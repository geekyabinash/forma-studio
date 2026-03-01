import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { users, mfaBackupCodes } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { mfaVerifySchema } from '@/lib/validations/auth'
import { verifyTotpCode } from '@/lib/totp'
import { decryptSecret, generateOtpCode } from '@/lib/crypto'
import { verifyOtp } from '@/lib/otp-store'
import crypto from 'crypto'

function generateBackupCodes(): string[] {
  const codes: string[] = []
  for (let i = 0; i < 8; i++) {
    const code = crypto.randomBytes(4).toString('hex').toUpperCase()
    // Format as XXXX-XXXX
    codes.push(`${code.slice(0, 4)}-${code.slice(4)}`)
  }
  return codes
}

export async function POST(request: Request) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const parsed = mfaVerifySchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid code format' },
        { status: 400 }
      )
    }

    const { code } = parsed.data

    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.id, session.user.id))
      .limit(1)

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const method = user.mfaMethod || 'email'
    let isValid = false

    if (method === 'email') {
      isValid = verifyOtp(user.id, code)
    } else if (method === 'totp') {
      if (!user.totpSecret) {
        return NextResponse.json(
          { error: 'TOTP not configured. Please set up again.' },
          { status: 400 }
        )
      }
      const secret = decryptSecret(user.totpSecret)
      isValid = verifyTotpCode(secret, code)
    }

    if (!isValid) {
      return NextResponse.json(
        { error: 'Invalid verification code' },
        { status: 400 }
      )
    }

    // Generate backup codes
    const backupCodes = generateBackupCodes()
    const backupCodeHashes = await Promise.all(
      backupCodes.map(async (code) => ({
        userId: user.id,
        codeHash: await bcrypt.hash(code, 10),
      }))
    )

    // Delete old backup codes
    await db
      .delete(mfaBackupCodes)
      .where(eq(mfaBackupCodes.userId, user.id))

    // Insert new backup codes
    await db.insert(mfaBackupCodes).values(backupCodeHashes)

    // Enable MFA
    await db
      .update(users)
      .set({
        mfaEnabled: true,
        mfaMethod: method,
        mfaVerifiedAt: new Date(),
      })
      .where(eq(users.id, user.id))

    return NextResponse.json({
      message: 'MFA enabled successfully',
      backupCodes, // Show once, never stored in plaintext
    })
  } catch (error) {
    console.error('MFA verify error:', error)
    return NextResponse.json(
      { error: 'Failed to verify MFA' },
      { status: 500 }
    )
  }
}

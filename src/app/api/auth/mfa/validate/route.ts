import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { db } from '@/lib/db'
import { users, mfaBackupCodes } from '@/lib/db/schema'
import { eq, and } from 'drizzle-orm'
import { verifyTotpCode } from '@/lib/totp'
import { decryptSecret } from '@/lib/crypto'
import { verifyOtp } from '@/lib/otp-store'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { userId, code, isBackupCode } = body

    if (!userId || !code) {
      return NextResponse.json(
        { error: 'Missing userId or code' },
        { status: 400 }
      )
    }

    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.id, userId))
      .limit(1)

    if (!user || !user.mfaEnabled) {
      return NextResponse.json({ error: 'MFA not enabled' }, { status: 400 })
    }

    // Handle backup code
    if (isBackupCode) {
      const backupCodes = await db
        .select()
        .from(mfaBackupCodes)
        .where(
          and(
            eq(mfaBackupCodes.userId, userId),
            eq(mfaBackupCodes.used, false)
          )
        )

      let matched = false
      for (const bc of backupCodes) {
        const isMatch = await bcrypt.compare(code, bc.codeHash)
        if (isMatch) {
          await db
            .update(mfaBackupCodes)
            .set({ used: true })
            .where(eq(mfaBackupCodes.id, bc.id))
          matched = true
          break
        }
      }

      if (!matched) {
        return NextResponse.json(
          { error: 'Invalid backup code' },
          { status: 400 }
        )
      }

      return NextResponse.json({ valid: true })
    }

    // Handle email OTP
    if (user.mfaMethod === 'email') {
      const isValid = verifyOtp(userId, code)
      if (!isValid) {
        return NextResponse.json(
          { error: 'Invalid or expired code' },
          { status: 400 }
        )
      }
      return NextResponse.json({ valid: true })
    }

    // Handle TOTP
    if (user.mfaMethod === 'totp') {
      if (!user.totpSecret) {
        return NextResponse.json(
          { error: 'TOTP not configured' },
          { status: 400 }
        )
      }
      const secret = decryptSecret(user.totpSecret)
      const isValid = verifyTotpCode(secret, code)
      if (!isValid) {
        return NextResponse.json(
          { error: 'Invalid code' },
          { status: 400 }
        )
      }
      return NextResponse.json({ valid: true })
    }

    return NextResponse.json({ error: 'Invalid MFA method' }, { status: 400 })
  } catch (error) {
    console.error('MFA validate error:', error)
    return NextResponse.json(
      { error: 'Failed to validate MFA' },
      { status: 500 }
    )
  }
}

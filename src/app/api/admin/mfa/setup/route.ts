import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { users } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { mfaSetupSchema } from '@/lib/validations/auth'
import { generateTotpSecret } from '@/lib/totp'
import { encryptSecret, generateOtpCode } from '@/lib/crypto'
import { storeOtp } from '@/lib/otp-store'
import { sendMfaOtp } from '@/lib/email'

export async function POST(request: Request) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const parsed = mfaSetupSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid method' }, { status: 400 })
    }

    const { method } = parsed.data

    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.id, session.user.id))
      .limit(1)

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    if (method === 'email') {
      const code = generateOtpCode()
      storeOtp(user.id, code)
      await sendMfaOtp(user.email, code)

      return NextResponse.json({
        method: 'email',
        message: 'Verification code sent to your email',
      })
    }

    if (method === 'totp') {
      const { secret, uri } = generateTotpSecret(user.email)

      // Store encrypted secret temporarily (will be confirmed on verify)
      const encrypted = encryptSecret(secret)
      await db
        .update(users)
        .set({ totpSecret: encrypted, mfaMethod: 'totp' })
        .where(eq(users.id, user.id))

      return NextResponse.json({
        method: 'totp',
        secret, // Show to user for manual entry
        uri, // For QR code generation
        message: 'Scan the QR code with your authenticator app',
      })
    }

    return NextResponse.json({ error: 'Invalid method' }, { status: 400 })
  } catch (error) {
    console.error('MFA setup error:', error)
    return NextResponse.json(
      { error: 'Failed to set up MFA' },
      { status: 500 }
    )
  }
}

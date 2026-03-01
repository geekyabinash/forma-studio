import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { users } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { generateOtpCode } from '@/lib/crypto'
import { storeOtp } from '@/lib/otp-store'
import { sendMfaOtp } from '@/lib/email'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { userId } = body

    if (!userId) {
      return NextResponse.json({ error: 'Missing userId' }, { status: 400 })
    }

    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.id, userId))
      .limit(1)

    if (!user || !user.mfaEnabled) {
      return NextResponse.json({ error: 'MFA not enabled' }, { status: 400 })
    }

    if (user.mfaMethod === 'email') {
      const code = generateOtpCode()
      storeOtp(user.id, code)
      await sendMfaOtp(user.email, code)

      return NextResponse.json({
        method: 'email',
        message: 'Verification code sent to your email',
      })
    }

    if (user.mfaMethod === 'totp') {
      return NextResponse.json({
        method: 'totp',
        message: 'Enter the code from your authenticator app',
      })
    }

    return NextResponse.json({ error: 'Invalid MFA method' }, { status: 400 })
  } catch (error) {
    console.error('MFA challenge error:', error)
    return NextResponse.json(
      { error: 'Failed to send MFA challenge' },
      { status: 500 }
    )
  }
}

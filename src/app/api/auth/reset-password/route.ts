import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { db } from '@/lib/db'
import { users, passwordResetTokens } from '@/lib/db/schema'
import { eq, and } from 'drizzle-orm'
import { hashToken } from '@/lib/crypto'
import { resetPasswordSchema } from '@/lib/validations/auth'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const parsed = resetPasswordSchema.safeParse(body)

    if (!parsed.success) {
      const firstError = parsed.error.issues[0]?.message || 'Validation failed'
      return NextResponse.json({ error: firstError }, { status: 400 })
    }

    const { token, newPassword } = parsed.data
    const tokenHash = hashToken(token)

    const [resetToken] = await db
      .select()
      .from(passwordResetTokens)
      .where(
        and(
          eq(passwordResetTokens.tokenHash, tokenHash),
          eq(passwordResetTokens.used, false)
        )
      )
      .limit(1)

    if (!resetToken) {
      return NextResponse.json(
        { error: 'Invalid or expired reset link' },
        { status: 400 }
      )
    }

    if (new Date() > resetToken.expiresAt) {
      await db
        .update(passwordResetTokens)
        .set({ used: true })
        .where(eq(passwordResetTokens.id, resetToken.id))

      return NextResponse.json(
        { error: 'Reset link has expired. Please request a new one.' },
        { status: 400 }
      )
    }

    const newHash = await bcrypt.hash(newPassword, 12)

    await db
      .update(users)
      .set({ passwordHash: newHash })
      .where(eq(users.id, resetToken.userId))

    await db
      .update(passwordResetTokens)
      .set({ used: true })
      .where(eq(passwordResetTokens.id, resetToken.id))

    return NextResponse.json({ message: 'Password has been reset successfully' })
  } catch (error) {
    console.error('Reset password error:', error)
    return NextResponse.json(
      { error: 'Failed to reset password' },
      { status: 500 }
    )
  }
}

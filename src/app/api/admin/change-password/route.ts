import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { requireAdminSession } from '@/lib/server/admin-route'
import { db } from '@/lib/db'
import { users } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { changePasswordSchema } from '@/lib/validations/auth'

export async function POST(request: Request) {
  try {
    const authResult = await requireAdminSession()
    if (authResult.response) return authResult.response
    const { session } = authResult

    const body = await request.json()
    const parsed = changePasswordSchema.safeParse(body)

    if (!parsed.success) {
      const firstError = parsed.error.issues[0]?.message || 'Validation failed'
      return NextResponse.json({ error: firstError }, { status: 400 })
    }

    const { currentPassword, newPassword } = parsed.data

    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.id, session.user.id))
      .limit(1)

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const passwordMatch = await bcrypt.compare(currentPassword, user.passwordHash)
    if (!passwordMatch) {
      return NextResponse.json(
        { error: 'Current password is incorrect' },
        { status: 400 }
      )
    }

    const newHash = await bcrypt.hash(newPassword, 12)

    await db
      .update(users)
      .set({ passwordHash: newHash })
      .where(eq(users.id, session.user.id))

    return NextResponse.json({ message: 'Password updated successfully' })
  } catch (error) {
    console.error('Change password error:', error)
    return NextResponse.json(
      { error: 'Failed to change password' },
      { status: 500 }
    )
  }
}

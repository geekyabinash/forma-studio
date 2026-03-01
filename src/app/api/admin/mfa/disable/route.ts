import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { users, mfaBackupCodes } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { mfaDisableSchema } from '@/lib/validations/auth'

export async function POST(request: Request) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const parsed = mfaDisableSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Password is required' },
        { status: 400 }
      )
    }

    const { password } = parsed.data

    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.id, session.user.id))
      .limit(1)

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const passwordMatch = await bcrypt.compare(password, user.passwordHash)
    if (!passwordMatch) {
      return NextResponse.json(
        { error: 'Incorrect password' },
        { status: 400 }
      )
    }

    // Disable MFA
    await db
      .update(users)
      .set({
        mfaEnabled: false,
        mfaMethod: null,
        totpSecret: null,
        mfaVerifiedAt: null,
      })
      .where(eq(users.id, user.id))

    // Delete backup codes
    await db
      .delete(mfaBackupCodes)
      .where(eq(mfaBackupCodes.userId, user.id))

    return NextResponse.json({ message: 'MFA disabled successfully' })
  } catch (error) {
    console.error('MFA disable error:', error)
    return NextResponse.json(
      { error: 'Failed to disable MFA' },
      { status: 500 }
    )
  }
}

import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { users } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'

export async function GET() {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const [user] = await db
      .select({
        mfaEnabled: users.mfaEnabled,
        mfaMethod: users.mfaMethod,
        mfaVerifiedAt: users.mfaVerifiedAt,
      })
      .from(users)
      .where(eq(users.id, session.user.id))
      .limit(1)

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    return NextResponse.json({
      mfaEnabled: user.mfaEnabled ?? false,
      mfaMethod: user.mfaMethod,
      mfaVerifiedAt: user.mfaVerifiedAt,
    })
  } catch (error) {
    console.error('MFA status error:', error)
    return NextResponse.json(
      { error: 'Failed to get MFA status' },
      { status: 500 }
    )
  }
}

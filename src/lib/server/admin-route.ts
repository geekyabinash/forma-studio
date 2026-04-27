import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'

type AdminSession = { user: { id: string } }

export async function requireAdminSession() {
  const session = await auth()

  if (!session?.user?.id) {
    return {
      session: null,
      response: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }),
    }
  }

  return { session: session as AdminSession, response: null }
}

export function validationError(details: unknown) {
  return NextResponse.json(
    { error: 'Validation failed', details },
    { status: 400 }
  )
}

import { db } from '@/lib/db'
import { formSubmissions } from '@/lib/db/schema'
import { auth } from '@/lib/auth'
import { NextResponse } from 'next/server'
import { eq, desc, and } from 'drizzle-orm'

export async function GET(request: Request) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Parse query params
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type') // 'contact' | 'career' | null (all)
    const status = searchParams.get('status') // 'unread' | 'read' | 'archived' | null (all)

    // Build dynamic where conditions
    const conditions = []
    if (type) conditions.push(eq(formSubmissions.type, type as any))
    if (status) conditions.push(eq(formSubmissions.status, status as any))

    const data = await db
      .select()
      .from(formSubmissions)
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .orderBy(desc(formSubmissions.submittedAt))

    return NextResponse.json({ submissions: data })
  } catch (error) {
    console.error('GET /api/admin/inbox error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch submissions' },
      { status: 500 }
    )
  }
}

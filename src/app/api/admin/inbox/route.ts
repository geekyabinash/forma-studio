import { db } from '@/lib/db'
import { formSubmissions } from '@/lib/db/schema'
import { requireAdminSession } from '@/lib/server/admin-route'
import { isSubmissionStatus, isSubmissionType } from '@/lib/admin/options'
import { NextResponse } from 'next/server'
import { eq, desc, and } from 'drizzle-orm'

export async function GET(request: Request) {
  try {
    const authResult = await requireAdminSession()
    if (authResult.response) return authResult.response
    // Parse query params
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type') // 'contact' | 'career' | null (all)
    const status = searchParams.get('status') // 'unread' | 'read' | 'archived' | null (all)

    // Build dynamic where conditions
    const conditions = []
    if (type && isSubmissionType(type)) {
      conditions.push(eq(formSubmissions.type, type))
    }
    if (status && isSubmissionStatus(status)) {
      conditions.push(eq(formSubmissions.status, status))
    }

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

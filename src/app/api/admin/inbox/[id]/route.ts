import { db } from '@/lib/db'
import { formSubmissions } from '@/lib/db/schema'
import { submissionUpdateSchema } from '@/lib/schemas'
import { auth } from '@/lib/auth'
import { NextResponse } from 'next/server'
import { eq } from 'drizzle-orm'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params

    // Fetch submission by ID
    const [data] = await db
      .select()
      .from(formSubmissions)
      .where(eq(formSubmissions.id, id))
      .limit(1)

    if (!data) {
      return NextResponse.json({ error: 'Submission not found' }, { status: 404 })
    }

    return NextResponse.json({ submission: data })
  } catch (error) {
    console.error('GET /api/admin/inbox/[id] error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch submission' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params

    // Parse and validate request body
    const body = await request.json()
    const result = submissionUpdateSchema.safeParse(body)
    if (!result.success) {
      return NextResponse.json({ error: 'Validation failed', details: result.error.issues }, { status: 400 })
    }
    const validatedData = result.data

    // Update submission
    const updateData: Record<string, any> = { ...validatedData }

    // If marking as read, set readAt timestamp
    if (validatedData.status === 'read') {
      updateData.readAt = new Date()
    }

    const [data] = await db
      .update(formSubmissions)
      .set(updateData)
      .where(eq(formSubmissions.id, id))
      .returning()

    if (!data) {
      return NextResponse.json({ error: 'Submission not found' }, { status: 404 })
    }

    return NextResponse.json({ submission: data })
  } catch (error) {
    console.error('PUT /api/admin/inbox/[id] error:', error)
    return NextResponse.json(
      { error: 'Failed to update submission' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params

    // Delete submission
    await db.delete(formSubmissions).where(eq(formSubmissions.id, id))

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('DELETE /api/admin/inbox/[id] error:', error)
    return NextResponse.json(
      { error: 'Failed to delete submission' },
      { status: 500 }
    )
  }
}

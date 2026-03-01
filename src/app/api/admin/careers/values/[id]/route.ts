import { db } from '@/lib/db'
import { careerValues } from '@/lib/db/schema'
import { careerValueSchema } from '@/lib/schemas'
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

    // Fetch value by ID
    const [data] = await db
      .select()
      .from(careerValues)
      .where(eq(careerValues.id, id))
      .limit(1)

    if (!data) {
      return NextResponse.json({ error: 'Value not found' }, { status: 404 })
    }

    return NextResponse.json({ value: data })
  } catch (error) {
    console.error('GET /api/admin/careers/values/[id] error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch value' },
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
    const result = careerValueSchema.safeParse(body)
    if (!result.success) {
      return NextResponse.json({ error: 'Validation failed', details: result.error.issues }, { status: 400 })
    }
    const v = result.data

    // Update value
    const [data] = await db
      .update(careerValues)
      .set({
        title: v.title,
        description: v.description,
        sortOrder: v.sort_order,
      })
      .where(eq(careerValues.id, id))
      .returning()

    if (!data) {
      return NextResponse.json({ error: 'Value not found' }, { status: 404 })
    }

    return NextResponse.json({ value: data })
  } catch (error) {
    console.error('PUT /api/admin/careers/values/[id] error:', error)
    return NextResponse.json(
      { error: 'Failed to update value' },
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

    // Delete value
    await db.delete(careerValues).where(eq(careerValues.id, id))

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('DELETE /api/admin/careers/values/[id] error:', error)
    return NextResponse.json(
      { error: 'Failed to delete value' },
      { status: 500 }
    )
  }
}

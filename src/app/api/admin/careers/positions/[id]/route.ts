import { db } from '@/lib/db'
import { careerPositions } from '@/lib/db/schema'
import { careerPositionSchema } from '@/lib/schemas'
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

    // Fetch position by ID
    const [data] = await db
      .select()
      .from(careerPositions)
      .where(eq(careerPositions.id, id))
      .limit(1)

    if (!data) {
      return NextResponse.json({ error: 'Position not found' }, { status: 404 })
    }

    return NextResponse.json({ position: data })
  } catch (error) {
    console.error('GET /api/admin/careers/positions/[id] error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch position' },
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
    const result = careerPositionSchema.safeParse(body)
    if (!result.success) {
      return NextResponse.json({ error: 'Validation failed', details: result.error.issues }, { status: 400 })
    }
    const v = result.data

    // Update position
    const [data] = await db
      .update(careerPositions)
      .set({
        title: v.title,
        department: v.department,
        employmentType: v.employment_type,
        location: v.location,
        experience: v.experience,
        description: v.description,
        responsibilities: v.responsibilities,
        qualifications: v.qualifications,
        postedDate: v.posted_date,
        isActive: v.is_active,
      })
      .where(eq(careerPositions.id, id))
      .returning()

    if (!data) {
      return NextResponse.json({ error: 'Position not found' }, { status: 404 })
    }

    return NextResponse.json({ position: data })
  } catch (error) {
    console.error('PUT /api/admin/careers/positions/[id] error:', error)
    return NextResponse.json(
      { error: 'Failed to update position' },
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

    // Delete position
    await db.delete(careerPositions).where(eq(careerPositions.id, id))

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('DELETE /api/admin/careers/positions/[id] error:', error)
    return NextResponse.json(
      { error: 'Failed to delete position' },
      { status: 500 }
    )
  }
}

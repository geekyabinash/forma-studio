import { db } from '@/lib/db'
import { careerPositions } from '@/lib/db/schema'
import { careerPositionSchema } from '@/lib/schemas'
import { auth } from '@/lib/auth'
import { NextResponse } from 'next/server'
import { asc } from 'drizzle-orm'

export async function GET() {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Fetch all positions
    const data = await db
      .select()
      .from(careerPositions)
      .orderBy(asc(careerPositions.sortOrder))

    return NextResponse.json({ positions: data })
  } catch (error) {
    console.error('GET /api/admin/careers/positions error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch positions' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Parse and validate request body
    const body = await request.json()
    const result = careerPositionSchema.safeParse(body)
    if (!result.success) {
      return NextResponse.json({ error: 'Validation failed', details: result.error.issues }, { status: 400 })
    }
    const v = result.data

    // Insert position
    const [data] = await db
      .insert(careerPositions)
      .values({
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
      .returning()

    return NextResponse.json({ position: data }, { status: 201 })
  } catch (error) {
    console.error('POST /api/admin/careers/positions error:', error)
    return NextResponse.json(
      { error: 'Failed to create position' },
      { status: 500 }
    )
  }
}

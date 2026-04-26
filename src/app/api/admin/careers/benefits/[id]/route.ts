import { db } from '@/lib/db'
import { careerBenefits } from '@/lib/db/schema'
import { careerBenefitSchema } from '@/lib/schemas'
import { auth } from '@/lib/auth'
import { revalidatePublicSite } from '@/lib/revalidate'
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

    // Fetch benefit by ID
    const [data] = await db
      .select()
      .from(careerBenefits)
      .where(eq(careerBenefits.id, id))
      .limit(1)

    if (!data) {
      return NextResponse.json({ error: 'Benefit not found' }, { status: 404 })
    }

    return NextResponse.json({ benefit: data })
  } catch (error) {
    console.error('GET /api/admin/careers/benefits/[id] error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch benefit' },
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
    const result = careerBenefitSchema.safeParse(body)
    if (!result.success) {
      return NextResponse.json({ error: 'Validation failed', details: result.error.issues }, { status: 400 })
    }
    const v = result.data

    // Update benefit
    const [data] = await db
      .update(careerBenefits)
      .set({
        icon: v.icon,
        title: v.title,
        description: v.description,
        sortOrder: v.sort_order,
      })
      .where(eq(careerBenefits.id, id))
      .returning()

    if (!data) {
      return NextResponse.json({ error: 'Benefit not found' }, { status: 404 })
    }

    revalidatePublicSite()

    return NextResponse.json({ benefit: data })
  } catch (error) {
    console.error('PUT /api/admin/careers/benefits/[id] error:', error)
    return NextResponse.json(
      { error: 'Failed to update benefit' },
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

    // Delete benefit
    await db.delete(careerBenefits).where(eq(careerBenefits.id, id))

    revalidatePublicSite()

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('DELETE /api/admin/careers/benefits/[id] error:', error)
    return NextResponse.json(
      { error: 'Failed to delete benefit' },
      { status: 500 }
    )
  }
}

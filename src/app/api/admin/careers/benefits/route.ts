import { db } from '@/lib/db'
import { careerBenefits } from '@/lib/db/schema'
import { careerBenefitSchema } from '@/lib/schemas'
import { auth } from '@/lib/auth'
import { revalidatePublicSite } from '@/lib/revalidate'
import { NextResponse } from 'next/server'
import { asc } from 'drizzle-orm'

export async function GET() {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Fetch all benefits
    const data = await db
      .select()
      .from(careerBenefits)
      .orderBy(asc(careerBenefits.sortOrder))

    return NextResponse.json({ benefits: data })
  } catch (error) {
    console.error('GET /api/admin/careers/benefits error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch benefits' },
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
    const result = careerBenefitSchema.safeParse(body)
    if (!result.success) {
      return NextResponse.json({ error: 'Validation failed', details: result.error.issues }, { status: 400 })
    }
    const v = result.data

    // Insert benefit
    const [data] = await db
      .insert(careerBenefits)
      .values({
        icon: v.icon,
        title: v.title,
        description: v.description,
        sortOrder: v.sort_order,
      })
      .returning()

    revalidatePublicSite()

    return NextResponse.json({ benefit: data }, { status: 201 })
  } catch (error) {
    console.error('POST /api/admin/careers/benefits error:', error)
    return NextResponse.json(
      { error: 'Failed to create benefit' },
      { status: 500 }
    )
  }
}

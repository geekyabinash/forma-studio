import { db } from '@/lib/db'
import { careerValues } from '@/lib/db/schema'
import { careerValueSchema } from '@/lib/schemas'
import { requireAdminSession } from '@/lib/server/admin-route'
import { revalidatePublicSite } from '@/lib/revalidate'
import { NextResponse } from 'next/server'
import { asc } from 'drizzle-orm'

export async function GET() {
  try {
    const authResult = await requireAdminSession()
    if (authResult.response) return authResult.response
    // Fetch all values
    const data = await db
      .select()
      .from(careerValues)
      .orderBy(asc(careerValues.sortOrder))

    return NextResponse.json({ values: data })
  } catch (error) {
    console.error('GET /api/admin/careers/values error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch values' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const authResult = await requireAdminSession()
    if (authResult.response) return authResult.response
    // Parse and validate request body
    const body = await request.json()
    const result = careerValueSchema.safeParse(body)
    if (!result.success) {
      return NextResponse.json({ error: 'Validation failed', details: result.error.issues }, { status: 400 })
    }
    const v = result.data

    // Insert value
    const [data] = await db
      .insert(careerValues)
      .values({
        title: v.title,
        description: v.description,
        sortOrder: v.sort_order,
      })
      .returning()

    revalidatePublicSite()

    return NextResponse.json({ value: data }, { status: 201 })
  } catch (error) {
    console.error('POST /api/admin/careers/values error:', error)
    return NextResponse.json(
      { error: 'Failed to create value' },
      { status: 500 }
    )
  }
}

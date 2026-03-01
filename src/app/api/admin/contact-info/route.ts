import { db } from '@/lib/db'
import { contactInfo } from '@/lib/db/schema'
import { contactInfoSchema } from '@/lib/schemas'
import { auth } from '@/lib/auth'
import { NextResponse } from 'next/server'
import { eq } from 'drizzle-orm'

export async function GET() {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const [data] = await db
      .select()
      .from(contactInfo)
      .limit(1)

    return NextResponse.json({ contactInfo: data || null })
  } catch (error) {
    console.error('GET /api/admin/contact-info error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch contact info' },
      { status: 500 }
    )
  }
}

export async function PUT(request: Request) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const result = contactInfoSchema.safeParse(body)
    if (!result.success) {
      return NextResponse.json({ error: 'Validation failed', details: result.error.issues }, { status: 400 })
    }
    const v = result.data

    // Check if a row exists
    const [existing] = await db.select().from(contactInfo).limit(1)

    let data
    if (existing) {
      ;[data] = await db
        .update(contactInfo)
        .set({
          address: v.address,
          phone: v.phone,
          email: v.email,
          workingHours: v.working_hours,
        })
        .where(eq(contactInfo.id, existing.id))
        .returning()
    } else {
      ;[data] = await db
        .insert(contactInfo)
        .values({
          address: v.address,
          phone: v.phone,
          email: v.email,
          workingHours: v.working_hours,
        })
        .returning()
    }

    return NextResponse.json({ contactInfo: data })
  } catch (error) {
    console.error('PUT /api/admin/contact-info error:', error)
    return NextResponse.json(
      { error: 'Failed to update contact info' },
      { status: 500 }
    )
  }
}

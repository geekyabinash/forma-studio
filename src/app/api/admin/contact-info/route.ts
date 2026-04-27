import { db } from '@/lib/db'
import { contactInfo } from '@/lib/db/schema'
import { contactInfoSchema } from '@/lib/schemas'
import { requireAdminSession } from '@/lib/server/admin-route'
import { revalidatePublicSite } from '@/lib/revalidate'
import { NextResponse } from 'next/server'
import { eq } from 'drizzle-orm'

export async function GET() {
  try {
    const authResult = await requireAdminSession()
    if (authResult.response) return authResult.response
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
    const authResult = await requireAdminSession()
    if (authResult.response) return authResult.response
    const body = await request.json()
    const result = contactInfoSchema.safeParse(body)
    if (!result.success) {
      return NextResponse.json({ error: 'Validation failed', details: result.error.issues }, { status: 400 })
    }
    const v = result.data

    const values = {
      address: v.address,
      phone: v.phone,
      email: v.email,
      workingHours: v.working_hours,
      instagramUrl: v.instagram_url,
      facebookUrl: v.facebook_url,
      linkedinUrl: v.linkedin_url,
      whatsappUrl: v.whatsapp_url,
      footerTagline: v.footer_tagline,
      footerCopyright: v.footer_copyright,
      footerCredit: v.footer_credit,
    }

    // Check if a row exists
    const [existing] = await db.select().from(contactInfo).limit(1)

    let data
    if (existing) {
      ;[data] = await db
        .update(contactInfo)
        .set(values)
        .where(eq(contactInfo.id, existing.id))
        .returning()
    } else {
      ;[data] = await db.insert(contactInfo).values(values).returning()
    }

    revalidatePublicSite()

    return NextResponse.json({ contactInfo: data })
  } catch (error) {
    console.error('PUT /api/admin/contact-info error:', error)
    return NextResponse.json(
      { error: 'Failed to update contact info' },
      { status: 500 }
    )
  }
}

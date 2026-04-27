import { db } from '@/lib/db'
import { services } from '@/lib/db/schema'
import { serviceSchema } from '@/lib/schemas'
import { requireAdminSession } from '@/lib/server/admin-route'
import { revalidatePublicSite } from '@/lib/revalidate'
import { NextResponse } from 'next/server'
import { asc } from 'drizzle-orm'

export async function GET() {
  try {
    const authResult = await requireAdminSession()
    if (authResult.response) return authResult.response
    const data = await db
      .select()
      .from(services)
      .orderBy(asc(services.sortOrder))

    return NextResponse.json({ services: data })
  } catch (error) {
    console.error('GET /api/admin/services error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch services' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const authResult = await requireAdminSession()
    if (authResult.response) return authResult.response
    const body = await request.json()
    const result = serviceSchema.safeParse(body)
    if (!result.success) {
      return NextResponse.json({ error: 'Validation failed', details: result.error.issues }, { status: 400 })
    }
    const v = result.data

    const [data] = await db
      .insert(services)
      .values({
        title: v.title,
        slug: v.slug,
        shortTitle: v.short_title,
        description: v.description,
        icon: v.icon,
        features: v.features,
        imageUrl: v.image_url || null,
        imageAlt: v.image_alt,
        imageWidth: v.image_width,
        imageHeight: v.image_height,
        featuredProjectSlug: v.featured_project_slug,
      })
      .returning()

    revalidatePublicSite()

    return NextResponse.json({ service: data }, { status: 201 })
  } catch (error) {
    console.error('POST /api/admin/services error:', error)
    return NextResponse.json(
      { error: 'Failed to create service' },
      { status: 500 }
    )
  }
}

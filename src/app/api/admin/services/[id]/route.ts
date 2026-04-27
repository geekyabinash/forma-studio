import { db } from '@/lib/db'
import { services } from '@/lib/db/schema'
import { serviceSchema } from '@/lib/schemas'
import { requireAdminSession } from '@/lib/server/admin-route'
import { revalidatePublicSite } from '@/lib/revalidate'
import { NextResponse } from 'next/server'
import { eq } from 'drizzle-orm'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authResult = await requireAdminSession()
    if (authResult.response) return authResult.response
    const { id } = await params

    // Fetch service by ID
    const [data] = await db
      .select()
      .from(services)
      .where(eq(services.id, id))
      .limit(1)

    if (!data) {
      return NextResponse.json({ error: 'Service not found' }, { status: 404 })
    }

    return NextResponse.json({ service: data })
  } catch (error) {
    console.error('GET /api/admin/services/[id] error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch service' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authResult = await requireAdminSession()
    if (authResult.response) return authResult.response
    const { id } = await params

    // Parse and validate request body
    const body = await request.json()
    const result = serviceSchema.safeParse(body)
    if (!result.success) {
      return NextResponse.json({ error: 'Validation failed', details: result.error.issues }, { status: 400 })
    }
    const v = result.data

    // Update service
    const [data] = await db
      .update(services)
      .set({
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
      .where(eq(services.id, id))
      .returning()

    if (!data) {
      return NextResponse.json({ error: 'Service not found' }, { status: 404 })
    }

    revalidatePublicSite()

    return NextResponse.json({ service: data })
  } catch (error) {
    console.error('PUT /api/admin/services/[id] error:', error)
    return NextResponse.json(
      { error: 'Failed to update service' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authResult = await requireAdminSession()
    if (authResult.response) return authResult.response
    const { id } = await params

    // Delete service
    await db.delete(services).where(eq(services.id, id))

    revalidatePublicSite()

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('DELETE /api/admin/services/[id] error:', error)
    return NextResponse.json(
      { error: 'Failed to delete service' },
      { status: 500 }
    )
  }
}

import { db } from '@/lib/db'
import { galleryItems } from '@/lib/db/schema'
import { galleryItemSchema } from '@/lib/schemas'
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

    // Fetch gallery item by ID
    const [data] = await db
      .select()
      .from(galleryItems)
      .where(eq(galleryItems.id, id))
      .limit(1)

    if (!data) {
      return NextResponse.json({ error: 'Gallery item not found' }, { status: 404 })
    }

    return NextResponse.json({ item: data })
  } catch (error) {
    console.error('GET /api/admin/gallery/[id] error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch gallery item' },
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
    const result = galleryItemSchema.safeParse(body)
    if (!result.success) {
      return NextResponse.json({ error: 'Validation failed', details: result.error.issues }, { status: 400 })
    }
    const v = result.data

    // Update gallery item
    const [data] = await db
      .update(galleryItems)
      .set({
        imageUrl: v.image_url,
        imageAlt: v.image_alt,
        imageWidth: v.image_width,
        imageHeight: v.image_height,
        caption: v.caption,
        category: v.category,
        projectSlug: v.project_slug,
      })
      .where(eq(galleryItems.id, id))
      .returning()

    if (!data) {
      return NextResponse.json({ error: 'Gallery item not found' }, { status: 404 })
    }

    revalidatePublicSite()

    return NextResponse.json({ item: data })
  } catch (error) {
    console.error('PUT /api/admin/gallery/[id] error:', error)
    return NextResponse.json(
      { error: 'Failed to update gallery item' },
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

    // Delete gallery item
    await db.delete(galleryItems).where(eq(galleryItems.id, id))

    revalidatePublicSite()

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('DELETE /api/admin/gallery/[id] error:', error)
    return NextResponse.json(
      { error: 'Failed to delete gallery item' },
      { status: 500 }
    )
  }
}

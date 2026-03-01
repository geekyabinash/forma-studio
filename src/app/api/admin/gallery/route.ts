import { db } from '@/lib/db'
import { galleryItems } from '@/lib/db/schema'
import { galleryItemSchema } from '@/lib/schemas'
import { auth } from '@/lib/auth'
import { NextResponse } from 'next/server'
import { asc } from 'drizzle-orm'

export async function GET() {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Fetch all gallery items
    const data = await db
      .select()
      .from(galleryItems)
      .orderBy(asc(galleryItems.sortOrder))

    return NextResponse.json({ items: data })
  } catch (error) {
    console.error('GET /api/admin/gallery error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch gallery items' },
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
    const result = galleryItemSchema.safeParse(body)
    if (!result.success) {
      return NextResponse.json({ error: 'Validation failed', details: result.error.issues }, { status: 400 })
    }
    const v = result.data

    // Insert gallery item
    const [data] = await db
      .insert(galleryItems)
      .values({
        imageUrl: v.image_url,
        imageAlt: v.image_alt,
        imageWidth: v.image_width,
        imageHeight: v.image_height,
        caption: v.caption,
        category: v.category,
        projectSlug: v.project_slug,
      })
      .returning()

    return NextResponse.json({ item: data }, { status: 201 })
  } catch (error) {
    console.error('POST /api/admin/gallery error:', error)
    return NextResponse.json(
      { error: 'Failed to create gallery item' },
      { status: 500 }
    )
  }
}

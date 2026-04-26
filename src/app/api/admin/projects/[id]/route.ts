import { db } from '@/lib/db'
import { projects } from '@/lib/db/schema'
import { projectSchema } from '@/lib/schemas'
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

    const [data] = await db
      .select()
      .from(projects)
      .where(eq(projects.id, id))
      .limit(1)

    if (!data) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 })
    }

    return NextResponse.json({ project: data })
  } catch (error) {
    console.error('GET /api/admin/projects/[id] error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch project' },
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

    const body = await request.json()
    const result = projectSchema.safeParse(body)
    if (!result.success) {
      return NextResponse.json({ error: 'Validation failed', details: result.error.issues }, { status: 400 })
    }
    const v = result.data

    const [data] = await db
      .update(projects)
      .set({
        title: v.title,
        slug: v.slug,
        category: v.category,
        status: v.status,
        year: v.year,
        location: v.location,
        area: v.area || null,
        client: v.client || null,
        description: v.description,
        shortDescription: v.short_description,
        heroImage: v.hero_image || null,
        gallery: v.gallery || [],
        featured: v.featured ?? false,
        sortOrder: v.sort_order ?? 0,
      })
      .where(eq(projects.id, id))
      .returning()

    if (!data) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 })
    }

    revalidatePublicSite()

    return NextResponse.json({ project: data })
  } catch (error) {
    console.error('PUT /api/admin/projects/[id] error:', error)
    return NextResponse.json(
      { error: 'Failed to update project' },
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

    await db.delete(projects).where(eq(projects.id, id))

    revalidatePublicSite()

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('DELETE /api/admin/projects/[id] error:', error)
    return NextResponse.json(
      { error: 'Failed to delete project' },
      { status: 500 }
    )
  }
}

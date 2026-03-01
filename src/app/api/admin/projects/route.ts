import { db } from '@/lib/db'
import { projects } from '@/lib/db/schema'
import { projectSchema } from '@/lib/schemas'
import { auth } from '@/lib/auth'
import { NextResponse } from 'next/server'
import { asc } from 'drizzle-orm'

export async function GET() {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const data = await db
      .select()
      .from(projects)
      .orderBy(asc(projects.sortOrder))

    return NextResponse.json({ projects: data })
  } catch (error) {
    console.error('GET /api/admin/projects error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch projects' },
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

    const body = await request.json()
    const result = projectSchema.safeParse(body)
    if (!result.success) {
      return NextResponse.json({ error: 'Validation failed', details: result.error.issues }, { status: 400 })
    }
    const v = result.data

    const [data] = await db
      .insert(projects)
      .values({
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
      .returning()

    return NextResponse.json({ project: data }, { status: 201 })
  } catch (error) {
    console.error('POST /api/admin/projects error:', error)
    return NextResponse.json(
      { error: 'Failed to create project' },
      { status: 500 }
    )
  }
}

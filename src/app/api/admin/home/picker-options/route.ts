import { auth } from '@/lib/auth'
import { NextResponse } from 'next/server'
import { getProjects, getServices } from '@/lib/data/fetch'

export async function GET() {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const [projects, services] = await Promise.all([
      getProjects(),
      getServices(),
    ])

    return NextResponse.json({
      projects: projects.map((p) => ({
        slug: p.slug,
        title: p.title,
        imageUrl: p.heroImage?.url ?? '',
      })),
      services: services.map((s) => ({
        slug: s.slug,
        title: s.title,
        imageUrl: s.image?.url ?? '',
      })),
    })
  } catch (error) {
    console.error('GET /api/admin/home/picker-options error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch picker options' },
      { status: 500 }
    )
  }
}

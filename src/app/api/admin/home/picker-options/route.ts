import { requireAdminSession } from '@/lib/server/admin-route'
import { NextResponse } from 'next/server'
import { getProjects, getServices } from '@/lib/data/fetch'

export async function GET() {
  try {
    const authResult = await requireAdminSession()
    if (authResult.response) return authResult.response
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

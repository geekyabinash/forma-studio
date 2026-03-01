import { db } from '@/lib/db'
import { projects } from '@/lib/db/schema'
import { NextResponse } from 'next/server'
import { asc } from 'drizzle-orm'

export async function GET() {
  try {
    const data = await db
      .select()
      .from(projects)
      .orderBy(asc(projects.sortOrder))

    return NextResponse.json({ projects: data })
  } catch (error) {
    console.error('GET /api/projects error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch projects' },
      { status: 500 }
    )
  }
}

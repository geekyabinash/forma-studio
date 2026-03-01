import { db } from '@/lib/db'
import { aboutContent } from '@/lib/db/schema'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const [data] = await db
      .select()
      .from(aboutContent)
      .limit(1)

    return NextResponse.json({ about: data || null })
  } catch (error) {
    console.error('GET /api/about error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch about content' },
      { status: 500 }
    )
  }
}

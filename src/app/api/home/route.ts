import { db } from '@/lib/db'
import { homeContent } from '@/lib/db/schema'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const [data] = await db.select().from(homeContent).limit(1)
    return NextResponse.json({ home: data || null })
  } catch (error) {
    console.error('GET /api/home error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch home content' },
      { status: 500 }
    )
  }
}

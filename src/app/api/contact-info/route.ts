import { db } from '@/lib/db'
import { contactInfo } from '@/lib/db/schema'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const [data] = await db
      .select()
      .from(contactInfo)
      .limit(1)

    return NextResponse.json({ contactInfo: data || null })
  } catch (error) {
    console.error('GET /api/contact-info error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch contact info' },
      { status: 500 }
    )
  }
}

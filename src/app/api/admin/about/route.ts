import { db } from '@/lib/db'
import { aboutContent } from '@/lib/db/schema'
import { aboutContentSchema } from '@/lib/schemas'
import { auth } from '@/lib/auth'
import { revalidatePublicSite } from '@/lib/revalidate'
import { NextResponse } from 'next/server'
import { eq } from 'drizzle-orm'

export async function GET() {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const [data] = await db
      .select()
      .from(aboutContent)
      .limit(1)

    return NextResponse.json({ about: data || null })
  } catch (error) {
    console.error('GET /api/admin/about error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch about content' },
      { status: 500 }
    )
  }
}

export async function PUT(request: Request) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const result = aboutContentSchema.safeParse(body)
    if (!result.success) {
      return NextResponse.json({ error: 'Validation failed', details: result.error.issues }, { status: 400 })
    }
    const v = result.data

    // Check if a row exists
    const [existing] = await db.select().from(aboutContent).limit(1)

    let data
    if (existing) {
      ;[data] = await db
        .update(aboutContent)
        .set({
          heroTagline: v.hero_tagline,
          heroSubtitle: v.hero_subtitle,
          storyTitle: v.story_title,
          storyParagraphs: v.story_paragraphs,
          pullQuote: v.pull_quote,
          pullQuoteAttribution: v.pull_quote_attribution || null,
          milestones: v.milestones,
          teamMembers: v.team_members,
        })
        .where(eq(aboutContent.id, existing.id))
        .returning()
    } else {
      ;[data] = await db
        .insert(aboutContent)
        .values({
          heroTagline: v.hero_tagline,
          heroSubtitle: v.hero_subtitle,
          storyTitle: v.story_title,
          storyParagraphs: v.story_paragraphs,
          pullQuote: v.pull_quote,
          pullQuoteAttribution: v.pull_quote_attribution || null,
          milestones: v.milestones,
          teamMembers: v.team_members,
        })
        .returning()
    }

    revalidatePublicSite()

    return NextResponse.json({ about: data })
  } catch (error) {
    console.error('PUT /api/admin/about error:', error)
    return NextResponse.json(
      { error: 'Failed to update about content' },
      { status: 500 }
    )
  }
}

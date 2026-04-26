import { db } from '@/lib/db'
import { homeContent } from '@/lib/db/schema'
import { homeContentSchema } from '@/lib/schemas'
import { auth } from '@/lib/auth'
import { NextResponse } from 'next/server'
import { eq } from 'drizzle-orm'

export async function GET() {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const [data] = await db.select().from(homeContent).limit(1)

    return NextResponse.json({ home: data || null })
  } catch (error) {
    console.error('GET /api/admin/home error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch home content' },
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
    const result = homeContentSchema.safeParse(body)
    if (!result.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: result.error.issues },
        { status: 400 }
      )
    }
    const v = result.data

    const values = {
      heroVideoUrl: v.hero_video_url,
      heroTaglineLine1: v.hero_tagline_line1,
      heroTaglineLine2: v.hero_tagline_line2,
      parallaxLabel: v.parallax_label,
      parallaxImageBg: v.parallax_image_bg,
      parallaxImageMid: v.parallax_image_mid,
      parallaxImageFg: v.parallax_image_fg,
      projectsCount: v.projects_count,
      projectsCountLabel: v.projects_count_label,
      aboutSnippetTitle: v.about_snippet_title,
      aboutSnippetBody: v.about_snippet_body,
      aboutSnippetCtaText: v.about_snippet_cta_text,
      aboutSnippetImage: v.about_snippet_image,
      featuredWorkLabel: v.featured_work_label,
      featuredWorkEyebrow: v.featured_work_eyebrow,
      featuredWorkDescription: v.featured_work_description,
      featuredWorkProjectSlugs: v.featured_work_project_slugs,
      featuredWorkLimit: v.featured_work_limit,
      featuredWorkCtaText: v.featured_work_cta_text,
      featuredWorkCtaLink: v.featured_work_cta_link,
      servicesLabel: v.services_label,
      servicesEyebrow: v.services_eyebrow,
      servicesDescription: v.services_description,
      servicesServiceSlugs: v.services_service_slugs,
      servicesLimit: v.services_limit,
      servicesCtaText: v.services_cta_text,
      servicesCtaLink: v.services_cta_link,
      ctaHeading: v.cta_heading,
      ctaSubtitle: v.cta_subtitle,
      ctaButtonText: v.cta_button_text,
    }

    const [existing] = await db.select().from(homeContent).limit(1)

    let data
    if (existing) {
      ;[data] = await db
        .update(homeContent)
        .set(values)
        .where(eq(homeContent.id, existing.id))
        .returning()
    } else {
      ;[data] = await db.insert(homeContent).values(values).returning()
    }

    return NextResponse.json({ home: data })
  } catch (error) {
    console.error('PUT /api/admin/home error:', error)
    return NextResponse.json(
      { error: 'Failed to update home content' },
      { status: 500 }
    )
  }
}

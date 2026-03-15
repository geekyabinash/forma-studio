import { db } from '@/lib/db'
import { navigationSettings } from '@/lib/db/schema'
import { navigationSettingsSchema } from '@/lib/schemas'
import { auth } from '@/lib/auth'
import { NextResponse } from 'next/server'
import { eq } from 'drizzle-orm'
import { revalidateTag } from 'next/cache'

const DEFAULT_VISIBILITY: Record<string, boolean> = {
  '/projects': true,
  '/services': true,
  '/gallery': true,
  '/about': true,
  '/careers': true,
  '/contact': true,
}

export async function GET() {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const [data] = await db.select().from(navigationSettings).limit(1)

    return NextResponse.json({
      visibility: data?.visibility ?? DEFAULT_VISIBILITY,
    })
  } catch (error) {
    console.error('GET /api/admin/navigation-settings error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch navigation settings' },
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
    const result = navigationSettingsSchema.safeParse(body)
    if (!result.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: result.error.issues },
        { status: 400 }
      )
    }

    const [existing] = await db.select().from(navigationSettings).limit(1)

    let data
    if (existing) {
      ;[data] = await db
        .update(navigationSettings)
        .set({ visibility: result.data.visibility })
        .where(eq(navigationSettings.id, existing.id))
        .returning()
    } else {
      ;[data] = await db
        .insert(navigationSettings)
        .values({ visibility: result.data.visibility })
        .returning()
    }

    revalidateTag('navigation-settings', 'default')

    return NextResponse.json({ visibility: data.visibility })
  } catch (error) {
    console.error('PUT /api/admin/navigation-settings error:', error)
    return NextResponse.json(
      { error: 'Failed to update navigation settings' },
      { status: 500 }
    )
  }
}

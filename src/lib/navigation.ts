import { db } from '@/lib/db'
import { navigationSettings } from '@/lib/db/schema'
import { navItems } from '@/data/navigation'
import { unstable_cache } from 'next/cache'

const DEFAULT_VISIBILITY: Record<string, boolean> = {
  '/projects': true,
  '/services': true,
  '/gallery': true,
  '/about': true,
  '/careers': true,
  '/contact': true,
}

async function fetchVisibility(): Promise<Record<string, boolean>> {
  const [row] = await db.select().from(navigationSettings).limit(1)
  if (!row?.visibility) {
    return DEFAULT_VISIBILITY
  }
  return row.visibility
}

export const getNavigationVisibility = unstable_cache(
  fetchVisibility,
  ['navigation-visibility'],
  { tags: ['navigation-settings'], revalidate: 60 }
)

export async function getVisibleNavItems() {
  const visibility = await getNavigationVisibility()
  return navItems.filter((item) => visibility[item.href] !== false)
}

export async function getHiddenPaths(): Promise<string[]> {
  const visibility = await getNavigationVisibility()
  return Object.entries(visibility)
    .filter(([, visible]) => !visible)
    .map(([path]) => path)
}

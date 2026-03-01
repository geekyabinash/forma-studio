import { db } from '@/lib/db'
import {
  services as servicesTable,
  careerPositions,
  careerBenefits,
  careerValues,
  galleryItems,
} from '@/lib/db/schema'
import { asc, eq, and } from 'drizzle-orm'
import type { Service, JobPosition, Benefit, CultureValue } from '@/types'
import { services as staticServices } from '@/data/services'
import {
  positions as staticPositions,
  benefits as staticBenefits,
  cultureValues as staticCultureValues,
} from '@/data/careers'

// ---------------------------------------------------------------------------
// Transform helpers  (Drizzle camelCase row  -->  frontend types)
// ---------------------------------------------------------------------------

type ServiceRow = typeof servicesTable.$inferSelect

function transformService(row: ServiceRow): Service {
  return {
    id: row.id,
    title: row.title,
    slug: row.slug,
    shortTitle: row.shortTitle ?? row.title,
    description: row.description,
    icon: row.icon ?? '',
    features: (row.features as string[]) ?? [],
    featuredProjectSlug: row.featuredProjectSlug ?? undefined,
    image: {
      id: `img-${row.id}`,
      url: row.imageUrl ?? '',
      alt: row.imageAlt ?? row.title,
      width: row.imageWidth ?? 1200,
      height: row.imageHeight ?? 800,
    },
  }
}

type PositionRow = typeof careerPositions.$inferSelect

function transformPosition(row: PositionRow): JobPosition {
  return {
    id: row.id,
    title: row.title,
    department: row.department as JobPosition['department'],
    employmentType: row.employmentType as JobPosition['employmentType'],
    location: row.location,
    experience: row.experience ?? '',
    description: row.description,
    responsibilities: (row.responsibilities as string[]) ?? [],
    qualifications: (row.qualifications as string[]) ?? [],
    postedDate: row.postedDate ?? '',
  }
}

type BenefitRow = typeof careerBenefits.$inferSelect

function transformBenefit(row: BenefitRow): Benefit {
  return {
    id: row.id,
    icon: row.icon,
    title: row.title,
    description: row.description,
  }
}

type ValueRow = typeof careerValues.$inferSelect

function transformValue(row: ValueRow): CultureValue {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
  }
}

export interface GalleryItem {
  id: string
  title?: string
  description: string | null
  imageUrl: string
  imageAlt: string
  imageWidth: number
  imageHeight: number
  category: string | null
  projectSlug: string | null
}

type GalleryRow = typeof galleryItems.$inferSelect

function transformGalleryItem(row: GalleryRow): GalleryItem {
  return {
    id: row.id,
    title: row.caption ?? '',
    description: row.caption,
    imageUrl: row.imageUrl,
    imageAlt: row.imageAlt ?? '',
    imageWidth: row.imageWidth ?? 1200,
    imageHeight: row.imageHeight ?? 800,
    category: row.category,
    projectSlug: row.projectSlug,
  }
}

// ---------------------------------------------------------------------------
// Data fetching functions
// ---------------------------------------------------------------------------

export async function getServices(): Promise<Service[]> {
  try {
    const data = await db
      .select()
      .from(servicesTable)
      .orderBy(asc(servicesTable.sortOrder))

    if (!data || data.length === 0) return staticServices

    return data.map(transformService)
  } catch (err) {
    console.error('[getServices] DB fetch failed, using static fallback:', err)
    return staticServices
  }
}

export async function getCareerPositions(): Promise<JobPosition[]> {
  try {
    const data = await db
      .select()
      .from(careerPositions)
      .where(eq(careerPositions.isActive, true))
      .orderBy(asc(careerPositions.sortOrder))

    if (!data || data.length === 0) return staticPositions

    return data.map(transformPosition)
  } catch (err) {
    console.error(
      '[getCareerPositions] DB fetch failed, using static fallback:',
      err
    )
    return staticPositions
  }
}

export async function getCareerBenefits(): Promise<Benefit[]> {
  try {
    const data = await db
      .select()
      .from(careerBenefits)
      .orderBy(asc(careerBenefits.sortOrder))

    if (!data || data.length === 0) return staticBenefits

    return data.map(transformBenefit)
  } catch (err) {
    console.error(
      '[getCareerBenefits] DB fetch failed, using static fallback:',
      err
    )
    return staticBenefits
  }
}

export async function getCareerValues(): Promise<CultureValue[]> {
  try {
    const data = await db
      .select()
      .from(careerValues)
      .orderBy(asc(careerValues.sortOrder))

    if (!data || data.length === 0) return staticCultureValues

    return data.map(transformValue)
  } catch (err) {
    console.error(
      '[getCareerValues] DB fetch failed, using static fallback:',
      err
    )
    return staticCultureValues
  }
}

export async function getGalleryItems(filters?: {
  category?: string
  projectSlug?: string
}): Promise<GalleryItem[]> {
  try {
    const conditions = []
    if (filters?.category) {
      conditions.push(
        eq(galleryItems.category, filters.category as any)
      )
    }
    if (filters?.projectSlug) {
      conditions.push(eq(galleryItems.projectSlug, filters.projectSlug))
    }

    const data = await db
      .select()
      .from(galleryItems)
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .orderBy(asc(galleryItems.sortOrder))

    if (!data || data.length === 0) return []

    return data.map(transformGalleryItem)
  } catch (err) {
    console.error('[getGalleryItems] DB fetch failed:', err)
    return []
  }
}

export async function getGalleryCategories(): Promise<string[]> {
  try {
    const data = await db
      .select({ category: galleryItems.category })
      .from(galleryItems)

    if (!data || data.length === 0) return []

    const categories = [
      ...new Set(
        data
          .map((row) => row.category)
          .filter((c) => c !== null)
      ),
    ]
    return categories.sort()
  } catch (err) {
    console.error('[getGalleryCategories] DB fetch failed:', err)
    return []
  }
}

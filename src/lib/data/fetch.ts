import { db } from '@/lib/db'
import {
  services as servicesTable,
  careerPositions,
  careerBenefits,
  careerValues,
  galleryItems,
  projects as projectsTable,
  homeContent,
} from '@/lib/db/schema'
import { asc, eq, and } from 'drizzle-orm'
import type {
  Service,
  JobPosition,
  Benefit,
  CultureValue,
  Project,
} from '@/types'
import { services as staticServices } from '@/data/services'
import {
  positions as staticPositions,
  benefits as staticBenefits,
  cultureValues as staticCultureValues,
} from '@/data/careers'
import { projects as staticProjects } from '@/data/projects'

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

type ProjectRow = typeof projectsTable.$inferSelect

function transformProject(row: ProjectRow): Project {
  const heroImage = row.heroImage ?? { url: '', alt: '', width: 0, height: 0 }
  const gallery = row.gallery ?? []

  return {
    id: row.id,
    title: row.title,
    slug: row.slug,
    category: row.category as Project['category'],
    status: row.status as Project['status'],
    year: row.year,
    location: row.location,
    area: row.area ?? undefined,
    client: row.client ?? undefined,
    description: row.description,
    shortDescription: row.shortDescription,
    heroImage: {
      id: `img-${row.id}-hero`,
      url: heroImage.url,
      alt: heroImage.alt,
      width: heroImage.width,
      height: heroImage.height,
    },
    gallery: gallery.map((g, i) => ({
      id: `img-${row.id}-${i}`,
      url: g.url,
      alt: g.alt,
      width: g.width,
      height: g.height,
    })),
    featured: row.featured ?? false,
    sortOrder: row.sortOrder ?? 0,
    createdAt: row.createdAt?.toISOString() ?? '',
    updatedAt: row.updatedAt?.toISOString() ?? '',
  }
}

export async function getProjects(): Promise<Project[]> {
  try {
    const data = await db
      .select()
      .from(projectsTable)
      .orderBy(asc(projectsTable.sortOrder))

    if (!data || data.length === 0) return staticProjects

    return data.map(transformProject)
  } catch (err) {
    console.error('[getProjects] DB fetch failed, using static fallback:', err)
    return staticProjects
  }
}

export interface HomeContent {
  heroVideoUrl: string
  heroTaglineLine1: string
  heroTaglineLine2: string
  parallaxLabel: string
  parallaxImageBg: { url: string; alt: string; width: number; height: number }
  parallaxImageMid: { url: string; alt: string; width: number; height: number }
  parallaxImageFg: { url: string; alt: string; width: number; height: number }
  projectsCount: number
  projectsCountLabel: string
  aboutSnippetTitle: string
  aboutSnippetBody: string
  aboutSnippetCtaText: string
  aboutSnippetImage: { url: string; alt: string; width: number; height: number }
  featuredWorkLabel: string
  servicesLabel: string
  ctaHeading: string
  ctaSubtitle: string
  ctaButtonText: string
}

export const HOME_CONTENT_DEFAULTS: HomeContent = {
  heroVideoUrl: '/video/hero-video.mp4',
  heroTaglineLine1: 'DESIGN WITH INTENT.',
  heroTaglineLine2: 'BUILD WITH PASSION.',
  parallaxLabel: 'Selected Works',
  parallaxImageBg: {
    url: '/images/parallax/layer-1-bg.jpg',
    alt: '',
    width: 1600,
    height: 900,
  },
  parallaxImageMid: {
    url: '/images/parallax/layer-2-mid.jpg',
    alt: 'Architectural detail showcasing Forma Studio design',
    width: 1200,
    height: 1600,
  },
  parallaxImageFg: {
    url: '/images/parallax/layer-3-fg.jpg',
    alt: 'Architectural element by Forma Studio',
    width: 1200,
    height: 900,
  },
  projectsCount: 150,
  projectsCountLabel: 'Projects Delivered',
  aboutSnippetTitle: 'Who We Are',
  aboutSnippetBody:
    "At Forma Studio, we believe architecture is more than structure — it's the silent language of space that shapes how people live, work, and dream. Founded on the principles of intentional design and passionate craftsmanship, we create environments that transcend the ordinary.",
  aboutSnippetCtaText: 'Learn more about us',
  aboutSnippetImage: {
    url: '/images/parallax/layer-2-mid.jpg',
    alt: 'Forma Studio design process',
    width: 600,
    height: 800,
  },
  featuredWorkLabel: 'Featured Work',
  servicesLabel: 'What We Do',
  ctaHeading: "Let's build something remarkable.",
  ctaSubtitle:
    "Ready to transform your vision into reality? Let's start a conversation.",
  ctaButtonText: 'Start Your Project',
}

type HomeContentRow = typeof homeContent.$inferSelect

function transformHomeContent(row: HomeContentRow): HomeContent {
  return {
    heroVideoUrl: row.heroVideoUrl ?? HOME_CONTENT_DEFAULTS.heroVideoUrl,
    heroTaglineLine1:
      row.heroTaglineLine1 ?? HOME_CONTENT_DEFAULTS.heroTaglineLine1,
    heroTaglineLine2:
      row.heroTaglineLine2 ?? HOME_CONTENT_DEFAULTS.heroTaglineLine2,
    parallaxLabel: row.parallaxLabel ?? HOME_CONTENT_DEFAULTS.parallaxLabel,
    parallaxImageBg:
      row.parallaxImageBg ?? HOME_CONTENT_DEFAULTS.parallaxImageBg,
    parallaxImageMid:
      row.parallaxImageMid ?? HOME_CONTENT_DEFAULTS.parallaxImageMid,
    parallaxImageFg:
      row.parallaxImageFg ?? HOME_CONTENT_DEFAULTS.parallaxImageFg,
    projectsCount: row.projectsCount ?? HOME_CONTENT_DEFAULTS.projectsCount,
    projectsCountLabel:
      row.projectsCountLabel ?? HOME_CONTENT_DEFAULTS.projectsCountLabel,
    aboutSnippetTitle:
      row.aboutSnippetTitle ?? HOME_CONTENT_DEFAULTS.aboutSnippetTitle,
    aboutSnippetBody:
      row.aboutSnippetBody ?? HOME_CONTENT_DEFAULTS.aboutSnippetBody,
    aboutSnippetCtaText:
      row.aboutSnippetCtaText ?? HOME_CONTENT_DEFAULTS.aboutSnippetCtaText,
    aboutSnippetImage:
      row.aboutSnippetImage ?? HOME_CONTENT_DEFAULTS.aboutSnippetImage,
    featuredWorkLabel:
      row.featuredWorkLabel ?? HOME_CONTENT_DEFAULTS.featuredWorkLabel,
    servicesLabel: row.servicesLabel ?? HOME_CONTENT_DEFAULTS.servicesLabel,
    ctaHeading: row.ctaHeading ?? HOME_CONTENT_DEFAULTS.ctaHeading,
    ctaSubtitle: row.ctaSubtitle ?? HOME_CONTENT_DEFAULTS.ctaSubtitle,
    ctaButtonText: row.ctaButtonText ?? HOME_CONTENT_DEFAULTS.ctaButtonText,
  }
}

export async function getHomeContent(): Promise<HomeContent> {
  try {
    const [row] = await db.select().from(homeContent).limit(1)
    if (!row) return HOME_CONTENT_DEFAULTS
    return transformHomeContent(row)
  } catch (err) {
    console.error(
      '[getHomeContent] DB fetch failed, using static defaults:',
      err
    )
    return HOME_CONTENT_DEFAULTS
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

/**
 * Seed Script: Populate Neon PostgreSQL with static data
 *
 * Usage:
 *   1. Set DATABASE_URL in .env.local
 *   2. Run: npx drizzle-kit push (to create tables)
 *   3. Run: npx tsx scripts/seed.ts
 */

import { drizzle } from 'drizzle-orm/neon-http'
import {
  services,
  careerPositions,
  careerBenefits,
  careerValues,
} from '../src/lib/db/schema'
import { assertSeedAllowed } from './seed-safety'

assertSeedAllowed('db:seed')

// Load env vars
import { config } from 'dotenv'
config({ path: '.env.local' })

if (!process.env.DATABASE_URL) {
  console.error('Missing DATABASE_URL in .env.local')
  process.exit(1)
}

const db = drizzle(process.env.DATABASE_URL)

async function seedServices() {
  console.log('Seeding services...')

  // Import static data
  const { services: staticServices } = await import('../src/data/services')

  await db
    .insert(services)
    .values(
      staticServices.map((s, i) => ({
        title: s.title,
        slug: s.slug,
        shortTitle: s.shortTitle,
        description: s.description,
        icon: s.icon,
        features: s.features,
        imageUrl: s.image.url,
        imageAlt: s.image.alt,
        imageWidth: s.image.width,
        imageHeight: s.image.height,
        featuredProjectSlug:
          'featuredProjectSlug' in s
            ? (s.featuredProjectSlug as string) || null
            : null,
        sortOrder: i,
      }))
    )
    .onConflictDoNothing()

  console.log(`Seeded ${staticServices.length} services`)
}

async function seedCareerPositions() {
  console.log('Seeding career positions...')

  const { positions } = await import('../src/data/careers')

  await db
    .insert(careerPositions)
    .values(
      positions.map((p, i) => ({
        title: p.title,
        department: p.department as
          | 'architecture'
          | 'interior-design'
          | 'engineering'
          | 'management',
        employmentType: p.employmentType as
          | 'full-time'
          | 'part-time'
          | 'internship',
        location: p.location,
        experience: p.experience || null,
        description: p.description,
        responsibilities: p.responsibilities,
        qualifications: p.qualifications,
        postedDate:
          'postedDate' in p ? (p.postedDate as string) : undefined,
        isActive: true,
        sortOrder: i,
      }))
    )
    .onConflictDoNothing()

  console.log(`Seeded ${positions.length} career positions`)
}

async function seedCareerBenefits() {
  console.log('Seeding career benefits...')

  const { benefits } = await import('../src/data/careers')

  await db
    .insert(careerBenefits)
    .values(
      benefits.map((b, i) => ({
        icon: b.icon,
        title: b.title,
        description: b.description,
        sortOrder: i,
      }))
    )
    .onConflictDoNothing()

  console.log(`Seeded ${benefits.length} career benefits`)
}

async function seedCareerValues() {
  console.log('Seeding career values...')

  const { cultureValues: staticValues } = await import('../src/data/careers')

  await db
    .insert(careerValues)
    .values(
      staticValues.map((v, i) => ({
        title: v.title,
        description: v.description,
        sortOrder: i,
      }))
    )
    .onConflictDoNothing()

  console.log(`Seeded ${staticValues.length} career values`)
}

async function main() {
  console.log('Starting database seed...')
  console.log(`Database: ${process.env.DATABASE_URL?.split('@')[1]?.split('/')[0] || 'configured'}`)

  await seedServices()
  await seedCareerPositions()
  await seedCareerBenefits()
  await seedCareerValues()

  console.log('\nSeed completed successfully!')
}

main().catch((error) => {
  console.error('Seed failed:', error)
  process.exit(1)
})

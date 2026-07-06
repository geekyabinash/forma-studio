/**
 * Seed Script: Migrate hardcoded projects, about, and contact data to DB
 *
 * Usage:
 *   1. Set DATABASE_URL in .env.local
 *   2. Run: npx drizzle-kit push (to create tables)
 *   3. Run: npx tsx scripts/seed-content.ts
 */

import { drizzle } from 'drizzle-orm/neon-http'
import {
  projects,
  aboutContent,
  contactInfo,
} from '../src/lib/db/schema'
import { assertSeedAllowed } from './seed-safety'

assertSeedAllowed('db:seed-content')

import { config } from 'dotenv'
config({ path: '.env.local' })

if (!process.env.DATABASE_URL) {
  console.error('Missing DATABASE_URL in .env.local')
  process.exit(1)
}

const db = drizzle(process.env.DATABASE_URL)

async function seedProjects() {
  console.log('Seeding projects...')

  const { projects: staticProjects } = await import('../src/data/projects')

  await db
    .insert(projects)
    .values(
      staticProjects.map((p) => ({
        title: p.title,
        slug: p.slug,
        category: p.category as 'residential' | 'commercial' | 'interior' | 'landscape' | 'renovation',
        status: p.status as 'completed' | 'in-progress' | 'concept',
        year: p.year,
        location: p.location,
        area: p.area || null,
        client: p.client || null,
        description: p.description,
        shortDescription: p.shortDescription,
        heroImage: {
          url: p.heroImage.url,
          alt: p.heroImage.alt,
          width: p.heroImage.width,
          height: p.heroImage.height,
        },
        gallery: p.gallery.map((g) => ({
          url: g.url,
          alt: g.alt,
          width: g.width,
          height: g.height,
        })),
        featured: p.featured,
        sortOrder: p.sortOrder,
      }))
    )
    .onConflictDoNothing()

  console.log(`Seeded ${staticProjects.length} projects`)
}

async function seedAboutContent() {
  console.log('Seeding about content...')

  await db
    .insert(aboutContent)
    .values({
      heroTagline: 'About Forma Studio',
      heroSubtitle: 'Architecture that transforms spaces and lives',
      storyTitle: 'Our Story',
      storyParagraphs: [
        'Founded in 2010, Forma Studio emerged from a simple belief \u2014 that architecture has the power to transform not just spaces, but lives. What began as a small design practice in a converted Mumbai warehouse has grown into a multidisciplinary studio of architects, interior designers, landscape architects, and urban planners, all united by a shared commitment to design excellence and environmental responsibility.',
        'From the outset, our founder Arjun Mehta championed an approach that places people at the centre of every design decision. We listen before we draw. We study climate, culture, and context before we commit a single line to paper. This patient, research-led process ensures that every Forma Studio project is rooted in the realities of its site and shaped by the aspirations of the people who will inhabit it.',
        'Over the past decade and a half, our portfolio has expanded from residential architecture to encompass hospitality interiors, commercial developments, public landscapes, and heritage restoration. Yet no matter the scale or typology, every project shares the same DNA: rigorous environmental analysis, thoughtful material selection, and an uncompromising pursuit of beauty that endures. We measure our success not in awards \u2014 though we are grateful for the recognition \u2014 but in the lasting relationships we build with clients who return to us, project after project, because they trust our process and believe in our vision.',
        'Today, Forma Studio operates from a light-filled atelier in Mumbai\u2019s Bandra district, where hand-drawn sketches share wall space with digital renderings and material samples line every shelf. It is a space built for collaboration \u2014 where architects, engineers, craftspeople, and clients gather around the same table to shape ideas into reality. We invite you to learn more about the people who make it all possible and the journey that has brought us here.',
      ],
      pullQuote: "We don't design buildings. We design the moments that happen inside them \u2014 the morning light on a staircase, the quiet of a courtyard, the joy of a room that feels like home.",
      pullQuoteAttribution: 'Arjun Mehta, Founder',
      milestones: [
        {
          year: '2010',
          title: 'Studio Founded',
          description: 'Arjun Mehta establishes Forma Studio in Mumbai with a vision to create architecture that serves both people and planet.',
        },
        {
          year: '2013',
          title: 'First Major Project',
          description: 'Completed The Glass Pavilion, winning a local design award and establishing the studio\u2019s reputation for climate-responsive residential architecture.',
        },
        {
          year: '2016',
          title: 'Team Expansion',
          description: 'Grew to 15 professionals spanning architecture, interior design, and landscape architecture, enabling the studio to take on larger multidisciplinary commissions.',
        },
        {
          year: '2019',
          title: 'National Recognition',
          description: 'Featured in Architectural Digest India and received commendation from the Indian Institute of Architects for sustainable design leadership.',
        },
        {
          year: '2022',
          title: '50th Project Milestone',
          description: 'Celebrated the completion of 50 architectural projects across six Indian cities, from intimate residences to large-scale commercial developments.',
        },
        {
          year: '2024',
          title: 'New Horizons',
          description: 'Expanded into landscape architecture and urban planning, welcoming new talent and broadening the studio\u2019s multidisciplinary capabilities.',
        },
      ],
    })
    .onConflictDoNothing()

  console.log('Seeded about content')
}

async function seedContactInfo() {
  console.log('Seeding contact info...')

  await db
    .insert(contactInfo)
    .values({
      address: '123 Architecture Lane, Bandra West, Mumbai 400050, India',
      phone: '+91 99999 99999',
      email: 'hello@formastudio.in',
      workingHours: 'Mon - Fri: 9:00 AM - 6:00 PM | Sat: 10:00 AM - 2:00 PM',
    })
    .onConflictDoNothing()

  console.log('Seeded contact info')
}

async function main() {
  console.log('Starting content seed...')
  console.log(`Database: ${process.env.DATABASE_URL?.split('@')[1]?.split('/')[0] || 'configured'}`)

  await seedProjects()
  await seedAboutContent()
  await seedContactInfo()

  console.log('\nContent seed completed successfully!')
}

main().catch((error) => {
  console.error('Content seed failed:', error)
  process.exit(1)
})

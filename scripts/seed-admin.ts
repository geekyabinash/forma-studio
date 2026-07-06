/**
 * Seed Admin User Script
 *
 * Creates admin user with hashed password in the database.
 *
 * Usage:
 *   1. Set DATABASE_URL, ADMIN_EMAIL, ADMIN_PASSWORD in .env.local
 *   2. Run: npx tsx scripts/seed-admin.ts
 */

import { drizzle } from 'drizzle-orm/neon-http'
import bcrypt from 'bcryptjs'
import { users } from '../src/lib/db/schema'
import { assertSeedAllowed } from './seed-safety'

assertSeedAllowed('db:seed-admin')

import { config } from 'dotenv'
config({ path: '.env.local' })

if (!process.env.DATABASE_URL) {
  console.error('Missing DATABASE_URL in .env.local')
  process.exit(1)
}

const db = drizzle(process.env.DATABASE_URL)

async function seedAdmin() {
  const email = process.env.ADMIN_EMAIL || 'admin@formastudio.in'
  const password = process.env.ADMIN_PASSWORD || 'changeme'

  const hash = await bcrypt.hash(password, 12)

  await db
    .insert(users)
    .values({
      email,
      passwordHash: hash,
      name: 'Admin',
    })
    .onConflictDoNothing()

  console.log(`Admin user created: ${email}`)
}

seedAdmin().catch((error) => {
  console.error('Failed to create admin user:', error)
  process.exit(1)
})

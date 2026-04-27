import { drizzle, type NeonHttpDatabase } from 'drizzle-orm/neon-http'
import * as schema from './schema'

let _db: NeonHttpDatabase<typeof schema> | null = null

export function getDb() {
  if (!_db) {
    if (!process.env.DATABASE_URL) {
      return null
    }
    _db = drizzle(process.env.DATABASE_URL, { schema })
  }
  return _db
}

// For convenience - use `db` as a proxy that lazily initializes
export const db = new Proxy({} as NeonHttpDatabase<typeof schema>, {
  get(_, prop) {
    const instance = getDb()
    if (!instance) {
      throw new Error('Database not available (DATABASE_URL not set)')
    }
    return Reflect.get(instance, prop)
  },
})

import { drizzle, type NeonHttpDatabase } from 'drizzle-orm/neon-http'
import * as schema from './schema'

let _db: NeonHttpDatabase<typeof schema> | null = null

export function getDb() {
  if (!_db) {
    _db = drizzle(process.env.DATABASE_URL!, { schema })
  }
  return _db
}

// For convenience - use `db` as a proxy that lazily initializes
export const db = new Proxy({} as NeonHttpDatabase<typeof schema>, {
  get(_, prop) {
    return (getDb() as any)[prop]
  },
})

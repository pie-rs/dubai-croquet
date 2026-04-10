import { drizzle, type PostgresJsDatabase } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import * as schema from './schema'

type Db = PostgresJsDatabase<typeof schema>

let cachedDb: Db | null = null

export function hasDatabaseUrl() {
  return Boolean(process.env.DATABASE_URL?.trim())
}

export function getDb() {
  const connectionString = process.env.DATABASE_URL?.trim()
  if (!connectionString) {
    return null
  }

  if (!cachedDb) {
    const client = postgres(connectionString)
    cachedDb = drizzle(client, { schema })
  }

  return cachedDb
}

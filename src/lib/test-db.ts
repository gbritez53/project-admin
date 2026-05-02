import { drizzle, type DrizzleD1Database } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client";
import { migrate } from "drizzle-orm/libsql/migrator";
import * as schema from "../db/schema";

export interface TestDbClient {
  db: DrizzleD1Database<typeof schema>;
  client: ReturnType<typeof createClient>;
}

/**
 * Create an in-memory SQLite database for testing.
 * Applies the same migrations as production to ensure test/prod parity.
 */
export async function makeTestDb(): Promise<TestDbClient> {
  const client = createClient({ url: ":memory:" });

  // CRITICAL: enforce FK in test DB too
  await client.execute("PRAGMA foreign_keys = ON;");

  const db = drizzle(client, { schema });

  // Apply committed migrations so tests match prod shape exactly
  await migrate(db, { migrationsFolder: "./drizzle" });

  return { db, client };
}

export type TestDb = TestDbClient["db"];
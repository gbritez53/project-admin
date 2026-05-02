import { drizzle } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client";
import * as schema from "./schema";

function getClient() {
  const url = import.meta.env.TURSO_DATABASE_URL;
  const authToken = import.meta.env.TURSO_AUTH_TOKEN;

  if (!url) {
    throw new Error("TURSO_DATABASE_URL is required. Add it to your .env file.");
  }

  return createClient({ url, authToken });
}

function getDb() {
  const client = getClient();
  return drizzle(client, { schema });
}

// Singleton - create lazily
let dbInstance: ReturnType<typeof getDb> | null = null;

export function getDbInstance() {
  if (!dbInstance) {
    const client = getClient();
    client.execute("PRAGMA foreign_keys = ON;").catch(console.error);
    dbInstance = drizzle(client, { schema });
  }
  return dbInstance;
}

// For backwards compatibility
export const db = getDbInstance();

export type DB = typeof db;
import { drizzle } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client";
import * as schema from "./schema";

const url = import.meta.env.TURSO_DATABASE_URL;
const authToken = import.meta.env.TURSO_AUTH_TOKEN;

if (!url) throw new Error("TURSO_DATABASE_URL is required");

export const libsql = createClient({ url, authToken });

// Enforce FK constraints on every connection (idempotent, cheap).
await libsql.execute("PRAGMA foreign_keys = ON;");

export const db = drizzle(libsql, { schema });

export type DB = typeof db;
/// <reference types="astro/client" />
import type { DB } from "./db/client";

interface ImportMetaEnv {
  readonly TURSO_DATABASE_URL: string;
  readonly TURSO_AUTH_TOKEN: string;
  readonly PUBLIC_MONEY_LOCALE?: string;
  readonly PUBLIC_MONEY_CURRENCY?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

declare namespace App {
  interface Locals {
    db: DB;
  }
}
import type { MiddlewareHandler } from "astro";
import { db } from "./db/client";

export const onRequest: MiddlewareHandler = async (context, next) => {
  // @ts-ignore - db type augmentation
  context.locals.db = db;
  return next();
};
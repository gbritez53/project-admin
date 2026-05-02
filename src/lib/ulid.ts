import { ulid } from "ulid";

/**
 * Generate a new ULID string for use as a database ID.
 * ULIDs are sortable, URL-safe, and 26 characters long.
 */
export const newId = (): string => ulid();
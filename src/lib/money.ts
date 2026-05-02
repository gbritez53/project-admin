const CENTS_PER_UNIT = 100;
const MAX_CENTS = 99999999; // 999,999.99

/**
 * Parse a user-typed money string into integer cents.
 * Accepts: "12", "12.3", "12.34", "1,234.56", "12,34" (EU comma), "  12.5  ".
 * Throws on garbage like "abc" or empty.
 */
export function parseMoney(input: string): number {
  if (typeof input !== "string") throw new TypeError("parseMoney: string required");
  const trimmed = input.trim();
  if (trimmed === "") throw new RangeError("parseMoney: empty");

  // Normalize: strip thousand separators, accept ',' or '.' as decimal.
  // Heuristic: last separator is the decimal mark.
  const cleaned = trimmed.replace(/\s/g, "");
  const lastDot = cleaned.lastIndexOf(".");
  const lastComma = cleaned.lastIndexOf(",");

  let normalized: string;
  if (lastDot === -1 && lastComma === -1) {
    normalized = cleaned;
  } else {
    const decIdx = Math.max(lastDot, lastComma);
    const intPart = cleaned.slice(0, decIdx).replace(/[.,]/g, "");
    const decPart = cleaned.slice(decIdx + 1).replace(/[.,]/g, "");
    normalized = `${intPart}.${decPart}`;
  }

  if (!/^-?\d+(\.\d+)?$/.test(normalized)) {
    throw new RangeError(`parseMoney: invalid number "${input}"`);
  }

  const parts = normalized.split(".");
  const intPart = parts[0] ?? "0";
  const decPart = parts[1] ?? "";
  const padded = (decPart + "00").slice(0, 2); // truncate excess decimals
  const cents = Number(intPart) * CENTS_PER_UNIT +
    (intPart.startsWith("-") ? -1 : 1) * Number(padded);

  if (!Number.isFinite(cents)) throw new RangeError("parseMoney: overflow");

  // Check bounds
  if (cents < 0) throw new RangeError("parseMoney: negative not allowed");
  if (cents > MAX_CENTS) throw new RangeError("parseMoney: exceeds maximum");

  return cents;
}

/**
 * Format integer cents as a human string. Default: en-US "$12.34".
 */
export function formatMoney(
  cents: number,
  opts: { locale?: string; currency?: string } = {},
): string {
  const { locale = "en-US", currency = "USD" } = opts;
  const value = cents / CENTS_PER_UNIT;
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
  }).format(value);
}
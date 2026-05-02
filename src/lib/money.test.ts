import { describe, it, expect } from "vitest";
import { parseMoney, formatMoney } from "./money";

describe("parseMoney", () => {
  it("parses whole numbers correctly", () => {
    expect(parseMoney("12")).toBe(1200);
    expect(parseMoney("100")).toBe(10000);
    expect(parseMoney("0")).toBe(0);
  });

  it("parses decimal amounts correctly", () => {
    expect(parseMoney("12.50")).toBe(1250);
    expect(parseMoney("0.01")).toBe(1);
    expect(parseMoney("100.99")).toBe(10099);
  });

  it("parses zero correctly", () => {
    expect(parseMoney("0")).toBe(0);
    expect(parseMoney("0.00")).toBe(0);
  });

  it("parses minimum cent correctly", () => {
    expect(parseMoney("0.01")).toBe(1);
  });

  it("parses maximum amount correctly", () => {
    expect(parseMoney("999999.99")).toBe(99999999);
  });

  it("rejects negative amounts", () => {
    expect(() => parseMoney("-1")).toThrow();
    expect(() => parseMoney("-0.01")).toThrow();
    expect(() => parseMoney("-100.00")).toThrow();
  });

  it("rejects non-numeric strings", () => {
    expect(() => parseMoney("abc")).toThrow();
    expect(() => parseMoney("")).toThrow();
    expect(() => parseMoney("  ")).toThrow();
    expect(() => parseMoney(",")).toThrow();
  });

  it("accepts maximum amount", () => {
    expect(parseMoney("999999.99")).toBe(99999999);
  });

  it("rejects amounts exceeding maximum", () => {
    expect(() => parseMoney("1000000.00")).toThrow();
    expect(() => parseMoney("1000000")).toThrow();
  });

  it("handles whitespace trimming", () => {
    expect(parseMoney("  12.50  ")).toBe(1250);
    expect(parseMoney("\t100\t")).toBe(10000);
  });
});

describe("formatMoney", () => {
  it("formats cents to currency string", () => {
    expect(formatMoney(1250)).toBe("$12.50");
    expect(formatMoney(100)).toBe("$1.00");
    expect(formatMoney(0)).toBe("$0.00");
  });

  it("formats zero correctly", () => {
    expect(formatMoney(0)).toBe("$0.00");
  });

  it("formats maximum cents correctly", () => {
    expect(formatMoney(99999999)).toBe("$999,999.99");
  });

  it("formats different amounts correctly", () => {
    expect(formatMoney(1)).toBe("$0.01");
    expect(formatMoney(99)).toBe("$0.99");
    expect(formatMoney(1000)).toBe("$10.00");
    expect(formatMoney(999)).toBe("$9.99");
  });
});

describe("round-trip", () => {
  it("parseMoney then formatMoney returns a valid currency string", () => {
    const testCases = [
      { input: "12.50", expectedCents: 1250 },
      { input: "0", expectedCents: 0 },
      { input: "100.99", expectedCents: 10099 },
      { input: "999999.99", expectedCents: 99999999 },
    ];
    for (const { input, expectedCents } of testCases) {
      const cents = parseMoney(input);
      expect(cents).toBe(expectedCents);
      const formatted = formatMoney(cents);
      // Just verify it contains a dollar sign and the numeric value
      expect(formatted).toMatch(/\$/);
      // Extract numeric value from formatted string and compare
      const numericValue = parseFloat(formatted.replace(/[$,]/g, ""));
      expect(numericValue).toBeCloseTo(expectedCents / 100, 2);
    }
  });
});
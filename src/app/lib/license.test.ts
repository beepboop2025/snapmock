import { describe, it, expect } from "vitest";
import { isValidLicenseKey, normalizeLicenseKey, MIN_KEY_LENGTH } from "./license";

describe("isValidLicenseKey", () => {
  it("rejects the empty string", () => {
    expect(isValidLicenseKey("")).toBe(false);
  });

  it("rejects keys shorter than the minimum length", () => {
    expect(isValidLicenseKey("1234567")).toBe(false); // 7 chars
  });

  it("accepts a key of exactly the minimum length", () => {
    expect("12345678".length).toBe(MIN_KEY_LENGTH);
    expect(isValidLicenseKey("12345678")).toBe(true);
  });

  it("accepts longer keys", () => {
    expect(isValidLicenseKey("order-2026-abc-xyz")).toBe(true);
  });

  it("trims surrounding whitespace before measuring length", () => {
    // 7 visible chars padded with whitespace -> still invalid
    expect(isValidLicenseKey("   1234567   ")).toBe(false);
    // 8 visible chars padded with whitespace -> valid
    expect(isValidLicenseKey("  12345678  ")).toBe(true);
  });

  it("treats all-whitespace input as invalid", () => {
    expect(isValidLicenseKey("          ")).toBe(false);
  });
});

describe("normalizeLicenseKey", () => {
  it("strips leading and trailing whitespace", () => {
    expect(normalizeLicenseKey("  hello@example.com  ")).toBe("hello@example.com");
  });

  it("leaves interior whitespace untouched", () => {
    expect(normalizeLicenseKey("  John Doe  ")).toBe("John Doe");
  });
});

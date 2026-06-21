// =============================================
// Pure license-key validation
// =============================================
// The activation rule lives here so it can be tested in isolation from
// React, localStorage, and window events. A key is valid when, after
// trimming surrounding whitespace, it has at least MIN_KEY_LENGTH chars.

export const MIN_KEY_LENGTH = 8;

/** Whitespace-trimmed validity check for a license/activation key. */
export function isValidLicenseKey(key: string): boolean {
  return key.trim().length >= MIN_KEY_LENGTH;
}

/** Normalised form that gets persisted (trimmed). */
export function normalizeLicenseKey(key: string): string {
  return key.trim();
}

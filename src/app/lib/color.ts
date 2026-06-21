// =============================================
// Pure color helpers
// =============================================
// Used to decide whether UI sitting on a custom background should switch
// to light-on-dark styling. Mirrors the perceived-luminance math that was
// previously inlined in MockupEditor.

/**
 * Expand a hex color to its 6-digit form (without leading '#').
 * Accepts "#abc", "abc", "#aabbcc", "aabbcc".
 */
export function expandHex(hex: string): string {
  let c = hex.replace("#", "");
  if (c.length === 3) {
    c = c[0] + c[0] + c[1] + c[1] + c[2] + c[2];
  }
  return c;
}

/**
 * ITU-R BT.601 perceived luminance (0-255) of a hex color.
 * Returns NaN for inputs that cannot be parsed as hex.
 */
export function perceivedLuminance(hex: string): number {
  const c = expandHex(hex);
  const r = parseInt(c.substring(0, 2), 16);
  const g = parseInt(c.substring(2, 4), 16);
  const b = parseInt(c.substring(4, 6), 16);
  return (r * 299 + g * 587 + b * 114) / 1000;
}

/** True when a hex color is dark enough to warrant light foreground text. */
export function isDarkColor(hex: string): boolean {
  return perceivedLuminance(hex) < 128;
}

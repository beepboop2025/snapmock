import { describe, it, expect } from "vitest";
import { expandHex, perceivedLuminance, isDarkColor } from "./color";

describe("expandHex", () => {
  it("strips a leading hash", () => {
    expect(expandHex("#aabbcc")).toBe("aabbcc");
  });

  it("expands 3-digit shorthand to 6 digits", () => {
    expect(expandHex("#abc")).toBe("aabbcc");
    expect(expandHex("f0a")).toBe("ff00aa");
  });

  it("leaves 6-digit values unchanged", () => {
    expect(expandHex("123456")).toBe("123456");
  });
});

describe("perceivedLuminance", () => {
  it("is 0 for pure black", () => {
    expect(perceivedLuminance("#000000")).toBe(0);
  });

  it("is 255 for pure white", () => {
    expect(perceivedLuminance("#ffffff")).toBe(255);
  });

  it("weights green most heavily (BT.601)", () => {
    // Pure green should read brighter than pure red, which beats pure blue.
    const r = perceivedLuminance("#ff0000");
    const g = perceivedLuminance("#00ff00");
    const b = perceivedLuminance("#0000ff");
    expect(g).toBeGreaterThan(r);
    expect(r).toBeGreaterThan(b);
    expect(g).toBeCloseTo(149.685, 3);
  });

  it("handles shorthand identically to full form", () => {
    expect(perceivedLuminance("#fff")).toBe(perceivedLuminance("#ffffff"));
  });
});

describe("isDarkColor", () => {
  it("classifies black and deep navy as dark", () => {
    expect(isDarkColor("#000000")).toBe(true);
    expect(isDarkColor("#1a1a2e")).toBe(true);
  });

  it("classifies white and pale colors as light", () => {
    expect(isDarkColor("#ffffff")).toBe(false);
    expect(isDarkColor("#ffd200")).toBe(false); // gold
  });

  it("uses 128 as the threshold (boundary is not dark)", () => {
    // Construct a gray with luminance exactly 128 -> not < 128 -> light.
    expect(perceivedLuminance("#808080")).toBe(128);
    expect(isDarkColor("#808080")).toBe(false);
    // One step darker flips it.
    expect(isDarkColor("#7f7f7f")).toBe(true);
  });

  it("classifies the default editor purple (#7c3aed) as dark", () => {
    expect(isDarkColor("#7c3aed")).toBe(true);
  });
});

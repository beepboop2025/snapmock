import { describe, it, expect } from "vitest";
import {
  hasCrypto,
  cryptoLabel,
  buildMethods,
  availableMethods,
  buildUpiDeepLink,
  buildUpiQrUrl,
  buildPaypalUrl,
  buildBmacUrl,
  resolveWallets,
  type PaymentConfig,
} from "./payment";

const base: PaymentConfig = {
  UPI_ID: "",
  UPI_NAME: "",
  PAYPAL_USERNAME: "",
  BMAC_USERNAME: "",
  CRYPTO_WALLETS: [],
  CRYPTO_ADDRESS: "",
  CRYPTO_NETWORK: "",
  PRODUCT_NAME: "SnapMock",
  PRO_PRICE_INR: "749",
};

const cfg = (over: Partial<PaymentConfig>): PaymentConfig => ({ ...base, ...over });

describe("hasCrypto", () => {
  it("is false when no wallets and no legacy address", () => {
    expect(hasCrypto(base)).toBe(false);
  });

  it("is true with a wallet array", () => {
    expect(hasCrypto(cfg({ CRYPTO_WALLETS: [{ network: "Eth", address: "0x1", icon: "x" }] }))).toBe(true);
  });

  it("is true with only the legacy single address", () => {
    expect(hasCrypto(cfg({ CRYPTO_ADDRESS: "bc1abc" }))).toBe(true);
  });
});

describe("cryptoLabel", () => {
  it("pluralises networks count for >1 wallet", () => {
    expect(
      cryptoLabel(
        cfg({
          CRYPTO_WALLETS: [
            { network: "Eth", address: "a", icon: "x" },
            { network: "Btc", address: "b", icon: "y" },
          ],
        })
      )
    ).toBe("Crypto (2 networks)");
  });

  it("names the single wallet network for exactly one wallet", () => {
    expect(cryptoLabel(cfg({ CRYPTO_WALLETS: [{ network: "Solana", address: "s", icon: "z" }] }))).toBe(
      "Crypto (Solana)"
    );
  });

  it("falls back to legacy network field when no wallet array", () => {
    expect(cryptoLabel(cfg({ CRYPTO_NETWORK: "Polygon" }))).toBe("Crypto (Polygon)");
  });

  it("is the bare label when nothing configured", () => {
    expect(cryptoLabel(base)).toBe("Crypto");
  });
});

describe("buildMethods / availableMethods", () => {
  it("marks availability per configured field", () => {
    const m = buildMethods(cfg({ UPI_ID: "x@ybl", PAYPAL_USERNAME: "snap" }));
    const byId = Object.fromEntries(m.map((x) => [x.id, x.available]));
    expect(byId).toEqual({ upi: true, paypal: true, bmac: false, crypto: false });
  });

  it("always returns the four methods in stable order", () => {
    expect(buildMethods(base).map((m) => m.id)).toEqual(["upi", "paypal", "bmac", "crypto"]);
  });

  it("filters to only configured methods", () => {
    const avail = availableMethods(cfg({ BMAC_USERNAME: "snap" }));
    expect(avail.map((m) => m.id)).toEqual(["bmac"]);
  });

  it("returns empty when nothing is configured", () => {
    expect(availableMethods(base)).toHaveLength(0);
  });
});

describe("buildUpiDeepLink", () => {
  it("returns empty string when no UPI id", () => {
    expect(buildUpiDeepLink(base, "pro")).toBe("");
  });

  it("encodes the payee id and attaches INR amount in pro mode", () => {
    const link = buildUpiDeepLink(cfg({ UPI_ID: "name@okaxis", UPI_NAME: "Mri" }), "pro");
    expect(link).toContain("upi://pay?pa=name%40okaxis");
    expect(link).toContain("&pn=Mri");
    expect(link).toContain("&am=749&cu=INR");
    expect(link).toContain("&tn=SnapMock%20Pro%20License");
  });

  it("omits the amount in tip mode but keeps currency", () => {
    const link = buildUpiDeepLink(cfg({ UPI_ID: "x@ybl" }), "tip");
    expect(link).not.toContain("&am=");
    expect(link).toContain("&cu=INR");
    expect(link).toContain("&tn=Support%20SnapMock");
  });

  it("falls back to PRODUCT_NAME when UPI_NAME is blank", () => {
    const link = buildUpiDeepLink(cfg({ UPI_ID: "x@ybl" }), "tip");
    expect(link).toContain("&pn=SnapMock");
  });

  it("falls back to 749 when PRO_PRICE_INR is empty", () => {
    const link = buildUpiDeepLink(cfg({ UPI_ID: "x@ybl", PRO_PRICE_INR: "" }), "pro");
    expect(link).toContain("&am=749&cu=INR");
  });
});

describe("buildUpiQrUrl", () => {
  it("is empty for an empty deep link", () => {
    expect(buildUpiQrUrl("")).toBe("");
  });

  it("url-encodes the deep link into the qrserver endpoint", () => {
    const url = buildUpiQrUrl("upi://pay?pa=a@b");
    expect(url.startsWith("https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=")).toBe(true);
    expect(url).toContain("upi%3A%2F%2Fpay%3Fpa%3Da%40b");
  });
});

describe("paypal / bmac url builders", () => {
  it("pins the $9 path for pro mode paypal", () => {
    expect(buildPaypalUrl("snapmock", "pro")).toBe("https://paypal.me/snapmock/9");
  });

  it("omits amount path for tip mode paypal", () => {
    expect(buildPaypalUrl("snapmock", "tip")).toBe("https://paypal.me/snapmock");
  });

  it("builds a bmac profile url", () => {
    expect(buildBmacUrl("snapmock")).toBe("https://buymeacoffee.com/snapmock");
  });
});

describe("resolveWallets", () => {
  it("prefers the multi-wallet array", () => {
    const wallets = [{ network: "Eth", address: "0x1", icon: "x" }];
    expect(resolveWallets(cfg({ CRYPTO_WALLETS: wallets }))).toBe(wallets);
  });

  it("synthesises a single wallet from legacy fields", () => {
    const out = resolveWallets(cfg({ CRYPTO_ADDRESS: "bc1abc", CRYPTO_NETWORK: "Bitcoin" }));
    expect(out).toEqual([{ network: "Bitcoin", address: "bc1abc", icon: "🪙" }]);
  });

  it("defaults the legacy network name to 'Crypto'", () => {
    const out = resolveWallets(cfg({ CRYPTO_ADDRESS: "bc1abc" }));
    expect(out[0].network).toBe("Crypto");
  });

  it("returns empty when nothing configured", () => {
    expect(resolveWallets(base)).toEqual([]);
  });
});

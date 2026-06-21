// =============================================
// Pure payment-link / method-resolution logic
// =============================================
// Extracted from PaymentModal so it can be unit-tested without React,
// the DOM, or any network access. These functions take an explicit
// config object so they are fully deterministic.

export type PaymentMethodId = "upi" | "paypal" | "bmac" | "crypto";

export type CryptoWallet = { network: string; address: string; icon: string };

export interface PaymentConfig {
  UPI_ID: string;
  UPI_NAME: string;
  PAYPAL_USERNAME: string;
  BMAC_USERNAME: string;
  CRYPTO_WALLETS: CryptoWallet[];
  CRYPTO_ADDRESS: string;
  CRYPTO_NETWORK: string;
  PRODUCT_NAME: string;
  PRO_PRICE_INR: string;
}

export type PayMode = "pro" | "tip";

export interface PaymentMethodOption {
  id: PaymentMethodId;
  name: string;
  icon: string;
  available: boolean;
}

/** True when at least one crypto destination is configured. */
export function hasCrypto(config: Pick<PaymentConfig, "CRYPTO_WALLETS" | "CRYPTO_ADDRESS">): boolean {
  return (!!config.CRYPTO_WALLETS && config.CRYPTO_WALLETS.length > 0) || !!config.CRYPTO_ADDRESS;
}

/** Human label for the crypto button, pluralising by number of networks. */
export function cryptoLabel(
  config: Pick<PaymentConfig, "CRYPTO_WALLETS" | "CRYPTO_NETWORK">
): string {
  const wallets = config.CRYPTO_WALLETS;
  if (wallets?.length > 1) return `Crypto (${wallets.length} networks)`;
  if (wallets?.length === 1) return `Crypto (${wallets[0].network})`;
  if (config.CRYPTO_NETWORK) return `Crypto (${config.CRYPTO_NETWORK})`;
  return "Crypto";
}

/** Full ordered list of payment methods with their availability computed. */
export function buildMethods(config: PaymentConfig): PaymentMethodOption[] {
  return [
    { id: "upi", name: "UPI (GPay / PhonePe)", icon: "💳", available: !!config.UPI_ID },
    { id: "paypal", name: "PayPal", icon: "🅿️", available: !!config.PAYPAL_USERNAME },
    { id: "bmac", name: "Buy Me a Coffee", icon: "☕", available: !!config.BMAC_USERNAME },
    { id: "crypto", name: cryptoLabel(config), icon: "🪙", available: hasCrypto(config) },
  ];
}

/** Only the methods that are actually configured/usable. */
export function availableMethods(config: PaymentConfig): PaymentMethodOption[] {
  return buildMethods(config).filter((m) => m.available);
}

/**
 * Build a UPI deep link (upi://pay?...). Returns "" when no UPI id is set.
 * In "pro" mode the configured INR amount (or 749 fallback) is attached.
 */
export function buildUpiDeepLink(config: PaymentConfig, mode: PayMode): string {
  if (!config.UPI_ID) return "";
  const pn = config.UPI_NAME || config.PRODUCT_NAME;
  const amountPart =
    mode === "pro" ? `&am=${config.PRO_PRICE_INR || "749"}&cu=INR` : "&cu=INR";
  const note = mode === "pro" ? "SnapMock Pro License" : "Support SnapMock";
  return (
    `upi://pay?pa=${encodeURIComponent(config.UPI_ID)}` +
    `&pn=${encodeURIComponent(pn)}` +
    amountPart +
    `&tn=${encodeURIComponent(note)}`
  );
}

/** QR-image URL for a given UPI deep link. Empty in, empty out. */
export function buildUpiQrUrl(deepLink: string): string {
  if (!deepLink) return "";
  return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(deepLink)}`;
}

/** paypal.me link; "pro" mode pins the $9 amount path. */
export function buildPaypalUrl(username: string, mode: PayMode): string {
  return `https://paypal.me/${username}${mode === "pro" ? "/9" : ""}`;
}

/** Buy Me a Coffee profile link. */
export function buildBmacUrl(username: string): string {
  return `https://buymeacoffee.com/${username}`;
}

/**
 * Resolve the list of wallets to display, preferring the multi-wallet array
 * and falling back to the legacy single-address fields.
 */
export function resolveWallets(
  config: Pick<PaymentConfig, "CRYPTO_WALLETS" | "CRYPTO_ADDRESS" | "CRYPTO_NETWORK">
): CryptoWallet[] {
  if (config.CRYPTO_WALLETS?.length) return config.CRYPTO_WALLETS;
  if (config.CRYPTO_ADDRESS) {
    return [{ network: config.CRYPTO_NETWORK || "Crypto", address: config.CRYPTO_ADDRESS, icon: "🪙" }];
  }
  return [];
}

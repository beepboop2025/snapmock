// =============================================
// SnapMock Configuration
// =============================================
// Fill in whichever payment methods you have.
// No financial info shared with any third party.
// Money goes directly to YOU.

export const CONFIG = {
  // ── Direct Payment Methods ──────────────────
  // Fill in ANY methods you already have. Leave others blank.
  // At least one must be set to receive payments.

  // UPI (India) — Zero setup! You already have this via Google Pay/PhonePe/Paytm
  // Find your UPI ID in your UPI app → Profile → UPI ID
  UPI_ID: "", // e.g. "yourname@okaxis", "9876543210@ybl", "yourname@paytm"
  UPI_NAME: "", // e.g. "Mrinal" — your display name for UPI payments

  // PayPal — Create free account at paypal.me, share the link
  PAYPAL_USERNAME: "", // e.g. "snapmock" → becomes paypal.me/snapmock

  // Buy Me a Coffee — sign up with email at buymeacoffee.com
  // Note: BMAC requires connecting Stripe/PayPal before you can receive payments
  BMAC_USERNAME: "", // e.g. "snapmock" → becomes buymeacoffee.com/snapmock

  // Crypto wallets — add as many networks as you support
  // No financial info needed. Convert to fiat when you want.
  CRYPTO_WALLETS: [
    { network: "Ethereum", address: "0x84a8c2281F053b8671253f1fBa80a76E68299793", icon: "⟠" },
    { network: "Bitcoin", address: "bc1qesqcn0z2r7465945gmgr6v5jr3zqt5035cmze0", icon: "₿" },
    { network: "Solana", address: "BHauLSfgsYoXRDbeRUXrZHABXP29NA9DrUfajQ6jsKRW", icon: "◎" },
    { network: "BNB Chain", address: "0x84a8c2281F053b8671253f1fBa80a76E68299793", icon: "🔶" },
    { network: "Base", address: "0x84a8c2281F053b8671253f1fBa80a76E68299793", icon: "🔵" },
    { network: "Polygon", address: "0x84a8c2281F053b8671253f1fBa80a76E68299793", icon: "⬡" },
  ] as { network: string; address: string; icon: string }[],

  // Legacy single-wallet fields (kept for backward compatibility)
  CRYPTO_ADDRESS: "", // leave empty when using CRYPTO_WALLETS above
  CRYPTO_NETWORK: "",

  // ── Email Capture ──────────────────────────
  EMAIL_ENDPOINT: "", // e.g. "https://formspree.io/f/xyzabc"

  // ── Site Info ──────────────────────────────
  SITE_URL: "https://snapmock-orpin.vercel.app",
  PRODUCT_NAME: "SnapMock",
  PRO_PRICE: "$9",
  PRO_PRICE_INR: "749",
  PRO_PRICE_LABEL: "one-time",
};

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

  // Crypto wallet — create free wallet via MetaMask or Coinbase Wallet
  // No financial info needed. Convert to fiat when you want.
  CRYPTO_ADDRESS: "", // e.g. "0x1234...abcd" (ETH/USDC/Polygon address)
  CRYPTO_NETWORK: "", // e.g. "Ethereum", "Polygon", "Base"

  // ── Email Capture ──────────────────────────
  EMAIL_ENDPOINT: "", // e.g. "https://formspree.io/f/xyzabc"

  // ── Site Info ──────────────────────────────
  SITE_URL: "https://snapmock-orpin.vercel.app",
  PRODUCT_NAME: "SnapMock",
  PRO_PRICE: "$9",
  PRO_PRICE_INR: "749",
  PRO_PRICE_LABEL: "one-time",
};

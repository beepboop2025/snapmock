# SnapMock

**Turn screenshots into beautiful mockups in seconds.**

Upload any screenshot, pick a gradient background, add a browser or phone frame, and download a polished PNG. Everything runs in your browser — your images never leave your device.

## Features

- 12+ gradient backgrounds
- Browser window & phone device frames
- Adjustable padding, shadows, and corner radius
- High-resolution PNG export (2x free, 4x Pro)
- Clipboard paste support (Ctrl+V)
- Drag & drop upload
- 100% client-side — zero server uploads
- No sign-up required
- Built-in multi-method payment system (UPI, PayPal, BMAC, Crypto)
- Freemium model with Pro license activation

## Tech Stack

- **Next.js 16** (App Router) + TypeScript
- **Tailwind CSS v4**
- **html-to-image** for client-side PNG export
- **Vercel Analytics** + Speed Insights
- Deployed on **Vercel**

## Getting Started

```bash
git clone https://github.com/YOUR_USERNAME/snapmock.git
cd snapmock
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Configuration

Edit `src/app/config.ts` to connect your payment methods:

```ts
export const CONFIG = {
  UPI_ID: "",           // Your UPI ID (Google Pay / PhonePe)
  PAYPAL_USERNAME: "",  // PayPal.me username
  BMAC_USERNAME: "",    // Buy Me a Coffee username
  CRYPTO_ADDRESS: "",   // Wallet address
  EMAIL_ENDPOINT: "",   // Email capture form endpoint
  // ...
};
```

The app auto-detects configured methods and displays them in the payment modal.

## Deployment

```bash
npm run build
npx vercel --yes --prod
```

## Project Structure

```
src/app/
  config.ts              # Payment & site configuration
  page.tsx               # Landing page
  layout.tsx             # Root layout + SEO
  components/
    MockupEditor.tsx     # Core editor (canvas + controls)
    PricingSection.tsx   # Free / Pro pricing
    PaymentModal.tsx     # Multi-method payment modal
    FloatingSupport.tsx  # Floating tip button
    EmailCapture.tsx     # Email capture form
  hooks/
    useLicense.ts        # Pro license management
```

## License

MIT

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SnapMock - Beautiful Screenshot Mockups in Seconds",
  description:
    "Create stunning screenshot mockups with beautiful gradient backgrounds, shadows, and device frames. Free online tool for developers, marketers, and content creators. No sign-up required.",
  keywords: [
    "screenshot mockup",
    "mockup generator",
    "screenshot beautifier",
    "product mockup",
    "social media screenshots",
    "browser mockup",
    "phone mockup",
    "screenshot tool",
    "image mockup",
    "free mockup generator",
  ],
  openGraph: {
    title: "SnapMock - Beautiful Screenshot Mockups in Seconds",
    description:
      "Create stunning screenshot mockups with beautiful backgrounds, shadows, and device frames. Free online tool. No sign-up required.",
    type: "website",
    url: "https://snapmock-orpin.vercel.app",
    siteName: "SnapMock",
  },
  twitter: {
    card: "summary_large_image",
    title: "SnapMock - Beautiful Screenshot Mockups in Seconds",
    description:
      "Drop a screenshot, pick a style, download a stunning mockup. Free, instant, no sign-up.",
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: "https://snapmock-orpin.vercel.app",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Cormorant_Garamond } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ParticleBackground } from "@/components/ParticleBackground";
import { ErrorBoundary } from "@/components/ErrorBoundary";

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

const cormorant = Cormorant_Garamond({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? "https://vibeguard.app";

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: "VibeGuard — Privacy-First AI Writing Auditor",
    template: "%s | VibeGuard",
  },
  description:
    "Analyze tone, readability, and inclusivity using AI that runs entirely in your browser. Your text never leaves your device.",
  keywords: [
    "AI writing",
    "tone analyzer",
    "inclusivity checker",
    "readability",
    "privacy-first",
    "browser AI",
    "writing audit",
    "jargon detector",
  ],
  authors: [{ name: "VibeGuard" }],
  creator: "VibeGuard",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: baseUrl,
    siteName: "VibeGuard",
    title: "VibeGuard — Privacy-First AI Writing Auditor",
    description:
      "Analyze tone, readability, and inclusivity using AI that runs entirely in your browser. Your text never leaves your device.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "VibeGuard — Privacy-First AI Writing Auditor",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "VibeGuard — Privacy-First AI Writing Auditor",
    description:
      "Analyze tone, readability, and inclusivity using AI that runs entirely in your browser.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/apple-icon.png", sizes: "180x180", type: "image/png" }],
  },
  manifest: "/manifest.json",
  other: {
    "theme-color": "#ffffff",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              name: "VibeGuard",
              url: baseUrl,
              description:
                "Privacy-first AI writing auditor. Analyze tone, readability, and inclusivity entirely in your browser.",
              applicationCategory: "ProductivityApplication",
              operatingSystem: "Any",
              offers: {
                "@type": "Offer",
                price: "0",
                priceCurrency: "USD",
              },
              featureList: [
                "Tone analysis",
                "Readability scoring",
                "Jargon detection",
                "Inclusivity checking",
                "100% browser-based",
                "Zero data collection",
              ],
            }),
          }}
        />
      </head>
      <body
        className={`${plusJakarta.variable} ${cormorant.variable} antialiased font-sans`}
      >
        <a
          href="#main-content"
          className="fixed left-4 top-4 z-[100] -translate-y-20 rounded-lg bg-electric px-4 py-2 text-sm font-medium text-deep-black transition-transform focus:translate-y-0"
        >
          Skip to content
        </a>
        <ParticleBackground />
        <div className="noise-overlay" aria-hidden="true" />
        <Navbar />
        <ErrorBoundary>
          <main id="main-content" className="min-h-screen">{children}</main>
        </ErrorBoundary>
        <Footer />
      </body>
    </html>
  );
}

/**
 * Direção visual: Arquivo de Serviço Público — tipografia editorial brasileira, serviço público e auditabilidade.
 */
import type { Metadata, Viewport } from "next";
import { DM_Serif_Display, IBM_Plex_Mono, IBM_Plex_Sans } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";

const displayFont = DM_Serif_Display({ variable: "--font-display", subsets: ["latin"], weight: "400", display: "swap" });
const sansFont = IBM_Plex_Sans({ variable: "--font-sans", subsets: ["latin"], weight: ["400", "500", "600", "700"], display: "swap" });
const monoFont = IBM_Plex_Mono({ variable: "--font-mono", subsets: ["latin"], weight: ["400", "500", "600"], display: "swap" });

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://datasus.vercel.app";
const siteName = "DATASUS Releases";
const description = "Catálogo público de versões DATASUS, incluindo SISAIH01, BPA, SIA, CIHA01 e SIGTAP, com downloads HTTPS e releases sincronizadas diariamente a partir das fontes oficiais.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "DATASUS Releases — versões oficiais organizadas",
    template: "%s | DATASUS Releases",
  },
  description,
  applicationName: siteName,
  authors: [{ name: "Lucas Camargo Stivan", url: "https://github.com/stivan-lucas" }],
  creator: "Lucas Camargo Stivan",
  publisher: "Lucas Camargo Stivan",
  keywords: ["DATASUS", "SISAIH01", "BPA", "SIA", "CIHA01", "SIGTAP", "releases", "HTTPS", "saúde"],
  category: "Saúde e tecnologia",
  alternates: { canonical: "/" },
  icons: {
    icon: [{ url: "/icon.svg", type: "image/svg+xml", sizes: "any" }, { url: "/favicon.ico", sizes: "32x32" }],
    apple: [{ url: "/apple-icon", sizes: "180x180", type: "image/png" }],
  },
  manifest: "/manifest.webmanifest",
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 },
  },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: "/",
    siteName,
    title: "Versões DATASUS organizadas para download via HTTPS",
    description,
    images: [{ url: "/opengraph-image", width: 1200, height: 630, type: "image/png", alt: "DATASUS Releases — versões oficiais, organizadas" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "DATASUS Releases — versões oficiais organizadas",
    description,
    images: [{ url: "/twitter-image", alt: "DATASUS Releases — versões oficiais, organizadas" }],
    creator: "@stivan_lucas",
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
  },
  other: { "color-scheme": "light dark" },
};

export const viewport: Viewport = {
  colorScheme: "light dark",
  themeColor: [{ media: "(prefers-color-scheme: light)", color: "#f7f3eb" }, { media: "(prefers-color-scheme: dark)", color: "#111917" }],
};

const structuredData = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: siteName,
  url: siteUrl,
  description,
  applicationCategory: "UtilitiesApplication",
  operatingSystem: "Web",
  inLanguage: "pt-BR",
  isAccessibleForFree: true,
  author: { "@type": "Person", name: "Lucas Camargo Stivan", url: "https://github.com/stivan-lucas" },
  license: "https://www.apache.org/licenses/LICENSE-2.0",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <head>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
        <script
          dangerouslySetInnerHTML={{
            __html: `(() => { try { const saved = localStorage.getItem('datasus-releases-theme'); const theme = saved === 'dark' || saved === 'light' ? saved : matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'; document.documentElement.dataset.theme = theme; document.documentElement.style.colorScheme = theme; } catch (_) {} })();`,
          }}
        />
      </head>
      <body className={`${displayFont.variable} ${sansFont.variable} ${monoFont.variable}`}>
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}

/**
 * Direção visual: Arquivo de Serviço Público — tipografia editorial brasileira, serviço público e auditabilidade.
 */
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://datasus.vercel.app"),
  title: "DATASUS Releases — versões oficiais, organizadas",
  description: "Catálogo público de versões DATASUS, com downloads HTTPS e releases sincronizadas diariamente a partir das fontes oficiais.",
  applicationName: "DATASUS Releases",
  authors: [{ name: "Lucas Camargo Stivan", url: "https://github.com/stivan-lucas" }],
  creator: "Lucas Camargo Stivan",
  keywords: ["DATASUS", "SISAIH01", "BPA", "SIA", "releases", "HTTPS", "saúde"],
  icons: { icon: "/assets/brand-mark.svg" },
  robots: { index: true, follow: true },
  other: { "color-scheme": "light" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}

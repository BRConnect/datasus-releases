/**
 * Direção visual: Arquivo de Serviço Público — tipografia editorial brasileira, serviço público e auditabilidade.
 */
import type { Metadata } from "next";
import { DM_Serif_Display, IBM_Plex_Mono, IBM_Plex_Sans } from "next/font/google";
import "./globals.css";

const display = DM_Serif_Display({ subsets: ["latin"], weight: "400", variable: "--font-display" });
const sans = IBM_Plex_Sans({ subsets: ["latin"], weight: ["400", "500", "600", "700"], variable: "--font-sans" });
const mono = IBM_Plex_Mono({ subsets: ["latin"], weight: ["400", "500"], variable: "--font-mono" });

export const metadata: Metadata = {
  title: "DATASUS Releases — versões oficiais, organizadas",
  description: "Catálogo público de releases DATASUS sincronizado diariamente a partir das fontes oficiais.",
  icons: { icon: "/manus-storage/datasus-releases-mark_357468d7.png" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR">
      <body className={`${display.variable} ${sans.variable} ${mono.variable}`}>{children}</body>
    </html>
  );
}

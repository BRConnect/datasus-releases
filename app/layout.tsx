/**
 * Direção visual: Arquivo de Serviço Público — tipografia editorial brasileira, serviço público e auditabilidade.
 */
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "DATASUS Releases — versões oficiais, organizadas",
  description: "Catálogo público de releases DATASUS sincronizado diariamente a partir das fontes oficiais.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}

/**
 * Direção visual: Arquivo de Serviço Público — documento editorial com navegação lateral, contraste alto e leitura auditável.
 */
import type { ReactNode } from "react";
import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";
import { PrintDocumentButton } from "@/components/print-document-button";

type LegalSection = { id: string; label: string };

type LegalShellProps = {
  active: "termos" | "privacidade";
  eyebrow: string;
  title: string;
  summary: string;
  sections: LegalSection[];
  children: ReactNode;
};

export function LegalShell({ active, eyebrow, title, summary, sections, children }: LegalShellProps) {
  const currentYear = new Date().getFullYear();

  return (
    <main id="conteudo" className="legal-shell">
      <a className="skip-link" href="#documento">Pular para o documento</a>

      <header className="site-header legal-header">
        <div className="site-container header-inner">
          <Link href="/" className="brand-link" aria-label="DATASUS Releases — início">
            <img src="/assets/brand-mark.svg" alt="" aria-hidden="true" className="h-10 w-10 shrink-0" width="40" height="40" />
            <span className="min-w-0 leading-none">
              <span className="brand-name">DATASUS</span>
              <span className="brand-subtitle">releases / catálogo</span>
            </span>
          </Link>

          <nav className="header-nav" aria-label="Navegação legal">
            <Link href="/" className="hidden sm:inline">Início</Link>
            <Link href="/termos" aria-current={active === "termos" ? "page" : undefined}>Termos</Link>
            <Link href="/privacidade" aria-current={active === "privacidade" ? "page" : undefined}>Privacidade</Link>
            <ThemeToggle />
          </nav>
        </div>
      </header>

      <section className="legal-hero" aria-labelledby="legal-title">
        <div className="site-container legal-hero-inner">
          <div>
            <p className="eyebrow accent"><span />{eyebrow}</p>
            <h1 id="legal-title">{title}</h1>
            <p>{summary}</p>
          </div>
          <div className="legal-hero-actions">
            <p>Última atualização: <time dateTime="2026-08-15">15 de agosto de 2026</time></p>
            <PrintDocumentButton />
          </div>
        </div>
      </section>

      <div className="site-container legal-layout">
        <aside className="legal-index" aria-label="Índice do documento">
          <p>Índice</p>
          <nav>
            {sections.map((section) => <a href={`#${section.id}`} key={section.id}>{section.label}</a>)}
          </nav>
        </aside>

        <article id="documento" className="legal-document" tabIndex={-1}>
          <div className="legal-record" aria-label="Identificação do documento">
            <span><i />Documento público</span>
            <strong>{active === "termos" ? "REG. TERMOS-2026.01" : "REG. PRIV-2026.01"}</strong>
            <span>Arquivo digital / versão vigente</span>
          </div>
          {children}
        </article>
      </div>

      <footer className="site-container legal-footer">
        <p>© 2026–{currentYear} <a href="https://github.com/stivan-lucas" target="_blank" rel="noreferrer">Lucas Camargo Stivan</a>. Todos os direitos reservados.</p>
        <nav aria-label="Documentos legais">
          <Link href="/termos">Termos de Uso</Link>
          <Link href="/privacidade">Política de Privacidade</Link>
        </nav>
      </footer>
    </main>
  );
}

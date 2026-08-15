/**
 * Direção visual: Arquivo de Serviço Público — catálogo vertical responsivo, leitura auditável e controles inclusivos.
 */
"use client";

import { useEffect, useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { LocalIcon } from "@/components/local-icon";
import { ReleaseCard } from "@/components/release-card";
import { ThemeToggle } from "@/components/theme-toggle";
import { initialReleases, type ProgramId, type ReleasesPayload } from "@/lib/releases";

const sources = [
  { id: "SISAIH01" as const, title: "SIH · SISAIH01", description: "Autorizações de Internações Hospitalares", href: "http://sihd.datasus.gov.br/versao/versao_sisaih01.php", asset: "/assets/source-sih.svg" },
  { id: "BPA" as const, title: "SIA · BPA", description: "Boletim de Produção Ambulatorial", href: "https://sia.datasus.gov.br/versao/listar_ftp_bpa.php", asset: "/assets/source-bpa.svg" },
  { id: "SIA" as const, title: "SIA · banco mensal", description: "Base de dados ambulatorial por competência", href: "https://sia.datasus.gov.br/versao/listar_ftp_sia.php", asset: "/assets/source-sia.svg" },
];

const programLabels: Record<"ALL" | ProgramId, string> = {
  ALL: "Todo o acervo",
  SISAIH01: "SISAIH01",
  BPA: "BPA",
  SIA: "SIA",
};

function formatSyncTime(isoDate: string) {
  try {
    return new Intl.DateTimeFormat("pt-BR", { dateStyle: "medium", timeStyle: "short", timeZone: "America/Sao_Paulo" }).format(new Date(isoDate));
  } catch {
    return "aguardando sincronização";
  }
}

export default function Home() {
  const [data, setData] = useState<ReleasesPayload>(initialReleases);
  const [filter, setFilter] = useState<"ALL" | ProgramId>("ALL");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [catalogStatus, setCatalogStatus] = useState("Carregando as releases mais recentes.");
  const currentYear = new Date().getFullYear();
  const releasesUrl = data.repository ? `https://github.com/${data.repository}/releases` : "#acervo";

  async function refreshManifest() {
    setIsRefreshing(true);
    setCatalogStatus("Atualizando o catálogo de releases.");
    try {
      const response = await fetch(`/api/releases?v=${Date.now()}`, { cache: "no-store" });
      if (!response.ok) throw new Error("Releases indisponíveis");
      const payload = (await response.json()) as ReleasesPayload;
      if (Array.isArray(payload.releases) && payload.releases.length) {
        setData(payload);
        setCatalogStatus(`${payload.releases.length} releases encontradas e atualizadas.`);
      } else {
        setCatalogStatus("O catálogo ainda não possui releases compatíveis.");
      }
    } catch {
      setCatalogStatus("Não foi possível atualizar agora. O último catálogo disponível continua em exibição.");
    } finally {
      window.setTimeout(() => setIsRefreshing(false), 250);
    }
  }

  useEffect(() => { void refreshManifest(); }, []);

  const visibleReleases = useMemo(
    () => filter === "ALL" ? data.releases : data.releases.filter((release) => release.program === filter),
    [data.releases, filter]
  );
  const releasedCount = data.releases.filter((release) => release.delivery === "github-release").length;

  return (
    <main id="conteudo" tabIndex={-1} className="site-shell">
      <a className="skip-link" href="#acervo">Pular para o acervo de releases</a>

      <header className="site-header">
        <div className="site-container header-inner">
          <a href="#inicio" className="brand-link" aria-label="DATASUS Releases — início">
            <img src="/assets/brand-mark.svg" alt="" aria-hidden="true" className="h-10 w-10 shrink-0" width="40" height="40" />
            <span className="min-w-0 leading-none">
              <span className="brand-name">DATASUS</span>
              <span className="brand-subtitle">releases / catálogo</span>
            </span>
          </a>

          <nav className="header-nav" aria-label="Navegação principal">
            <a href="#acervo">Acervo</a>
            <a className="hidden sm:inline" href="#fontes">Fontes</a>
            <a className="header-github hidden sm:inline-flex" href={releasesUrl} target="_blank" rel="noreferrer"><LocalIcon name="github" className="h-4 w-4" /> GitHub</a>
            <ThemeToggle />
          </nav>
        </div>
      </header>

      <section id="inicio" className="hero-section" aria-labelledby="hero-heading">
        <div className="hero-art" aria-hidden="true">
          <img src="/assets/archive-hero.svg" alt="" width="1440" height="800" />
        </div>
        <div className="site-container hero-content">
          <div className="hero-copy">
            <p className="eyebrow"><span />Arquivo de versões oficiais</p>
            <h1 id="hero-heading">A versão certa.<br /><span>No lugar certo.</span></h1>
            <p className="hero-description">Um catálogo público, simples de consultar e sincronizado diariamente com os portais oficiais do DATASUS.</p>
            <div className="hero-actions">
              <a href="#acervo" className="primary-link">Consultar arquivos <LocalIcon name="arrow-up-right" className="h-4 w-4 icon-on-accent" /></a>
              <span className="hero-note">Atualização automática · 07:00 BRT</span>
            </div>
          </div>
          <div className="hero-monitor" aria-hidden="true">
            <p>faixa de monitoramento / 03</p>
            <div><span>Fontes</span><strong>SIH · BPA · SIA</strong></div>
            <div><span>Consulta</span><strong>Diária · 07:00 BRT</strong></div>
            <div><span>Entrega</span><strong>Release pública / HTTPS</strong></div>
          </div>
        </div>
      </section>

      <section className="site-container stats-grid" aria-label="Resumo do catálogo">
        {[
          { label: "Fontes monitoradas", value: "03", note: "SIH e SIA" },
          { label: "Arquivos no acervo", value: String(data.releases.length).padStart(2, "0"), note: releasedCount ? `${releasedCount} em releases` : "primeira publicação pendente" },
          { label: "Próxima consulta", value: "07:00", note: "horário de Brasília" },
        ].map((stat) => (
          <div className="stat-card" key={stat.label}>
            <p>{stat.label}</p>
            <div><strong>{stat.value}</strong><span>{stat.note}</span></div>
          </div>
        ))}
      </section>

      <section id="acervo" className="site-container catalog-section" aria-labelledby="catalog-heading">
        <div className="catalog-header">
          <div>
            <p className="eyebrow accent"><span />Registro corrente</p>
            <h2 id="catalog-heading">Acervo de atualizações</h2>
            <p>Cada item mantém o vínculo para a fonte oficial e, após a sincronização, oferece uma cópia na release pública do projeto.</p>
          </div>
          <Button variant="outline" onClick={() => void refreshManifest()} disabled={isRefreshing} className="refresh-button" aria-describedby="catalog-status">
            <LocalIcon name="refresh" className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
            {isRefreshing ? "Atualizando" : "Atualizar catálogo"}
          </Button>
        </div>

        <p id="catalog-status" className="sr-only" role="status" aria-live="polite">{catalogStatus}</p>
        <div className="filter-bar" role="group" aria-label="Filtrar programas">
          {(Object.keys(programLabels) as Array<"ALL" | ProgramId>).map((program) => (
            <button
              key={program}
              type="button"
              onClick={() => setFilter(program)}
              aria-pressed={filter === program}
              className={`filter-button ${filter === program ? "is-active" : ""}`}
            >
              {programLabels[program]}
            </button>
          ))}
        </div>

        <div className="release-list" aria-busy={isRefreshing}>
          {visibleReleases.length ? visibleReleases.map((release, index) => <ReleaseCard release={release} index={index} key={release.id} />) : (
            <div className="empty-state" role="status">
              Nenhuma release pública compatível foi encontrada no repositório configurado. Confira a variável <code>DATASUS_RELEASES_REPOSITORY</code> e se as Actions do fork estão habilitadas.
            </div>
          )}
        </div>

        <div className="catalog-meta">
          <span>Consulta à API GitHub: {formatSyncTime(data.generatedAt)}</span>
          <a href={releasesUrl} target="_blank" rel="noreferrer">Ver todas as releases <LocalIcon name="arrow-up-right" className="h-[13px] w-[13px]" /></a>
        </div>
      </section>

      <section id="fontes" className="sources-section" aria-labelledby="sources-heading">
        <div className="site-container sources-layout">
          <div>
            <p className="eyebrow accent"><span />Transparência de origem</p>
            <h2 id="sources-heading">Fontes sob consulta diária</h2>
            <p>A automação compara as páginas dos sistemas e publica somente arquivos executáveis que atendem às regras de cada fonte.</p>
          </div>
          <div className="sources-grid">
            {sources.map((source) => (
              <a key={source.id} href={source.href} target="_blank" rel="noreferrer" className="source-card">
                <img src={source.asset} alt="" aria-hidden="true" width="360" height="260" />
                <span className="source-overlay" />
                <span className="source-content">
                  <span className="source-card-top"><Badge variant="neutral">{source.id}</Badge><LocalIcon name="arrow-up-right" className="h-[17px] w-[17px]" /></span>
                  <span><strong>{source.title}</strong><small>{source.description}</small></span>
                </span>
              </a>
            ))}
          </div>
        </div>
      </section>

      <footer className="site-container site-footer">
        <div className="footer-main">
          <p><LocalIcon name="archive" className="h-[18px] w-[18px]" />Catálogo independente de consulta. Fontes e arquivos pertencem aos respectivos órgãos oficiais.</p>
          <div className="footer-tags"><span><LocalIcon name="check" className="h-[13px] w-[13px]" />rastreável</span><span><LocalIcon name="clock" className="h-[13px] w-[13px]" />diário</span><span><LocalIcon name="database" className="h-[13px] w-[13px]" />público</span></div>
        </div>
        <div className="footer-legal">
          <span>Informações legais</span>
          <a href="/termos">Termos de Uso</a>
          <a href="/privacidade">Política de Privacidade</a>
        </div>
        <p className="copyright">© 2026–{currentYear} <a href="https://github.com/stivan-lucas" target="_blank" rel="noreferrer">Lucas Camargo Stivan</a>. Todos os direitos reservados.</p>
      </footer>
    </main>
  );
}

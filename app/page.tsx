/**
 * Direção visual: Arquivo de Serviço Público — catálogo vertical, informação prioritária e acessos verificáveis.
 */
"use client";

import { useEffect, useMemo, useState } from "react";
import { Archive, ArrowUpRight, Check, Clock3, Database, Github, RefreshCw } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ReleaseCard } from "@/components/release-card";
import { initialReleases, type ProgramId, type ReleasesPayload } from "@/lib/releases";

const sources = [
  { id: "SISAIH01" as const, title: "SIH · SISAIH01", description: "Autorizações de Internações Hospitalares", href: "http://sihd.datasus.gov.br/versao/versao_sisaih01.php" },
  { id: "BPA" as const, title: "SIA · BPA", description: "Boletim de Produção Ambulatorial", href: "https://sia.datasus.gov.br/versao/listar_ftp_bpa.php" },
  { id: "SIA" as const, title: "SIA · banco mensal", description: "Base de dados ambulatorial por competência", href: "https://sia.datasus.gov.br/versao/listar_ftp_sia.php" },
];

const programLabels: Record<"ALL" | ProgramId, string> = { ALL: "Todo o acervo", SISAIH01: "SISAIH01", BPA: "BPA", SIA: "SIA" };

function formatSyncTime(isoDate: string) {
  try { return new Intl.DateTimeFormat("pt-BR", { dateStyle: "medium", timeStyle: "short", timeZone: "America/Sao_Paulo" }).format(new Date(isoDate)); }
  catch { return "aguardando sincronização"; }
}

export default function Home() {
  const [data, setData] = useState<ReleasesPayload>(initialReleases);
  const [filter, setFilter] = useState<"ALL" | ProgramId>("ALL");
  const [isRefreshing, setIsRefreshing] = useState(false);

  const releasesUrl = data.repository ? `https://github.com/${data.repository}/releases` : "#acervo";

  async function refreshManifest() {
    setIsRefreshing(true);
    try {
      const response = await fetch(`/api/releases?v=${Date.now()}`, { cache: "no-store" });
      if (!response.ok) throw new Error("Releases indisponíveis");
      const payload = (await response.json()) as ReleasesPayload;
      if (Array.isArray(payload.releases) && payload.releases.length) setData(payload);
    } catch {
      // A fonte inicial preserva uma página útil durante a primeira sincronização.
    } finally { window.setTimeout(() => setIsRefreshing(false), 250); }
  }

  useEffect(() => { void refreshManifest(); }, []);

  const visibleReleases = useMemo(() => filter === "ALL" ? data.releases : data.releases.filter((release) => release.program === filter), [data.releases, filter]);
  const releasedCount = data.releases.filter((release) => release.delivery === "github-release").length;

  return (
    <main className="min-h-screen overflow-hidden bg-[#f7f3eb] text-[#1c2724]">
      <header className="border-b border-[#1c2724]/12 bg-[#f7f3eb]/85 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8 lg:px-12">
          <a href="#inicio" className="flex items-center gap-3" aria-label="DATASUS Releases — início">
            <span className="relative h-10 w-10 shrink-0 border border-[#0a5b4a]/25 bg-[#0a5b4a] before:absolute before:left-2 before:top-3 before:h-4 before:w-6 before:bg-[#f7f3eb] after:absolute after:bottom-2 after:left-2 after:h-1 after:w-6 after:bg-[#c86b42]" aria-hidden="true" />
            <div className="leading-none"><p className="font-display text-[1.35rem] tracking-[-0.04em]">DATASUS</p><p className="mt-1 font-mono text-[9px] uppercase tracking-[0.22em] text-[#0a5b4a]">releases</p></div>
          </a>
          <div className="hidden items-center gap-4 md:flex">
            <a href="#acervo" className="text-sm font-semibold text-[#46514b] transition-colors hover:text-[#0a5b4a]">Acervo</a>
            <a href="#fontes" className="text-sm font-semibold text-[#46514b] transition-colors hover:text-[#0a5b4a]">Fontes</a>
            <a href={releasesUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 border-l border-[#1c2724]/15 pl-4 text-sm font-semibold text-[#0a5b4a]"><Github size={16} /> GitHub</a>
          </div>
        </div>
      </header>

      <section id="inicio" className="relative border-b border-[#1c2724]/12">
        <div className="absolute inset-0 overflow-hidden bg-[#ebe5d8]"><div className="absolute -right-10 top-0 h-[130%] w-[48%] rotate-[7deg] border-l border-[#0a5b4a]/12 bg-[linear-gradient(150deg,rgba(10,91,74,0.17),rgba(247,243,235,0.92)_42%,rgba(200,107,66,0.13))]" /><div className="absolute right-[12%] top-[24%] h-44 w-64 border border-[#0a5b4a]/15 bg-[#f7f3eb]/75 shadow-[20px_22px_0_rgba(10,91,74,0.10)]" /><div className="absolute right-[4%] top-[15%] h-20 w-48 border border-[#c86b42]/25 bg-[#f7f3eb]/65" /><div className="absolute inset-0 bg-gradient-to-r from-[#f7f3eb] via-[#f7f3eb]/94 to-[#f7f3eb]/38" /><div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#f7f3eb] to-transparent" /></div>
        <div className="relative mx-auto max-w-7xl px-5 pb-14 pt-16 sm:px-8 sm:pb-20 sm:pt-24 lg:px-12 lg:pb-24">
          <div className="max-w-3xl"><div className="mb-6 flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.18em] text-[#0a5b4a]"><span className="h-2.5 w-2.5 bg-[#c86b42]" />Arquivo de versões oficiais</div><h1 className="max-w-2xl font-display text-5xl leading-[0.95] tracking-[-0.055em] text-[#1c2724] sm:text-6xl lg:text-7xl">A versão certa.<br /><span className="text-[#0a5b4a]">No lugar certo.</span></h1><p className="mt-6 max-w-xl text-base leading-7 text-[#4e5a54] sm:text-lg">Um catálogo público, simples de consultar e sincronizado diariamente com os portais oficiais do DATASUS.</p><div className="mt-9 flex flex-wrap items-center gap-3"><a href="#acervo" className="inline-flex h-12 items-center gap-2 bg-[#0a5b4a] px-5 text-sm font-semibold text-white shadow-[0_10px_20px_rgba(10,91,74,0.14)] transition-transform duration-150 hover:bg-[#074b3d] active:scale-[0.97]">Consultar arquivos <ArrowUpRight size={16} /></a><span className="font-mono text-[11px] uppercase tracking-[0.1em] text-[#657169]">Atualização automática · 07:00 BRT</span></div></div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-px border-x border-[#1c2724]/12 bg-[#1c2724]/12 sm:grid-cols-3">
        {[{ label: "Fontes monitoradas", value: "03", note: "SIH e SIA" }, { label: "Arquivos no acervo", value: String(data.releases.length).padStart(2, "0"), note: releasedCount ? `${releasedCount} em releases` : "primeira publicação pendente" }, { label: "Próxima consulta", value: "07:00", note: "horário de Brasília" }].map((stat) => <div className="bg-[#f7f3eb] px-5 py-6 sm:px-8" key={stat.label}><p className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#6d7670]">{stat.label}</p><div className="mt-2 flex items-baseline justify-between"><strong className="font-display text-3xl tracking-[-0.04em] text-[#0a5b4a]">{stat.value}</strong><span className="text-xs text-[#59635d]">{stat.note}</span></div></div>)}
      </section>

      <section id="acervo" className="mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:px-12 lg:py-24">
        <div className="grid gap-8 border-b border-[#1c2724]/15 pb-8 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end"><div><p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#c86b42]">Registro corrente</p><h2 className="mt-3 font-display text-4xl tracking-[-0.045em] sm:text-5xl">Acervo de atualizações</h2><p className="mt-3 max-w-xl text-sm leading-6 text-[#5a655e]">Cada item mantém o vínculo para a fonte oficial e, após a sincronização, oferece uma cópia na release pública do projeto.</p></div><Button variant="outline" onClick={() => void refreshManifest()} disabled={isRefreshing} className="w-fit"><RefreshCw size={16} className={isRefreshing ? "animate-spin" : ""} />{isRefreshing ? "Atualizando" : "Atualizar catálogo"}</Button></div>
        <div className="mt-6 flex flex-wrap gap-2" role="group" aria-label="Filtrar programas">{(Object.keys(programLabels) as Array<"ALL" | ProgramId>).map((program) => <button key={program} onClick={() => setFilter(program)} className={`rounded-sm border px-3 py-2 font-mono text-[10px] uppercase tracking-[0.1em] transition-colors ${filter === program ? "border-[#0a5b4a] bg-[#0a5b4a] text-white" : "border-[#1c2724]/15 bg-transparent text-[#657169] hover:border-[#0a5b4a]/45 hover:text-[#0a5b4a]"}`}>{programLabels[program]}</button>)}</div>
        <div className="mt-6">{visibleReleases.length ? visibleReleases.map((release, index) => <ReleaseCard release={release} index={index} key={release.id} />) : <div className="border border-dashed border-[#1c2724]/18 px-5 py-10 text-sm text-[#5a655e]">Nenhuma release pública compatível foi encontrada no repositório configurado. Confira a variável <code className="font-mono text-[#0a5b4a]">DATASUS_RELEASES_REPOSITORY</code> e se as Actions do fork estão habilitadas.</div>}</div>
        <div className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-[#1c2724]/12 pt-5 font-mono text-[10px] uppercase tracking-[0.1em] text-[#68726b]"><span>Consulta à API GitHub: {formatSyncTime(data.generatedAt)}</span><a href={releasesUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-[#0a5b4a] hover:underline">Ver todas as releases <ArrowUpRight size={13} /></a></div>
      </section>

      <section id="fontes" className="border-y border-[#1c2724]/12 bg-[#ebe5d8]"><div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:px-12 lg:py-20"><div className="grid gap-10 lg:grid-cols-[0.78fr_2fr] lg:gap-16"><div><p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#c86b42]">Transparência de origem</p><h2 className="mt-3 font-display text-4xl leading-none tracking-[-0.04em]">Fontes sob consulta diária</h2><p className="mt-5 text-sm leading-6 text-[#5c655e]">A automação compara as páginas dos sistemas e publica somente arquivos executáveis que atendem às regras de cada fonte.</p></div><div className="grid gap-4 sm:grid-cols-3">{sources.map((source) => <a key={source.id} href={source.href} target="_blank" rel="noreferrer" className="source-tile group relative min-h-56 overflow-hidden border border-[#1c2724]/12 bg-[#f7f3eb] p-5"><div className="absolute inset-0 bg-[linear-gradient(145deg,rgba(10,91,74,0.10),transparent_58%,rgba(200,107,66,0.09))]" /><div className="relative flex h-full flex-col justify-between"><div className="flex items-center justify-between"><Badge variant="neutral">{source.id}</Badge><ArrowUpRight size={17} className="text-[#0a5b4a]" /></div><div><h3 className="font-display text-2xl tracking-[-0.03em]">{source.title}</h3><p className="mt-2 text-xs leading-5 text-[#546059]">{source.description}</p></div></div></a>)}</div></div></div></section>

      <footer className="mx-auto max-w-7xl px-5 py-8 sm:px-8 lg:px-12"><div className="flex flex-col gap-5 border-t border-[#1c2724]/12 pt-7 sm:flex-row sm:items-center sm:justify-between"><div className="flex items-center gap-3 text-sm text-[#5d6861]"><Archive size={18} className="text-[#0a5b4a]" /><span>Catálogo independente de consulta. Fontes e arquivos pertencem aos respectivos órgãos oficiais.</span></div><div className="flex items-center gap-4 font-mono text-[10px] uppercase tracking-[0.1em] text-[#758079]"><span className="inline-flex items-center gap-1.5"><Check size={13} className="text-[#0a5b4a]" />rastreável</span><span className="inline-flex items-center gap-1.5"><Clock3 size={13} className="text-[#0a5b4a]" />diário</span><span className="inline-flex items-center gap-1.5"><Database size={13} className="text-[#0a5b4a]" />público</span></div></div></footer>
    </main>
  );
}

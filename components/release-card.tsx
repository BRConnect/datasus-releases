/**
 * Direção visual: Arquivo de Serviço Público — ficha com código auditável, marcadores de acervo e retirada identificada.
 */
import { ArrowDownToLine, ExternalLink, FileArchive, FileCheck2, ShieldCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import type { ReleaseItem } from "@/lib/releases";

type ReleaseCardProps = { release: ReleaseItem; index: number };

export function ReleaseCard({ release, index }: ReleaseCardProps) {
  const isGitHubRelease = release.delivery === "github-release";
  const catalogCode = `DS-${release.program}-${release.version.replaceAll(".", "-").toUpperCase()}`;
  const actionLabel = isGitHubRelease
    ? `Baixar ${release.filename} · ${release.size}`
    : `Abrir ${release.filename} · ${release.size}`;

  return (
    <article
      className="release-card group relative grid gap-5 border-t border-[#1c2724]/12 py-6 md:grid-cols-[9.25rem_minmax(0,1fr)_auto] md:gap-7"
      style={{ animationDelay: `${index * 45}ms` }}
    >
      <aside className="flex gap-3 md:block" aria-label={`Registro ${catalogCode}`}>
        <div className="flex items-center gap-1.5" aria-hidden="true">
          <span className="h-3.5 w-3.5 bg-[#0a5b4a] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.25)]" />
          <span className="h-3.5 w-1 bg-[#c86b42]" />
          <span className="h-px flex-1 bg-[#1c2724]/18 md:hidden" />
        </div>
        <div className="mt-0 flex h-10 w-10 shrink-0 items-center justify-center border border-[#0a5b4a]/20 bg-[#0a5b4a]/[0.045] text-[#0a5b4a] md:mt-4">
          <FileArchive size={18} strokeWidth={1.6} aria-hidden="true" />
        </div>
        <div className="min-w-0 md:mt-3">
          <p className="font-mono text-[9px] uppercase tracking-[0.14em] text-[#69736c]">FICHA</p>
          <p className="mt-0.5 truncate font-mono text-[10px] font-medium tracking-[0.03em] text-[#0a5b4a]">{catalogCode}</p>
          <p className="mt-1.5 inline-flex items-center gap-1 font-mono text-[9px] uppercase tracking-[0.1em] text-[#69736c]">
            <ShieldCheck size={11} className="text-[#0a5b4a]" /> {isGitHubRelease ? "Íntegra publicada" : "Fonte visível"}
          </p>
        </div>
      </aside>

      <div className="min-w-0">
        <div className="mb-2 flex flex-wrap items-center gap-2">
          <Badge>{release.program}</Badge>
          <Badge variant={isGitHubRelease ? "accent" : "neutral"}>
            {isGitHubRelease ? "Release sincronizada" : "Origem oficial"}
          </Badge>
        </div>
        <p className="font-mono text-[11px] tracking-[0.025em] text-[#607068]">{release.filename}</p>
        <h3 className="mt-1 font-display text-xl leading-tight tracking-[-0.025em] text-[#1c2724] md:text-2xl">
          {release.programName} <span className="text-[#0a5b4a]">{release.version}</span>
        </h3>
        <dl className="mt-4 grid grid-cols-2 divide-x divide-y divide-[#1c2724]/10 border border-[#1c2724]/10 sm:grid-cols-4 sm:divide-y-0">
          <div className="min-w-0 px-3 py-2.5 first:pl-3">
            <dt className="font-mono text-[8px] uppercase tracking-[0.13em] text-[#7c857f]">Versão</dt>
            <dd className="mt-1 font-mono text-[10px] text-[#33413a]">{release.version}</dd>
          </div>
          <div className="min-w-0 px-3 py-2.5">
            <dt className="font-mono text-[8px] uppercase tracking-[0.13em] text-[#7c857f]">Registro</dt>
            <dd className="mt-1 truncate font-mono text-[10px] text-[#33413a]">{release.publishedLabel}</dd>
          </div>
          <div className="min-w-0 px-3 py-2.5">
            <dt className="font-mono text-[8px] uppercase tracking-[0.13em] text-[#7c857f]">Tamanho</dt>
            <dd className="mt-1 truncate font-mono text-[10px] text-[#33413a]">{release.size}</dd>
          </div>
          <div className="min-w-0 px-3 py-2.5">
            <dt className="font-mono text-[8px] uppercase tracking-[0.13em] text-[#7c857f]">Rastreio</dt>
            <dd className="mt-1 font-mono text-[10px] text-[#0a5b4a]">{isGitHubRelease ? "GITHUB · OK" : "DATASUS · OK"}</dd>
          </div>
        </dl>
      </div>

      <div className="flex flex-wrap items-center gap-2 self-center md:justify-end">
        <a
          className={buttonVariants({ size: "default", className: "h-auto min-h-10 max-w-full px-3 py-2.5 font-mono text-[10px] leading-4" })}
          href={release.downloadUrl}
          target="_blank"
          rel="noreferrer"
          aria-label={actionLabel}
        >
          {isGitHubRelease ? <FileCheck2 className="shrink-0" size={15} /> : <ArrowDownToLine className="shrink-0" size={15} />}
          <span className="max-w-52 text-left">{actionLabel}</span>
        </a>
        <a
          className={buttonVariants({ variant: "ghost", size: "sm", className: "px-2" })}
          href={release.sourcePage}
          target="_blank"
          rel="noreferrer"
          aria-label={`Auditar fonte oficial de ${release.filename}`}
          title="Auditar fonte oficial"
        >
          <ExternalLink size={15} />
        </a>
      </div>
    </article>
  );
}

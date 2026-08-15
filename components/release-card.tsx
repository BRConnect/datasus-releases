/**
 * Direção visual: Arquivo de Serviço Público — cada release é uma ficha de acervo com download inequívoco.
 */
import { ArrowDownToLine, ExternalLink, FileArchive, FileCheck2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import type { ReleaseItem } from "@/lib/releases";

type ReleaseCardProps = { release: ReleaseItem; index: number };

export function ReleaseCard({ release, index }: ReleaseCardProps) {
  const isGitHubRelease = release.delivery === "github-release";

  return (
    <article
      className="release-card group relative grid gap-5 border-t border-[#1c2724]/12 py-6 md:grid-cols-[4.25rem_minmax(0,1fr)_auto] md:items-center md:gap-7"
      style={{ animationDelay: `${index * 45}ms` }}
    >
      <div className="flex h-11 w-11 items-center justify-center border border-[#0a5b4a]/20 bg-[#0a5b4a]/[0.045] text-[#0a5b4a]">
        <FileArchive size={20} strokeWidth={1.6} aria-hidden="true" />
      </div>

      <div className="min-w-0">
        <div className="mb-2 flex flex-wrap items-center gap-2">
          <Badge>{release.program}</Badge>
          <Badge variant={isGitHubRelease ? "accent" : "neutral"}>
            {isGitHubRelease ? "Release sincronizada" : "Origem oficial"}
          </Badge>
        </div>
        <h3 className="font-display text-xl leading-tight tracking-[-0.025em] text-[#1c2724] md:text-2xl">
          {release.programName} <span className="text-[#0a5b4a]">{release.version}</span>
        </h3>
        <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 font-mono text-[11px] tracking-[0.02em] text-[#66706a]">
          <span>{release.filename}</span>
          <span className="hidden text-[#c86b42] sm:inline">/</span>
          <span>{release.publishedLabel}</span>
          <span className="hidden text-[#c86b42] sm:inline">/</span>
          <span>{release.size}</span>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2 md:justify-end">
        <a
          className={buttonVariants({ size: "default" })}
          href={release.downloadUrl}
          target="_blank"
          rel="noreferrer"
          aria-label={`Baixar ${release.filename}`}
        >
          {isGitHubRelease ? <FileCheck2 size={16} /> : <ArrowDownToLine size={16} />}
          {isGitHubRelease ? "Baixar release" : "Ir para a origem"}
        </a>
        <a
          className={buttonVariants({ variant: "ghost", size: "sm", className: "px-2" })}
          href={release.sourcePage}
          target="_blank"
          rel="noreferrer"
          aria-label={`Abrir fonte oficial de ${release.filename}`}
          title="Abrir fonte oficial"
        >
          <ExternalLink size={15} />
        </a>
      </div>
    </article>
  );
}

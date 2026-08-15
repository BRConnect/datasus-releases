/**
 * Direção visual: Arquivo de Serviço Público — ficha auditável, responsiva e legível em qualquer tema.
 */
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { LocalIcon } from "@/components/local-icon";
import type { ReleaseItem } from "@/lib/releases";

type ReleaseCardProps = { release: ReleaseItem; index: number };

export function ReleaseCard({ release, index }: ReleaseCardProps) {
  const isGitHubRelease = release.delivery === "github-release";
  const catalogCode = `DS-${release.program}-${release.version.replaceAll(".", "-").toUpperCase()}`;
  const actionLabel = isGitHubRelease ? `Baixar ${release.filename} · ${release.size}` : `Abrir ${release.filename} · ${release.size}`;

  return (
    <article className="release-card" style={{ animationDelay: `${index * 45}ms` }}>
      <aside className="release-record" aria-label={`Registro ${catalogCode}`}>
        <div className="record-mark" aria-hidden="true"><span /><i /><b /></div>
        <div className="record-file"><LocalIcon name="file" className="h-[18px] w-[18px]" /></div>
        <div className="record-code">
          <p>Ficha</p>
          <strong>{catalogCode}</strong>
          <span><LocalIcon name="verified" className="h-[11px] w-[11px]" />{isGitHubRelease ? "Íntegra publicada" : "Fonte visível"}</span>
        </div>
      </aside>

      <div className="release-details">
        <div className="release-badges"><Badge>{release.program}</Badge><Badge variant={isGitHubRelease ? "accent" : "neutral"}>{isGitHubRelease ? "Release sincronizada" : "Origem oficial"}</Badge></div>
        <p className="release-filename" title={release.filename}>{release.filename}</p>
        <h3>{release.programName} <span>{release.version}</span></h3>
        <dl className="release-metadata">
          <div><dt>Versão</dt><dd>{release.version}</dd></div>
          <div><dt>Registro</dt><dd title={release.publishedLabel}>{release.publishedLabel}</dd></div>
          <div><dt>Tamanho</dt><dd title={release.size}>{release.size}</dd></div>
          <div><dt>Rastreio</dt><dd>{isGitHubRelease ? "GitHub · OK" : "DATASUS · OK"}</dd></div>
        </dl>
      </div>

      <div className="release-actions">
        <a className={buttonVariants({ size: "default", className: "release-download" })} href={release.downloadUrl} target="_blank" rel="noreferrer" aria-label={actionLabel}>
          <LocalIcon name="download" className="h-[15px] w-[15px] shrink-0 icon-on-accent" />
          <span>{actionLabel}</span>
        </a>
        <a className={buttonVariants({ variant: "ghost", size: "sm", className: "release-source" })} href={release.sourcePage} target="_blank" rel="noreferrer" aria-label={`Auditar fonte oficial de ${release.filename}`} title="Auditar fonte oficial">
          <LocalIcon name="external" className="h-[15px] w-[15px]" />
          <span className="sr-only">Auditar fonte oficial</span>
        </a>
      </div>
    </article>
  );
}

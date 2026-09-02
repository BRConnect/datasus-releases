/**
 * Catálogo portátil: consulta a API pública do GitHub e apresenta somente os ativos atuais de cada programa.
 */
import { NextResponse } from "next/server";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { getReleasesRepository } from "@/lib/config";
import type { ProgramId, ReleaseItem, ReleasesPayload } from "@/lib/releases";

export const dynamic = "force-dynamic";
export const revalidate = 300;
export const runtime = "nodejs";

type GitHubAsset = { name: string; size: number; browser_download_url: string; updated_at: string };
type GitHubRelease = {
  tag_name: string;
  name: string;
  html_url: string;
  body: string | null;
  published_at: string | null;
  created_at: string;
  draft: boolean;
  prerelease: boolean;
  assets: GitHubAsset[];
};

const sourcePages: Record<ProgramId, string> = {
  SISAIH01: "http://sihd.datasus.gov.br/versao/versao_sisaih01.php",
  BPA: "https://sia.datasus.gov.br/versao/listar_ftp_bpa.php",
  SIA: "https://sia.datasus.gov.br/versao/listar_ftp_sia.php",
  CIHA01: "https://ciha.saude.gov.br/versao/versao_ciha1.php",
};

const programNames: Record<ProgramId, string> = {
  SISAIH01: "Sistema de Informações Hospitalares",
  BPA: "Boletim de Produção Ambulatorial",
  SIA: "Banco de Dados do SIA",
  CIHA01: "Comunicação de Informação Hospitalar e Ambulatorial",
};

function getProgram(tag: string): ProgramId | null {
  if (tag.startsWith("sih-sisaih01-")) return "SISAIH01";
  if (tag.startsWith("bpa-v")) return "BPA";
  if (tag.startsWith("sia-bd-")) return "SIA";
  if (tag.startsWith("ciha01-v")) return "CIHA01";
  return null;
}

function releaseRank(release: GitHubRelease, program: ProgramId) {
  const tag = release.tag_name;
  if (program === "SISAIH01") {
    const value = /sih-sisaih01-(\d{2})-(\d{4})-/i.exec(tag);
    return value ? Number(value[2]) * 100 + Number(value[1]) : 0;
  }
  if (program === "BPA") {
    const value = /bpa-v(\d+)-(\d+)/i.exec(tag);
    return value ? Number(value[1]) * 1000 + Number(value[2]) : 0;
  }
  if (program === "SIA") {
    const value = /sia-bd-(\d{4})(\d{2})([a-z])/i.exec(tag);
    return value ? Number(value[1]) * 10_000 + Number(value[2]) * 100 + value[3].charCodeAt(0) : 0;
  }
  const value = /ciha01-v(\d+)-(\d+)/i.exec(tag);
  return value ? Number(value[1]) * 1000 + Number(value[2]) : 0;
}

function artifactVersion(program: ProgramId, filename: string, tag: string) {
  if (program === "SISAIH01") {
    const value = /sisaih01_ver(\d{2})(\d+)\.exe/i.exec(filename);
    return value ? `${value[1]}.${value[2]}` : tag;
  }
  if (program === "BPA") {
    const value = /BPAMAG(\d{2})(\d{2})\.exe/i.exec(filename);
    return value ? `${value[1]}.${value[2]}` : tag;
  }
  if (program === "SIA") {
    const value = /BDSIA(\d{4})(\d{2})([a-z])\.exe/i.exec(filename);
    return value ? `${value[1]}.${value[2]}${value[3]}` : tag;
  }
  const value = /CIHA01_VER(\d{2})(\d+)\.exe/i.exec(filename);
  return value ? `${value[1]}.${value[2]}` : tag;
}

function isArtifact(program: ProgramId, filename: string) {
  if (program === "SISAIH01") return /^sisaih01_ver\d+\.exe$/i.test(filename);
  if (program === "BPA") return /^BPAMAG\d+\.exe$/i.test(filename);
  if (program === "SIA") return /^BDSIA\d{4}\d{2}[a-z]\.exe$/i.test(filename);
  return /^CIHA01_VER\d+\.exe$/i.test(filename);
}

function fileSize(bytes: number) {
  if (bytes < 1_000_000) return `${Math.max(1, Math.round(bytes / 1_000))} KB`;
  return `${(bytes / 1_000_000).toLocaleString("pt-BR", { maximumFractionDigits: 1 })} MB`;
}

function dateLabel(value: string) {
  return new Intl.DateTimeFormat("pt-BR", { dateStyle: "medium", timeZone: "America/Sao_Paulo" }).format(new Date(value));
}

function sourcePage(program: ProgramId, body: string | null) {
  const match = /Origem:\s*(https?:\/\/[^\s]+)/i.exec(body ?? "");
  return match?.[1] ?? sourcePages[program];
}

function makeItems(release: GitHubRelease, program: ProgramId): ReleaseItem[] {
  const publishedAt = release.published_at ?? release.created_at;
  const competence = /competência\s+(\d{2}\/\d{4})/i.exec(release.name)?.[1];
  return release.assets
    .filter((asset) => isArtifact(program, asset.name))
    .sort((left, right) => left.name.localeCompare(right.name))
    .map((asset) => ({
      id: `${release.tag_name}-${asset.name}`,
      program,
      programName: programNames[program],
      version: artifactVersion(program, asset.name, release.tag_name),
      filename: asset.name,
      size: fileSize(asset.size),
      sourceUrl: release.html_url,
      downloadUrl: asset.browser_download_url,
      sourcePage: sourcePage(program, release.body),
      publishedLabel: competence ? `Competência ${competence}` : dateLabel(publishedAt),
      competence,
      delivery: "github-release" as const,
    }));
}

export async function GET() {
  const repository = getReleasesRepository();
  const response = await fetch(`https://api.github.com/repos/${repository}/releases?per_page=100`, {
    headers: { Accept: "application/vnd.github+json", "User-Agent": "datasus-releases-catalog" },
    next: { revalidate: 300 },
  });

  if (!response.ok) {
    try {
      const fallback = JSON.parse(await readFile(join(process.cwd(), "public", "releases.json"), "utf8")) as ReleasesPayload;
      if (fallback.repository === repository && fallback.releases.length) {
        return NextResponse.json(fallback, { headers: { "Cache-Control": "no-store" } });
      }
    } catch {
      // Sem manifesto local compatível; manter a resposta pública de falha.
    }
    return NextResponse.json({ error: "Não foi possível consultar as releases públicas configuradas." }, { status: response.status });
  }

  const releases = (await response.json()) as GitHubRelease[];
  const currentByProgram = new Map<ProgramId, GitHubRelease>();
  for (const release of releases) {
    if (release.draft || release.prerelease) continue;
    const program = getProgram(release.tag_name);
    if (!program) continue;
    const previous = currentByProgram.get(program);
    if (!previous || releaseRank(release, program) > releaseRank(previous, program)) {
      currentByProgram.set(program, release);
    }
  }

  const items = (["SISAIH01", "BPA", "SIA", "CIHA01"] as ProgramId[]).flatMap((program) => {
    const release = currentByProgram.get(program);
    return release ? makeItems(release, program) : [];
  });

  const payload: ReleasesPayload = { generatedAt: new Date().toISOString(), repository, releases: items };
  return NextResponse.json(payload, { headers: { "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600" } });
}

/**
 * Sincronizador portátil em Bun. Coleta fontes públicas DATASUS, publica releases no repositório atual e nunca executa binários.
 * O workflow GitHub fornece a autenticação automaticamente; em execução manual, use um GH_TOKEN com permissão de escrita.
 */
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join, basename } from "node:path";

type ProgramId = "SISAIH01" | "BPA" | "SIA" | "CIHA01";

type Candidate = {
  id: string;
  program: ProgramId;
  programName: string;
  version: string;
  filename: string;
  size: string;
  sourceUrl: string;
  sourcePage: string;
  publishedLabel: string;
  competence?: string;
  tag: string;
  title: string;
};

type PublishedItem = Omit<Candidate, "tag" | "title"> & {
  downloadUrl: string;
  delivery: "github-release";
};

type CachedManifest = { generatedAt?: string; repository?: string; releases?: PublishedItem[] };

const repository = process.env.GITHUB_REPOSITORY ?? "BRConnect/datasus-releases";
const SIH_URL = "http://sihd.datasus.gov.br/versao/versao_sisaih01.php";
const BPA_URL = "https://sia.datasus.gov.br/versao/listar_ftp_bpa.php";
const SIA_URL = "https://sia.datasus.gov.br/versao/listar_ftp_sia.php";
const CIHA_URL = "https://ciha.saude.gov.br/versao/versao_ciha1.php";

function decode(value: string) {
  return value
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&#0?39;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function sourceFileName(url: string, fallback: string) {
  const path = url.replace(/\s/g, "").split(/[?#]/)[0];
  const name = basename(path);
  return /\.exe$/i.test(name) ? name : fallback;
}

async function getHtml(url: string) {
  let lastError: unknown;
  for (let attempt = 1; attempt <= 3; attempt += 1) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 45_000);
    try {
      const response = await fetch(url, {
        headers: { "user-agent": "datasus-releases-sync/2.0" },
        signal: controller.signal,
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return await response.text();
    } catch (error) {
      lastError = error;
      console.warn(`Tentativa ${attempt}/3 sem resposta em ${url}.`);
      if (attempt < 3) await Bun.sleep(attempt * 4_000);
    } finally {
      clearTimeout(timer);
    }
  }
  throw new Error(`Fonte indisponível após 3 tentativas: ${url}. ${lastError instanceof Error ? lastError.message : ""}`);
}

function parseSih(html: string): Candidate[] {
  const competenceMatch = /CMPT\s+(\d{2}\/\d{4})/i.exec(html);
  if (!competenceMatch) throw new Error("Competência atual do SISAIH01 não encontrada.");

  const start = competenceMatch.index;
  const nextCompetence = html.slice(start + competenceMatch[0].length).search(/CMPT\s+\d{2}\/\d{4}/i);
  const section = html.slice(start, nextCompetence === -1 ? undefined : start + competenceMatch[0].length + nextCompetence);
  const links = [...section.matchAll(/href=["']([^"']+sisaih01_ver(\d+)\.exe)\s*["'][^>]*>([^<]*)</gi)];
  if (!links.length) throw new Error("Instaladores atuais do SISAIH01 não encontrados.");

  const competence = competenceMatch[1];
  const versions = links.map((match) => {
    const digits = match[2];
    const sourceUrl = match[1].replace(/\s/g, "");
    const fallback = `sisaih01_ver${digits}.exe`;
    return {
      filename: sourceFileName(sourceUrl, fallback),
      version: `${digits.slice(0, 2)}.${digits.slice(2)}`,
      sourceUrl,
    };
  });
  const versionToken = versions.map((item) => item.version.replace(".", "-")).join("-");
  const tag = `sih-sisaih01-${competence.replace("/", "-")}-v${versionToken}`;
  const title = `SISAIH01 · competência ${competence} · versões ${versions.map((entry) => entry.version).join(" e ")}`;

  return versions.map((item) => ({
    id: `sisaih01-${item.version.replace(".", "-")}`,
    program: "SISAIH01" as const,
    programName: "Sistema de Informações Hospitalares",
    version: item.version,
    filename: item.filename,
    size: "Conforme arquivo oficial",
    sourceUrl: item.sourceUrl,
    sourcePage: SIH_URL,
    publishedLabel: `Competência ${competence}`,
    competence,
    tag,
    title,
  }));
}

function tableEntry(html: string, filename: string) {
  const escapedName = filename.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const expression = new RegExp(
    `href=["']([^"']+)["'][^>]*>${escapedName}<\\/a><\\/td>\\s*<td[^>]*>([\\s\\S]*?)<\\/td>\\s*<td[^>]*>([\\s\\S]*?)<\\/td>`,
    "i"
  );
  const match = expression.exec(html);
  if (!match) throw new Error(`Metadados de ${filename} não encontrados.`);
  return { sourceUrl: decode(match[1]), date: decode(match[2]), size: decode(match[3]) };
}

function parseBpa(html: string): Candidate {
  const filename = [...html.matchAll(/>(BPAMAG\d+\.exe)</gi)].at(-1)?.[1];
  if (!filename) throw new Error("Instalador BPA não encontrado.");
  const entry = tableEntry(html, filename);
  const numericVersion = /^BPAMAG(\d{2})(\d{2})\.exe$/i.exec(filename);
  const version = numericVersion ? `${numericVersion[1]}.${numericVersion[2]}` : filename;
  return {
    id: `bpa-${version.replace(".", "-")}`,
    program: "BPA",
    programName: "Boletim de Produção Ambulatorial",
    version,
    filename,
    size: entry.size,
    sourceUrl: entry.sourceUrl,
    sourcePage: BPA_URL,
    publishedLabel: entry.date,
    tag: `bpa-v${version.replace(".", "-")}`,
    title: `BPA · versão ${version}`,
  };
}

function parseCiha(html: string): Candidate {
  const matches = [...html.matchAll(/href=["']([^"']*CIHA01_VER(\d+)\.exe)\s*["']/gi)];
  const latest = matches.at(-1);
  if (!latest) throw new Error("Instalador CIHA01 não encontrado.");

  const digits = latest[2];
  const sourceUrl = latest[1].replace(/\s/g, "");
  const version = `${digits.slice(0, 2)}.${digits.slice(2)}`;
  return {
    id: `ciha01-${version.replace(".", "-")}`,
    program: "CIHA01",
    programName: "Comunicação de Informação Hospitalar e Ambulatorial",
    version,
    filename: sourceFileName(sourceUrl, `CIHA01_VER${digits}.exe`),
    size: "Conforme arquivo oficial",
    sourceUrl,
    sourcePage: CIHA_URL,
    publishedLabel: "Versão atual",
    tag: `ciha01-v${version.replace(".", "-")}`,
    title: `CIHA01 · versão ${version}`,
  };
}

function parseSia(html: string): Candidate {
  const candidates = [...html.matchAll(/>(BDSIA(\d{4})(\d{2})([a-z])\.exe)</gi)]
    .map((match) => ({ filename: match[1], year: match[2], month: match[3], suffix: match[4] }))
    .sort((left, right) => right.filename.localeCompare(left.filename));
  const latest = candidates[0];
  if (!latest) throw new Error("Banco de dados mensal SIA não encontrado.");
  const entry = tableEntry(html, latest.filename);
  const version = `${latest.year}.${latest.month}${latest.suffix}`;
  return {
    id: `sia-${latest.year}${latest.month}${latest.suffix}`,
    program: "SIA",
    programName: "Banco de Dados do SIA",
    version,
    filename: latest.filename,
    size: entry.size,
    sourceUrl: entry.sourceUrl,
    sourcePage: SIA_URL,
    publishedLabel: entry.date,
    tag: `sia-bd-${latest.year}${latest.month}${latest.suffix}`,
    title: `SIA · banco mensal ${version}`,
  };
}

async function run(command: string[], quiet = false) {
  const child = Bun.spawn(command, { stdout: quiet ? "pipe" : "inherit", stderr: "inherit", env: { ...process.env, GH_FORCE_TTY: "0", NO_COLOR: "1" } });
  if ((await child.exited) !== 0) throw new Error(`Comando falhou: ${command.join(" ")}`);
  return quiet ? (await new Response(child.stdout).text()).trim() : "";
}

async function getReleaseAssets(tag: string): Promise<string[] | null> {
  const child = Bun.spawn(["gh", "release", "view", tag, "--repo", repository, "--json", "assets"], { stdout: "pipe", stderr: "ignore", env: { ...process.env, GH_FORCE_TTY: "0", NO_COLOR: "1" } });
  if ((await child.exited) !== 0) return null;
  const raw = await new Response(child.stdout).text();
  const clean = raw.replace(/\u001b\[[0-?]*[ -\/]*[@-~]/g, "").replace(/\u001b\][^\u0007]*(?:\u0007|\u001b\\)/g, "");
  return (JSON.parse(clean) as { assets: { name: string }[] }).assets.map((asset) => asset.name);
}

function isExpectedArtifact(program: ProgramId, filename: string) {
  if (program === "SISAIH01") return /^sisaih01_ver\d+\.exe$/i.test(filename);
  if (program === "BPA") return /^BPAMAG\d+\.exe$/i.test(filename);
  if (program === "SIA") return /^BDSIA\d{4}\d{2}[a-z]\.exe$/i.test(filename);
  return /^CIHA01_VER\d+\.exe$/i.test(filename);
}

async function download(candidate: Candidate, directory: string) {
  const destination = join(directory, candidate.filename);
  await run([
    "curl", "--fail", "--location", "--show-error", "--retry", "3", "--retry-all-errors",
    "--connect-timeout", "30", "--max-time", "1200", "--output", destination, candidate.sourceUrl,
  ]);
  if (!(await Bun.file(destination).exists())) throw new Error(`Download ausente: ${candidate.filename}`);
  return destination;
}

async function publishGroup(group: Candidate[]): Promise<PublishedItem[]> {
  const [first] = group;
  const knownAssets = await getReleaseAssets(first.tag);
  const invalidAssets = (knownAssets ?? []).filter((asset) => !isExpectedArtifact(first.program, asset));
  for (const asset of invalidAssets) {
    await run(["gh", "release", "delete-asset", first.tag, asset, "--repo", repository, "--yes"]);
  }

  const missing = group.filter((candidate) => !knownAssets?.includes(candidate.filename));
  if (missing.length) {
    const directory = await mkdtemp(join(tmpdir(), "datasus-releases-"));
    try {
      const files = await Promise.all(missing.map((candidate) => download(candidate, directory)));
      if (knownAssets === null) {
        await run([
          "gh", "release", "create", first.tag, ...files, "--repo", repository,
          "--title", first.title,
          "--notes", `Arquivos obtidos automaticamente das fontes oficiais DATASUS.\n\nOrigem: ${first.sourcePage}`,
          "--latest=false",
        ]);
      } else {
        await run(["gh", "release", "upload", first.tag, ...files, "--repo", repository, "--clobber"]);
      }
    } finally {
      await rm(directory, { recursive: true, force: true });
    }
  }

  return group.map(({ tag: _tag, title: _title, ...candidate }) => ({
    ...candidate,
    downloadUrl: `https://github.com/${repository}/releases/download/${first.tag}/${candidate.filename}`,
    delivery: "github-release" as const,
  }));
}

function groupByTag(candidates: Candidate[]) {
  return [...candidates.reduce((groups, candidate) => {
    const group = groups.get(candidate.tag) ?? [];
    group.push(candidate);
    groups.set(candidate.tag, group);
    return groups;
  }, new Map<string, Candidate[]>()).values()];
}

async function main() {
  console.log(`Consultando fontes oficiais para ${repository}...`);
  const responses = await Promise.allSettled([getHtml(SIH_URL), getHtml(BPA_URL), getHtml(SIA_URL), getHtml(CIHA_URL)]);
  const definitions: Array<{ program: ProgramId; parse: (html: string) => Candidate | Candidate[] }> = [
    { program: "SISAIH01", parse: parseSih },
    { program: "BPA", parse: parseBpa },
    { program: "SIA", parse: parseSia },
    { program: "CIHA01", parse: parseCiha },
  ];

  const candidates: Candidate[] = [];
  const parsedPrograms = new Set<ProgramId>();
  responses.forEach((response, index) => {
    const definition = definitions[index];
    if (response.status === "rejected") {
      console.error(`Fonte ${definition.program} indisponível: ${response.reason}`);
      return;
    }
    try {
      const parsed = definition.parse(response.value);
      candidates.push(...(Array.isArray(parsed) ? parsed : [parsed]));
      parsedPrograms.add(definition.program);
    } catch (error) {
      console.error(`Não foi possível interpretar ${definition.program}: ${error instanceof Error ? error.message : error}`);
    }
  });
  if (!candidates.length) throw new Error("Nenhuma fonte DATASUS respondeu com instalador válido.");

  const cached = (await Bun.file("public/releases.json").json()) as CachedManifest;
  const published: PublishedItem[] = [];
  for (const group of groupByTag(candidates)) {
    try {
      published.push(...(await publishGroup(group)));
    } catch (error) {
      console.error(`Falha ao publicar ${group[0].program}: ${error instanceof Error ? error.message : error}`);
      published.push(...(cached.releases ?? []).filter((release) => release.program === group[0].program));
    }
  }

  const untouched = (cached.releases ?? []).filter((release) => !parsedPrograms.has(release.program));
  await Bun.write("public/releases.json", `${JSON.stringify({ generatedAt: new Date().toISOString(), repository, releases: [...published, ...untouched] }, null, 2)}\n`);
  console.log("Manifesto atualizado com links de releases GitHub válidos.");
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});

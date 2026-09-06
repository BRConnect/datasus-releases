export type ProgramId = "SISAIH01" | "BPA" | "SIA" | "CIHA01" | "SIGTAP";

export type Candidate = {
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

export type PublishedItem = Omit<Candidate, "tag" | "title"> & {
  downloadUrl: string;
  delivery: "github-release";
};

export type CachedManifest = {
  generatedAt?: string;
  repository?: string;
  releases?: PublishedItem[];
};

export const repository = process.env.GITHUB_REPOSITORY ?? "BRConnect/datasus-releases";

export const sourceUrls = {
  SISAIH01: "http://sihd.datasus.gov.br/versao/versao_sisaih01.php",
  BPA: "https://sia.datasus.gov.br/versao/listar_ftp_bpa.php",
  SIA: "https://sia.datasus.gov.br/versao/listar_ftp_sia.php",
  CIHA01: "https://ciha.saude.gov.br/versao/versao_ciha1.php",
  SIGTAP_PAGE: "http://sigtap.datasus.gov.br/tabela-unificada/app/download.jsp",
  SIGTAP_RSS: "http://sigtap.datasus.gov.br/tabela-unificada/competencias.rss",
} as const;

export const programs: ProgramId[] = ["SISAIH01", "BPA", "SIA", "CIHA01", "SIGTAP"];

export type Parser = (html: string) => Candidate | Candidate[];

export type SourceDefinition = { program: ProgramId; parse: Parser };

export type ReleaseCommandRunner = (command: string[], quiet?: boolean) => Promise<string>;

export type SyncDependencies = {
  fetchHtml: (url: string, maxAttempts?: number) => Promise<string>;
  readManifest: () => Promise<CachedManifest>;
  writeManifest: (manifest: CachedManifest) => Promise<void>;
  getReleaseAssets: (tag: string) => Promise<string[] | null>;
  run: ReleaseCommandRunner;
  download: (candidate: Candidate, directory: string) => Promise<string>;
  createTempDirectory: () => Promise<string>;
  remove: (path: string, options?: { force?: boolean; recursive?: boolean }) => Promise<void>;
};

export const defaultSyncDependencies = {
  readManifest: async () => (await Bun.file("public/releases.json").json()) as CachedManifest,
  writeManifest: async (manifest: CachedManifest) => {
    await Bun.write("public/releases.json", `${JSON.stringify(manifest, null, 2)}\n`);
  },
};

export const isProgramId = (value: string): value is ProgramId => programs.includes(value as ProgramId);

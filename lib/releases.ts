/** Modelo de dados para o arquivo público de versões do catálogo DATASUS. */
export type ProgramId = "SISAIH01" | "BPA" | "SIA" | "CIHA01" | "SIGTAP";

export type ReleaseItem = {
  id: string;
  program: ProgramId;
  programName: string;
  version: string;
  filename: string;
  size: string;
  sourceUrl: string;
  downloadUrl: string;
  sourcePage: string;
  publishedLabel: string;
  competence?: string;
  delivery: "github-release" | "official-source";
};

export type ReleasesPayload = {
  generatedAt: string;
  repository: string;
  releases: ReleaseItem[];
};

export const initialReleases: ReleasesPayload = {
  generatedAt: "",
  repository: "",
  releases: []
};

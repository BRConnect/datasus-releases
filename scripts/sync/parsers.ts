import { basename } from "node:path";
import { sourceUrls, type Candidate } from "./types";
import { decode, sourceFileName, tableEntry } from "./parsing";

export function parseSih(html: string): Candidate[] {
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
    return { filename: sourceFileName(sourceUrl, `sisaih01_ver${digits}.exe`), version: `${digits.slice(0, 2)}.${digits.slice(2)}`, sourceUrl };
  });
  const versionToken = versions.map((item) => item.version.replace(".", "-")).join("-");
  const tag = `sih-sisaih01-${competence.replace("/", "-")}-v${versionToken}`;
  const title = `SISAIH01 · competência ${competence} · versões ${versions.map((entry) => entry.version).join(" e ")}`;
  return versions.map((item) => ({ id: `sisaih01-${item.version.replace(".", "-")}`, program: "SISAIH01" as const, programName: "Sistema de Informações Hospitalares", version: item.version, filename: item.filename, size: "Conforme arquivo oficial", sourceUrl: item.sourceUrl, sourcePage: sourceUrls.SISAIH01, publishedLabel: `Competência ${competence}`, competence, tag, title }));
}

export function parseBpa(html: string): Candidate {
  const filename = [...html.matchAll(/>(BPAMAG\d+\.exe)</gi)].at(-1)?.[1];
  if (!filename) throw new Error("Instalador BPA não encontrado.");
  const entry = tableEntry(html, filename);
  const numericVersion = /^BPAMAG(\d{2})(\d{2})\.exe$/i.exec(filename);
  const version = numericVersion ? `${numericVersion[1]}.${numericVersion[2]}` : filename;
  return { id: `bpa-${version.replace(".", "-")}`, program: "BPA", programName: "Boletim de Produção Ambulatorial", version, filename, size: entry.size, sourceUrl: entry.sourceUrl, sourcePage: sourceUrls.BPA, publishedLabel: entry.date, tag: `bpa-v${version.replace(".", "-")}`, title: `BPA · versão ${version}` };
}

export function parseCiha(html: string): Candidate {
  const latest = [...html.matchAll(/href=["']([^"']*CIHA01_VER(\d+)\.exe)\s*["']/gi)].at(-1);
  if (!latest) throw new Error("Instalador CIHA01 não encontrado.");
  const digits = latest[2];
  const sourceUrl = latest[1].replace(/\s/g, "");
  const version = `${digits.slice(0, 2)}.${digits.slice(2)}`;
  return { id: `ciha01-${version.replace(".", "-")}`, program: "CIHA01", programName: "Comunicação de Informação Hospitalar e Ambulatorial", version, filename: sourceFileName(sourceUrl, `CIHA01_VER${digits}.exe`), size: "Conforme arquivo oficial", sourceUrl, sourcePage: sourceUrls.CIHA01, publishedLabel: "Versão atual", tag: `ciha01-v${version.replace(".", "-")}`, title: `CIHA01 · versão ${version}` };
}

export function parseSigtap(xml: string): Candidate {
  const entries = [...xml.matchAll(/<item>[\s\S]*?<title>\s*Competência\s+(\d{2}\/\d{4})\s*<\/title>[\s\S]*?<link>\s*([^<]*TabelaUnificada_(\d{6})_v(\d+)\.zip)\s*<\/link>[\s\S]*?<pubDate>\s*([^<]+)\s*<\/pubDate>[\s\S]*?<\/item>/gi)]
    .map((match) => ({ competence: match[1], sourceUrl: decode(match[2]), versionToken: match[4], publishedAt: decode(match[5]) }))
    .sort((left, right) => right.competence.split("/").reverse().join("").localeCompare(left.competence.split("/").reverse().join("")));
  const latest = entries[0];
  if (!latest) throw new Error("Competência/arquivo ZIP do SIGTAP não encontrado no RSS oficial.");
  const filename = basename(latest.sourceUrl);
  const [month, year] = latest.competence.split("/");
  return { id: `sigtap-${year}${month}`, program: "SIGTAP", programName: "Tabela de Procedimentos, Medicamentos e OPM do SUS", version: `${month}/${year}`, filename, size: "Conforme arquivo oficial", sourceUrl: latest.sourceUrl, sourcePage: sourceUrls.SIGTAP_PAGE, publishedLabel: `Competência ${latest.competence}`, competence: latest.competence, tag: `sigtap-${year}${month}-v${latest.versionToken}`, title: `SIGTAP · competência ${latest.competence}` };
}

export function parseSia(html: string): Candidate {
  const latest = [...html.matchAll(/>(BDSIA(\d{4})(\d{2})([a-z])\.exe)</gi)].map((match) => ({ filename: match[1], year: match[2], month: match[3], suffix: match[4] })).sort((left, right) => right.filename.localeCompare(left.filename))[0];
  if (!latest) throw new Error("Banco de dados mensal SIA não encontrado.");
  const entry = tableEntry(html, latest.filename);
  const version = `${latest.year}.${latest.month}${latest.suffix}`;
  return { id: `sia-${latest.year}${latest.month}${latest.suffix}`, program: "SIA", programName: "Banco de Dados do SIA", version, filename: latest.filename, size: entry.size, sourceUrl: entry.sourceUrl, sourcePage: sourceUrls.SIA, publishedLabel: entry.date, tag: `sia-bd-${latest.year}${latest.month}${latest.suffix}`, title: `SIA · banco mensal ${version}` };
}

export const definitions = [
  { program: "SISAIH01" as const, parse: parseSih },
  { program: "BPA" as const, parse: parseBpa },
  { program: "SIA" as const, parse: parseSia },
  { program: "CIHA01" as const, parse: parseCiha },
  { program: "SIGTAP" as const, parse: parseSigtap },
];

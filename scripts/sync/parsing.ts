import { basename } from "node:path";
import type { ProgramId } from "./types";

export function decode(value: string) {
  return value
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&#0?39;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function sourceFileName(url: string, fallback: string) {
  const path = url.replace(/\s/g, "").split(/[?#]/)[0];
  const name = basename(path);
  return /\.exe$/i.test(name) ? name : fallback;
}

export function tableEntry(html: string, filename: string) {
  const escapedName = filename.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const expression = new RegExp(
    `href=["']([^"']+)["'][^>]*>${escapedName}<\\/a><\\/td>\\s*<td[^>]*>([\\s\\S]*?)<\\/td>\\s*<td[^>]*>([\\s\\S]*?)<\\/td>`,
    "i",
  );
  const match = expression.exec(html);
  if (!match) throw new Error(`Metadados de ${filename} não encontrados.`);
  return { sourceUrl: decode(match[1]), date: decode(match[2]), size: decode(match[3]) };
}

export function isExpectedArtifact(program: ProgramId, filename: string) {
  if (program === "SISAIH01") return /^sisaih01_ver\d+\.exe$/i.test(filename);
  if (program === "BPA") return /^BPAMAG\d+\.exe$/i.test(filename);
  if (program === "SIA") return /^BDSIA\d{4}\d{2}[a-z]\.exe$/i.test(filename);
  if (program === "CIHA01") return /^CIHA01_VER\d+\.exe$/i.test(filename);
  return /^TabelaUnificada_\d{6}_v\d+\.zip$/i.test(filename);
}

export function groupByTag<T extends { tag: string }>(items: T[]) {
  return [...items.reduce((groups, item) => {
    const group = groups.get(item.tag) ?? [];
    group.push(item);
    groups.set(item.tag, group);
    return groups;
  }, new Map<string, T[]>()).values()];
}

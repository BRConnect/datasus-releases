import { definitions } from "./parsers";
import { groupByTag } from "./parsing";
import { publishGroup } from "./github";
import { repository, sourceUrls, type Candidate, type CachedManifest, type ProgramId, type SyncDependencies } from "./types";

export async function synchronize(dependencies: SyncDependencies, targetRepository = repository) {
  console.log(`Consultando fontes oficiais para ${targetRepository}...`);
  const responses = await Promise.allSettled([dependencies.fetchHtml(sourceUrls.SISAIH01), dependencies.fetchHtml(sourceUrls.BPA), dependencies.fetchHtml(sourceUrls.SIA), dependencies.fetchHtml(sourceUrls.CIHA01), dependencies.fetchHtml(sourceUrls.SIGTAP_RSS, 10)]);
  const candidates: Candidate[] = [];
  const parsedPrograms = new Set<ProgramId>();
  responses.forEach((response, index) => {
    const definition = definitions[index];
    if (response.status === "rejected") { console.error(`Fonte ${definition.program} indisponível: ${response.reason}`); return; }
    try { const parsed = definition.parse(response.value); candidates.push(...(Array.isArray(parsed) ? parsed : [parsed])); parsedPrograms.add(definition.program); }
    catch (error) { console.error(`Não foi possível interpretar ${definition.program}: ${error instanceof Error ? error.message : error}`); }
  });
  const cached = await dependencies.readManifest();
  if (!candidates.length) {
    if (cached.releases?.length) { console.warn("Nenhuma fonte DATASUS respondeu; preservando o manifesto válido anterior."); await dependencies.writeManifest({ ...cached, generatedAt: new Date().toISOString(), repository: targetRepository }); return; }
    throw new Error("Nenhuma fonte DATASUS respondeu com instalador válido e não há manifesto de fallback.");
  }
  const published = [] as NonNullable<CachedManifest["releases"]>;
  for (const group of groupByTag(candidates)) {
    try { published.push(...await publishGroup(group, targetRepository, dependencies)); }
    catch (error) { console.error(`Falha ao publicar ${group[0].program}: ${error instanceof Error ? error.message : error}`); published.push(...(cached.releases ?? []).filter((release) => release.program === group[0].program)); }
  }
  const untouched = (cached.releases ?? []).filter((release) => !parsedPrograms.has(release.program));
  await dependencies.writeManifest({ generatedAt: new Date().toISOString(), repository: targetRepository, releases: [...published, ...untouched] });
  console.log("Manifesto atualizado com links de releases GitHub válidos.");
}

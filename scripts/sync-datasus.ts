/** Sincroniza fontes públicas DATASUS e publica releases sem executar os binários baixados. */
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { createCommandRunner, createReleaseAssetReader } from "./sync/github";
import { getHtml, download as downloadFile } from "./sync/network";
import { synchronize } from "./sync/synchronizer";
import { repository } from "./sync/types";

const run = createCommandRunner();

synchronize({
  fetchHtml: getHtml,
  readManifest: async () => (await Bun.file("public/releases.json").json()),
  writeManifest: async (manifest) => { await Bun.write("public/releases.json", `${JSON.stringify(manifest, null, 2)}\n`); },
  getReleaseAssets: createReleaseAssetReader(repository, run),
  run,
  download: (candidate, directory) => downloadFile(candidate, directory, run),
  createTempDirectory: () => mkdtemp(`${tmpdir()}/datasus-releases-`),
  remove: rm,
}, repository).catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});

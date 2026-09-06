import type { ReleaseCommandRunner, Candidate, PublishedItem } from "./types";
import { isExpectedArtifact } from "./parsing";

export function createCommandRunner(): ReleaseCommandRunner {
  return async (command, quiet = false) => {
    const child = Bun.spawn(command, { stdout: quiet ? "pipe" : "inherit", stderr: "inherit", env: { ...process.env, GH_FORCE_TTY: "0", NO_COLOR: "1" } });
    if ((await child.exited) !== 0) throw new Error(`Comando falhou: ${command.join(" ")}`);
    return quiet ? (await new Response(child.stdout).text()).trim() : "";
  };
}

export function createReleaseAssetReader(repository: string, run: ReleaseCommandRunner) {
  return async (tag: string): Promise<string[] | null> => {
    const child = Bun.spawn(["gh", "release", "view", tag, "--repo", repository, "--json", "assets"], { stdout: "pipe", stderr: "ignore", env: { ...process.env, GH_FORCE_TTY: "0", NO_COLOR: "1" } });
    if ((await child.exited) !== 0) return null;
    const raw = await new Response(child.stdout).text();
    const clean = raw.replace(/\u001b\[[0-?]*[ -\/]*[@-~]/g, "").replace(/\u001b\][^\u0007]*(?:\u0007|\u001b\\)/g, "");
    return (JSON.parse(clean) as { assets: { name: string }[] }).assets.map((asset) => asset.name);
  };
}

export async function publishGroup(group: Candidate[], repository: string, dependencies: { getReleaseAssets: (tag: string) => Promise<string[] | null>; run: ReleaseCommandRunner; download: (candidate: Candidate, directory: string) => Promise<string>; createTempDirectory: () => Promise<string>; remove: (path: string, options?: { force?: boolean; recursive?: boolean }) => Promise<void> }): Promise<PublishedItem[]> {
  const [first] = group;
  const knownAssets = await dependencies.getReleaseAssets(first.tag);
  for (const asset of (knownAssets ?? []).filter((asset) => !isExpectedArtifact(first.program, asset))) await dependencies.run(["gh", "release", "delete-asset", first.tag, asset, "--repo", repository, "--yes"]);
  const missing = group.filter((candidate) => !knownAssets?.includes(candidate.filename));
  if (missing.length) {
    const directory = await dependencies.createTempDirectory();
    try {
      const files = await Promise.all(missing.map((candidate) => dependencies.download(candidate, directory)));
      if (knownAssets === null) await dependencies.run(["gh", "release", "create", first.tag, ...files, "--repo", repository, "--title", first.title, "--notes", `Arquivos obtidos automaticamente das fontes oficiais DATASUS.\n\nOrigem: ${first.sourcePage}`, "--latest=false"]);
      else await dependencies.run(["gh", "release", "upload", first.tag, ...files, "--repo", repository, "--clobber"]);
    } finally { await dependencies.remove(directory, { recursive: true, force: true }); }
  }
  return group.map(({ tag: _tag, title: _title, ...candidate }) => ({ ...candidate, downloadUrl: `https://github.com/${repository}/releases/download/${first.tag}/${candidate.filename}`, delivery: "github-release" as const }));
}

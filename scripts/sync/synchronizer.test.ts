import { describe, expect, test } from "bun:test";
import { synchronize } from "./synchronizer";
import type { CachedManifest, SyncDependencies } from "./types";

function dependenciesWithUnavailableSources(manifest: CachedManifest, written: CachedManifest[]) {
  const dependencies: SyncDependencies = {
    fetchHtml: async () => { throw new Error("portal indisponível"); },
    readManifest: async () => manifest,
    writeManifest: async (value) => { written.push(value); },
    getReleaseAssets: async () => [],
    run: async () => "",
    download: async () => "/tmp/unused",
    createTempDirectory: async () => "/tmp/unused",
    remove: async () => undefined,
  };
  return dependencies;
}

describe("synchronizer resilience", () => {
  test("preserves the previous valid manifest when every source is unavailable", async () => {
    const previous: CachedManifest = {
      generatedAt: "2025-01-01T00:00:00.000Z",
      repository: "BRConnect/datasus-releases",
      releases: [{ id: "bpa-25-01", program: "BPA", programName: "BPA", version: "25.01", filename: "BPAMAG2501.exe", size: "10 MB", sourceUrl: "https://example.test/file.exe", sourcePage: "https://example.test", publishedLabel: "01/2025", downloadUrl: "https://github.com/example/release/file.exe", delivery: "github-release" }],
    };
    const written: CachedManifest[] = [];

    await synchronize(dependenciesWithUnavailableSources(previous, written), "example/repository");

    expect(written).toHaveLength(1);
    expect(written[0].releases).toEqual(previous.releases);
    expect(written[0].repository).toBe("example/repository");
  });
});

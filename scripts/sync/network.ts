import { rm } from "node:fs/promises";
import { join } from "node:path";
import type { Candidate } from "./types";
import type { ReleaseCommandRunner } from "./types";

export async function getHtml(url: string, maxAttempts = 3) {
  let lastError: unknown;
  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    const child = Bun.spawn(["curl", "--fail", "--location", "--silent", "--show-error", "--retry", "2", "--retry-all-errors", "--connect-timeout", "30", "--max-time", "120", "--http1.1", "--compressed", "--user-agent", "datasus-releases-sync/2.0", "--output", "-", url], { stdout: "pipe", stderr: "inherit", env: { ...process.env, NO_COLOR: "1" } });
    const exitCode = await child.exited;
    if (exitCode === 0) return await new Response(child.stdout).text();
    lastError = new Error(`curl terminou com código ${exitCode}`);
    console.warn(`Tentativa ${attempt}/${maxAttempts} sem resposta em ${url}.`);
    if (attempt < maxAttempts) await Bun.sleep(Math.min(attempt * 6_000, 30_000));
  }
  throw new Error(`Fonte indisponível após ${maxAttempts} tentativas: ${url}. ${lastError instanceof Error ? lastError.message : ""}`);
}

export async function download(candidate: Candidate, directory: string, run: ReleaseCommandRunner) {
  const destination = join(directory, candidate.filename);
  const attempts = candidate.program === "SIGTAP" ? 5 : 1;
  let lastError: unknown;
  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    try {
      await run(["curl", "--fail", "--location", "--silent", "--show-error", "--retry", "2", "--retry-all-errors", "--connect-timeout", "30", "--max-time", candidate.program === "SIGTAP" ? "300" : "1200", "--output", destination, candidate.sourceUrl]);
      if (!(await Bun.file(destination).exists())) throw new Error(`Download ausente: ${candidate.filename}`);
      return destination;
    } catch (error) {
      lastError = error;
      await rm(destination, { force: true });
      if (attempt < attempts) {
        console.warn(`Download SIGTAP tentativa ${attempt}/${attempts} falhou; aguardando o portal voltar.`);
        await Bun.sleep(Math.min(attempt * 15_000, 60_000));
      }
    }
  }
  throw new Error(`Download de ${candidate.filename} falhou após ${attempts} tentativas. ${lastError instanceof Error ? lastError.message : ""}`);
}

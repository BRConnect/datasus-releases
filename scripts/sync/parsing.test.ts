import { describe, expect, test } from "bun:test";
import { decode, groupByTag, isExpectedArtifact, sourceFileName, tableEntry } from "./parsing";

describe("parsing utilities", () => {
  test("decodes entities and normalizes HTML text", () => {
    expect(decode("  A&nbsp;&amp;&nbsp;B <b>ok</b> ")).toBe("A & B ok");
  });

  test("keeps executable basename and uses fallback for other files", () => {
    expect(sourceFileName("https://example.test/path/app.exe?download=1", "fallback.exe")).toBe("app.exe");
    expect(sourceFileName("https://example.test/path/archive", "fallback.exe")).toBe("fallback.exe");
  });

  test("reads table metadata", () => {
    const html = '<a href="ftp://example/BPAMAG2501.exe">BPAMAG2501.exe</a></td><td>01/2025</td><td>10 MB</td>';
    expect(tableEntry(html, "BPAMAG2501.exe")).toEqual({ sourceUrl: "ftp://example/BPAMAG2501.exe", date: "01/2025", size: "10 MB" });
  });

  test("validates artifact names by program", () => {
    expect(isExpectedArtifact("BPA", "BPAMAG2501.exe")).toBe(true);
    expect(isExpectedArtifact("BPA", "malware.exe")).toBe(false);
    expect(isExpectedArtifact("SIGTAP", "TabelaUnificada_202501_v12.zip")).toBe(true);
  });

  test("groups candidates by release tag", () => {
    expect(groupByTag([{ tag: "a", id: 1 }, { tag: "b", id: 2 }, { tag: "a", id: 3 }])).toEqual([[{ tag: "a", id: 1 }, { tag: "a", id: 3 }], [{ tag: "b", id: 2 }]]);
  });
});

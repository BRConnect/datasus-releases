import { describe, expect, test } from "bun:test";
import { parseBpa, parseCiha, parseSia, parseSigtap, parseSih } from "./parsers";

describe("DATASUS parsers", () => {
  test("parses SISAIH01 current competence and versions", () => {
    const html = 'CMPT 02/2025 <a href="http://files/sisaih01_ver2501.exe">one</a> <a href="http://files/sisaih01_ver2502.exe">two</a> CMPT 01/2025';
    const result = parseSih(html);
    expect(result.map((item) => item.version)).toEqual(["25.01", "25.02"]);
    expect(result[0].tag).toBe("sih-sisaih01-02-2025-v25-01-25-02");
  });

  test("parses BPA latest entry and metadata", () => {
    const html = '<a href="ftp://files/BPAMAG2501.exe">BPAMAG2501.exe</a></td><td>01/2025</td><td>20 MB</td>';
    expect(parseBpa(html)).toMatchObject({ program: "BPA", version: "25.01", size: "20 MB" });
  });

  test("parses SIA latest monthly database", () => {
    const html = '<a href="ftp://files/BDSIA202501a.exe">BDSIA202501a.exe</a></td><td>01/2025</td><td>30 MB</td>';
    expect(parseSia(html)).toMatchObject({ program: "SIA", version: "2025.01a", filename: "BDSIA202501a.exe" });
  });

  test("parses latest CIHA version", () => {
    expect(parseCiha('<a href="http://files/CIHA01_VER2501.exe">download</a>')).toMatchObject({ program: "CIHA01", version: "25.01" });
  });

  test("parses latest SIGTAP RSS competence", () => {
    const xml = '<item><title>Competência 01/2025</title><link>http://files/TabelaUnificada_202501_v123.zip</link><pubDate>Wed, 01 Jan 2025</pubDate></item>';
    expect(parseSigtap(xml)).toMatchObject({ program: "SIGTAP", version: "01/2025", filename: "TabelaUnificada_202501_v123.zip" });
  });
});

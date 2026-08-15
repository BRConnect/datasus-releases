/** Proxy interno de ativos: mantém os caminhos /manus-storage retornados pelo armazenamento do projeto. */
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(_request: NextRequest, context: { params: Promise<{ path: string[] }> }) {
  const { path } = await context.params;
  const key = path.join("/");
  const forgeBaseUrl = (process.env.BUILT_IN_FORGE_API_URL || "").replace(/\/+$/, "");
  const forgeKey = process.env.BUILT_IN_FORGE_API_KEY;

  if (!key || !forgeBaseUrl || !forgeKey) {
    return new NextResponse("Storage proxy not configured", { status: 500 });
  }

  try {
    const forgeUrl = new URL("v1/storage/presign/get", `${forgeBaseUrl}/`);
    forgeUrl.searchParams.set("path", key);
    const response = await fetch(forgeUrl, {
      headers: { Authorization: `Bearer ${forgeKey}` },
      cache: "no-store",
    });
    if (!response.ok) return new NextResponse("Storage backend error", { status: 502 });

    const { url } = (await response.json()) as { url?: string };
    if (!url) return new NextResponse("Empty signed URL", { status: 502 });
    return NextResponse.redirect(url, 307);
  } catch {
    return new NextResponse("Storage proxy error", { status: 502 });
  }
}

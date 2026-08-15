import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "DATASUS Releases",
    short_name: "DATASUS Releases",
    description: "Catálogo público de versões DATASUS com downloads HTTPS e releases rastreáveis.",
    start_url: "/",
    display: "standalone",
    background_color: "#f7f3eb",
    theme_color: "#075b4b",
    lang: "pt-BR",
    icons: [
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml", purpose: "any" },
      { src: "/apple-icon", sizes: "180x180", type: "image/png", purpose: "any" },
    ],
  };
}

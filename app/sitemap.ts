import type { MetadataRoute } from "next";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://datasus.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    { url: `${siteUrl}/`, lastModified: now, changeFrequency: "daily", priority: 1 },
    { url: `${siteUrl}/termos`, lastModified: now, changeFrequency: "yearly", priority: 0.5 },
    { url: `${siteUrl}/privacidade`, lastModified: now, changeFrequency: "yearly", priority: 0.5 },
  ];
}

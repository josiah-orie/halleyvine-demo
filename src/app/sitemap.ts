import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "https://halleyvine.online";
  return [{ url: base, changeFrequency: "monthly", priority: 1 }];
}

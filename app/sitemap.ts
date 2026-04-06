import type { MetadataRoute } from "next";
import { sampleNews } from "@/components/news/newsData";
import { buildAbsoluteUrl } from "@/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = ["/", "/about", "/products", "/news", "/contact"];
  const now = new Date();

  const staticEntries = staticRoutes.map((route) => ({
    url: buildAbsoluteUrl(route),
    lastModified: now,
    changeFrequency: route === "/" ? "weekly" : "monthly",
    priority: route === "/" ? 1 : 0.7,
  })) satisfies MetadataRoute.Sitemap;

  const newsEntries = sampleNews.map((article) => ({
    url: buildAbsoluteUrl(`/news/${article.slug}`),
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  return [...staticEntries, ...newsEntries];
}
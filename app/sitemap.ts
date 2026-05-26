import type { MetadataRoute } from "next";
import { getNewsSectionVisibilityService, getPublicNewsService } from "@/apiPack/service/news.service";
import { buildAbsoluteUrl } from "@/lib/seo";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes = ["/", "/about", "/products", "/contact"];
  const now = new Date();
  const { newsEnabled } = await getNewsSectionVisibilityService();
  const { news } = newsEnabled
    ? await getPublicNewsService()
    : { news: [] as Awaited<ReturnType<typeof getPublicNewsService>>["news"] };

  const staticEntries = staticRoutes.map((route) => ({
    url: buildAbsoluteUrl(route),
    lastModified: now,
    changeFrequency: route === "/" ? "weekly" : "monthly",
    priority: route === "/" ? 1 : 0.7,
  })) satisfies MetadataRoute.Sitemap;

  const newsEntries = news.map((article) => ({
    url: buildAbsoluteUrl(`/news/${article.slug}`),
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  const newsSectionEntry = newsEnabled
    ? [
      {
        url: buildAbsoluteUrl("/news"),
        lastModified: now,
        changeFrequency: "monthly" as const,
        priority: 0.7,
      },
    ]
    : [];

  return [...staticEntries, ...newsSectionEntry, ...newsEntries];
}
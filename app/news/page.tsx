import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getLocale, getTranslations } from "next-intl/server";
import NewsSection from "@/components/news/NewsSection";
import { getNewsSectionVisibilityService } from "@/apiPack/service/news.service";
import { buildPageMetadata } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const [locale, t] = await Promise.all([getLocale(), getTranslations("seo")]);

  return buildPageMetadata({
    title: t("newsTitle"),
    description: t("newsDescription"),
    path: "/news",
    locale,
    keywords: ["novedades GSAC", "noticias empresariales", "actualizaciones", "consultoria"],
  });
}

export default async function Page() {
  const { newsEnabled } = await getNewsSectionVisibilityService();
  if (!newsEnabled) {
    notFound();
  }

  return <NewsSection />;
}

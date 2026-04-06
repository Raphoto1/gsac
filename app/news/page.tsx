import type { Metadata } from "next";
import { getLocale, getTranslations } from "next-intl/server";
import NewsSection from "@/components/news/NewsSection";
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

export default function Page() {
  return <NewsSection />;
}

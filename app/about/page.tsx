import type { Metadata } from "next";
import { getLocale, getTranslations } from "next-intl/server";
import { useTranslations } from "next-intl";
import BigCardProps from "@/components/BigCardProps";
import { buildPageMetadata } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const [locale, t] = await Promise.all([getLocale(), getTranslations("seo")]);

  return buildPageMetadata({
    title: t("aboutTitle"),
    description: t("aboutDescription"),
    path: "/about",
    locale,
    keywords: ["sobre GSAC", "consultoria", "equipo", "servicios empresariales"],
  });
}

export default function Page() {
  const t = useTranslations("about");

  return (
    <div>
      <BigCardProps
        title={t("title")}
        description={t("description")}
        imageUrl='https://images.pexels.com/photos/48195/document-agreement-documents-sign-48195.jpeg'
      />
    </div>
  );
}

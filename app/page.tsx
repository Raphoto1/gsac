import type { Metadata } from "next";
import { getLocale, getTranslations } from "next-intl/server";
import Home from "@/components/home/Home";
import { buildPageMetadata } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const [locale, t] = await Promise.all([getLocale(), getTranslations("seo")]);

  return buildPageMetadata({
    title: t("homeTitle"),
    description: t("homeDescription"),
    path: "/",
    locale,
    keywords: [
      "consultoria empresarial",
      "soluciones operativas",
      "estrategia de crecimiento",
      "GSAC",
    ],
  });
}

export default function Page() {
  return <Home />;
}

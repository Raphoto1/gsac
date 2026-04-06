import type { Metadata } from "next";
import { getLocale, getTranslations } from "next-intl/server";
import Contact from "@/components/home/Contact";
import { useTranslations } from "next-intl";
import { buildPageMetadata } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const [locale, t] = await Promise.all([getLocale(), getTranslations("seo")]);

  return buildPageMetadata({
    title: t("contactTitle"),
    description: t("contactDescription"),
    path: "/contact",
    locale,
    keywords: ["contacto GSAC", "consultoria empresarial", "asesoria", "solicitar informacion"],
  });
}

export default function Page() {
  useTranslations("contact");

  return (
<div className="min-h-screen flex items-center justify-center">
      <Contact />
</div>
  );
}

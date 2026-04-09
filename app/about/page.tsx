import type { Metadata } from "next";
import { getLocale, getTranslations } from "next-intl/server";
import { useTranslations } from "next-intl";
import { AR, CL, CO, MX, UY } from "country-flag-icons/react/3x2";
import BigCardProps from "@/components/BigCardProps";
import { buildPageMetadata } from "@/lib/seo";

const operatingCountries = [
  { name: "Colombia", Flag: CO },
  { name: "Mexico", Flag: MX },
  { name: "Uruguay", Flag: UY },
  { name: "Argentina", Flag: AR },
  { name: "Chile", Flag: CL },
] as const;

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
        horizontalOrder='image-left'
        imageUrl='https://images.pexels.com/photos/48195/document-agreement-documents-sign-48195.jpeg'
      />
      <div className="bg-base-100 px-4 py-16 md:px-8 md:py-20">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-8">
          <div className="text-center">
            <h2 className="text-4xl font-bold">{t("countries.title")}</h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {operatingCountries.map(({ name, Flag }) => (
              <div
                key={name}
                className="rounded-3xl border border-base-300 bg-white px-5 py-6 text-center shadow-[0_14px_35px_rgba(15,23,42,0.06)]"
              >
                <div className="mx-auto flex w-full max-w-16 justify-center overflow-hidden rounded-lg shadow-sm ring-1 ring-base-300/70">
                  <Flag className="h-auto w-full" />
                </div>
                <p className="mt-3 text-xl font-semibold text-base-content">{name}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      <BigCardProps
        title={t("services.title")}
        description={t("services.description")}
        horizontalOrder='image-right'
        imageUrl='https://images.pexels.com/photos/48195/document-agreement-documents-sign-48195.jpeg'
        backgroundVariant={1}
      />
      <BigCardProps
        title={t("whyUs.title")}
        description={t("whyUs.description")}
        horizontalOrder='image-left'
        imageUrl='https://images.pexels.com/photos/48195/document-agreement-documents-sign-48195.jpeg'
        backgroundVariant={0}
      />
      <BigCardProps
        title={t("experience.title")}
        description={t("experience.description")}
        horizontalOrder='image-right'
        imageUrl='https://images.pexels.com/photos/48195/document-agreement-documents-sign-48195.jpeg'
        backgroundVariant={1}
      />
    </div>
  );
}

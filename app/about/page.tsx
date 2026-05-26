import type { Metadata } from "next";
import type { ComponentType } from "react";
import { getLocale, getTranslations } from "next-intl/server";
import * as FlagIcons from "country-flag-icons/react/3x2";
import ContentCardsSection from "@/components/about/ContentCardsSection";
import BigCardProps from "@/components/BigCardProps";
import { buildPageMetadata } from "@/lib/seo";
import type { AboutSectionId, AboutSectionItem } from "@/types/about-sections";
import { getAboutSectionsOrderService } from "@/apiPack/service/about-sections.service";
import {
  ABOUT_COUNTRY_LEGACY_NAME_TO_CODE,
  ABOUT_COUNTRY_OPTION_BY_CODE,
  ABOUT_COUNTRY_OPTION_BY_NAME,
  type AboutCardSectionData,
  type AboutCardSectionId,
  type LocalizedText,
} from "@/types/about-content";
import { getAboutContentService } from "@/apiPack/service/about-content.service";

const FLAG_COMPONENTS = FlagIcons as unknown as Record<string, ComponentType<{ className?: string }>>;

function normalizeCountryCode(value: string): string | null {
  const normalized = value.trim();
  const uppercase = normalized.toUpperCase();

  if (ABOUT_COUNTRY_OPTION_BY_CODE.has(uppercase)) {
    return uppercase;
  }

  const byName = ABOUT_COUNTRY_OPTION_BY_NAME.get(normalized);
  if (byName) {
    return byName.code;
  }

  const legacy = ABOUT_COUNTRY_LEGACY_NAME_TO_CODE[normalized];
  if (legacy) {
    return legacy;
  }

  return null;
}

const CARD_LAYOUT_BY_ID: Record<AboutCardSectionId, { horizontalOrder: "image-left" | "image-right"; backgroundVariant?: 0 | 1 }> = {
  intro: { horizontalOrder: "image-left" },
  mission: { horizontalOrder: "image-right", backgroundVariant: 1 },
  vision: { horizontalOrder: "image-left", backgroundVariant: 0 },
  services: { horizontalOrder: "image-right", backgroundVariant: 1 },
  whyUs: { horizontalOrder: "image-left", backgroundVariant: 0 },
  experience: { horizontalOrder: "image-right", backgroundVariant: 1 },
};

function resolveLocalizedText(value: LocalizedText, locale: "es" | "en"): string {
  return value[locale] || value[locale === "es" ? "en" : "es"];
}

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


export default async function Page() {
  const [t, locale, sections, content] = await Promise.all([
    getTranslations("about"),
    getLocale(),
    getAboutSectionsOrderService(),
    getAboutContentService(),
  ]);
  const resolvedLocale = locale === "en" ? "en" : "es";

  const visibleSections = [...sections]
    .filter((section) => section.visible)
    .sort((a, b) => a.position - b.position);

  const values = content.values.map((item) => ({
    key: item.key,
    title: resolveLocalizedText(item.title, resolvedLocale),
    description: resolveLocalizedText(item.description, resolvedLocale),
  }));

  function renderCardSection(sectionId: AboutCardSectionId, card: AboutCardSectionData) {
    const layout = CARD_LAYOUT_BY_ID[sectionId];

    return (
      <BigCardProps
        title={resolveLocalizedText(card.title, resolvedLocale)}
        description={resolveLocalizedText(card.description, resolvedLocale)}
        horizontalOrder={layout.horizontalOrder}
        imageUrl={card.imageUrl}
        backgroundVariant={layout.backgroundVariant}
      />
    );
  }

  function renderSection(section: AboutSectionItem) {
    const sectionId = section.id as AboutSectionId;

    if (sectionId === "intro") {
      return renderCardSection(sectionId, content.cards.intro);
    }

    if (sectionId === "mission") {
      return renderCardSection(sectionId, content.cards.mission);
    }

    if (sectionId === "vision") {
      return renderCardSection(sectionId, content.cards.vision);
    }

    if (sectionId === "values") {
      return <ContentCardsSection title={t("values.title")} items={values} />;
    }

    if (sectionId === "countries") {
      return (
        <div className='bg-base-200 px-4 py-16 md:px-8 md:py-20'>
          <div className='mx-auto flex w-full max-w-6xl flex-col gap-8'>
            <div className='text-center'>
              <h2 className='text-4xl font-bold'>{t("countries.title")}</h2>
            </div>
            <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-5'>
              {content.countries.map(({ name }) => {
                const code = normalizeCountryCode(name);
                const option = code ? ABOUT_COUNTRY_OPTION_BY_CODE.get(code) : null;
                const Flag = code ? FLAG_COMPONENTS[code] : undefined;

                return (
                <div key={name} className='rounded-3xl border border-base-300 bg-base-100 px-5 py-6 text-center shadow-[0_14px_35px_rgba(15,23,42,0.06)]'>
                  {Flag ? (
                    <div className='mx-auto flex w-full max-w-16 justify-center overflow-hidden rounded-lg shadow-sm ring-1 ring-base-300/70'>
                      <Flag className='h-auto w-full' />
                    </div>
                  ) : (
                    <div className='mx-auto flex h-9.5 w-full max-w-16 items-center justify-center rounded-lg bg-base-200 text-xs font-semibold text-base-content/70'>
                      {name.slice(0, 2).toUpperCase()}
                    </div>
                  )}
                  <p className='mt-3 text-xl font-semibold text-base-content'>{option?.name ?? name}</p>
                </div>
                );
              })}
            </div>
          </div>
        </div>
      );
    }

    if (sectionId === "services") {
      return renderCardSection(sectionId, content.cards.services);
    }

    if (sectionId === "whyUs") {
      return renderCardSection(sectionId, content.cards.whyUs);
    }

    return renderCardSection("experience", content.cards.experience);
  }

  return <div>{visibleSections.map((section) => <div key={section.id}>{renderSection(section)}</div>)}</div>;
}

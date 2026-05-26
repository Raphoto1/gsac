"use client";

import { useEffect, useRef, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import CaseCard from "../CaseCard";
import GeometricLinesBackground from "@/components/utils/particles/GeometricLinesBackground";
import { trackEvent } from "@/components/utils/analytics/GoogleAnalytics";
import { DEFAULT_HOME_CASES, type HomeCaseItem } from "@/types/home-cases";

async function readApiResponse<T>(response: Response): Promise<{ data: T | null; rawText: string | null }> {
  const contentType = response.headers.get("content-type") || "";

  if (contentType.includes("application/json")) {
    return { data: (await response.json()) as T, rawText: null };
  }

  return { data: null, rawText: await response.text() };
}

export default function Cases() {
  const t = useTranslations("cases");
  const locale = useLocale();
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const [cases, setCases] = useState<HomeCaseItem[]>(DEFAULT_HOME_CASES);
  const hasMoreThanFourCases = cases.length > 4;

  const desktopFeaturedLayout = [
    "h-full md:col-span-3 md:col-start-1 md:row-span-2",
    "h-full md:col-span-3 md:col-start-4 md:row-start-2 md:row-span-2",
    "h-full md:col-span-3 md:col-start-1 md:row-start-3 md:row-span-2",
    "h-full md:col-span-3 md:col-start-4 md:row-start-4 md:row-span-2",
  ];

  function getCaseCardClassName(index: number): string {
    if (cases.length <= 4) {
      return desktopFeaturedLayout[index] ?? "h-full md:col-span-3";
    }

    const isRightColumn = index % 2 === 1;
    return `h-full md:col-span-3 md:row-span-2 ${isRightColumn ? "md:col-start-4" : "md:col-start-1"}`;
  }

  useEffect(() => {
    let mounted = true;

    async function loadCases() {
      try {
        const response = await fetch("/api/page/cases", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          cache: "no-store",
        });

        if (!response.ok) {
          return;
        }

        const { data } = await readApiResponse<{ cases?: HomeCaseItem[] }>(response);
        if (mounted && Array.isArray(data?.cases) && data.cases.length) {
          setCases(data.cases);
        }
      } catch {
        // Keep defaults if the API is unavailable.
      }
    }

    loadCases();

    return () => {
      mounted = false;
    };
  }, []);

  const localizedCases = cases.map((caseItem, index) => ({
    companyName: locale === "en" ? caseItem.title.en : caseItem.title.es,
    organizationType: caseItem.organizationType,
    description: locale === "en" ? caseItem.description.en : caseItem.description.es,
    advancedDescription: locale === "en" ? caseItem.advancedDescription.en : caseItem.advancedDescription.es,
    impactItems: (locale === "en" ? caseItem.impactItems.en : caseItem.impactItems.es)
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean),
    detailsLabel: t("detailsLabel"),
    image: caseItem.image,
    className: getCaseCardClassName(index),
    style: hasMoreThanFourCases ? { gridRowStart: index + 1 } : undefined,
  }));

  useEffect(() => {
    const sectionElement = sectionRef.current;

    if (!sectionElement) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;

        if (!entry?.isIntersecting) {
          return;
        }

        trackEvent("view_success_cases_section", {
          section_name: "casos_de_exito",
          page_location: window.location.pathname,
        });

        observer.disconnect();
      },
      {
        threshold: 0.35,
      }
    );

    observer.observe(sectionElement);

    return () => observer.disconnect();
  }, []);


  return (
    <div
      ref={sectionRef}
      id='cases'
      className={`relative flex w-full flex-col items-center bg-base-200 px-4 py-10 ${hasMoreThanFourCases ? "justify-start overflow-visible" : "min-h-screen justify-center overflow-hidden"}`}
    >
      <GeometricLinesBackground />
      <h1 className='relative z-20 text-center text-4xl font-bold md:text-6xl'>{t("title")}</h1>
      <p className='relative z-20 mt-4 max-w-3xl text-center text-sm leading-relaxed text-base-content/70 md:text-base'>
        {t("description")}
      </p>
      <div className='relative z-20 grid w-full max-w-6xl grid-cols-1 gap-4 py-6 md:auto-rows-[112px] md:grid-cols-6'>
        {localizedCases.map((caseItem, index) => (
          <CaseCard key={index} {...caseItem} />
        ))}
      </div>
    </div>
  );
}

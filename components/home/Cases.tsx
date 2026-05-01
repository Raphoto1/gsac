"use client";

import { useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import CaseCard from "../CaseCard";
import GeometricLinesBackground from "@/components/utils/particles/GeometricLinesBackground";
import { trackEvent } from "@/components/utils/analytics/GoogleAnalytics";

export default function Cases() {
  const t = useTranslations("cases");
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const cases = ["case1", "case2", "case3", "case4"].map((caseKey, index) => ({
    companyName: t(`items.${caseKey}.title`),
    organizationType: t(`items.${caseKey}.organizationType`),
    description: t(`items.${caseKey}.description`),
    advancedDescription: t(`items.${caseKey}.advancedDescription`),
    impactItems: t.raw(`items.${caseKey}.impactItems`) as string[],
    detailsLabel: t("detailsLabel"),
    image: [
      "https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg",
      "https://images.pexels.com/photos/3184306/pexels-photo-3184306.jpeg",
      "https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg",
      "https://images.pexels.com/photos/3184339/pexels-photo-3184339.jpeg",
    ][index],
    className: [
      "h-full md:col-span-3 md:col-start-1 md:row-span-2",
      "h-full md:col-span-3 md:col-start-4 md:row-start-2 md:row-span-2",
      "h-full md:col-span-3 md:col-start-1 md:row-start-3 md:row-span-2",
      "h-full md:col-span-3 md:col-start-4 md:row-start-4 md:row-span-2",
    ][index],
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
      className='relative flex w-full min-h-screen flex-col items-center justify-center overflow-hidden bg-base-200 px-4 py-10'
    >
      <GeometricLinesBackground />
      <h1 className='relative z-20 text-center text-4xl font-bold md:text-6xl'>{t("title")}</h1>
      <p className='relative z-20 mt-4 max-w-3xl text-center text-sm leading-relaxed text-base-content/70 md:text-base'>
        {t("description")}
      </p>
      <div className='relative z-20 grid w-full max-w-6xl grid-cols-1 gap-4 py-6 md:auto-rows-[112px] md:grid-cols-6'>
        {cases.map((caseItem, index) => (
          <CaseCard key={index} {...caseItem} />
        ))}
      </div>
    </div>
  );
}

"use client";

import { useTranslations } from "next-intl";
import CaseCard from "../CaseCard";
import GeometricLinesBackground from "@/components/utils/particles/GeometricLinesBackground";

export default function Cases() {
  const t = useTranslations("cases");
  const cases = [
    {
      name: "Case 1",
      description: "Description for Case 1",
      image: "https://images.pexels.com/photos/3184423/pexels-photo-3184423.jpeg",
      className: "h-full md:col-span-3 md:col-start-1 md:row-span-2",
    },
    {
      name: "Case 2",
      description: "Description for Case 2",
      image: "https://images.pexels.com/photos/3184423/pexels-photo-3184423.jpeg",
      className: "h-full md:col-span-3 md:col-start-4 md:row-start-2 md:row-span-2",
    },
    {
      name: "Case 3",
      description: "Description for Case 3",
      image: "https://images.pexels.com/photos/3184423/pexels-photo-3184423.jpeg",
      className: "h-full md:col-span-3 md:col-start-1 md:row-start-3 md:row-span-2",
    },
    {
      name: "Case 4",
      description: "Description for Case 4",
      image: "https://images.pexels.com/photos/3184423/pexels-photo-3184423.jpeg",
      className: "h-full md:col-span-3 md:col-start-4 md:row-start-4 md:row-span-2",
    },
  ];


  return (
    <div className='relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-base-200 px-4 py-10'>
      <GeometricLinesBackground />
      <h1 className='relative z-20 text-center text-4xl font-bold md:text-6xl'>{t("title")}</h1>
      <div className='relative z-20 grid w-full max-w-7xl grid-cols-1 gap-4 py-6 md:auto-rows-[160px] md:grid-cols-6'>
        {cases.map((caseItem, index) => (
          <CaseCard key={index} {...caseItem} />
        ))}
      </div>
    </div>
  );
}

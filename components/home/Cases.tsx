"use client";

import { useTranslations } from "next-intl";
import CaseCard from "../CaseCard";

export default function Cases() {
  const t = useTranslations("cases");
    const cases = [
        {
            name: "Case 1",
            description: "Description for Case 1",
            image: "https://images.pexels.com/photos/3184423/pexels-photo-3184423.jpeg"
        },
        {
            name: "Case 2",
            description: "Description for Case 2",
            image: "https://images.pexels.com/photos/3184423/pexels-photo-3184423.jpeg"
        },
        {
            name: "Case 3",
            description: "Description for Case 3",
            image: "https://images.pexels.com/photos/3184423/pexels-photo-3184423.jpeg"
        },
        {
            name: "Case 4",
            description: "Description for Case 4",
            image: "https://images.pexels.com/photos/3184423/pexels-photo-3184423.jpeg"
        }
    ];


  return (
    <div className='flex min-h-screen flex-col items-center justify-center px-4 py-10'>
      <h1 className='text-center text-4xl font-bold md:text-6xl'>{t("title")}</h1>
      <div className='grid w-full max-w-7xl grid-cols-1 md:grid-cols-3 gap-4 py-6'>
        {cases.map((caseItem, index) => (
          <CaseCard key={index} {...caseItem} />
        ))}
      </div>
    </div>
  );
}

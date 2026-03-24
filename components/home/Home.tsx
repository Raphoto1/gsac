"use client";

import { useTranslations } from "next-intl";
import { LanguageSwitcher } from "@/components/utils/language/LanguageSwitcher";
import MainHeader from "./MainHeader";
import BigCard from "./BigCard";
import CompanyList from "./CompanyList";
import Cases from "./Cases";
import Contact from "./Contact";

export default function Home() {
  const t = useTranslations("home");

  return (
    <div>
      <MainHeader />
      <BigCard />
      <CompanyList />
      <Cases />
      <Contact />
    </div>
  );
}

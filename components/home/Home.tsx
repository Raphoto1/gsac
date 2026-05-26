"use client";

import { ComponentType } from "react";
import MainHeader from "./MainHeader";
import BigCard from "./BigCard";
import CompanyList from "./CompanyList";
import CompanyListClients from "./CompanyListClients";
import Cases from "./Cases";
import Contact from "./Contact";
import Team from "./Team";
import { useHomeData } from "@/hooks/useHomeData";
import type { SectionId } from "@/types/home-sections";

const SECTION_COMPONENTS: Record<SectionId, ComponentType> = {
  hero: MainHeader,
  bigcard: BigCard,
  cases: Cases,
  team: Team,
  holdings: CompanyList,
  clients: CompanyListClients,
  contact: Contact,
};

export default function Home() {
  const { sections } = useHomeData();
  const visibleSections = sections.filter((section) => section.visible);

  return (
    <div>
      {visibleSections.map((section) => {
        const SectionComponent = SECTION_COMPONENTS[section.id];
        return <SectionComponent key={section.id} />;
      })}
      {/* <HomeNewsPreview /> */}
    </div>
  );
}

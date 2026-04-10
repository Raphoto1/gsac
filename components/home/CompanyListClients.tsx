"use client";

import { createElement } from "react";
import { useTranslations } from "next-intl";

import CompanyListThreeScene from "./company-list/CompanyListThreeScene";

export type CompanyListItem = {
  name: string;
  description: string;
  logo?: string;
  relationship?: string;
  relationshipLabel?: string;
  website?: string;
  websiteLabel?: string;
  caseHref?: string;
  caseLabel?: string;
};

type CompanyListProps = {
  companies?: CompanyListItem[];
  title?: string;
  description?: string;
};

function CompanyListHeader({ title, description }: { title: string; description: string }) {
  return createElement(
    "div",
    {
      className: "text-center",
    },
    createElement(
      "h1",
      {
        className: "text-4xl font-bold md:text-6xl",
      },
      title,
    ),
    createElement(
      "p",
      {
        className: "mx-auto mt-3 max-w-3xl text-sm leading-relaxed text-base-content/70 md:text-base",
      },
      description,
    ),
  );
}

export default function CompanyList({ companies, title, description }: CompanyListProps) {
  const t = useTranslations("companiesClients");

  const resolvedCompanies: CompanyListItem[] =
    companies ??
    [
      {
        name: "Fundemex",
        description: t("items.fundemex.description"),
        logo: "/img/logos/fundemex.jpg",
        relationship: t("items.fundemex.relationship"),
        relationshipLabel: t("relationshipLabel"),
        website: t("items.fundemex.website"),
        websiteLabel: t("websiteLabel"),
      },
      {
        name: "Aldeas Infantiles SOS Colombia",
        description: t("items.aldeasInfantiles.description"),
        logo: "/img/logos/aldeas-infantiles-sos.png",
        relationship: t("items.aldeasInfantiles.relationship"),
        relationshipLabel: t("relationshipLabel"),
        website: t("items.aldeasInfantiles.website"),
        websiteLabel: t("websiteLabel"),
      },
      {
        name: "TECHO Internacional",
        description: t("items.techo.description"),
        logo: "/img/logos/techo.svg",
        relationship: t("items.techo.relationship"),
        relationshipLabel: t("relationshipLabel"),
        website: t("items.techo.website"),
        websiteLabel: t("websiteLabel"),
      },
      {
        name: "Agualongo",
        description: t("items.agualongo.description"),
        logo: "/img/logos/agualongo.png",
        relationship: t("items.agualongo.relationship"),
        relationshipLabel: t("relationshipLabel"),
        website: t("items.agualongo.website"),
        websiteLabel: t("websiteLabel"),
      },
      {
        name: "Socialab",
        description: t("items.socialab.description"),
        logo: "/img/logos/socialab.png",
        relationship: t("items.socialab.relationship"),
        relationshipLabel: t("relationshipLabel"),
        website: t("items.socialab.website"),
        websiteLabel: t("websiteLabel"),
      },
      {
        name: "Matteria",
        description: t("items.matteria.description"),
        logo: "/img/logos/matteria.png",
        relationship: t("items.matteria.relationship"),
        relationshipLabel: t("relationshipLabel"),
        website: t("items.matteria.website"),
        websiteLabel: t("websiteLabel"),
      },
      {
        name: "Territoria",
        description: t("items.territoria.description"),
        logo: "/img/logos/territoria.png",
        relationship: t("items.territoria.relationship"),
        relationshipLabel: t("relationshipLabel"),
        website: t("items.territoria.website"),
        websiteLabel: t("websiteLabel"),
      },
    ];

  const resolvedTitle = title ?? t("title");
  const resolvedDescription = description ?? t("description");

  return createElement(
    "section",
    {
      className: "relative overflow-hidden bg-white px-5 py-20 md:px-8 md:py-28",
    },
    createElement(
      "div",
      {
        className: "relative z-10 mx-auto flex w-full max-w-7xl flex-col gap-14",
      },
      createElement(CompanyListHeader, { title: resolvedTitle, description: resolvedDescription }),
      createElement(CompanyListThreeScene, { companies: resolvedCompanies }),
    ),
  );
}

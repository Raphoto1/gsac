"use client";

import { createElement } from "react";
import { useTranslations } from "next-intl";

import CompanyListThreeScene from "./company-list/CompanyListThreeScene";

export type CompanyListItem = {
  name: string;
  description: string;
  logo: string;
  website?: string;
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
        className: "mx-auto mt-2 max-w-2xl text-sm text-base-content/70 md:text-base",
      },
      description,
    ),
  );
}

export default function CompanyList({ companies, title, description }: CompanyListProps) {
  const t = useTranslations("companies");

  const resolvedCompanies: CompanyListItem[] =
    companies ??
    [
      {
        name: "GSA Financieros S.A.S.",
        description: t("items.gsaFinancieros.description"),
        logo: "https://images.pexels.com/photos/355952/pexels-photo-355952.jpeg",
        website: "https://www.gsafinancieros.com/"
      },
    ];

  const resolvedTitle = title ?? t("title");
  const resolvedDescription = description ?? t("description");
  const sectionClassName =
    resolvedCompanies.length === 1
      ? "relative overflow-hidden bg-base-100 px-5 py-8 md:px-8 md:py-8"
      : "relative overflow-hidden bg-base-100 px-5 py-16 md:px-8 md:py-20";

  return createElement(
    "section",
    {
      className: sectionClassName,
    },
    createElement("div", {
      className: "pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(13,103,154,0.12),_transparent_40%)]",
      "aria-hidden": true,
    }),
    createElement(
      "div",
      {
        className: "relative z-10 mx-auto flex w-full max-w-7xl flex-col gap-10",
      },
      createElement(CompanyListHeader, { title: resolvedTitle, description: resolvedDescription }),
      createElement(CompanyListThreeScene, { companies: resolvedCompanies }),
    ),
  );
}

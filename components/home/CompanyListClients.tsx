"use client";

import { createElement, useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import type { CompanyListItem, CompanyListProps } from "@/types/company-list";

import { DEFAULT_CLIENTS_ITEMS } from "./company-list/defaults";
import CompanyListThreeScene from "./company-list/CompanyListThreeScene";

async function readApiResponse<T>(response: Response): Promise<{ data: T | null; rawText: string | null }> {
  const contentType = response.headers.get("content-type") || "";

  if (contentType.includes("application/json")) {
    return { data: (await response.json()) as T, rawText: null };
  }

  return { data: null, rawText: await response.text() };
}

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
  const [resolvedFromApi, setResolvedFromApi] = useState<CompanyListItem[] | null>(null);

  useEffect(() => {
    if (companies) {
      setResolvedFromApi(companies);
      return;
    }

    let mounted = true;

    async function loadCompanies() {
      try {
        const response = await fetch("/api/page/company-list/clients", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          cache: "no-store",
        });

        if (!response.ok) {
          return;
        }

        const { data } = await readApiResponse<{ companies?: CompanyListItem[] }>(response);
        if (mounted && Array.isArray(data?.companies) && data.companies.length) {
          setResolvedFromApi(data.companies);
        }
      } catch {
        // Keep default values when the API is unavailable.
      }
    }

    loadCompanies();

    return () => {
      mounted = false;
    };
  }, [companies]);

  const resolvedCompanies: CompanyListItem[] =
    resolvedFromApi ??
    companies ??
    DEFAULT_CLIENTS_ITEMS;

  const resolvedTitle = title ?? t("title");
  const resolvedDescription = description ?? t("description");

  return createElement(
    "section",
    {
      className: "relative overflow-hidden bg-base-100 px-5 py-20 md:px-8 md:py-28",
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

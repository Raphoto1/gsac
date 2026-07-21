import { useState } from "react";
import Link from "next/link";
import { useLocale } from "next-intl";
import { resolveLocalizedText, type CompanyCardProps } from "@/types/company-list";

function getInitials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase() ?? "")
    .join("");
}

export default function CompanyCard({
  name,
  description,
  logo,
  relationship,
  relationshipLabel = "Relationship",
  website,
  websiteLabel = "Visit site",
  caseHref,
  caseLabel = "Ver caso",
}: CompanyCardProps) {
  const locale = useLocale() === "es" ? "es" : "en";
  const hasLogo = Boolean(logo);
  const [logoFailed, setLogoFailed] = useState(false);
  const resolvedName = resolveLocalizedText(name, locale);
  const resolvedDescription = resolveLocalizedText(description, locale);
  const resolvedRelationship = resolveLocalizedText(relationship, locale);
  const resolvedRelationshipLabel = resolveLocalizedText(relationshipLabel, locale) || (locale === "es" ? "Relación" : "Relationship");
  const resolvedWebsiteLabel = resolveLocalizedText(websiteLabel, locale) || (locale === "es" ? "Visitar sitio" : "Visit site");
  const resolvedCaseLabel = resolveLocalizedText(caseLabel, locale) || (locale === "es" ? "Ver caso" : "View case");
  const initials = getInitials(resolvedName);

  return (
    <article className="company-card-float group relative mx-auto flex w-full max-w-[18rem] flex-col items-center rounded-4xl border border-base-300 bg-base-100/98 px-5 pb-5 pt-18 text-center shadow-[0_16px_40px_rgba(15,23,42,0.08)] transition-transform duration-300 hover:-translate-y-2 hover:shadow-[0_24px_56px_rgba(15,23,42,0.14)]">
      <div className="pointer-events-none absolute inset-x-8 top-0 h-px bg-linear-to-r from-transparent via-primary/35 to-transparent" />
      <div className="pointer-events-none absolute left-1/2 top-0 h-20 w-32 -translate-x-1/2 -translate-y-1/3 rounded-full bg-primary/12 blur-2xl transition-transform duration-300 group-hover:scale-110" />

      <figure className="absolute left-1/2 top-0 flex h-20 w-42 -translate-x-1/2 -translate-y-1/2 items-center justify-center overflow-hidden rounded-[1.75rem] border border-base-300/80 bg-white px-4 py-3 shadow-xl">
        {hasLogo && !logoFailed ? (
          <img
            src={logo}
            alt={resolvedName}
            className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
            decoding="async"
            onError={() => setLogoFailed(true)}
            onLoad={() => setLogoFailed(false)}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-base-200 text-lg font-semibold tracking-[0.18em] text-primary">
            {initials}
          </div>
        )}
      </figure>

      <div className="relative z-10 flex flex-col items-center text-center">
        <h2 className="text-lg font-semibold text-base-content">{resolvedName}</h2>
        <p className="mt-2 text-sm leading-relaxed text-base-content/90">{resolvedDescription}</p>
        {resolvedRelationship ? (
          <div className="mt-4 w-full rounded-2xl border border-base-300 bg-base-100 px-3 py-2 text-left">
            <p className="text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-base-content/80">{resolvedRelationshipLabel}</p>
            <p className="mt-1 text-sm leading-relaxed text-base-content/90">{resolvedRelationship}</p>
          </div>
        ) : null}

        {website || caseHref ? (
          <div className="mt-4 flex flex-wrap justify-center gap-2">
            {caseHref ? (
              <Link className="btn btn-outline btn-primary btn-sm" href={caseHref}>
                {resolvedCaseLabel}
              </Link>
            ) : null}
            {website ? (
              <a
                className="btn btn-primary btn-sm"
                href={website}
                target="_blank"
                rel="noreferrer"
              >
                {resolvedWebsiteLabel}
              </a>
            ) : null}
          </div>
        ) : null}
      </div>
    </article>
  );
}

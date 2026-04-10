import Image from "next/image";
import Link from "next/link";

type CompanyCardProps = {
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
  const initials = getInitials(name);
  const hasLogo = Boolean(logo);

  return (
    <article className="company-card-float group relative mx-auto flex w-full max-w-[18rem] flex-col items-center rounded-4xl border border-base-300 bg-white px-5 pb-5 pt-18 text-center shadow-[0_16px_40px_rgba(15,23,42,0.08)] transition-transform duration-300 hover:-translate-y-2 hover:shadow-[0_24px_56px_rgba(15,23,42,0.14)]">
      <div className="pointer-events-none absolute inset-x-8 top-0 h-px bg-linear-to-r from-transparent via-primary/35 to-transparent" />
      <div className="pointer-events-none absolute left-1/2 top-0 h-20 w-32 -translate-x-1/2 -translate-y-1/3 rounded-full bg-primary/12 blur-2xl transition-transform duration-300 group-hover:scale-110" />

      <figure className="absolute left-1/2 top-0 flex h-20 w-[10.5rem] -translate-x-1/2 -translate-y-1/2 items-center justify-center overflow-hidden rounded-[1.75rem] border border-sky-100/80 bg-white px-4 py-3 shadow-xl">
        {hasLogo ? (
          <Image
            src={logo}
            alt={name}
            className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-105"
            width={240}
            height={240}
            sizes="168px"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-linear-to-br from-sky-100 via-white to-cyan-100 text-lg font-semibold tracking-[0.18em] text-sky-800">
            {initials}
          </div>
        )}
      </figure>

      <div className="relative z-10 flex flex-col items-center text-center">
        <h2 className="text-lg font-semibold text-base-content">{name}</h2>
        <p className="mt-2 text-sm leading-relaxed text-base-content/75">{description}</p>
        {relationship ? (
          <div className="mt-4 w-full rounded-2xl border border-sky-100 bg-sky-50/80 px-3 py-2 text-left">
            <p className="text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-sky-700/80">{relationshipLabel}</p>
            <p className="mt-1 text-sm leading-relaxed text-slate-700">{relationship}</p>
          </div>
        ) : null}

        {website || caseHref ? (
          <div className="mt-4 flex flex-wrap justify-center gap-2">
            {caseHref ? (
              <Link className="btn btn-outline btn-primary btn-sm" href={caseHref}>
                {caseLabel}
              </Link>
            ) : null}
            {website ? (
              <a
                className="btn btn-primary btn-sm"
                href={website}
                target="_blank"
                rel="noreferrer"
              >
                {websiteLabel}
              </a>
            ) : null}
          </div>
        ) : null}
      </div>
    </article>
  );
}

export type LocaleCode = "es" | "en";

export type LocalizedText = {
  es: string;
  en: string;
};

export type LocalizedValue = string | LocalizedText;

export type CompanyListItem = {
  dbId?: string;
  name: LocalizedValue;
  description: LocalizedValue;
  logo?: string;
  relationship?: LocalizedValue;
  relationshipLabel?: LocalizedValue;
  website?: string;
  websiteLabel?: LocalizedValue;
  caseHref?: string;
  caseLabel?: LocalizedValue;
};

export function isLocalizedText(value: unknown): value is LocalizedText {
  return Boolean(
    value &&
      typeof value === "object" &&
      typeof (value as { es?: unknown }).es === "string" &&
      typeof (value as { en?: unknown }).en === "string",
  );
}

export function normalizeLocalizedText(value: unknown): LocalizedText | undefined {
  if (typeof value === "string") {
    const normalized = value.trim();
    return normalized ? { es: normalized, en: normalized } : undefined;
  }

  if (!isLocalizedText(value)) {
    return undefined;
  }

  const es = value.es.trim();
  const en = value.en.trim();

  if (!es && !en) {
    return undefined;
  }

  return {
    es: es || en,
    en: en || es,
  };
}

export function resolveLocalizedText(value: LocalizedValue | undefined, locale: LocaleCode, fallbackLocale: LocaleCode = locale === "es" ? "en" : "es"): string {
  if (typeof value === "string") {
    return value;
  }

  if (!value) {
    return "";
  }

  return value[locale] || value[fallbackLocale] || "";
}

export type CompanyListProps = {
  companies?: CompanyListItem[];
  title?: string;
  description?: string;
};

export type CompanyListKind = "holdings" | "clients";

export type CompanyListResponse = {
  companies: CompanyListItem[];
};

export type CompanyCardProps = CompanyListItem;

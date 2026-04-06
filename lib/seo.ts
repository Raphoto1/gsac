import type { Metadata } from "next";

type SupportedLocale = "es" | "en";

type PageMetadataOptions = {
  title: string;
  description: string;
  path?: string;
  keywords?: string[];
  image?: string;
  locale?: string;
  type?: "website" | "article";
  robots?: Metadata["robots"];
};

function normalizeSiteUrl(rawSiteUrl?: string) {
  const fallbackUrl = "http://localhost:3000";
  const trimmedSiteUrl = rawSiteUrl?.trim();

  if (!trimmedSiteUrl) {
    return fallbackUrl;
  }

  const siteUrlWithProtocol = /^[a-z][a-z\d+.-]*:\/\//i.test(trimmedSiteUrl)
    ? trimmedSiteUrl
    : /^(localhost|127(?:\.\d{1,3}){3}|0\.0\.0\.0)(:\d+)?(\/|$)/i.test(trimmedSiteUrl)
      ? `http://${trimmedSiteUrl}`
      : `https://${trimmedSiteUrl}`;

  try {
    return new URL(siteUrlWithProtocol).origin;
  } catch {
    return fallbackUrl;
  }
}

export const siteConfig = {
  name: "GSAC",
  siteUrl: normalizeSiteUrl(process.env.NEXT_PUBLIC_SITE_URL),
  defaultDescription:
    "GSAC impulsa empresas con consultoria, soluciones operativas y acompanamiento estrategico para crecimiento sostenible.",
  defaultOgImage: "/img/logos/Logo.png",
  locales: ["es", "en"] as const,
};

function normalizePath(path: string = "/") {
  if (!path) {
    return "/";
  }

  return path.startsWith("/") ? path : `/${path}`;
}

function toOpenGraphLocale(locale?: string) {
  switch (locale as SupportedLocale | undefined) {
    case "en":
      return "en_US";
    case "es":
    default:
      return "es_ES";
  }
}

export function buildAbsoluteUrl(path: string = "/") {
  return new URL(normalizePath(path), siteConfig.siteUrl).toString();
}

export function buildFullTitle(title: string) {
  return title.includes(siteConfig.name) ? title : `${title} | ${siteConfig.name}`;
}

export function buildPageMetadata({
  title,
  description,
  path = "/",
  keywords = [],
  image = siteConfig.defaultOgImage,
  locale,
  type = "website",
  robots,
}: PageMetadataOptions): Metadata {
  const canonicalPath = normalizePath(path);
  const fullTitle = buildFullTitle(title);

  return {
    title,
    description,
    keywords,
    alternates: {
      canonical: canonicalPath,
    },
    openGraph: {
      title: fullTitle,
      description,
      url: canonicalPath,
      siteName: siteConfig.name,
      locale: toOpenGraphLocale(locale),
      type,
      images: [
        {
          url: image,
          alt: fullTitle,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [image],
    },
    robots,
  };
}

export function buildNoIndexMetadata(title: string, description: string): Metadata {
  return {
    title,
    description,
    robots: {
      index: false,
      follow: false,
      nocache: true,
      googleBot: {
        index: false,
        follow: false,
        noimageindex: true,
      },
    },
  };
}
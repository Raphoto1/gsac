import Link from "next/link";
import { getLocale, getTranslations } from "next-intl/server";
import { getGeneralInfoService } from "@/apiPack/service/general.service";
import { DEFAULT_GENERAL_INFO } from "@/types/general";

export default async function Footer() {
  const locale = await getLocale();
  const currentLocale = locale === "en" ? "en" : "es";
  const navigation = await getTranslations("navigation");
  const footer = await getTranslations("footer");

  const generalInfo = await getGeneralInfoService().catch(() => DEFAULT_GENERAL_INFO);

  return (
    <footer className="flex w-full flex-col items-center gap-6 overflow-hidden bg-base-200 px-4 py-8 text-base-content text-center sm:px-10">
      <aside className="w-full max-w-full">
        <p className="text-lg font-semibold">
          {generalInfo.companyName[currentLocale]} NIT: {generalInfo.nit}
        </p>
        <p>{generalInfo.tagline[currentLocale] || footer("tagline")}</p>
        <p className="text-sm opacity-70">
          Copyright {new Date().getFullYear()} - {generalInfo.rights[currentLocale] || footer("rights")}
        </p>
        <p className="text-xs opacity-50 mt-1">
          Designed by{" "}
          <a
            href="https://creativerafa.com"
            target="_blank"
            rel="noopener noreferrer"
            className="link link-hover"
          >
            Creative Rafa
          </a>
        </p>
      </aside>
      <nav className="flex w-full flex-col items-center gap-3 sm:flex-row sm:flex-wrap sm:justify-center">
        <Link className="link link-hover" href="/">
          {navigation("home")}
        </Link>
        <Link className="link link-hover" href="/products">
          {navigation("products")}
        </Link>
        <Link className="link link-hover" href="/about">
          {navigation("about")}
        </Link>
        <Link className="link link-hover" href="/contact">
          {navigation("contact")}
        </Link>
      </nav>
    </footer>
  );
}

import { useTranslations } from "next-intl";

export default function Footer() {
  const navigation = useTranslations("navigation");
  const footer = useTranslations("footer");

  return (
    <footer className="flex w-full flex-col items-center gap-6 overflow-hidden bg-base-200 px-4 py-8 text-base-content text-center sm:px-10">
      <aside className="w-full max-w-full">
    <p className="text-lg font-semibold" > GS Capital S.A.S.NIT: 123456789-0</p>
        <p>{footer("tagline")}</p>
        <p className="text-sm opacity-70">
          Copyright {new Date().getFullYear()} - {footer("rights")}
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
        <a className="link link-hover" href="/">
          {navigation("home")}
        </a>
        <a className="link link-hover" href="/products">
          {navigation("products")}
        </a>
        <a className="link link-hover" href="/about">
          {navigation("about")}
        </a>
        <a className="link link-hover" href="/contact">
          {navigation("contact")}
        </a>
      </nav>
    </footer>
  );
}

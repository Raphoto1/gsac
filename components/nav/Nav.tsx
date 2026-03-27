"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { RiCloseLine, RiMenu3Line } from "react-icons/ri";
import { LanguageSwitcher } from "@/components/utils/language/LanguageSwitcher";
import ThemeSwitcher from "@/components/utils/theme/ThemeSwitcher";
import Image from "next/image";

export default function Nav() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const lastScrollY = useRef(0);
  const pathname = usePathname();
  const t = useTranslations("navigation");

  const navItems = [
    { href: "/", label: t("home") },
    { href: "/about", label: t("about") },
    { href: "/news", label: t("news") },
    { href: "/products", label: t("products") },
    { href: "/contact", label: t("contact") },
  ];

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      setIsScrolled(currentScrollY > 24);

      if (currentScrollY <= 16) {
        setIsVisible(false);
      } else if (currentScrollY < lastScrollY.current) {
        setIsVisible(true);
      } else if (currentScrollY <= 80) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }

      lastScrollY.current = currentScrollY;
    };

    lastScrollY.current = window.scrollY;
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    const root = document.documentElement;

    const updateThemeState = () => {
      const theme = root.getAttribute("data-theme");
      setIsDarkMode(theme === "dark");
    };

    updateThemeState();

    const observer = new MutationObserver(updateThemeState);
    observer.observe(root, { attributes: true, attributeFilter: ["data-theme"] });

    return () => {
      observer.disconnect();
    };
  }, []);

  const linkClassName = (href: string) =>
    [
      "rounded-full px-4 py-2 text-sm font-medium transition-colors",
      pathname === href
        ? "bg-base-content text-base-100"
        : "text-base-content/80 hover:bg-base-200 hover:text-base-content",
    ].join(" ");

  const navVisible = isVisible || isMobileMenuOpen || isHovering;

  return (
    <>
      {/* Invisible hover trigger zone — desktop only */}
      <div
        className="fixed top-0 left-0 right-0 z-40 h-10 hidden md:block"
        onMouseEnter={() => setIsHovering(true)}
      />

      <header
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
        className={[
          "fixed top-0 left-0 right-0 z-50 border-b border-base-300 px-4 backdrop-blur transition-all duration-300",
          navVisible
            ? "translate-y-0 opacity-100"
            : "-translate-y-full opacity-0 pointer-events-none",
          isScrolled ? "bg-base-100/95 shadow-lg" : "bg-base-100/88 shadow-sm",
        ].join(" ")}
      >
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-3 py-3 px-0 sm:px-2">
        <div className="flex items-center gap-3">
          <Link href="/" >
            <Image
              src={isDarkMode ? "/img/logos/LogoWhite.png" : "/img/logos/Logo.png"}
              alt="GSAC Logo"
              width={150}
              height={150}
            />
          </Link>
        </div>

        <nav className="hidden items-center gap-1 md:flex">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} className={linkClassName(item.href)}>
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <div className="hidden sm:block">
            <LanguageSwitcher />
          </div>
          <ThemeSwitcher />
          <button
            type="button"
            className="btn btn-ghost btn-circle md:hidden"
            aria-label={isMobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
            onClick={() => setIsMobileMenuOpen((currentValue) => !currentValue)}
          >
            {isMobileMenuOpen ? (
              <RiCloseLine className="h-6 w-6" />
            ) : (
              <RiMenu3Line className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>

      {isMobileMenuOpen ? (
        <div className="mx-auto w-full max-w-7xl pb-4 md:hidden">
          <div className="rounded-3xl border border-base-300 bg-base-100 p-3 shadow-xl">
            <nav className="flex flex-col gap-2">
              {navItems.map((item) => (
                <Link key={item.href} href={item.href} className={linkClassName(item.href)}>
                  {item.label}
                </Link>
              ))}
            </nav>
            <div className="mt-3 border-t border-base-300 pt-3 sm:hidden">
              <LanguageSwitcher />
            </div>
          </div>
        </div>
      ) : null}
      </header>
    </>
  );
}

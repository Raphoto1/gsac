"use client";

import { useLocale } from "next-intl";
import { useTransition, useRef, useState, useEffect } from "react";
import { TbWorld } from "react-icons/tb";

export function LanguageSwitcher() {
  const locale = useLocale();
  const [isPending, startTransition] = useTransition();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const languages = [
    { code: "es", name: "Español", flag: "🇪🇸" },
    { code: "en", name: "English", flag: "🇺🇸" },
  ];

  const currentLang = languages.find((l) => l.code === locale) ?? languages[0];

  const handleLocaleChange = (newLocale: string) => {
    if (newLocale === locale) { setIsOpen(false); return; }
    setIsOpen(false);
    startTransition(async () => {
      const response = await fetch("/api/set-locale", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ locale: newLocale }),
      });
      if (response.ok) window.location.reload();
    });
  };

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen((v) => !v)}
        disabled={isPending}
        aria-label="Select language"
        aria-expanded={isOpen}
        className={`btn btn-ghost btn-circle flex items-center justify-center${isPending ? " opacity-50" : ""}`}
      >
        <TbWorld className="h-5 w-5" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-40 rounded-2xl border border-base-300 bg-base-100 shadow-xl z-50 overflow-hidden">
          {languages.map((lang) => (
            <button
              key={lang.code}
              type="button"
              onClick={() => handleLocaleChange(lang.code)}
              className={`flex w-full items-center gap-3 px-4 py-2.5 text-sm transition-colors hover:bg-base-200${
                locale === lang.code ? " font-semibold text-primary" : " text-base-content"
              }`}
            >
              <span>{lang.flag}</span>
              <span>{lang.name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import ParticleNetwork from "@/components/utils/particles/ParticleNetwork";
import { DEFAULT_BIGCARD, type BigCardData } from "@/types/home-bigcard";

async function readApiResponse<T>(response: Response): Promise<{ data: T | null; rawText: string | null }> {
  const contentType = response.headers.get("content-type") || "";

  if (contentType.includes("application/json")) {
    return { data: (await response.json()) as T, rawText: null };
  }

  return { data: null, rawText: await response.text() };
}

export default function BigCard() {
  const t = useTranslations("bigCard");
  const locale = useLocale();
  const textRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const [textVisible, setTextVisible] = useState(false);
  const [imageVisible, setImageVisible] = useState(false);
  const [content, setContent] = useState<BigCardData>(DEFAULT_BIGCARD);

  useEffect(() => {
    let mounted = true;

    async function loadBigCard() {
      try {
        const response = await fetch("/api/page/bigcard", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          cache: "no-store",
        });

        if (!response.ok) {
          return;
        }

        const { data } = await readApiResponse<{ bigCard?: BigCardData }>(response);
        if (mounted && data?.bigCard) {
          setContent(data.bigCard);
        }
      } catch {
        // Keep translation fallback when the API is unavailable.
      }
    }

    loadBigCard();

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.target === textRef.current && entry.isIntersecting) setTextVisible(true);
          if (entry.target === imageRef.current && entry.isIntersecting) setImageVisible(true);
        });
      },
      { threshold: 0.2 }
    );
    if (textRef.current) observer.observe(textRef.current);
    if (imageRef.current) observer.observe(imageRef.current);
    return () => {
      mounted = false;
      observer.disconnect();
    };
  }, []);

  const localizedTitle = locale === "en" ? content.title.en : content.title.es;
  const localizedDescription = locale === "en" ? content.description.en : content.description.es;

  return (
    <div className="hero min-h-screen bg-base-200 px-4 relative overflow-hidden">
      <ParticleNetwork color="13,103,154"/>
      <div className="hero-content flex w-full max-w-7xl flex-col gap-8 lg:flex-row-reverse">
        <div
          ref={imageRef}
          className={`w-full max-w-sm rounded-lg shadow-2xl transition-all duration-700 ease-out delay-150 ${
            imageVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-16"
          }`}
        >
          <Image
            src={content.image || DEFAULT_BIGCARD.image}
            alt="Consulting team"
            className="h-auto w-full rounded-lg"
            width={640}
            height={426}
            sizes="(max-width: 1024px) 100vw, 384px"
          />
        </div>
        <div
          ref={textRef}
          className={`text-center lg:pr-10 lg:text-left transition-all duration-700 ease-out ${
            textVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-16"
          }`}
        >
          <h1 className="text-5xl font-bold">{localizedTitle || t("title")}</h1>
          <p className="py-6 text-xl whitespace-pre-line">{localizedDescription || t("description")}</p>
        </div>
      </div>
    </div>
  );
}

"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import ParticleNetwork from "@/components/utils/particles/ParticleNetwork";

export default function BigCard() {
  const t = useTranslations("bigCard");
  const textRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const [textVisible, setTextVisible] = useState(false);
  const [imageVisible, setImageVisible] = useState(false);

  useEffect(() => {
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
    return () => observer.disconnect();
  }, []);

  return (
    <div className="hero min-h-screen bg-base-200 px-4 relative overflow-hidden">
      <ParticleNetwork />
      <div className="hero-content flex w-full max-w-7xl flex-col gap-8 lg:flex-row-reverse">
        <div
          ref={imageRef}
          className={`w-full max-w-sm rounded-lg shadow-2xl transition-all duration-700 ease-out delay-150 ${
            imageVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-16"
          }`}
        >
          <Image
            src="https://images.pexels.com/photos/3184423/pexels-photo-3184423.jpeg"
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
          <h1 className="text-5xl font-bold">{t("title")}</h1>
          <p className="py-6 text-xl">{t("description")}</p>
        </div>
      </div>
    </div>
  );
}

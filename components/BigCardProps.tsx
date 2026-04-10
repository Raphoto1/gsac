"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import GeometricLinesBackground from "@/components/utils/particles/GeometricLinesBackground";
import ParticleNetwork from "@/components/utils/particles/ParticleNetwork";

const backgroundRenderers = [
  () => <ParticleNetwork color="13,103,154" />,
  () => <GeometricLinesBackground />,
];

type BigCardPropsData = {
  title: string;
  description: string;
  secondaryDescription?: string;
  imageUrl?: string;
  horizontalOrder?: "image-right" | "image-left";
  backgroundVariant?: number;
};

function renderParagraphs(text: string, className: string) {
  return text.split(/\n\s*\n/).map((paragraph, index) => (
    <p key={`${paragraph.slice(0, 24)}-${index}`} className={className}>
      {paragraph}
    </p>
  ));
}

export default function BigCardProps({
  title,
  description,
  secondaryDescription,
  imageUrl,
  horizontalOrder = "image-right",
  backgroundVariant = 0,
}: BigCardPropsData) {
  const textRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const [textVisible, setTextVisible] = useState(false);
  const [imageVisible, setImageVisible] = useState(false);
  const isImageLeft = horizontalOrder === "image-left";
  const BackgroundRenderer = backgroundRenderers[backgroundVariant] ?? backgroundRenderers[0];

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
    <div className="hero relative min-h-screen overflow-hidden bg-base-200 px-4">
      <div className="pointer-events-none absolute inset-y-0 -left-12 -right-12 overflow-hidden md:-left-20 md:-right-20 lg:-left-24 lg:-right-24">
        <BackgroundRenderer />
      </div>
      <div className={["hero-content relative z-10 flex w-full max-w-7xl flex-col gap-8", isImageLeft ? "lg:flex-row" : "lg:flex-row-reverse"].join(" ")}>
        <div
          ref={imageRef}
          className={`w-full max-w-sm rounded-lg shadow-2xl transition-all duration-700 ease-out delay-150 lg:w-1/4 lg:max-w-none ${
            imageVisible ? "opacity-100 translate-x-0" : isImageLeft ? "opacity-0 -translate-x-16" : "opacity-0 translate-x-16"
          }`}
        >
          <Image
            src={imageUrl || "https://images.pexels.com/photos/3184423/pexels-photo-3184423.jpeg"}
            alt="Consulting team"
            className="h-auto w-full rounded-lg"
            width={640}
            height={426}
            sizes="(max-width: 1024px) 100vw, 384px"
          />
        </div>
        <div
          ref={textRef}
          className={`text-center lg:w-3/4 lg:text-left transition-all duration-700 ease-out ${isImageLeft ? "lg:pl-10" : "lg:pr-10"} ${
            textVisible ? "opacity-100 translate-x-0" : isImageLeft ? "opacity-0 translate-x-16" : "opacity-0 -translate-x-16"
          }`}
        >
          <h1 className="text-5xl font-bold">{title}</h1>
          <div className="space-y-6 py-6 text-xl leading-8 text-base-content/90">
            {renderParagraphs(description, "whitespace-pre-line")}
          </div>
          {secondaryDescription ? (
            <div className="max-w-2xl space-y-4 text-base leading-7 text-base-content/80">
              {renderParagraphs(secondaryDescription, "whitespace-pre-line")}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

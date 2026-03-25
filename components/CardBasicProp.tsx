"use client";

import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";
import {
  IoAdd,
  IoBriefcase,
  IoBusiness,
  IoClose,
  IoConstruct,
  IoGlobe,
  IoRocket,
  IoSettings,
} from "react-icons/io5";

type CardBasicProps = {
  title: string;
  description: string;
  link?: string;
  color?: "primary" | "secondary" | "accent" | "neutral";
  icon?: "business" | "briefcase" | "construct" | "globe" | "rocket" | "settings";
  delayIndex?: number;
  side?: "left" | "right";
  expandTitle?: string;
  expandText?: string;
  expandImage?: string;
};

const cardColorClassMap = {
  primary: "bg-primary text-primary-content",
  secondary: "bg-secondary text-secondary-content",
  accent: "bg-accent text-accent-content",
  neutral: "bg-neutral text-neutral-content",
} as const;

const cardIconMap = {
  business: IoBusiness,
  briefcase: IoBriefcase,
  construct: IoConstruct,
  globe: IoGlobe,
  rocket: IoRocket,
  settings: IoSettings,
} as const;

export default function CardBasicProp({
  title,
  description,
  link,
  color = "primary",
  icon = "business",
  delayIndex = 0,
  side = "left",
  expandTitle,
  expandText,
  expandImage,
}: CardBasicProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const CardIcon = cardIconMap[icon];

  const hasExpandContent = expandTitle || expandText || expandImage;

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    const currentCard = cardRef.current;
    if (!currentCard) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry) return;

        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(currentCard);
        }
      },
      { threshold: 0.2 }
    );

    observer.observe(currentCard);

    return () => {
      observer.disconnect();
    };
  }, []);

  const expandPanel = (
    <div className="flex flex-col gap-3 p-5">
      {expandImage ? (
        <div className="relative h-40 w-full overflow-hidden rounded-xl">
          <Image
            src={expandImage}
            alt={expandTitle ?? title}
            fill
            className="object-cover"
            sizes="384px"
          />
        </div>
      ) : null}
      {expandTitle ? (
        <h3 className="text-lg font-semibold">{expandTitle}</h3>
      ) : null}
      {expandText ? (
        <p className="text-sm text-base-content/80">{expandText}</p>
      ) : null}
    </div>
  );

  return (
    <div
      className={`relative w-96 transform-gpu transition-transform duration-500 ease-out ${
        isExpanded && !isMobile ? "z-40" : "z-0"
      } ${
        isExpanded && !isMobile
          ? side === "left" ? "-translate-x-3" : "translate-x-3"
          : ""
      }`}
    >
      {/* Card — z-10 stays in front */}
      <div
        ref={cardRef}
        className={`card relative z-10 w-full ${cardColorClassMap[color]} transform-gpu transition-all duration-700 ease-out ${
          !isExpanded ? "hover:-translate-y-2 hover:shadow-2xl hover:saturate-110" : ""
        } ${
          isVisible ? "translate-y-0 scale-100 opacity-100" : "translate-y-6 scale-[0.98] opacity-0"
        }`}
        style={{ transitionDelay: `${delayIndex * 90}ms` }}
      >
        <CardIcon className="absolute right-5 top-5" size={24} />
        <div className="card-body">
          <h2 className="card-title">{title}</h2>
          <p>{description}</p>
          <div className="card-actions justify-between items-center">
            {link ? (
              <Link href={link}>
                <button className="btn btn-sm">Learn More</button>
              </Link>
            ) : null}
            {hasExpandContent ? (
              <button
                type="button"
                className="btn btn-circle btn-sm btn-ghost ml-auto"
                onClick={() => setIsExpanded((prev) => !prev)}
                aria-label={isExpanded ? "Cerrar detalle" : "Ver detalle"}
              >
                {isExpanded ? <IoClose size={18} /> : <IoAdd size={18} />}
              </button>
            ) : null}
          </div>
        </div>
      </div>

      {/* Panel desktop — sale lateral, dentro del stacking context está bien */}
      {hasExpandContent && !isMobile ? (
        <div
          className={`absolute z-0 w-72 rounded-2xl bg-base-100 text-base-content shadow-xl overflow-hidden transition-all duration-500 ease-out ${
            side === "left"
              ? isExpanded
                ? "translate-x-0 opacity-100 pointer-events-auto"
                : "-translate-x-full opacity-0 pointer-events-none"
              : isExpanded
              ? "translate-x-0 opacity-100 pointer-events-auto"
              : "translate-x-full opacity-0 pointer-events-none"
          }`}
          style={side === "left" ? { top: 0, left: "100%" } : { top: 0, right: "100%" }}
        >
          {expandPanel}
        </div>
      ) : null}

      {/* Panel móvil — in-flow: se despliega hacia abajo sin z-index */}
      {hasExpandContent && isMobile ? (
        <div
          className={`overflow-hidden rounded-b-2xl bg-base-100 text-base-content shadow-xl transition-all duration-500 ease-out ${
            isExpanded ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          {expandPanel}
        </div>
      ) : null}
    </div>
  );
}

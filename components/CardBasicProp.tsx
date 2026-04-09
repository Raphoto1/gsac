"use client";

import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";
import Modal from "@/components/utils/modal/Modal";
import {
  IoAdd,
  IoBriefcase,
  IoBusiness,
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
  expandTitle,
  expandText,
  expandImage,
}: CardBasicProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const CardIcon = cardIconMap[icon];

  const hasExpandContent = expandTitle || expandText || expandImage;

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
    <div className="flex max-h-[70vh] flex-col gap-4 overflow-y-auto pr-1">
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
      {expandText ? (
        <p className="whitespace-pre-line text-sm leading-6 text-base-content/80">{expandText}</p>
      ) : null}
    </div>
  );

  return (
    <div className="relative w-full max-w-96 transform-gpu transition-all duration-500 ease-out">
      <div
        ref={cardRef}
        className={`company-card-float relative z-10 w-full rounded-4xl bg-white text-base-content shadow-[0_16px_40px_rgba(15,23,42,0.08)] transform-gpu transition-all duration-700 ease-out ${
          "hover:-translate-y-2 hover:shadow-2xl hover:saturate-110"
        } ${
          isVisible ? "translate-y-0 scale-100 opacity-100" : "translate-y-6 scale-[0.98] opacity-0"
        }`}
        style={{ transitionDelay: `${delayIndex * 90}ms` }}
      >
        <div className="pointer-events-none absolute inset-x-8 top-0 h-px bg-linear-to-r from-transparent via-primary/35 to-transparent" />
        <div className={`absolute left-1/2 top-1 flex h-22 w-22 -translate-x-1/2 -translate-y-1/3 md:-translate-y-1/2 items-center justify-center rounded-full border-4 border-white shadow-xl ${cardColorClassMap[color]}`}>
          <CardIcon size={28} />
        </div>

        <div className="flex flex-col px-6 pb-6 pt-14 text-center">
          <h2 className="text-lg font-semibold">{title}</h2>
          <p className="mt-2 text-sm leading-relaxed text-base-content/75">{description}</p>
          <div className="mt-5 flex items-center justify-between gap-3">
            {link ? (
              <Link href={link}>
                <button className="btn btn-sm">Learn More</button>
              </Link>
            ) : <Link href='/contact'>
                <button className="btn btn-sm">Contactanos</button>
              </Link>}
            {hasExpandContent ? (
              <button
                type="button"
                className="btn btn-circle btn-sm btn-ghost ml-auto"
                onClick={() => setIsModalOpen(true)}
                aria-label="Ver detalle"
              >
                <IoAdd size={18} />
              </button>
            ) : null}
          </div>
        </div>
      </div>

      {hasExpandContent ? (
        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={expandTitle ?? title}>
          {expandPanel}
        </Modal>
      ) : null}
    </div>
  );
}

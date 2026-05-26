"use client";

import { useState } from "react";
import {
  RiFileCopyLine,
  RiLinkedinFill,
  RiShareForwardLine,
  RiTwitterXFill,
  RiWhatsappFill,
} from "react-icons/ri";
import { buildAbsoluteUrl } from "@/lib/seo";

type NewsShareButtonsProps = {
  title: string;
  path: string;
  locale?: "es" | "en";
};

export default function NewsShareButtons({ title, path, locale = "es" }: NewsShareButtonsProps) {
  const [copied, setCopied] = useState(false);
  const articleUrl = buildAbsoluteUrl(path);
  const dictionary =
    locale === "en"
      ? {
        share: "Share",
        whatsapp: "Share on WhatsApp",
        linkedin: "Share on LinkedIn",
        x: "Share on X",
        copyAria: "Copy article link",
        copy: "Copy",
        copied: "Copied",
      }
      : {
        share: "Compartir",
        whatsapp: "Compartir por WhatsApp",
        linkedin: "Compartir en LinkedIn",
        x: "Compartir en X",
        copyAria: "Copiar enlace del articulo",
        copy: "Copiar",
        copied: "Copiado",
      };

  const encodedUrl = encodeURIComponent(articleUrl);
  const encodedTitle = encodeURIComponent(title);

  const links = [
    {
      href: `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`,
      label: dictionary.whatsapp,
      icon: RiWhatsappFill,
    },
    {
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
      label: dictionary.linkedin,
      icon: RiLinkedinFill,
    },
    {
      href: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`,
      label: dictionary.x,
      icon: RiTwitterXFill,
    },
  ];

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(articleUrl);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className="mt-4 flex flex-wrap items-center gap-2">
      <span className="inline-flex items-center gap-1 text-xs font-medium text-base-content/70">
        <RiShareForwardLine className="h-4 w-4" />
        {dictionary.share}
      </span>

      {links.map((item) => {
        const Icon = item.icon;

        return (
          <a
            key={item.label}
            href={item.href}
            target="_blank"
            rel="noreferrer"
            aria-label={item.label}
            className="btn btn-ghost btn-xs"
          >
            <Icon className="h-4 w-4" />
          </a>
        );
      })}

      <button
        type="button"
        className="btn btn-ghost btn-xs"
        onClick={handleCopy}
        aria-label={dictionary.copyAria}
      >
        <RiFileCopyLine className="h-4 w-4" />
        {copied ? dictionary.copied : dictionary.copy}
      </button>
    </div>
  );
}

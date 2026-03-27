"use client";

import { useMemo, useState } from "react";
import {
  RiFileCopyLine,
  RiLinkedinFill,
  RiShareForwardLine,
  RiTwitterXFill,
  RiWhatsappFill,
} from "react-icons/ri";

type NewsShareButtonsProps = {
  title: string;
  path: string;
};

export default function NewsShareButtons({ title, path }: NewsShareButtonsProps) {
  const [copied, setCopied] = useState(false);

  const articleUrl = useMemo(() => {
    if (typeof window === "undefined") {
      return path;
    }

    return `${window.location.origin}${path}`;
  }, [path]);

  const encodedUrl = encodeURIComponent(articleUrl);
  const encodedTitle = encodeURIComponent(title);

  const links = [
    {
      href: `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`,
      label: "Compartir por WhatsApp",
      icon: RiWhatsappFill,
    },
    {
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
      label: "Compartir en LinkedIn",
      icon: RiLinkedinFill,
    },
    {
      href: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`,
      label: "Compartir en X",
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
        Compartir
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
        aria-label="Copiar enlace del articulo"
      >
        <RiFileCopyLine className="h-4 w-4" />
        {copied ? "Copiado" : "Copiar"}
      </button>
    </div>
  );
}

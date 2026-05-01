import React from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";

export default function MainHeader() {
  const t = useTranslations("home");
  const impactItems = [t("impact.projects"), t("impact.clients"), t("impact.sectors")];

  return (
    <div
      className='hero min-h-screen'
      style={{
        backgroundImage: "url(https://images.pexels.com/photos/3183197/pexels-photo-3183197.jpeg)",
      }}>
      <div className='hero-overlay'></div>
      <div className='flex w-full justify-center px-4 text-center text-neutral-content md:justify-end md:pr-24'>
        <div className='flex w-full max-w-xl flex-col items-center'>
          <Image
            src="/img/logos/LogoWhite.png"
            alt="GSAC Logo"
            width={1080}
            height={433}
            priority
            className='h-auto w-full max-w-135'
          />
          <p className='mb-2 text-4xl font-bold'>{t("welcome")}</p>
          <p className='text-lg'>{t("description")}</p>
          <div className='mt-6 flex flex-wrap justify-center gap-3 text-sm font-semibold uppercase tracking-[0.18em] text-neutral-content/90 md:justify-center'>
            {impactItems.map((item) => (
              <span key={item} className='rounded-full border border-neutral-content/30 bg-black/15 px-4 py-2 backdrop-blur-sm'>
                {item}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

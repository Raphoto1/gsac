import React from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
export default function MainHeader() {
  const t = useTranslations("home");

  return (
    <div
      className='hero min-h-screen'
      style={{
        backgroundImage: "url(https://images.pexels.com/photos/3183197/pexels-photo-3183197.jpeg)",
      }}>
      <div className='hero-overlay'></div>
      <div className='flex w-full justify-center md:justify-end md:pr-50 text-neutral-content text-center'>
        <div className='max-w-md'>
          <Image src="/img/logos/LogoWhite.png" alt="GSAC Logo" width={350} height={350} />
          <p className='mb-2 text-4xl font-bold'>{t("welcome")}</p>
          <p className='text-lg'>{t("description")}</p>
        </div>
      </div>
    </div>
  );
}

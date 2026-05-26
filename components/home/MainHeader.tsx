import { useEffect, useState } from "react";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { DEFAULT_HERO, type HeroData } from "@/types/home-hero";

async function readApiResponse<T>(response: Response): Promise<{ data: T | null; rawText: string | null }> {
  const contentType = response.headers.get("content-type") || "";

  if (contentType.includes("application/json")) {
    return { data: (await response.json()) as T, rawText: null };
  }

  return { data: null, rawText: await response.text() };
}

export default function MainHeader() {
  const t = useTranslations("home");
  const locale = useLocale();
  const [hero, setHero] = useState<HeroData>(DEFAULT_HERO);

  useEffect(() => {
    let mounted = true;

    async function loadHero() {
      try {
        const response = await fetch("/api/page/hero", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          cache: "no-store",
        });

        if (!response.ok) {
          return;
        }

        const { data } = await readApiResponse<{ hero?: HeroData }>(response);
        if (mounted && data?.hero) {
          setHero(data.hero);
        }
      } catch {
        // Keep translations/defaults when the API is unavailable.
      }
    }

    loadHero();

    return () => {
      mounted = false;
    };
  }, []);

  const localizedWelcome = locale === "en" ? hero.welcome.en : hero.welcome.es;
  const localizedDescription = locale === "en" ? hero.description.en : hero.description.es;
  const impactItems = [
    locale === "en" ? hero.impact1.en : hero.impact1.es,
    locale === "en" ? hero.impact2.en : hero.impact2.es,
    locale === "en" ? hero.impact3.en : hero.impact3.es,
  ];
  const backgroundImage = hero.backgroundImage || DEFAULT_HERO.backgroundImage;

  return (
    <div
      className='hero min-h-screen'
      style={{
        backgroundImage: `url(${backgroundImage})`,
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
          <p className='mb-2 text-4xl font-bold'>{localizedWelcome || t("welcome")}</p>
          <p className='text-lg'>{localizedDescription || t("description")}</p>
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

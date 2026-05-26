import { DEFAULT_HERO, type HeroData, type HeroResponse } from "@/types/home-hero";
import { getHomeHeroFromDb, upsertHomeHeroInDb, type HomeHeroRecord } from "../dao/hero.dao";

type HeroPayload = {
  hero?: unknown;
};

export class HeroValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "HeroValidationError";
  }
}

function normalizeLocalizedText(value: unknown, fieldName: string) {
  if (!value || typeof value !== "object") {
    throw new HeroValidationError(`El campo ${fieldName} debe ser un objeto válido.`);
  }

  const es = (value as { es?: unknown }).es;
  const en = (value as { en?: unknown }).en;

  if (typeof es !== "string" || typeof en !== "string") {
    throw new HeroValidationError(`El campo ${fieldName} debe tener textos en español e inglés.`);
  }

  if (!es.trim() || !en.trim()) {
    throw new HeroValidationError(`El campo ${fieldName} no puede estar vacío.`);
  }

  return { es: es.trim(), en: en.trim() };
}

function mapRecordToHero(record: HomeHeroRecord | null): HeroData {
  if (!record) {
    return DEFAULT_HERO;
  }

  return {
    welcome: {
      es: record.welcomeEs,
      en: record.welcomeEn,
    },
    description: {
      es: record.descriptionEs,
      en: record.descriptionEn,
    },
    backgroundImage: record.backgroundImage || DEFAULT_HERO.backgroundImage,
    impact1: {
      es: record.impact1Es,
      en: record.impact1En,
    },
    impact2: {
      es: record.impact2Es,
      en: record.impact2En,
    },
    impact3: {
      es: record.impact3Es,
      en: record.impact3En,
    },
  };
}

function normalizePayload(payload: unknown): HeroData {
  if (!payload || typeof payload !== "object" || !("hero" in payload)) {
    throw new HeroValidationError("Payload inválido.");
  }

  const maybeHero = (payload as HeroPayload).hero;
  if (!maybeHero || typeof maybeHero !== "object") {
    throw new HeroValidationError("El campo hero debe ser un objeto válido.");
  }

  const welcome = normalizeLocalizedText((maybeHero as { welcome?: unknown }).welcome, "welcome");
  const description = normalizeLocalizedText((maybeHero as { description?: unknown }).description, "description");
  const impact1 = normalizeLocalizedText((maybeHero as { impact1?: unknown }).impact1, "impact1");
  const impact2 = normalizeLocalizedText((maybeHero as { impact2?: unknown }).impact2, "impact2");
  const impact3 = normalizeLocalizedText((maybeHero as { impact3?: unknown }).impact3, "impact3");
  const backgroundImageValue = (maybeHero as { backgroundImage?: unknown }).backgroundImage;
  const backgroundImage = typeof backgroundImageValue === "string" ? backgroundImageValue.trim() : "";

  return {
    welcome,
    description,
    backgroundImage: backgroundImage || DEFAULT_HERO.backgroundImage,
    impact1,
    impact2,
    impact3,
  };
}

export async function getHomeHeroService(): Promise<HeroResponse> {
  const record = await getHomeHeroFromDb();
  return { hero: mapRecordToHero(record) };
}

export async function updateHomeHeroService(payload: unknown): Promise<HeroResponse> {
  const normalized = normalizePayload(payload);
  const record = await upsertHomeHeroInDb({
    welcomeEs: normalized.welcome.es,
    welcomeEn: normalized.welcome.en,
    descriptionEs: normalized.description.es,
    descriptionEn: normalized.description.en,
    backgroundImage: normalized.backgroundImage,
    impact1Es: normalized.impact1.es,
    impact1En: normalized.impact1.en,
    impact2Es: normalized.impact2.es,
    impact2En: normalized.impact2.en,
    impact3Es: normalized.impact3.es,
    impact3En: normalized.impact3.en,
  });

  return { hero: mapRecordToHero(record) };
}
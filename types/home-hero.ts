import type { LocalizedText } from "./home-bigcard";

export type HeroData = {
  welcome: LocalizedText;
  description: LocalizedText;
  backgroundImage: string;
  impact1: LocalizedText;
  impact2: LocalizedText;
  impact3: LocalizedText;
};

export type HeroLocalizedField = "welcome" | "description" | "impact1" | "impact2" | "impact3";

export const DEFAULT_HERO: HeroData = {
  welcome: {
    es: "Estrategia financiera para crecer con impacto",
    en: "Financial strategy for impact-driven growth",
  },
  description: {
    es: "Acompañamos a organizaciones, empresas y actores del desarrollo con estructuración financiera, fundraising y proyectos de inversión sostenibles.",
    en: "We support organizations, companies, and development actors with financial structuring, fundraising, and sustainable investment projects.",
  },
  backgroundImage: "https://images.pexels.com/photos/3183197/pexels-photo-3183197.jpeg",
  impact1: { es: "120+ proyectos", en: "120+ projects" },
  impact2: { es: "40+ clientes", en: "40+ clients" },
  impact3: { es: "12 sectores", en: "12 industries" },
};

export type HeroResponse = {
  hero: HeroData;
};
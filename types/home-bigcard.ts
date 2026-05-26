export type LocalizedText = {
  es: string;
  en: string;
};

export type BigCardData = {
  title: LocalizedText;
  description: LocalizedText;
  image: string;
};

export type BigCardLocalizedField = "title" | "description";

export const DEFAULT_BIGCARD: BigCardData = {
  title: { es: "Nuestro Enfoque", en: "Our Approach" },
  description: {
    es: "GS Capital acompaña a organizaciones de impacto en la estructuración, fortalecimiento y ejecución de su estrategia financiera.",
    en: "GS Capital supports impact organizations in structuring, strengthening, and executing their financial strategy.",
  },
  image: "https://images.pexels.com/photos/3184423/pexels-photo-3184423.jpeg",
};

export type BigCardResponse = {
  bigCard: BigCardData;
};
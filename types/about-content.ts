import { countries as COUNTRY_CODES } from "country-flag-icons";

export type LocalizedText = {
  es: string;
  en: string;
};

export const ABOUT_CARD_SECTION_IDS = [
  "intro",
  "mission",
  "vision",
  "services",
  "whyUs",
  "experience",
] as const;

export type AboutCardSectionId = (typeof ABOUT_CARD_SECTION_IDS)[number];

export type AboutCardSectionData = {
  title: LocalizedText;
  description: LocalizedText;
  imageUrl: string;
};

export type AboutValueData = {
  key: string;
  title: LocalizedText;
  description: LocalizedText;
};

export type AboutCountryData = {
  name: string;
};

export type AboutCountryOption = {
  code: string;
  name: string;
};

export type AboutContentData = {
  cards: Record<AboutCardSectionId, AboutCardSectionData>;
  values: AboutValueData[];
  countries: AboutCountryData[];
};

export const DEFAULT_ABOUT_CARDS: Record<AboutCardSectionId, AboutCardSectionData> = {
  intro: {
    title: { es: "Acerca de nosotros", en: "About Us" },
    description: {
      es: "GS Capital acompana a organizaciones de impacto en la estructuracion, fortalecimiento y ejecucion de su estrategia financiera, integrando consultoria especializada, diseno de modelos de sostenibilidad, estructuracion de proyectos de inversion y estrategias de fundraising.\n\nEl objetivo es alinear su mision social con una capacidad real de operacion, crecimiento y escalabilidad en el tiempo.",
      en: "GS Capital supports impact organizations in structuring, strengthening, and executing their financial strategy by integrating specialized consulting, sustainability model design, investment project structuring, and fundraising strategies.\n\nThe goal is to align their social mission with a real capacity for operation, growth, and scalability over time.",
    },
    imageUrl: "https://images.pexels.com/photos/48195/document-agreement-documents-sign-48195.jpeg",
  },
  mission: {
    title: { es: "Mision", en: "Mission" },
    description: {
      es: "Acompanhar a organizaciones, empresas y actores del ecosistema de desarrollo en la estructuracion, fortalecimiento y ejecucion de su estrategia financiera, integrando consultoria, fundraising y estructuracion de planes de inversion, con el fin de construir modelos sostenibles que permitan crecer, escalar y generar impacto real en el tiempo.",
      en: "To support organizations, companies, and actors within the development ecosystem in structuring, strengthening, and executing their financial strategy by integrating consulting, fundraising, and investment plan structuring, with the aim of building sustainable models that enable growth, scalability, and real long-term impact.",
    },
    imageUrl: "https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg",
  },
  vision: {
    title: { es: "Vision", en: "Vision" },
    description: {
      es: "Ser una firma referente en America Latina en la estructuracion de soluciones financieras para organizaciones y empresas que operan en contextos de desarrollo, reconocida por su capacidad de conectar estrategia, inversiones, capital e impacto.",
      en: "To be a leading firm in Latin America in structuring financial solutions for organizations and companies operating in development contexts, recognized for its ability to connect strategy, investments, capital, and impact, and for transforming the way purpose-driven initiatives are designed, financed, and scaled.",
    },
    imageUrl: "https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg",
  },
  services: {
    title: { es: "Que servicio especifico les prestamos?", en: "What specific service do we provide?" },
    description: {
      es: "GS Capital presta servicios de consultoria, asesoria y estructuracion financiera para ONGs, fundaciones y organizaciones de impacto.",
      en: "GS Capital provides consulting, advisory, and financial structuring services for NGOs, foundations, and impact organizations.",
    },
    imageUrl: "https://images.pexels.com/photos/48195/document-agreement-documents-sign-48195.jpeg",
  },
  whyUs: {
    title: { es: "Por que elegirnos?", en: "Why choose us?" },
    description: {
      es: "GS Capital combina el rigor de una firma financiera con un entendimiento profundo de organizaciones que operan en contextos de desarrollo.",
      en: "GS Capital combines the rigor of a financial firm with a deep understanding of organizations operating in development contexts.",
    },
    imageUrl: "https://images.pexels.com/photos/48195/document-agreement-documents-sign-48195.jpeg",
  },
  experience: {
    title: { es: "Nuestra Experiencia y Origen", en: "Our Experience and Origin" },
    description: {
      es: "GS Capital opera como un spin-off de GSA Financieros S.A.S., firma colombiana fundada en 2013 con una trayectoria consolidada en asesoria bancaria y servicios especializados para el sector financiero.",
      en: "GS Capital operates as a spin-off of GSA Financieros S.A.S., a Colombian firm founded in 2013 with a solid track record in banking advisory and specialized services for the financial sector.",
    },
    imageUrl: "https://images.pexels.com/photos/48195/document-agreement-documents-sign-48195.jpeg",
  },
};

export const DEFAULT_ABOUT_VALUES: AboutValueData[] = [
  {
    key: "financialRigor",
    title: { es: "Rigor financiero", en: "Financial rigor" },
    description: {
      es: "Aplicamos estandares tecnicos propios de la industria financiera en cada proceso.",
      en: "We apply technical standards drawn from the financial industry in every process.",
    },
  },
  {
    key: "executionFocus",
    title: { es: "Enfoque en ejecucion", en: "Execution focus" },
    description: {
      es: "No nos limitamos al diagnostico. Disenamos soluciones que pueden implementarse en contextos reales.",
      en: "We do not stop at diagnosis. We design solutions that can be implemented in real contexts.",
    },
  },
  {
    key: "contextUnderstanding",
    title: { es: "Comprension del contexto", en: "Contextual understanding" },
    description: {
      es: "Entendemos las dinamicas del sector social, empresarial y de desarrollo.",
      en: "We understand the dynamics of the social, business, and development sectors.",
    },
  },
  {
    key: "sustainability",
    title: { es: "Sostenibilidad como principio", en: "Sustainability as a principle" },
    description: {
      es: "Promovemos modelos financieros que aseguren la continuidad de las organizaciones en el tiempo.",
      en: "We promote financial models that ensure organizations can endure over time.",
    },
  },
  {
    key: "strategyCapitalAlignment",
    title: { es: "Alineacion entre estrategia y capital", en: "Alignment between strategy and capital" },
    description: {
      es: "Conectamos los objetivos estrategicos con estructuras financieras coherentes.",
      en: "We connect our clients' strategic objectives with coherent financial structures.",
    },
  },
  {
    key: "longTermRelationships",
    title: { es: "Relaciones de largo plazo", en: "Long-term relationships" },
    description: {
      es: "Construimos relaciones basadas en confianza, confidencialidad y acompanamiento continuo.",
      en: "We build relationships based on trust, confidentiality, and ongoing support.",
    },
  },
];

export const DEFAULT_ABOUT_COUNTRIES: AboutCountryData[] = [
  { name: "Colombia" },
  { name: "Mexico" },
  { name: "Uruguay" },
  { name: "Argentina" },
  { name: "Chile" },
];

const COUNTRY_NAME_RESOLVER = new Intl.DisplayNames(["en"], { type: "region" });

function resolveCountryName(code: string): string {
  try {
    return COUNTRY_NAME_RESOLVER.of(code) ?? code;
  } catch {
    return code;
  }
}

export const ABOUT_COUNTRY_OPTIONS: AboutCountryOption[] = [
  ...COUNTRY_CODES.map((code) => ({
    code,
    name: resolveCountryName(code),
  })),
].sort((a, b) => a.name.localeCompare(b.name, "en"));

export const ABOUT_COUNTRY_OPTION_BY_CODE = new Map(
  ABOUT_COUNTRY_OPTIONS.map((option) => [option.code, option])
);

export const ABOUT_COUNTRY_OPTION_BY_NAME = new Map(
  ABOUT_COUNTRY_OPTIONS.map((option) => [option.name, option])
);

export const ABOUT_COUNTRY_LEGACY_NAME_TO_CODE: Record<string, string> = {
  Colombia: "CO",
  Mexico: "MX",
  Uruguay: "UY",
  Argentina: "AR",
  Chile: "CL",
};

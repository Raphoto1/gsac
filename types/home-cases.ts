import type { LocalizedText } from "./home-bigcard";

export type HomeCaseItem = {
  id: number;
  title: LocalizedText;
  organizationType: string;
  description: LocalizedText;
  advancedDescription: LocalizedText;
  impactItems: LocalizedText;
  image: string;
};

export type HomeCasesData = {
  cases: HomeCaseItem[];
};

export const DEFAULT_HOME_CASES: HomeCaseItem[] = [
  {
    id: 1,
    title: { es: "Optimización de fundraising y performance F2F", en: "Fundraising & F2F Performance Optimization" },
    organizationType: "ONG",
    description: { es: "ONG internacional en Colombia con desafíos en eficiencia del canal face-to-face.", en: "International NGO in Colombia facing face-to-face channel efficiency challenges." },
    advancedDescription: {
      es: "Problema / reto\nLa organización contaba con una base relevante de donantes, pero enfrentaba desafíos en la eficiencia del canal face-to-face (F2F).\n\n¿Qué hizo GS Capital?\nDiagnóstico integral del canal F2F.\nAnálisis de indicadores clave.\nDiseño de un plan de mejora en performance.\n\nResultado\nIdentificación de oportunidades claras de reducción de costos de adquisición.",
      en: "Challenge\nThe organization had a relevant donor base, but faced efficiency challenges in its face-to-face (F2F) channel.\n\nWhat GS Capital did\nDelivered a full diagnosis of the F2F channel.\nAnalyzed core indicators.\nDesigned a performance improvement plan.\n\nResult\nClear opportunities were identified to reduce acquisition costs.",
    },
    impactItems: { es: "Menor CPA, Modelo KPI, Ruta escalable", en: "Lower CPA, KPI Model, Scalable Path" },
    image: "https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg",
  },
  {
    id: 2,
    title: { es: "Estructuración de estrategia financiera y fundraising regional", en: "Regional financial strategy and fundraising structuring" },
    organizationType: "ONG",
    description: { es: "ONG internacional en América Latina que necesitaba fortalecer su estructura financiera.", en: "International NGO in Latin America needing stronger financial structure." },
    advancedDescription: {
      es: "Problema / reto\nLa organización necesitaba fortalecer su estructura financiera y capacidad de recaudo a nivel regional.\n\n¿Qué hizo GS Capital?\nAcompañamiento en estructuración de estrategia financiera.\nDiseño de lineamientos de fundraising.\nApoyo en planificación financiera.\n\nResultado\nMayor claridad en el modelo financiero regional.",
      en: "Challenge\nThe organization needed to strengthen its financial structure and fundraising capacity at a regional level.\n\nWhat GS Capital did\nSupported financial strategy structuring.\nDesigned fundraising guidelines.\nProvided financial planning support.\n\nResult\nGreater clarity was achieved in the regional financial model.",
    },
    impactItems: { es: "Visión regional, Fundraising, Proyecciones", en: "Regional view, Fundraising, Forecasting" },
    image: "https://images.pexels.com/photos/3184306/pexels-photo-3184306.jpeg",
  },
  {
    id: 3,
    title: { es: "Estructuración de proyecto de impacto y modelo financiero", en: "Impact project structuring and financial model" },
    organizationType: "Startup",
    description: { es: "Iniciativa de desarrollo territorial que requería una estructuración financiera clara.", en: "Territorial development initiative requiring clear financial structuring." },
    advancedDescription: {
      es: "Problema / reto\nEl proyecto requería una estructuración financiera clara para viabilizar su implementación.\n\n¿Qué hizo GS Capital?\nConstrucción del modelo financiero del proyecto.\nDefinición de necesidades de capital.\nAlineación entre impacto y viabilidad financiera.\n\nResultado\nProyecto estructurado financieramente y listo para búsqueda de capital.",
      en: "Challenge\nThe project required a clear financial structure to enable implementation.\n\nWhat GS Capital did\nBuilt the project's financial model.\nDefined capital needs.\nAligned impact with financial viability.\n\nResult\nThe project was financially structured and ready for capital raising.",
    },
    impactItems: { es: "Modelo financiero, Capital, Sostenibilidad", en: "Financial model, Capital, Sustainability" },
    image: "https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg",
  },
  {
    id: 4,
    title: { es: "Diagnóstico financiero y estructuración estratégica", en: "Financial diagnosis and strategic structuring" },
    organizationType: "Pyme",
    description: { es: "Empresa u organización en crecimiento que enfrentaba expansión sin estructura financiera clara.", en: "Growing company or organization facing expansion without a clear financial structure." },
    advancedDescription: {
      es: "Problema / reto\nLa organización enfrentaba crecimiento sin una estructura financiera clara.\n\n¿Qué hizo GS Capital?\nDiagnóstico financiero integral.\nConstrucción de modelo financiero.\nDefinición de escenarios de crecimiento.\n\nResultado\nHoja de ruta para crecimiento estructurado.",
      en: "Challenge\nThe organization was growing without a clear financial structure.\n\nWhat GS Capital did\nConducted a comprehensive financial diagnosis.\nBuilt a financial model.\nDefined growth scenarios.\n\nResult\nA roadmap for structured growth was created.",
    },
    impactItems: { es: "Diagnóstico, Escenarios, Hoja de ruta", en: "Diagnosis, Scenarios, Roadmap" },
    image: "https://images.pexels.com/photos/3184339/pexels-photo-3184339.jpeg",
  },
];

export type HomeCasesResponse = {
  cases: HomeCaseItem[];
};
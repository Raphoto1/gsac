export const ABOUT_SECTION_IDS = [
  "intro",
  "mission",
  "vision",
  "values",
  "countries",
  "services",
  "whyUs",
  "experience",
] as const;

export type AboutSectionId = (typeof ABOUT_SECTION_IDS)[number];

export type AboutSectionItem = {
  id: AboutSectionId;
  label: string;
  fixed: boolean;
  visible: boolean;
  position: number;
};

export type AboutSectionMeta = {
  id: AboutSectionId;
  label: string;
  fixed: boolean;
  visible: boolean;
};

export type AboutSectionOrderResponseItem = AboutSectionMeta & { position: number };

export const ABOUT_SECTION_LABELS: Record<AboutSectionId, string> = {
  intro: "Intro",
  mission: "Misión",
  vision: "Visión",
  values: "Valores",
  countries: "Países",
  services: "Servicios",
  whyUs: "¿Por qué nosotros?",
  experience: "Experiencia",
};

export const DEFAULT_ABOUT_SECTION_ORDER: AboutSectionItem[] = [
  { id: "intro", label: ABOUT_SECTION_LABELS.intro, fixed: false, visible: true, position: 1 },
  { id: "mission", label: ABOUT_SECTION_LABELS.mission, fixed: false, visible: true, position: 2 },
  { id: "vision", label: ABOUT_SECTION_LABELS.vision, fixed: false, visible: true, position: 3 },
  { id: "values", label: ABOUT_SECTION_LABELS.values, fixed: false, visible: true, position: 4 },
  { id: "countries", label: ABOUT_SECTION_LABELS.countries, fixed: false, visible: true, position: 5 },
  { id: "services", label: ABOUT_SECTION_LABELS.services, fixed: false, visible: true, position: 6 },
  { id: "whyUs", label: ABOUT_SECTION_LABELS.whyUs, fixed: false, visible: true, position: 7 },
  { id: "experience", label: ABOUT_SECTION_LABELS.experience, fixed: false, visible: true, position: 8 },
];

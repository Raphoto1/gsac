export const HOME_SECTION_IDS = [
  "hero",
  "bigcard",
  "cases",
  "team",
  "holdings",
  "clients",
  "contact",
] as const;

export type SectionId = (typeof HOME_SECTION_IDS)[number];

export type SectionItem = {
  id: SectionId;
  label: string;
  fixed: boolean;
  visible: boolean;
  position: number;
};

export type SectionMeta = {
  id: SectionId;
  label: string;
  fixed: boolean;
  visible: boolean;
};

export type SectionOrderResponseItem = SectionMeta & { position: number };

export const HOME_SECTION_LABELS: Record<SectionId, string> = {
  hero: "Hero",
  bigcard: "Enfoque",
  cases: "Casos",
  team: "Equipo",
  holdings: "Holdings",
  clients: "Clientes & Aliados",
  contact: "Contacto",
};

export const DEFAULT_HOME_SECTION_ORDER: SectionItem[] = [
  { id: "hero", label: HOME_SECTION_LABELS.hero, fixed: true, visible: true, position: 1 },
  { id: "bigcard", label: HOME_SECTION_LABELS.bigcard, fixed: false, visible: true, position: 2 },
  { id: "cases", label: HOME_SECTION_LABELS.cases, fixed: false, visible: true, position: 3 },
  { id: "team", label: HOME_SECTION_LABELS.team, fixed: false, visible: true, position: 4 },
  { id: "holdings", label: HOME_SECTION_LABELS.holdings, fixed: false, visible: true, position: 5 },
  { id: "clients", label: HOME_SECTION_LABELS.clients, fixed: false, visible: true, position: 6 },
  { id: "contact", label: HOME_SECTION_LABELS.contact, fixed: true, visible: true, position: 7 },
];

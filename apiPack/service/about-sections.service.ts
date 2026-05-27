import {
  ABOUT_SECTION_KEYS,
  getAboutSectionOrderFromDb,
  replaceAboutSectionOrderInDb,
  type AboutSectionKey,
  type AboutSectionOrderRecord,
} from "../dao/about-sections.dao";
import {
  ABOUT_SECTION_IDS,
  ABOUT_SECTION_LABELS,
  DEFAULT_ABOUT_SECTION_ORDER,
  type AboutSectionId,
  type AboutSectionItem,
} from "@/types/about-sections";

type SectionPayloadItem = {
  id: AboutSectionId;
  visible: boolean;
  position: number;
};

const SECTION_META_BY_KEY: Record<
  AboutSectionKey,
  Omit<AboutSectionItem, "position" | "visible">
> = {
  INTRO: { id: "intro", label: ABOUT_SECTION_LABELS.intro, fixed: false },
  MISSION: { id: "mission", label: ABOUT_SECTION_LABELS.mission, fixed: false },
  VISION: { id: "vision", label: ABOUT_SECTION_LABELS.vision, fixed: false },
  VALUES: { id: "values", label: ABOUT_SECTION_LABELS.values, fixed: false },
  COUNTRIES: { id: "countries", label: ABOUT_SECTION_LABELS.countries, fixed: false },
  SERVICES: { id: "services", label: ABOUT_SECTION_LABELS.services, fixed: false },
  WHY_US: { id: "whyUs", label: ABOUT_SECTION_LABELS.whyUs, fixed: false },
  EXPERIENCE: { id: "experience", label: ABOUT_SECTION_LABELS.experience, fixed: false },
};

const SECTION_KEY_BY_ID: Record<AboutSectionId, AboutSectionKey> = {
  intro: ABOUT_SECTION_KEYS.INTRO,
  mission: ABOUT_SECTION_KEYS.MISSION,
  vision: ABOUT_SECTION_KEYS.VISION,
  values: ABOUT_SECTION_KEYS.VALUES,
  countries: ABOUT_SECTION_KEYS.COUNTRIES,
  services: ABOUT_SECTION_KEYS.SERVICES,
  whyUs: ABOUT_SECTION_KEYS.WHY_US,
  experience: ABOUT_SECTION_KEYS.EXPERIENCE,
};

const ALL_SECTION_IDS: AboutSectionId[] = [...ABOUT_SECTION_IDS];

export class AboutSectionValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AboutSectionValidationError";
  }
}

function isSectionId(value: unknown): value is AboutSectionId {
  return typeof value === "string" && ALL_SECTION_IDS.includes(value as AboutSectionId);
}

function mapDbRowsToSectionItems(rows: AboutSectionOrderRecord[]): AboutSectionItem[] {
  return rows.map((row) => {
    const meta = SECTION_META_BY_KEY[row.section];
    return {
      id: meta.id,
      label: meta.label,
      fixed: meta.fixed,
      visible: row.visible,
      position: row.position,
    };
  });
}

function normalizeSectionsPayload(payload: unknown): SectionPayloadItem[] {
  if (!payload || typeof payload !== "object" || !("sections" in payload)) {
    throw new AboutSectionValidationError("Payload inválido.");
  }

  const maybeSections = (payload as { sections?: unknown }).sections;
  if (!Array.isArray(maybeSections)) {
    throw new AboutSectionValidationError("El campo sections debe ser un arreglo.");
  }

  const parsed = maybeSections.map((item) => {
    if (!item || typeof item !== "object") {
      throw new AboutSectionValidationError("Cada sección debe ser un objeto válido.");
    }

    const sectionId = (item as { id?: unknown }).id;
    const position = (item as { position?: unknown }).position;
    const visible = (item as { visible?: unknown }).visible;

    if (!isSectionId(sectionId)) {
      throw new AboutSectionValidationError("Hay una sección inválida en el payload.");
    }

    if (typeof position !== "number" || !Number.isInteger(position)) {
      throw new AboutSectionValidationError("Todas las posiciones deben ser enteros.");
    }

    if (typeof visible !== "boolean") {
      throw new AboutSectionValidationError("Todas las secciones deben indicar si están visibles.");
    }

    return {
      id: sectionId,
      visible,
      position,
    };
  });

  if (parsed.length !== ALL_SECTION_IDS.length) {
    throw new AboutSectionValidationError("Se deben enviar exactamente 8 secciones.");
  }

  const uniqueIds = new Set(parsed.map((item) => item.id));
  if (uniqueIds.size !== ALL_SECTION_IDS.length) {
    throw new AboutSectionValidationError("No se permiten secciones duplicadas.");
  }

  const uniquePositions = new Set(parsed.map((item) => item.position));
  if (uniquePositions.size !== ALL_SECTION_IDS.length) {
    throw new AboutSectionValidationError("No se permiten posiciones duplicadas.");
  }

  const sortedByPosition = [...parsed].sort((a, b) => a.position - b.position);
  const expectedPositions = ALL_SECTION_IDS.map((_, index) => index + 1);

  for (let i = 0; i < expectedPositions.length; i += 1) {
    if (sortedByPosition[i].position !== expectedPositions[i]) {
      throw new AboutSectionValidationError("Las posiciones deben ser consecutivas de 1 a 8.");
    }
  }

  return sortedByPosition;
}

export async function getAboutSectionsOrderService(): Promise<AboutSectionItem[]> {
  const rows = await getAboutSectionOrderFromDb();
  if (!rows.length) {
    return DEFAULT_ABOUT_SECTION_ORDER;
  }

  return mapDbRowsToSectionItems(rows);
}

export async function updateAboutSectionsOrderService(payload: unknown): Promise<AboutSectionItem[]> {
  const normalized = normalizeSectionsPayload(payload);

  const dbPayload = normalized.map((item) => ({
    section: SECTION_KEY_BY_ID[item.id],
    visible: item.visible,
    position: item.position,
  }));

  const rows = await replaceAboutSectionOrderInDb(dbPayload);
  return mapDbRowsToSectionItems(rows);
}

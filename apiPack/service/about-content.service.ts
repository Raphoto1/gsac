import {
  ABOUT_COUNTRY_LEGACY_NAME_TO_CODE,
  ABOUT_COUNTRY_OPTION_BY_CODE,
  ABOUT_COUNTRY_OPTION_BY_NAME,
  ABOUT_COUNTRY_OPTIONS,
  ABOUT_CARD_SECTION_IDS,
  DEFAULT_ABOUT_CARDS,
  DEFAULT_ABOUT_COUNTRIES,
  DEFAULT_ABOUT_VALUES,
  type AboutCardSectionData,
  type AboutCardSectionId,
  type AboutCountryData,
  type AboutValueData,
  type LocalizedText,
} from "@/types/about-content";
import {
  ABOUT_CARD_SECTION_KEYS,
  getAboutCardSectionFromDb,
  getAboutCountryEntriesFromDb,
  getAboutValueEntriesFromDb,
  replaceAboutCountryEntriesInDb,
  replaceAboutValueEntriesInDb,
  upsertAboutCardSectionInDb,
  type AboutCardSectionKey,
  type AboutCardSectionRecord,
} from "../dao/about-content.dao";

const CARD_KEY_BY_ID: Record<AboutCardSectionId, AboutCardSectionKey> = {
  intro: ABOUT_CARD_SECTION_KEYS.INTRO,
  mission: ABOUT_CARD_SECTION_KEYS.MISSION,
  vision: ABOUT_CARD_SECTION_KEYS.VISION,
  services: ABOUT_CARD_SECTION_KEYS.SERVICES,
  whyUs: ABOUT_CARD_SECTION_KEYS.WHY_US,
  experience: ABOUT_CARD_SECTION_KEYS.EXPERIENCE,
};

const VALID_COUNTRY_CODES = new Set(ABOUT_COUNTRY_OPTIONS.map((option) => option.code));

function normalizeCountryToCode(value: string): string | null {
  const normalized = value.trim();

  if (!normalized) {
    return null;
  }

  const maybeCode = normalized.toUpperCase();
  if (VALID_COUNTRY_CODES.has(maybeCode)) {
    return maybeCode;
  }

  const byName = ABOUT_COUNTRY_OPTION_BY_NAME.get(normalized);
  if (byName) {
    return byName.code;
  }

  const legacy = ABOUT_COUNTRY_LEGACY_NAME_TO_CODE[normalized];
  if (legacy && VALID_COUNTRY_CODES.has(legacy)) {
    return legacy;
  }

  return null;
}

export class AboutContentValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AboutContentValidationError";
  }
}

function normalizeLocalizedText(value: unknown, fieldName: string): LocalizedText {
  if (!value || typeof value !== "object") {
    throw new AboutContentValidationError(`El campo ${fieldName} debe ser un objeto valido.`);
  }

  const es = (value as { es?: unknown }).es;
  const en = (value as { en?: unknown }).en;

  if (typeof es !== "string" || typeof en !== "string") {
    throw new AboutContentValidationError(`El campo ${fieldName} debe tener textos en espanol e ingles.`);
  }

  const normalizedEs = es.trim();
  const normalizedEn = en.trim();

  if (!normalizedEs || !normalizedEn) {
    throw new AboutContentValidationError(`El campo ${fieldName} no puede estar vacio.`);
  }

  return { es: normalizedEs, en: normalizedEn };
}

function mapCardRecord(record: AboutCardSectionRecord): AboutCardSectionData {
  return {
    title: { es: record.titleEs, en: record.titleEn },
    description: { es: record.descriptionEs, en: record.descriptionEn },
    imageUrl: record.imageUrl,
  };
}

function normalizeCardPayload(payload: unknown): AboutCardSectionData {
  if (!payload || typeof payload !== "object" || !("section" in payload)) {
    throw new AboutContentValidationError("Payload invalido.");
  }

  const section = (payload as { section?: unknown }).section;
  if (!section || typeof section !== "object") {
    throw new AboutContentValidationError("El campo section debe ser un objeto valido.");
  }

  const title = normalizeLocalizedText((section as { title?: unknown }).title, "title");
  const description = normalizeLocalizedText((section as { description?: unknown }).description, "description");
  const imageValue = (section as { imageUrl?: unknown }).imageUrl;

  if (typeof imageValue !== "string" || !imageValue.trim()) {
    throw new AboutContentValidationError("El campo imageUrl no puede estar vacio.");
  }

  return {
    title,
    description,
    imageUrl: imageValue.trim(),
  };
}

function normalizeValuesPayload(payload: unknown): AboutValueData[] {
  if (!payload || typeof payload !== "object" || !("values" in payload)) {
    throw new AboutContentValidationError("Payload invalido.");
  }

  const maybeValues = (payload as { values?: unknown }).values;
  if (!Array.isArray(maybeValues) || maybeValues.length === 0) {
    throw new AboutContentValidationError("Debes enviar al menos un valor.");
  }

  return maybeValues.map((item, index) => {
    if (!item || typeof item !== "object") {
      throw new AboutContentValidationError("Cada valor debe ser un objeto valido.");
    }

    const key = (item as { key?: unknown }).key;
    if (typeof key !== "string" || !key.trim()) {
      throw new AboutContentValidationError(`El valor ${index + 1} debe tener key.`);
    }

    return {
      key: key.trim(),
      title: normalizeLocalizedText((item as { title?: unknown }).title, `values[${index}].title`),
      description: normalizeLocalizedText((item as { description?: unknown }).description, `values[${index}].description`),
    };
  });
}

function normalizeCountriesPayload(payload: unknown): AboutCountryData[] {
  if (!payload || typeof payload !== "object" || !("countries" in payload)) {
    throw new AboutContentValidationError("Payload invalido.");
  }

  const maybeCountries = (payload as { countries?: unknown }).countries;
  if (!Array.isArray(maybeCountries) || maybeCountries.length === 0) {
    throw new AboutContentValidationError("Debes enviar al menos un pais.");
  }

  return maybeCountries.map((item, index) => {
    if (!item || typeof item !== "object") {
      throw new AboutContentValidationError("Cada pais debe ser un objeto valido.");
    }

    const name = (item as { name?: unknown }).name;
    if (typeof name !== "string" || !name.trim()) {
      throw new AboutContentValidationError(`El pais ${index + 1} no puede estar vacio.`);
    }

    const normalizedCode = normalizeCountryToCode(name);
    if (!normalizedCode) {
      throw new AboutContentValidationError(`El pais ${index + 1} no esta soportado.`);
    }

    return { name: normalizedCode };
  });
}

async function getCardSectionWithSeed(sectionId: AboutCardSectionId): Promise<AboutCardSectionData> {
  const key = CARD_KEY_BY_ID[sectionId];
  const existing = await getAboutCardSectionFromDb(key);

  if (existing) {
    return mapCardRecord(existing);
  }

  const fallback = DEFAULT_ABOUT_CARDS[sectionId];
  const created = await upsertAboutCardSectionInDb(key, {
    titleEs: fallback.title.es,
    titleEn: fallback.title.en,
    descriptionEs: fallback.description.es,
    descriptionEn: fallback.description.en,
    imageUrl: fallback.imageUrl,
  });

  return mapCardRecord(created);
}

export async function getAboutCardSectionService(sectionId: AboutCardSectionId): Promise<{ section: AboutCardSectionData }> {
  const section = await getCardSectionWithSeed(sectionId);
  return { section };
}

export async function updateAboutCardSectionService(sectionId: AboutCardSectionId, payload: unknown): Promise<{ section: AboutCardSectionData }> {
  const normalized = normalizeCardPayload(payload);
  const key = CARD_KEY_BY_ID[sectionId];

  const updated = await upsertAboutCardSectionInDb(key, {
    titleEs: normalized.title.es,
    titleEn: normalized.title.en,
    descriptionEs: normalized.description.es,
    descriptionEn: normalized.description.en,
    imageUrl: normalized.imageUrl,
  });

  return { section: mapCardRecord(updated) };
}

export async function getAboutValuesService(): Promise<{ values: AboutValueData[] }> {
  const rows = await getAboutValueEntriesFromDb();

  if (!rows.length) {
    const seeded = await replaceAboutValueEntriesInDb(
      DEFAULT_ABOUT_VALUES.map((item, index) => ({
        position: index + 1,
        valueKey: item.key,
        titleEs: item.title.es,
        titleEn: item.title.en,
        descriptionEs: item.description.es,
        descriptionEn: item.description.en,
      }))
    );

    return {
      values: seeded.map((row) => ({
        key: row.valueKey,
        title: { es: row.titleEs, en: row.titleEn },
        description: { es: row.descriptionEs, en: row.descriptionEn },
      })),
    };
  }

  return {
    values: rows.map((row) => ({
      key: row.valueKey,
      title: { es: row.titleEs, en: row.titleEn },
      description: { es: row.descriptionEs, en: row.descriptionEn },
    })),
  };
}

export async function updateAboutValuesService(payload: unknown): Promise<{ values: AboutValueData[] }> {
  const normalized = normalizeValuesPayload(payload);

  const rows = await replaceAboutValueEntriesInDb(
    normalized.map((item, index) => ({
      position: index + 1,
      valueKey: item.key,
      titleEs: item.title.es,
      titleEn: item.title.en,
      descriptionEs: item.description.es,
      descriptionEn: item.description.en,
    }))
  );

  return {
    values: rows.map((row) => ({
      key: row.valueKey,
      title: { es: row.titleEs, en: row.titleEn },
      description: { es: row.descriptionEs, en: row.descriptionEn },
    })),
  };
}

export async function getAboutCountriesService(): Promise<{ countries: AboutCountryData[] }> {
  const rows = await getAboutCountryEntriesFromDb();

  if (!rows.length) {
    const seeded = await replaceAboutCountryEntriesInDb(
      DEFAULT_ABOUT_COUNTRIES.map((item, index) => ({
        position: index + 1,
        name: item.name,
      }))
    );

    return {
      countries: seeded.map((row) => ({ name: row.name })),
    };
  }

  return {
    countries: rows.map((row) => ({
      name: normalizeCountryToCode(row.name) ?? row.name,
    })),
  };
}

export async function updateAboutCountriesService(payload: unknown): Promise<{ countries: AboutCountryData[] }> {
  const normalized = normalizeCountriesPayload(payload);

  const rows = await replaceAboutCountryEntriesInDb(
    normalized.map((item, index) => ({
      position: index + 1,
      name: item.name,
    }))
  );

  return {
    countries: rows.map((row) => ({ name: row.name })),
  };
}

export async function getAboutContentService() {
  const [intro, mission, vision, services, whyUs, experience, values, countries] = await Promise.all([
    getCardSectionWithSeed("intro"),
    getCardSectionWithSeed("mission"),
    getCardSectionWithSeed("vision"),
    getCardSectionWithSeed("services"),
    getCardSectionWithSeed("whyUs"),
    getCardSectionWithSeed("experience"),
    getAboutValuesService(),
    getAboutCountriesService(),
  ]);

  return {
    cards: {
      intro,
      mission,
      vision,
      services,
      whyUs,
      experience,
    },
    values: values.values,
    countries: countries.countries,
  };
}

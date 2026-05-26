import { DEFAULT_HOME_CASES, type HomeCaseItem, type HomeCasesResponse } from "@/types/home-cases";
import { getHomeCasesFromDb, upsertHomeCasesInDb, type HomeCasesRecord } from "../dao/cases.dao";

type CasesPayload = {
  cases?: unknown;
};

export class CasesValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "CasesValidationError";
  }
}

function normalizeLocalizedText(value: unknown, fieldName: string) {
  if (!value || typeof value !== "object") {
    throw new CasesValidationError(`El campo ${fieldName} debe ser un objeto válido.`);
  }

  const es = (value as { es?: unknown }).es;
  const en = (value as { en?: unknown }).en;

  if (typeof es !== "string" || typeof en !== "string") {
    throw new CasesValidationError(`El campo ${fieldName} debe tener textos en español e inglés.`);
  }

  if (!es.trim() || !en.trim()) {
    throw new CasesValidationError(`El campo ${fieldName} no puede estar vacío.`);
  }

  return { es: es.trim(), en: en.trim() };
}

function normalizeImpactItems(value: unknown): { es: string; en: string } {
  const text = normalizeLocalizedText(value, "impactItems");
  return {
    es: text.es,
    en: text.en,
  };
}

function parseCasesArray(payloadCases: unknown): HomeCaseItem[] {
  if (!Array.isArray(payloadCases)) {
    throw new CasesValidationError("El campo cases debe ser un arreglo.");
  }

  if (!payloadCases.length) {
    throw new CasesValidationError("Se debe guardar al menos 1 caso.");
  }

  const parsed = payloadCases.map((item, index) => {
    if (!item || typeof item !== "object") {
      throw new CasesValidationError(`El caso ${index + 1} debe ser un objeto válido.`);
    }

    const id = (item as { id?: unknown }).id;
    const title = normalizeLocalizedText((item as { title?: unknown }).title, "title");
    const organizationType = (item as { organizationType?: unknown }).organizationType;
    const description = normalizeLocalizedText((item as { description?: unknown }).description, "description");
    const advancedDescription = normalizeLocalizedText((item as { advancedDescription?: unknown }).advancedDescription, "advancedDescription");
    const impactItems = normalizeImpactItems((item as { impactItems?: unknown }).impactItems);
    const imageValue = (item as { image?: unknown }).image;
    const image = typeof imageValue === "string" ? imageValue.trim() : "";

    if (typeof id !== "number" || !Number.isInteger(id)) {
      throw new CasesValidationError("Cada caso debe incluir un id entero.");
    }

    if (typeof organizationType !== "string") {
      throw new CasesValidationError("El tipo de organización debe ser un texto válido.");
    }

    return {
      id,
      title,
      organizationType: organizationType.trim(),
      description,
      advancedDescription,
      impactItems,
      image: image || DEFAULT_HOME_CASES[index]?.image || DEFAULT_HOME_CASES[0].image,
    };
  });

  return parsed.sort((a, b) => a.id - b.id);
}

function mapRecordToCases(record: HomeCasesRecord | null): HomeCaseItem[] {
  if (!record || !Array.isArray(record.items)) {
    return DEFAULT_HOME_CASES;
  }

  return record.items as HomeCaseItem[];
}

export async function getHomeCasesService(): Promise<HomeCasesResponse> {
  const record = await getHomeCasesFromDb();
  return { cases: mapRecordToCases(record) };
}

export async function updateHomeCasesService(payload: unknown): Promise<HomeCasesResponse> {
  if (!payload || typeof payload !== "object" || !("cases" in payload)) {
    throw new CasesValidationError("Payload inválido.");
  }

  const parsed = parseCasesArray((payload as CasesPayload).cases);
  const record = await upsertHomeCasesInDb(parsed);
  return { cases: mapRecordToCases(record) };
}
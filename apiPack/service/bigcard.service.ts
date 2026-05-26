import { DEFAULT_BIGCARD, type BigCardData, type BigCardResponse } from "@/types/home-bigcard";
import {
  getHomeBigCardFromDb,
  upsertHomeBigCardInDb,
  type BigCardRecord,
} from "../dao/bigcard.dao";

type BigCardPayload = {
  bigCard?: unknown;
};

export class BigCardValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "BigCardValidationError";
  }
}

function normalizeLocalizedText(value: unknown, fieldName: string) {
  if (!value || typeof value !== "object") {
    throw new BigCardValidationError(`El campo ${fieldName} debe ser un objeto válido.`);
  }

  const es = (value as { es?: unknown }).es;
  const en = (value as { en?: unknown }).en;

  if (typeof es !== "string" || typeof en !== "string") {
    throw new BigCardValidationError(`El campo ${fieldName} debe tener textos en español e inglés.`);
  }

  if (!es.trim() || !en.trim()) {
    throw new BigCardValidationError(`El campo ${fieldName} no puede estar vacío.`);
  }

  return { es: es.trim(), en: en.trim() };
}

function mapRecordToBigCard(record: BigCardRecord | null): BigCardData {
  if (!record) {
    return DEFAULT_BIGCARD;
  }

  return {
    title: {
      es: record.titleEs,
      en: record.titleEn,
    },
    description: {
      es: record.descriptionEs,
      en: record.descriptionEn,
    },
    image: record.image || DEFAULT_BIGCARD.image,
  };
}

function normalizePayload(payload: unknown): BigCardData {
  if (!payload || typeof payload !== "object" || !("bigCard" in payload)) {
    throw new BigCardValidationError("Payload inválido.");
  }

  const maybeBigCard = (payload as BigCardPayload).bigCard;
  if (!maybeBigCard || typeof maybeBigCard !== "object") {
    throw new BigCardValidationError("El campo bigCard debe ser un objeto válido.");
  }

  const title = normalizeLocalizedText((maybeBigCard as { title?: unknown }).title, "title");
  const description = normalizeLocalizedText((maybeBigCard as { description?: unknown }).description, "description");
  const imageValue = (maybeBigCard as { image?: unknown }).image;
  const image = typeof imageValue === "string" ? imageValue.trim() : "";

  return {
    title,
    description,
    image: image || DEFAULT_BIGCARD.image,
  };
}

export async function getHomeBigCardService(): Promise<BigCardResponse> {
  const record = await getHomeBigCardFromDb();
  return { bigCard: mapRecordToBigCard(record) };
}

export async function updateHomeBigCardService(payload: unknown): Promise<BigCardResponse> {
  const normalized = normalizePayload(payload);
  const record = await upsertHomeBigCardInDb({
    titleEs: normalized.title.es,
    titleEn: normalized.title.en,
    descriptionEs: normalized.description.es,
    descriptionEn: normalized.description.en,
    image: normalized.image,
  });

  return { bigCard: mapRecordToBigCard(record) };
}
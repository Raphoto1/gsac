import type { GeneralInfo } from "@/types/general";
import { DEFAULT_GENERAL_INFO } from "@/types/general";
import {
  getGeneralInfoFromDb,
  upsertGeneralInfoInDb,
} from "../dao/general.dao";

export class GeneralValidationError extends Error {
  constructor(public field: string, message: string) {
    super(message);
    this.name = "GeneralValidationError";
  }
}

let generalInfoFallback: GeneralInfo = { ...DEFAULT_GENERAL_INFO };

function normalizeRequiredText(value: unknown, field: string): string {
  if (typeof value !== "string") {
    throw new GeneralValidationError(field, `${field} debe ser texto.`);
  }

  const normalized = value.trim();
  if (!normalized) {
    throw new GeneralValidationError(field, `${field} es obligatorio.`);
  }

  return normalized;
}

function isPrismaTableMissingError(error: unknown): boolean {
  if (!error || typeof error !== "object") {
    return false;
  }

  const maybeCode = (error as { code?: unknown }).code;
  return maybeCode === "P2021" || maybeCode === "P2022";
}

function isDbUnavailableError(error: unknown): boolean {
  if (!error || typeof error !== "object") {
    return false;
  }

  const maybeCode = (error as { code?: unknown }).code;
  return maybeCode === "P1001" || maybeCode === "P1002";
}

export async function getGeneralInfoService(): Promise<GeneralInfo> {
  try {
    const data = await getGeneralInfoFromDb();
    generalInfoFallback = data;
    return data;
  } catch (error) {
    if (isPrismaTableMissingError(error) || isDbUnavailableError(error)) {
      return generalInfoFallback;
    }

    throw error;
  }
}

export async function updateGeneralInfoService(payload: unknown): Promise<GeneralInfo> {
  if (!payload || typeof payload !== "object") {
    throw new GeneralValidationError("payload", "El body debe ser un objeto válido.");
  }

  const data = payload as {
    companyName?: { es?: unknown; en?: unknown };
    nit?: unknown;
    tagline?: { es?: unknown; en?: unknown };
    rights?: { es?: unknown; en?: unknown };
  };

  const normalized: GeneralInfo = {
    id: "general_info",
    companyName: {
      es: normalizeRequiredText(data.companyName?.es, "companyName.es"),
      en: normalizeRequiredText(data.companyName?.en, "companyName.en"),
    },
    nit: normalizeRequiredText(data.nit, "nit"),
    tagline: {
      es: normalizeRequiredText(data.tagline?.es, "tagline.es"),
      en: normalizeRequiredText(data.tagline?.en, "tagline.en"),
    },
    rights: {
      es: normalizeRequiredText(data.rights?.es, "rights.es"),
      en: normalizeRequiredText(data.rights?.en, "rights.en"),
    },
  };

  try {
    const saved = await upsertGeneralInfoInDb(normalized);
    generalInfoFallback = saved;
    return saved;
  } catch (error) {
    if (isPrismaTableMissingError(error) || isDbUnavailableError(error)) {
      generalInfoFallback = normalized;
      return normalized;
    }

    throw error;
  }
}

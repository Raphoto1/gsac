import { normalizeLocalizedText, type CompanyListItem, type CompanyListKind, type CompanyListResponse, type LocalizedText } from "@/types/company-list";
import { getCompanyListFromDb, upsertCompanyListInDb, type CompanyListRecord } from "../dao/company-list.dao";

type CompanyListPayload = {
  companies?: unknown;
};

export class CompanyListValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "CompanyListValidationError";
  }
}

function normalizeOptionalText(value: unknown): string | undefined {
  if (typeof value !== "string") {
    return undefined;
  }

  const normalized = value.trim();
  return normalized || undefined;
}

function normalizeOptionalLocalizedText(value: unknown): LocalizedText | undefined {
  return normalizeLocalizedText(value);
}

function normalizeCompanyItem(item: unknown, index: number): CompanyListItem {
  if (!item || typeof item !== "object") {
    throw new CompanyListValidationError(`La empresa ${index + 1} debe ser un objeto válido.`);
  }

  const name = (item as { name?: unknown }).name;
  const description = (item as { description?: unknown }).description;
  const dbId = (item as { dbId?: unknown }).dbId;
  const logo = (item as { logo?: unknown }).logo;
  const relationship = (item as { relationship?: unknown }).relationship;
  const relationshipLabel = (item as { relationshipLabel?: unknown }).relationshipLabel;
  const website = (item as { website?: unknown }).website;
  const websiteLabel = (item as { websiteLabel?: unknown }).websiteLabel;
  const caseHref = (item as { caseHref?: unknown }).caseHref;
  const caseLabel = (item as { caseLabel?: unknown }).caseLabel;

  const normalizedName = normalizeLocalizedText(name);
  if (!normalizedName) {
    throw new CompanyListValidationError(`La empresa ${index + 1} debe tener un nombre válido.`);
  }

  const normalizedDescription = normalizeLocalizedText(description);
  if (!normalizedDescription) {
    throw new CompanyListValidationError(`La empresa ${index + 1} debe tener una descripción válida.`);
  }

  return {
    dbId: typeof dbId === "string" ? dbId : undefined,
    name: normalizedName,
    description: normalizedDescription,
    logo: typeof logo === "string" ? logo.trim() || undefined : undefined,
    relationship: normalizeOptionalLocalizedText(relationship),
    relationshipLabel: normalizeOptionalLocalizedText(relationshipLabel),
    website: normalizeOptionalText(website),
    websiteLabel: normalizeOptionalLocalizedText(websiteLabel),
    caseHref: typeof caseHref === "string" ? caseHref.trim() || undefined : undefined,
    caseLabel: normalizeOptionalLocalizedText(caseLabel),
  };
}

function parseCompanyListItems(companies: unknown): CompanyListItem[] {
  if (!Array.isArray(companies)) {
    throw new CompanyListValidationError("El campo companies debe ser un arreglo.");
  }

  const parsed = companies.map((item, index) => normalizeCompanyItem(item, index));

  if (!parsed.length) {
    throw new CompanyListValidationError("Debe existir al menos una empresa.");
  }

  return parsed;
}

function mapRecordToItems(record: CompanyListRecord | null): CompanyListItem[] {
  if (!record || !Array.isArray(record.items)) {
    return [];
  }

  return record.items.map((item, index) => normalizeCompanyItem(item, index));
}

export async function getCompanyListService(kind: CompanyListKind): Promise<CompanyListResponse> {
  const record = await getCompanyListFromDb(kind);
  return { companies: mapRecordToItems(record) };
}

export async function updateCompanyListService(
  kind: CompanyListKind,
  payload: unknown
): Promise<CompanyListResponse> {
  if (!payload || typeof payload !== "object" || !("companies" in payload)) {
    throw new CompanyListValidationError("Payload inválido.");
  }

  const parsed = parseCompanyListItems((payload as CompanyListPayload).companies);
  const record = await upsertCompanyListInDb(kind, parsed);
  return { companies: mapRecordToItems(record) };
}
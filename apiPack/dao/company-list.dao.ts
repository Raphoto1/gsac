import { prisma } from "@/lib/prisma";
import { normalizeLocalizedText, type CompanyListItem, type CompanyListKind } from "@/types/company-list";

export type CompanyListRecord = {
  items: CompanyListItem[];
};

type CompanyListDbKind = "HOLDINGS" | "CLIENTS";

type CompanyListRow = {
  id: string;
  kind: CompanyListDbKind;
  position: number;
  nameEs: string;
  nameEn: string;
  descriptionEs: string;
  descriptionEn: string;
  logo: string | null;
  relationshipEs: string | null;
  relationshipEn: string | null;
  relationshipLabelEs: string | null;
  relationshipLabelEn: string | null;
  website: string | null;
  websiteLabelEs: string | null;
  websiteLabelEn: string | null;
  caseHref: string | null;
  caseLabelEs: string | null;
  caseLabelEn: string | null;
};

const DB_KIND_BY_KIND: Record<CompanyListKind, CompanyListDbKind> = {
  holdings: "HOLDINGS",
  clients: "CLIENTS",
};

function toDbKind(kind: CompanyListKind): CompanyListDbKind {
  return DB_KIND_BY_KIND[kind];
}

function toLocalizedText(valueEs: string | null, valueEn: string | null) {
  const es = valueEs?.trim() || valueEn?.trim() || "";
  const en = valueEn?.trim() || valueEs?.trim() || "";
  return { es, en };
}

function mapRowToItem(row: CompanyListRow): CompanyListItem {
  return {
    dbId: row.id,
    name: toLocalizedText(row.nameEs, row.nameEn),
    description: toLocalizedText(row.descriptionEs, row.descriptionEn),
    logo: row.logo || undefined,
    relationship: row.relationshipEs || row.relationshipEn ? toLocalizedText(row.relationshipEs, row.relationshipEn) : undefined,
    relationshipLabel: row.relationshipLabelEs || row.relationshipLabelEn ? toLocalizedText(row.relationshipLabelEs, row.relationshipLabelEn) : undefined,
    website: row.website || undefined,
    websiteLabel: row.websiteLabelEs || row.websiteLabelEn ? toLocalizedText(row.websiteLabelEs, row.websiteLabelEn) : undefined,
    caseHref: row.caseHref || undefined,
    caseLabel: row.caseLabelEs || row.caseLabelEn ? toLocalizedText(row.caseLabelEs, row.caseLabelEn) : undefined,
  };
}

function normalizeTextPair(value: unknown): { es: string; en: string } {
  const localized = normalizeLocalizedText(value);
  if (localized) {
    return localized;
  }

  return { es: "", en: "" };
}

function normalizeOptionalString(value: unknown): string | null {
  if (typeof value !== "string") {
    return null;
  }

  const normalized = value.trim();
  return normalized || null;
}

function normalizeIncomingItem(item: CompanyListItem) {
  const name = normalizeTextPair(item.name);
  const description = normalizeTextPair(item.description);
  const relationship = item.relationship ? normalizeTextPair(item.relationship) : null;
  const relationshipLabel = item.relationshipLabel ? normalizeTextPair(item.relationshipLabel) : null;
  const websiteLabel = item.websiteLabel ? normalizeTextPair(item.websiteLabel) : null;
  const caseLabel = item.caseLabel ? normalizeTextPair(item.caseLabel) : null;

  return {
    dbId: item.dbId,
    nameEs: name.es,
    nameEn: name.en,
    descriptionEs: description.es,
    descriptionEn: description.en,
    logo: normalizeOptionalString(item.logo),
    relationshipEs: relationship?.es ?? null,
    relationshipEn: relationship?.en ?? null,
    relationshipLabelEs: relationshipLabel?.es ?? null,
    relationshipLabelEn: relationshipLabel?.en ?? null,
    website: normalizeOptionalString(item.website),
    websiteLabelEs: websiteLabel?.es ?? null,
    websiteLabelEn: websiteLabel?.en ?? null,
    caseHref: normalizeOptionalString(item.caseHref),
    caseLabelEs: caseLabel?.es ?? null,
    caseLabelEn: caseLabel?.en ?? null,
  };
}

export async function getCompanyListFromDb(kind: CompanyListKind): Promise<CompanyListRecord | null> {
  const rows = await prisma.homeCompanyListEntry.findMany({
    where: { kind: toDbKind(kind) },
    orderBy: { position: "asc" },
  });

  return { items: rows.map(mapRowToItem) };
}

export async function upsertCompanyListInDb(
  kind: CompanyListKind,
  items: CompanyListItem[]
): Promise<CompanyListRecord> {
  const dbKind = toDbKind(kind);

  const rows = await prisma.$transaction(async (tx) => {
    const existingRows = await tx.homeCompanyListEntry.findMany({
      where: { kind: dbKind },
      orderBy: { position: "asc" },
    });

    const existingById = new Map(existingRows.map((row) => [row.id, row]));
    const nextIds = new Set<string>();

    for (const [index, item] of items.entries()) {
      const payload = normalizeIncomingItem(item);
      const position = index + 1;

      if (payload.dbId && existingById.has(payload.dbId)) {
        nextIds.add(payload.dbId);
        await tx.homeCompanyListEntry.update({
          where: { id: payload.dbId },
          data: {
            kind: dbKind,
            position,
            nameEs: payload.nameEs,
            nameEn: payload.nameEn,
            descriptionEs: payload.descriptionEs,
            descriptionEn: payload.descriptionEn,
            logo: payload.logo,
            relationshipEs: payload.relationshipEs,
            relationshipEn: payload.relationshipEn,
            relationshipLabelEs: payload.relationshipLabelEs,
            relationshipLabelEn: payload.relationshipLabelEn,
            website: payload.website,
            websiteLabelEs: payload.websiteLabelEs,
            websiteLabelEn: payload.websiteLabelEn,
            caseHref: payload.caseHref,
            caseLabelEs: payload.caseLabelEs,
            caseLabelEn: payload.caseLabelEn,
          },
        });
        continue;
      }

      const created = await tx.homeCompanyListEntry.create({
        data: {
          kind: dbKind,
          position,
          // New rows receive a fresh persistent id from Prisma.
          nameEs: payload.nameEs,
          nameEn: payload.nameEn,
          descriptionEs: payload.descriptionEs,
          descriptionEn: payload.descriptionEn,
          logo: payload.logo,
          relationshipEs: payload.relationshipEs,
          relationshipEn: payload.relationshipEn,
          relationshipLabelEs: payload.relationshipLabelEs,
          relationshipLabelEn: payload.relationshipLabelEn,
          website: payload.website,
          websiteLabelEs: payload.websiteLabelEs,
          websiteLabelEn: payload.websiteLabelEn,
          caseHref: payload.caseHref,
          caseLabelEs: payload.caseLabelEs,
          caseLabelEn: payload.caseLabelEn,
        },
      });

      nextIds.add(created.id);
    }

    const idsToDelete = existingRows.map((row) => row.id).filter((id) => !nextIds.has(id));
    if (idsToDelete.length) {
      await tx.homeCompanyListEntry.deleteMany({
        where: { id: { in: idsToDelete } },
      });
    }

    return tx.homeCompanyListEntry.findMany({
      where: { kind: dbKind },
      orderBy: { position: "asc" },
    });
  });

  return { items: rows.map(mapRowToItem) };
}
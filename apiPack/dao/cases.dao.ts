import { prisma } from "@/lib/prisma";
import { DEFAULT_HOME_CASES, type HomeCaseItem } from "@/types/home-cases";

export type HomeCasesRecord = {
  items: HomeCaseItem[];
};

type HomeCaseRow = {
  id: string;
  position: number;
  titleEs: string;
  titleEn: string;
  organizationType: string;
  descriptionEs: string;
  descriptionEn: string;
  advancedDescriptionEs: string;
  advancedDescriptionEn: string;
  impactItemsEs: string;
  impactItemsEn: string;
  image: string;
};

const CASES_ID = "home_cases";

function mapRowToCase(row: HomeCaseRow): HomeCaseItem {
  return {
    id: row.position,
    title: { es: row.titleEs, en: row.titleEn },
    organizationType: row.organizationType,
    description: { es: row.descriptionEs, en: row.descriptionEn },
    advancedDescription: { es: row.advancedDescriptionEs, en: row.advancedDescriptionEn },
    impactItems: { es: row.impactItemsEs, en: row.impactItemsEn },
    image: row.image,
  };
}

function mapCaseToRow(item: HomeCaseItem, index: number) {
  return {
    position: index + 1,
    titleEs: item.title.es,
    titleEn: item.title.en,
    organizationType: item.organizationType,
    descriptionEs: item.description.es,
    descriptionEn: item.description.en,
    advancedDescriptionEs: item.advancedDescription.es,
    advancedDescriptionEn: item.advancedDescription.en,
    impactItemsEs: item.impactItems.es,
    impactItemsEn: item.impactItems.en,
    image: item.image,
  };
}

async function readLegacyCases(): Promise<HomeCaseItem[]> {
  const legacyRecord = await prisma.homeCases.findUnique({
    where: { id: CASES_ID },
    select: { items: true },
  });

  if (!legacyRecord || !Array.isArray(legacyRecord.items)) {
    return [];
  }

  return legacyRecord.items as HomeCaseItem[];
}

export async function getHomeCasesFromDb(): Promise<HomeCasesRecord | null> {
  const rows = await prisma.homeCaseEntry.findMany({
    orderBy: { position: "asc" },
  });

  if (rows.length) {
    return { items: rows.map(mapRowToCase) };
  }

  const legacyItems = await readLegacyCases();
  if (!legacyItems.length) {
    return { items: DEFAULT_HOME_CASES };
  }

  await prisma.homeCaseEntry.deleteMany({});
  await prisma.homeCaseEntry.createMany({
    data: legacyItems.map(mapCaseToRow),
  });

  return { items: legacyItems };
}

export async function upsertHomeCasesInDb(items: HomeCaseItem[]): Promise<HomeCasesRecord> {
  await prisma.homeCaseEntry.deleteMany({});
  await prisma.homeCaseEntry.createMany({
    data: items.map(mapCaseToRow),
  });

  return { items };
}
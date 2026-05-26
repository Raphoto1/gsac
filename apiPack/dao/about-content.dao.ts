import { AboutCardSectionKey } from "@prisma/client";
import { prisma } from "@/lib/prisma";

export type AboutCardSectionRecord = {
  section: AboutCardSectionKey;
  titleEs: string;
  titleEn: string;
  descriptionEs: string;
  descriptionEn: string;
  imageUrl: string;
};

export type AboutValueEntryRecord = {
  position: number;
  valueKey: string;
  titleEs: string;
  titleEn: string;
  descriptionEs: string;
  descriptionEn: string;
};

export type AboutCountryEntryRecord = {
  position: number;
  name: string;
};

export async function getAboutCardSectionFromDb(section: AboutCardSectionKey): Promise<AboutCardSectionRecord | null> {
  return prisma.adminAboutCardSection.findUnique({
    where: { section },
    select: {
      section: true,
      titleEs: true,
      titleEn: true,
      descriptionEs: true,
      descriptionEn: true,
      imageUrl: true,
    },
  });
}

export async function upsertAboutCardSectionInDb(section: AboutCardSectionKey, data: Omit<AboutCardSectionRecord, "section">): Promise<AboutCardSectionRecord> {
  return prisma.adminAboutCardSection.upsert({
    where: { section },
    create: {
      section,
      titleEs: data.titleEs,
      titleEn: data.titleEn,
      descriptionEs: data.descriptionEs,
      descriptionEn: data.descriptionEn,
      imageUrl: data.imageUrl,
    },
    update: {
      titleEs: data.titleEs,
      titleEn: data.titleEn,
      descriptionEs: data.descriptionEs,
      descriptionEn: data.descriptionEn,
      imageUrl: data.imageUrl,
    },
    select: {
      section: true,
      titleEs: true,
      titleEn: true,
      descriptionEs: true,
      descriptionEn: true,
      imageUrl: true,
    },
  });
}

export async function getAboutValueEntriesFromDb(): Promise<AboutValueEntryRecord[]> {
  return prisma.adminAboutValueEntry.findMany({
    orderBy: { position: "asc" },
    select: {
      position: true,
      valueKey: true,
      titleEs: true,
      titleEn: true,
      descriptionEs: true,
      descriptionEn: true,
    },
  });
}

export async function replaceAboutValueEntriesInDb(entries: Array<Omit<AboutValueEntryRecord, "position"> & { position: number }>): Promise<AboutValueEntryRecord[]> {
  await prisma.adminAboutValueEntry.deleteMany();
  await prisma.adminAboutValueEntry.createMany({
    data: entries.map((entry) => ({
      position: entry.position,
      valueKey: entry.valueKey,
      titleEs: entry.titleEs,
      titleEn: entry.titleEn,
      descriptionEs: entry.descriptionEs,
      descriptionEn: entry.descriptionEn,
    })),
  });

  return getAboutValueEntriesFromDb();
}

export async function getAboutCountryEntriesFromDb(): Promise<AboutCountryEntryRecord[]> {
  return prisma.adminAboutCountryEntry.findMany({
    orderBy: { position: "asc" },
    select: {
      position: true,
      name: true,
    },
  });
}

export async function replaceAboutCountryEntriesInDb(entries: Array<Omit<AboutCountryEntryRecord, "position"> & { position: number }>): Promise<AboutCountryEntryRecord[]> {
  await prisma.adminAboutCountryEntry.deleteMany();
  await prisma.adminAboutCountryEntry.createMany({
    data: entries.map((entry) => ({
      position: entry.position,
      name: entry.name,
    })),
  });

  return getAboutCountryEntriesFromDb();
}

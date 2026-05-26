import { prisma } from "@/lib/prisma";

export type BigCardRecord = {
  titleEs: string;
  titleEn: string;
  descriptionEs: string;
  descriptionEn: string;
  image: string | null;
};

const BIGCARD_ID = "home_bigcard";

export async function getHomeBigCardFromDb(): Promise<BigCardRecord | null> {
  return prisma.homeBigCard.findUnique({
    where: { id: BIGCARD_ID },
    select: {
      titleEs: true,
      titleEn: true,
      descriptionEs: true,
      descriptionEn: true,
      image: true,
    },
  });
}

export async function upsertHomeBigCardInDb(data: BigCardRecord): Promise<BigCardRecord> {
  return prisma.homeBigCard.upsert({
    where: { id: BIGCARD_ID },
    create: {
      id: BIGCARD_ID,
      titleEs: data.titleEs,
      titleEn: data.titleEn,
      descriptionEs: data.descriptionEs,
      descriptionEn: data.descriptionEn,
      image: data.image,
    },
    update: {
      titleEs: data.titleEs,
      titleEn: data.titleEn,
      descriptionEs: data.descriptionEs,
      descriptionEn: data.descriptionEn,
      image: data.image,
    },
    select: {
      titleEs: true,
      titleEn: true,
      descriptionEs: true,
      descriptionEn: true,
      image: true,
    },
  });
}
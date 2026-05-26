import { prisma } from "@/lib/prisma";

export type HomeHeroRecord = {
  welcomeEs: string;
  welcomeEn: string;
  descriptionEs: string;
  descriptionEn: string;
  backgroundImage: string;
  impact1Es: string;
  impact1En: string;
  impact2Es: string;
  impact2En: string;
  impact3Es: string;
  impact3En: string;
};

const HERO_ID = "home_hero";

export async function getHomeHeroFromDb(): Promise<HomeHeroRecord | null> {
  return prisma.homeHero.findUnique({
    where: { id: HERO_ID },
    select: {
      welcomeEs: true,
      welcomeEn: true,
      descriptionEs: true,
      descriptionEn: true,
      backgroundImage: true,
      impact1Es: true,
      impact1En: true,
      impact2Es: true,
      impact2En: true,
      impact3Es: true,
      impact3En: true,
    },
  });
}

export async function upsertHomeHeroInDb(data: HomeHeroRecord): Promise<HomeHeroRecord> {
  return prisma.homeHero.upsert({
    where: { id: HERO_ID },
    create: {
      id: HERO_ID,
      welcomeEs: data.welcomeEs,
      welcomeEn: data.welcomeEn,
      descriptionEs: data.descriptionEs,
      descriptionEn: data.descriptionEn,
      backgroundImage: data.backgroundImage,
      impact1Es: data.impact1Es,
      impact1En: data.impact1En,
      impact2Es: data.impact2Es,
      impact2En: data.impact2En,
      impact3Es: data.impact3Es,
      impact3En: data.impact3En,
    },
    update: {
      welcomeEs: data.welcomeEs,
      welcomeEn: data.welcomeEn,
      descriptionEs: data.descriptionEs,
      descriptionEn: data.descriptionEn,
      backgroundImage: data.backgroundImage,
      impact1Es: data.impact1Es,
      impact1En: data.impact1En,
      impact2Es: data.impact2Es,
      impact2En: data.impact2En,
      impact3Es: data.impact3Es,
      impact3En: data.impact3En,
    },
    select: {
      welcomeEs: true,
      welcomeEn: true,
      descriptionEs: true,
      descriptionEn: true,
      backgroundImage: true,
      impact1Es: true,
      impact1En: true,
      impact2Es: true,
      impact2En: true,
      impact3Es: true,
      impact3En: true,
    },
  });
}
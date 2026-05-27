import { prisma } from "@/lib/prisma";

export const ABOUT_SECTION_KEYS = {
  INTRO: "INTRO",
  MISSION: "MISSION",
  VISION: "VISION",
  VALUES: "VALUES",
  COUNTRIES: "COUNTRIES",
  SERVICES: "SERVICES",
  WHY_US: "WHY_US",
  EXPERIENCE: "EXPERIENCE",
} as const;

export type AboutSectionKey = (typeof ABOUT_SECTION_KEYS)[keyof typeof ABOUT_SECTION_KEYS];

export type AboutSectionOrderRecord = {
  section: AboutSectionKey;
  position: number;
  fixed: boolean;
  visible: boolean;
};

export async function getAboutSectionOrderFromDb(): Promise<AboutSectionOrderRecord[]> {
  return prisma.adminAboutSectionOrder.findMany({
    orderBy: { position: "asc" },
    select: {
      section: true,
      position: true,
      fixed: true,
      visible: true,
    },
  });
}

export async function replaceAboutSectionOrderInDb(
  sections: Array<{ section: AboutSectionKey; position: number; visible: boolean }>
): Promise<AboutSectionOrderRecord[]> {
  await prisma.$transaction(async (tx) => {
    await tx.adminAboutSectionOrder.deleteMany();
    await tx.adminAboutSectionOrder.createMany({
      data: sections.map((item) => ({
        section: item.section,
        position: item.position,
        fixed: false,
        visible: item.visible,
      })),
    });
  });

  return getAboutSectionOrderFromDb();
}

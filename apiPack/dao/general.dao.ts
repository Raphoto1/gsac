import { prisma } from "@/lib/prisma";
import type { GeneralInfo } from "@/types/general";
import { DEFAULT_GENERAL_INFO } from "@/types/general";

export async function getGeneralInfoFromDb(): Promise<GeneralInfo> {
  const data = await prisma.homeGeneralInfo.findUnique({
    where: { id: "general_info" },
  });

  if (!data) {
    return DEFAULT_GENERAL_INFO;
  }

  return {
    id: data.id,
    companyName: {
      es: data.companyNameEs,
      en: data.companyNameEn,
    },
    nit: data.nit,
    tagline: {
      es: data.taglineEs,
      en: data.taglineEn,
    },
    rights: {
      es: data.rightsEs,
      en: data.rightsEn,
    },
  };
}

export async function upsertGeneralInfoInDb(generalInfo: GeneralInfo): Promise<GeneralInfo> {
  const data = await prisma.homeGeneralInfo.upsert({
    where: { id: "general_info" },
    create: {
      id: "general_info",
      companyNameEs: generalInfo.companyName.es,
      companyNameEn: generalInfo.companyName.en,
      nit: generalInfo.nit,
      taglineEs: generalInfo.tagline.es,
      taglineEn: generalInfo.tagline.en,
      rightsEs: generalInfo.rights.es,
      rightsEn: generalInfo.rights.en,
    },
    update: {
      companyNameEs: generalInfo.companyName.es,
      companyNameEn: generalInfo.companyName.en,
      nit: generalInfo.nit,
      taglineEs: generalInfo.tagline.es,
      taglineEn: generalInfo.tagline.en,
      rightsEs: generalInfo.rights.es,
      rightsEn: generalInfo.rights.en,
    },
  });

  return {
    id: data.id,
    companyName: {
      es: data.companyNameEs,
      en: data.companyNameEn,
    },
    nit: data.nit,
    tagline: {
      es: data.taglineEs,
      en: data.taglineEn,
    },
    rights: {
      es: data.rightsEs,
      en: data.rightsEn,
    },
  };
}

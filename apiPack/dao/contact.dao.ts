import { prisma } from "@/lib/prisma";
import type { ContactInfo } from "@/types/contact";
import { DEFAULT_CONTACT_INFO } from "@/types/contact";

export async function getContactInfoFromDb(): Promise<ContactInfo> {
  const data = await prisma.homeContactInfo.findUnique({
    where: { id: "contact_info" },
  });

  if (!data) {
    return DEFAULT_CONTACT_INFO;
  }

  return {
    id: data.id,
    companyName: data.companyName,
    nit: data.nit,
    email: data.email,
    phone: data.phone,
    address: data.address,
  };
}

export async function upsertContactInfoInDb(
  contactInfo: ContactInfo
): Promise<ContactInfo> {
  const data = await prisma.homeContactInfo.upsert({
    where: { id: "contact_info" },
    create: {
      id: "contact_info",
      companyName: contactInfo.companyName,
      nit: contactInfo.nit,
      email: contactInfo.email,
      phone: contactInfo.phone,
      address: contactInfo.address || "",
    },
    update: {
      companyName: contactInfo.companyName,
      nit: contactInfo.nit,
      email: contactInfo.email,
      phone: contactInfo.phone,
      address: contactInfo.address || "",
    },
  });

  return {
    id: data.id,
    companyName: data.companyName,
    nit: data.nit,
    email: data.email,
    phone: data.phone,
    address: data.address,
  };
}

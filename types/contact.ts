export type ContactInfo = {
  id: string;
  companyName: string;
  nit: string;
  email: string;
  phone: string;
  address?: string;
};

export const DEFAULT_CONTACT_INFO: ContactInfo = {
  id: "contact_info",
  companyName: "GS Capital S.A.S.",
  nit: "123456789-0",
  email: "info@gsac.com",
  phone: "+1 234 567 890",
  address: "",
};

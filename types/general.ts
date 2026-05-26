export type GeneralInfo = {
  id: string;
  companyName: {
    es: string;
    en: string;
  };
  nit: string;
  tagline: {
    es: string;
    en: string;
  };
  rights: {
    es: string;
    en: string;
  };
};

export const DEFAULT_GENERAL_INFO: GeneralInfo = {
  id: "general_info",
  companyName: {
    es: "GS Capital S.A.S.",
    en: "GS Capital S.A.S.",
  },
  nit: "123456789-0",
  tagline: {
    es: "Operado por GSA Financieros",
    en: "Operated by GSA Financieros",
  },
  rights: {
    es: "Todos los derechos reservados",
    en: "All rights reserved",
  },
};

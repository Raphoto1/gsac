const fs = require("fs");
const path = require("path");
const dotenv = require("dotenv");
const {
  PrismaClient,
  HomeSectionKey,
  CompanyListKind,
  AboutSectionKey,
  AboutCardSectionKey,
} = require("@prisma/client");
const { PrismaPg } = require("@prisma/adapter-pg");
const { Pool } = require("pg");
const { list, del } = require("@vercel/blob");

const rootDir = path.resolve(__dirname, "..");

dotenv.config({ path: path.join(rootDir, ".env") });
dotenv.config({ path: path.join(rootDir, ".env.local"), override: true });

function normalizePostgresSslMode(url) {
  if (!(url.startsWith("postgresql://") || url.startsWith("postgres://"))) {
    return url;
  }

  try {
    const parsed = new URL(url);
    const sslMode = parsed.searchParams.get("sslmode");

    if (!sslMode) {
      return url;
    }

    const normalized = sslMode.toLowerCase();
    if (normalized === "prefer" || normalized === "require" || normalized === "verify-ca") {
      parsed.searchParams.set("sslmode", "verify-full");
      return parsed.toString();
    }

    return url;
  } catch {
    return url;
  }
}

function buildPrismaClient() {
  const rawResolvedUrl =
    process.env.DATABASE_URL ??
    process.env.PRISMA_DATABASE_URL ??
    process.env.POSTGRES_URL;

  if (!rawResolvedUrl) {
    throw new Error(
      "Missing Prisma connection URL. Define DATABASE_URL, PRISMA_DATABASE_URL, or POSTGRES_URL."
    );
  }

  const resolvedUrl = normalizePostgresSslMode(rawResolvedUrl);

  if (
    resolvedUrl.startsWith("prisma://") ||
    resolvedUrl.startsWith("prisma+postgres://")
  ) {
    return new PrismaClient({
      accelerateUrl: resolvedUrl,
      log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
    });
  }

  if (
    resolvedUrl.startsWith("postgresql://") ||
    resolvedUrl.startsWith("postgres://")
  ) {
    const pool = new Pool({ connectionString: resolvedUrl });
    const adapter = new PrismaPg(pool);

    return new PrismaClient({
      adapter,
      log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
    });
  }

  throw new Error(
    "Invalid database URL protocol. Use prisma://, prisma+postgres://, postgresql:// or postgres://"
  );
}

const prisma = buildPrismaClient();

function readJson(relativePath) {
  return JSON.parse(fs.readFileSync(path.join(rootDir, relativePath), "utf8"));
}

const messagesEs = readJson(path.join("messages", "es.json"));
const messagesEn = readJson(path.join("messages", "en.json"));

const HERO_BACKGROUND_IMAGE = "https://images.pexels.com/photos/3183197/pexels-photo-3183197.jpeg";
const BIGCARD_IMAGE = "https://images.pexels.com/photos/3184423/pexels-photo-3184423.jpeg";
const CASE_IMAGES = [
  "https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg",
  "https://images.pexels.com/photos/3184306/pexels-photo-3184306.jpeg",
  "https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg",
  "https://images.pexels.com/photos/3184339/pexels-photo-3184339.jpeg",
];
const TEAM_PHOTOS = [
  "https://images.pexels.com/photos/3777946/pexels-photo-3777946.jpeg",
  "https://images.pexels.com/photos/2381069/pexels-photo-2381069.jpeg",
  "https://images.pexels.com/photos/3760263/pexels-photo-3760263.jpeg",
  "https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg",
];
const PRODUCTS_HEADER = {
  titleEs: "Nuestros servicios",
  titleEn: "Our Services",
  descriptionEs: "Explora nuestro catalogo",
  descriptionEn: "Explore our catalog",
  secondaryDescriptionEs: "Integramos soluciones pensadas para mejorar control, eficiencia operativa y capacidad de crecimiento en cada etapa del negocio.",
  secondaryDescriptionEn: "We integrate solutions designed to improve control, operational efficiency, and growth capacity at every stage of the business.",
  imageUrl: "https://images.pexels.com/photos/7698796/pexels-photo-7698796.jpeg",
};

const CONTACT_INFO = {
  companyName: "GS Capital S.A.S.",
  nit: "123456789-0",
  email: "info@gsac.com",
  phone: "+1 234 567 890",
  address: "",
};

const GENERAL_INFO = {
  companyNameEs: "GS Capital S.A.S.",
  companyNameEn: "GS Capital S.A.S.",
  nit: "123456789-0",
  taglineEs: "Operado por GSA Financieros",
  taglineEn: "Operated by GSA Financieros",
  rightsEs: "Todos los derechos reservados",
  rightsEn: "All rights reserved",
};

const ABOUT_SECTION_ORDER = [
  { section: AboutSectionKey.INTRO, position: 1, fixed: false, visible: true },
  { section: AboutSectionKey.MISSION, position: 2, fixed: false, visible: true },
  { section: AboutSectionKey.VISION, position: 3, fixed: false, visible: true },
  { section: AboutSectionKey.VALUES, position: 4, fixed: false, visible: true },
  { section: AboutSectionKey.COUNTRIES, position: 5, fixed: false, visible: true },
  { section: AboutSectionKey.SERVICES, position: 6, fixed: false, visible: true },
  { section: AboutSectionKey.WHY_US, position: 7, fixed: false, visible: true },
  { section: AboutSectionKey.EXPERIENCE, position: 8, fixed: false, visible: true },
];

const ABOUT_CARD_SECTIONS = [
  {
    section: AboutCardSectionKey.INTRO,
    titleEs: "Acerca de nosotros",
    titleEn: "About Us",
    descriptionEs:
      "GS Capital acompana a organizaciones de impacto en la estructuracion, fortalecimiento y ejecucion de su estrategia financiera, integrando consultoria especializada, diseno de modelos de sostenibilidad, estructuracion de proyectos de inversion y estrategias de fundraising.",
    descriptionEn:
      "GS Capital supports impact organizations in structuring, strengthening, and executing their financial strategy by integrating specialized consulting, sustainability model design, investment project structuring, and fundraising strategies.",
    imageUrl: "https://images.pexels.com/photos/48195/document-agreement-documents-sign-48195.jpeg",
  },
  {
    section: AboutCardSectionKey.MISSION,
    titleEs: "Mision",
    titleEn: "Mission",
    descriptionEs:
      "Acompanhar a organizaciones, empresas y actores del ecosistema de desarrollo en la estructuracion, fortalecimiento y ejecucion de su estrategia financiera.",
    descriptionEn:
      "To support organizations, companies, and actors within the development ecosystem in structuring, strengthening, and executing their financial strategy.",
    imageUrl: "https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg",
  },
  {
    section: AboutCardSectionKey.VISION,
    titleEs: "Vision",
    titleEn: "Vision",
    descriptionEs:
      "Ser una firma referente en America Latina en la estructuracion de soluciones financieras para organizaciones y empresas que operan en contextos de desarrollo.",
    descriptionEn:
      "To be a leading firm in Latin America in structuring financial solutions for organizations and companies operating in development contexts.",
    imageUrl: "https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg",
  },
  {
    section: AboutCardSectionKey.SERVICES,
    titleEs: "Que servicio especifico les prestamos?",
    titleEn: "What specific service do we provide?",
    descriptionEs:
      "GS Capital presta servicios de consultoria, asesoria y estructuracion financiera para ONGs, fundaciones y organizaciones de impacto.",
    descriptionEn:
      "GS Capital provides consulting, advisory, and financial structuring services for NGOs, foundations, and impact organizations.",
    imageUrl: "https://images.pexels.com/photos/48195/document-agreement-documents-sign-48195.jpeg",
  },
  {
    section: AboutCardSectionKey.WHY_US,
    titleEs: "Por que elegirnos?",
    titleEn: "Why choose us?",
    descriptionEs:
      "GS Capital combina el rigor de una firma financiera con un entendimiento profundo de organizaciones que operan en contextos de desarrollo.",
    descriptionEn:
      "GS Capital combines the rigor of a financial firm with a deep understanding of organizations operating in development contexts.",
    imageUrl: "https://images.pexels.com/photos/48195/document-agreement-documents-sign-48195.jpeg",
  },
  {
    section: AboutCardSectionKey.EXPERIENCE,
    titleEs: "Nuestra Experiencia y Origen",
    titleEn: "Our Experience and Origin",
    descriptionEs:
      "GS Capital opera como un spin-off de GSA Financieros S.A.S., firma colombiana fundada en 2013 con una trayectoria consolidada en asesoria bancaria.",
    descriptionEn:
      "GS Capital operates as a spin-off of GSA Financieros S.A.S., a Colombian firm founded in 2013 with a solid track record in banking advisory.",
    imageUrl: "https://images.pexels.com/photos/48195/document-agreement-documents-sign-48195.jpeg",
  },
];

const ABOUT_VALUES = [
  {
    valueKey: "financialRigor",
    titleEs: "Rigor financiero",
    titleEn: "Financial rigor",
    descriptionEs: "Aplicamos estandares tecnicos propios de la industria financiera en cada proceso.",
    descriptionEn: "We apply technical standards drawn from the financial industry in every process.",
  },
  {
    valueKey: "executionFocus",
    titleEs: "Enfoque en ejecucion",
    titleEn: "Execution focus",
    descriptionEs: "No nos limitamos al diagnostico. Disenamos soluciones que pueden implementarse en contextos reales.",
    descriptionEn: "We do not stop at diagnosis. We design solutions that can be implemented in real contexts.",
  },
  {
    valueKey: "sustainability",
    titleEs: "Sostenibilidad como principio",
    titleEn: "Sustainability as a principle",
    descriptionEs: "Promovemos modelos financieros que aseguren la continuidad de las organizaciones en el tiempo.",
    descriptionEn: "We promote financial models that ensure organizations can endure over time.",
  },
  {
    valueKey: "strategyCapitalAlignment",
    titleEs: "Alineacion entre estrategia y capital",
    titleEn: "Alignment between strategy and capital",
    descriptionEs: "Conectamos los objetivos estrategicos con estructuras financieras coherentes.",
    descriptionEn: "We connect strategic objectives with coherent financial structures.",
  },
];

const ABOUT_COUNTRIES = ["CO", "MX", "UY", "AR", "CL"];

const NEWS_ARTICLES = [
  {
    slug: "solucion-control-financiero-pymes",
    isActive: true,
    date: "15 marzo 2026",
    imageUrl:
      "https://images.pexels.com/photos/6694543/pexels-photo-6694543.jpeg?auto=compress&cs=tinysrgb&w=1200",
    titleEs: "Lanzamos una nueva solucion de control financiero para pymes",
    titleEn: "We launched a new financial control solution for SMEs",
    categoryEs: "Producto",
    categoryEn: "Product",
    excerptEs:
      "Presentamos una herramienta enfocada en flujo de caja, proyecciones y alertas para decisiones mas rapidas.",
    excerptEn:
      "We introduced a tool focused on cash flow, forecasts, and alerts for faster decisions.",
    contentEs: [
      "Control financiero en un solo lugar.",
      "Flujo de caja actualizado, alertas y proyecciones.",
    ],
    contentEn: [
      "Financial control in one place.",
      "Updated cash flow, alerts, and forecasting.",
    ],
  },
  {
    slug: "encuentro-innovacion-empresarial",
    isActive: true,
    date: "2 marzo 2026",
    imageUrl: null,
    titleEs: "GSAC participa en encuentro regional de innovacion empresarial",
    titleEn: "GSAC joins a regional business innovation meeting",
    categoryEs: "Eventos",
    categoryEn: "Events",
    excerptEs:
      "Compartimos casos practicos sobre implementacion tecnologica y optimizacion de procesos en distintos sectores.",
    excerptEn:
      "We shared practical cases on technology implementation and process optimization.",
    contentEs: [
      "Presentamos una charla de transformacion digital orientada a resultados.",
      "Mostramos experiencias reales con clientes en automatizacion.",
    ],
    contentEn: [
      "We presented a digital transformation talk focused on measurable outcomes.",
      "We showed real client automation experiences.",
    ],
  },
  {
    slug: "alianza-estrategica-consultoria",
    isActive: true,
    date: "21 febrero 2026",
    imageUrl:
      "https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=1200",
    titleEs: "Nueva alianza estrategica para fortalecer servicios de consultoria",
    titleEn: "New strategic alliance to strengthen consulting services",
    categoryEs: "Alianzas",
    categoryEn: "Partnerships",
    excerptEs:
      "Firmamos un acuerdo para ampliar capacidades en analisis financiero y acompanamiento operativo.",
    excerptEn:
      "We signed an agreement to expand capabilities in financial analysis and operational support.",
    contentEs: [
      "La alianza incorpora especialistas en planeacion y control de gestion.",
      "El trabajo conjunto busca acelerar la ejecucion de mejoras.",
    ],
    contentEn: [
      "The alliance adds specialists in planning and management control.",
      "The collaboration aims to accelerate improvement execution.",
    ],
  },
];

const PRODUCTS_ITEMS = [
  {
    position: 1,
    titleEs: "Estrategia y Planeacion Financiera",
    titleEn: "Financial Strategy & Planning",
    descriptionEs: "Consultoria estrategica para estructurar, ordenar o redefinir el modelo financiero y la ruta de crecimiento.",
    descriptionEn: "Strategic consulting to structure, organize, or redefine the financial model and growth path.",
    icon: "briefcase",
    expandTitleEs: "Estrategia y Planeacion Financiera",
    expandTitleEn: "Financial Strategy & Planning",
    expandTextEs: "Que es y para quien?\nServicio de consultoria estrategica para organizaciones y empresas que necesitan estructurar, ordenar o redefinir su modelo financiero y su ruta de crecimiento.",
    expandTextEn: "What is it and for whom?\nStrategic consulting service for organizations and companies that need to structure, organize, or redefine their financial model and growth path.",
    expandImageUrl: "https://images.pexels.com/photos/6694543/pexels-photo-6694543.jpeg",
  },
  {
    position: 2,
    titleEs: "Estructuracion de Modelos de Fundraising",
    titleEn: "Fundraising Model Structuring",
    descriptionEs: "Diseno y optimizacion de estrategias de recaudo para fortalecer y diversificar fuentes de financiamiento.",
    descriptionEn: "Design and optimization of fundraising strategies to strengthen and diversify funding sources.",
    icon: "rocket",
    expandTitleEs: "Estructuracion de Modelos de Fundraising",
    expandTitleEn: "Fundraising Model Structuring",
    expandTextEs: "Que es y para quien?\nDiseno y optimizacion de estrategias de recaudo para organizaciones que dependen o quieren fortalecer sus fuentes de financiamiento.",
    expandTextEn: "What is it and for whom?\nDesign and optimization of fundraising strategies for organizations that depend on or want to strengthen their funding sources.",
    expandImageUrl: "https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg",
  },
  {
    position: 3,
    titleEs: "Estructuracion de Proyectos de Inversion",
    titleEn: "Investment Project Structuring",
    descriptionEs: "Servicio para estructurar proyectos y acceder a financiamiento o inversion con una base financiera solida.",
    descriptionEn: "Service to structure projects and access financing or investment with a solid financial foundation.",
    icon: "globe",
    expandTitleEs: "Estructuracion de Proyectos de Inversion",
    expandTitleEn: "Investment Project Structuring",
    expandTextEs: "Que es y para quien?\nServicio dirigido a organizaciones y empresas que necesitan estructurar proyectos para acceder a financiamiento o inversion.",
    expandTextEn: "What is it and for whom?\nService aimed at organizations and companies that need to structure projects to access financing or investment.",
    expandImageUrl: "https://images.pexels.com/photos/4386370/pexels-photo-4386370.jpeg",
  },
  {
    position: 4,
    titleEs: "Finanzas para el Desarrollo e Inversion de Impacto",
    titleEn: "Finance for Development & Impact Investment",
    descriptionEs: "Soluciones financieras con enfoque de impacto para organizaciones y actores que operan en contextos de desarrollo.",
    descriptionEn: "Financial solutions with an impact focus for organizations and actors operating in development contexts.",
    icon: "construct",
    expandTitleEs: "Finanzas para el Desarrollo e Inversion de Impacto",
    expandTitleEn: "Finance for Development & Impact Investment",
    expandTextEs: "Que es y para quien?\nServicio especializado para organizaciones, empresas y actores que operan en contextos de desarrollo y buscan estructurar soluciones financieras con enfoque de impacto.",
    expandTextEn: "What is it and for whom?\nSpecialized service for organizations, companies, and actors operating in development contexts seeking to structure financial solutions with an impact focus.",
    expandImageUrl: "https://images.pexels.com/photos/6771985/pexels-photo-6771985.jpeg",
  },
  {
    position: 5,
    titleEs: "Asesoria Financiera Estrategica (CFO externo)",
    titleEn: "Strategic Financial Advisory (External CFO)",
    descriptionEs: "Acompanamiento continuo para tomar mejores decisiones financieras sin depender de un equipo interno robusto.",
    descriptionEn: "Ongoing support to make better financial decisions without relying on a large internal team.",
    icon: "settings",
    expandTitleEs: "Asesoria Financiera Estrategica (CFO externo)",
    expandTitleEn: "Strategic Financial Advisory (External CFO)",
    expandTextEs: "Que es y para quien?\nAcompanamiento continuo para organizaciones y empresas que requieren soporte financiero estrategico sin tener un equipo interno robusto.",
    expandTextEn: "What is it and for whom?\nOngoing support for organizations and companies that require strategic financial guidance without a large internal team.",
    expandImageUrl: "https://images.pexels.com/photos/3184328/pexels-photo-3184328.jpeg",
  },
];

const DEFAULT_SECTION_ORDER = [
  { section: HomeSectionKey.HERO, position: 1, fixed: true, visible: true },
  { section: HomeSectionKey.BIGCARD, position: 2, fixed: false, visible: true },
  { section: HomeSectionKey.CASES, position: 3, fixed: false, visible: true },
  { section: HomeSectionKey.TEAM, position: 4, fixed: false, visible: true },
  { section: HomeSectionKey.HOLDINGS, position: 5, fixed: false, visible: true },
  { section: HomeSectionKey.CLIENTS, position: 6, fixed: false, visible: true },
  { section: HomeSectionKey.CONTACT, position: 7, fixed: true, visible: true },
];

const CASE_ORGANIZATION_TYPES = ["ONG", "ONG", "Startup", "Pyme"];

const TEAM_MEMBERS = [
  {
    name: "Estrategia / Strategy",
    role: "Dirección de crecimiento y ejecución / Growth and execution leadership",
    photo: TEAM_PHOTOS[0],
  },
  {
    name: "Estructuración financiera / Financial structuring",
    role: "Modelos de sostenibilidad y planeación de capital / Sustainability models and capital planning",
    photo: TEAM_PHOTOS[1],
  },
  {
    name: "Fundraising y alianzas / Fundraising and partnerships",
    role: "Estrategia de donantes, grants y aliados / Donor, grants, and alliance strategy",
    photo: TEAM_PHOTOS[2],
  },
  {
    name: "Proyectos de inversión / Investment projects",
    role: "Estructuración de impacto y despliegue / Impact structuring and delivery",
    photo: TEAM_PHOTOS[3],
  },
];

const HOLDINGS_ITEMS = [
  {
    kind: CompanyListKind.HOLDINGS,
    position: 1,
    nameEs: "GSA Financieros S.A.S.",
    nameEn: "GSA Financieros S.A.S.",
    descriptionEs: "Firma especializada en asesoria financiera, calculo actuarial, liquidacion de prestamos y analisis tecnico de productos financieros.",
    descriptionEn: "A firm specialized in financial advisory, actuarial calculations, loan settlements, and technical analysis of financial products.",
    logo: "https://images.pexels.com/photos/355952/pexels-photo-355952.jpeg",
    relationshipEs: null,
    relationshipEn: null,
    relationshipLabelEs: null,
    relationshipLabelEn: null,
    website: "https://www.gsafinancieros.com/",
    websiteLabelEs: null,
    websiteLabelEn: null,
    caseHref: null,
    caseLabelEs: null,
    caseLabelEn: null,
  },
];

const CLIENTS_ITEMS = [
  {
    kind: CompanyListKind.CLIENTS,
    position: 1,
    nameEs: "Fundemex",
    nameEn: "Fundemex",
    descriptionEs: messagesEs.companiesClients.items.fundemex.description,
    descriptionEn: messagesEn.companiesClients.items.fundemex.description,
    logo: "/img/logos/fundemex.jpg",
    relationshipEs: messagesEs.companiesClients.items.fundemex.relationship,
    relationshipEn: messagesEn.companiesClients.items.fundemex.relationship,
    relationshipLabelEs: messagesEs.companiesClients.relationshipLabel,
    relationshipLabelEn: messagesEn.companiesClients.relationshipLabel,
    website: messagesEs.companiesClients.items.fundemex.website,
    websiteLabelEs: messagesEs.companiesClients.websiteLabel,
    websiteLabelEn: messagesEn.companiesClients.websiteLabel,
    caseHref: null,
    caseLabelEs: null,
    caseLabelEn: null,
  },
  {
    kind: CompanyListKind.CLIENTS,
    position: 2,
    nameEs: "Aldeas Infantiles SOS Colombia",
    nameEn: "Aldeas Infantiles SOS Colombia",
    descriptionEs: messagesEs.companiesClients.items.aldeasInfantiles.description,
    descriptionEn: messagesEn.companiesClients.items.aldeasInfantiles.description,
    logo: "/img/logos/aldeas-infantiles-sos.png",
    relationshipEs: messagesEs.companiesClients.items.aldeasInfantiles.relationship,
    relationshipEn: messagesEn.companiesClients.items.aldeasInfantiles.relationship,
    relationshipLabelEs: messagesEs.companiesClients.relationshipLabel,
    relationshipLabelEn: messagesEn.companiesClients.relationshipLabel,
    website: messagesEs.companiesClients.items.aldeasInfantiles.website,
    websiteLabelEs: messagesEs.companiesClients.websiteLabel,
    websiteLabelEn: messagesEn.companiesClients.websiteLabel,
    caseHref: null,
    caseLabelEs: null,
    caseLabelEn: null,
  },
  {
    kind: CompanyListKind.CLIENTS,
    position: 3,
    nameEs: "TECHO Internacional",
    nameEn: "TECHO International",
    descriptionEs: messagesEs.companiesClients.items.techo.description,
    descriptionEn: messagesEn.companiesClients.items.techo.description,
    logo: "/img/logos/techo.svg",
    relationshipEs: messagesEs.companiesClients.items.techo.relationship,
    relationshipEn: messagesEn.companiesClients.items.techo.relationship,
    relationshipLabelEs: messagesEs.companiesClients.relationshipLabel,
    relationshipLabelEn: messagesEn.companiesClients.relationshipLabel,
    website: messagesEs.companiesClients.items.techo.website,
    websiteLabelEs: messagesEs.companiesClients.websiteLabel,
    websiteLabelEn: messagesEn.companiesClients.websiteLabel,
    caseHref: null,
    caseLabelEs: null,
    caseLabelEn: null,
  },
  {
    kind: CompanyListKind.CLIENTS,
    position: 4,
    nameEs: "Agualongo",
    nameEn: "Agualongo",
    descriptionEs: messagesEs.companiesClients.items.agualongo.description,
    descriptionEn: messagesEn.companiesClients.items.agualongo.description,
    logo: "/img/logos/agualongo.png",
    relationshipEs: messagesEs.companiesClients.items.agualongo.relationship,
    relationshipEn: messagesEn.companiesClients.items.agualongo.relationship,
    relationshipLabelEs: messagesEs.companiesClients.relationshipLabel,
    relationshipLabelEn: messagesEn.companiesClients.relationshipLabel,
    website: messagesEs.companiesClients.items.agualongo.website,
    websiteLabelEs: messagesEs.companiesClients.websiteLabel,
    websiteLabelEn: messagesEn.companiesClients.websiteLabel,
    caseHref: null,
    caseLabelEs: null,
    caseLabelEn: null,
  },
  {
    kind: CompanyListKind.CLIENTS,
    position: 5,
    nameEs: "Socialab",
    nameEn: "Socialab",
    descriptionEs: messagesEs.companiesClients.items.socialab.description,
    descriptionEn: messagesEn.companiesClients.items.socialab.description,
    logo: "/img/logos/socialab.png",
    relationshipEs: messagesEs.companiesClients.items.socialab.relationship,
    relationshipEn: messagesEn.companiesClients.items.socialab.relationship,
    relationshipLabelEs: messagesEs.companiesClients.relationshipLabel,
    relationshipLabelEn: messagesEn.companiesClients.relationshipLabel,
    website: messagesEs.companiesClients.items.socialab.website,
    websiteLabelEs: messagesEs.companiesClients.websiteLabel,
    websiteLabelEn: messagesEn.companiesClients.websiteLabel,
    caseHref: null,
    caseLabelEs: null,
    caseLabelEn: null,
  },
  {
    kind: CompanyListKind.CLIENTS,
    position: 6,
    nameEs: "Matteria",
    nameEn: "Matteria",
    descriptionEs: messagesEs.companiesClients.items.matteria.description,
    descriptionEn: messagesEn.companiesClients.items.matteria.description,
    logo: "/img/logos/matteria.png",
    relationshipEs: messagesEs.companiesClients.items.matteria.relationship,
    relationshipEn: messagesEn.companiesClients.items.matteria.relationship,
    relationshipLabelEs: messagesEs.companiesClients.relationshipLabel,
    relationshipLabelEn: messagesEn.companiesClients.relationshipLabel,
    website: messagesEs.companiesClients.items.matteria.website,
    websiteLabelEs: messagesEs.companiesClients.websiteLabel,
    websiteLabelEn: messagesEn.companiesClients.websiteLabel,
    caseHref: null,
    caseLabelEs: null,
    caseLabelEn: null,
  },
  {
    kind: CompanyListKind.CLIENTS,
    position: 7,
    nameEs: "Territoria",
    nameEn: "Territoria",
    descriptionEs: messagesEs.companiesClients.items.territoria.description,
    descriptionEn: messagesEn.companiesClients.items.territoria.description,
    logo: "/img/logos/territoria.png",
    relationshipEs: messagesEs.companiesClients.items.territoria.relationship,
    relationshipEn: messagesEn.companiesClients.items.territoria.relationship,
    relationshipLabelEs: messagesEs.companiesClients.relationshipLabel,
    relationshipLabelEn: messagesEn.companiesClients.relationshipLabel,
    website: messagesEs.companiesClients.items.territoria.website,
    websiteLabelEs: messagesEs.companiesClients.websiteLabel,
    websiteLabelEn: messagesEn.companiesClients.websiteLabel,
    caseHref: null,
    caseLabelEs: null,
    caseLabelEn: null,
  },
];

function buildCases() {
  const caseKeys = ["case1", "case2", "case3", "case4"];

  return caseKeys.map((caseKey, index) => ({
    position: index + 1,
    titleEs: messagesEs.cases.items[caseKey].title,
    titleEn: messagesEn.cases.items[caseKey].title,
    organizationType: CASE_ORGANIZATION_TYPES[index],
    descriptionEs: messagesEs.cases.items[caseKey].description,
    descriptionEn: messagesEn.cases.items[caseKey].description,
    advancedDescriptionEs: messagesEs.cases.items[caseKey].advancedDescription,
    advancedDescriptionEn: messagesEn.cases.items[caseKey].advancedDescription,
    impactItemsEs: messagesEs.cases.items[caseKey].impactItems.join(", "),
    impactItemsEn: messagesEn.cases.items[caseKey].impactItems.join(", "),
    image: CASE_IMAGES[index],
  }));
}

async function listAllBlobUrls(token) {
  const urls = [];
  let cursor = undefined;
  let hasMore = true;

  while (hasMore) {
    const response = await list({ token, limit: 1000, cursor });
    urls.push(...response.blobs.map((blob) => blob.url));
    cursor = response.cursor;
    hasMore = response.hasMore;
  }

  return urls;
}

async function deleteBlobStoreContents() {
  const token = process.env.BLOB_READ_WRITE_TOKEN;

  if (!token) {
    console.log("BLOB_READ_WRITE_TOKEN no configurado. Se omite limpieza de blob store.");
    return 0;
  }

  const urls = await listAllBlobUrls(token);

  if (!urls.length) {
    console.log("Blob store already empty.");
    return 0;
  }

  const batchSize = 100;
  for (let index = 0; index < urls.length; index += batchSize) {
    const batch = urls.slice(index, index + batchSize);
    await del(batch, { token });
  }

  console.log(`Deleted ${urls.length} blob file(s).`);
  return urls.length;
}

async function resetAndSeedDatabase() {
  const cases = buildCases();

  await prisma.$transaction(async (tx) => {
    await tx.homeCompanyListEntry.deleteMany();
    await tx.homeCaseEntry.deleteMany();
    await tx.homeTeamMemberEntry.deleteMany();
    await tx.homeProductEntry.deleteMany();
    await tx.adminHomeSectionOrder.deleteMany();
    await tx.adminAboutSectionOrder.deleteMany();
    await tx.adminAboutCardSection.deleteMany();
    await tx.adminAboutValueEntry.deleteMany();
    await tx.adminAboutCountryEntry.deleteMany();
    await tx.newsArticle.deleteMany();
    await tx.homeCases.deleteMany();
    await tx.homeTeam.deleteMany();

    await tx.homeHero.upsert({
      where: { id: "home_hero" },
      update: {
        welcomeEs: messagesEs.home.welcome,
        welcomeEn: messagesEn.home.welcome,
        descriptionEs: messagesEs.home.description,
        descriptionEn: messagesEn.home.description,
        backgroundImage: HERO_BACKGROUND_IMAGE,
        impact1Es: messagesEs.home.impact.projects,
        impact1En: messagesEn.home.impact.projects,
        impact2Es: messagesEs.home.impact.clients,
        impact2En: messagesEn.home.impact.clients,
        impact3Es: messagesEs.home.impact.sectors,
        impact3En: messagesEn.home.impact.sectors,
      },
      create: {
        id: "home_hero",
        welcomeEs: messagesEs.home.welcome,
        welcomeEn: messagesEn.home.welcome,
        descriptionEs: messagesEs.home.description,
        descriptionEn: messagesEn.home.description,
        backgroundImage: HERO_BACKGROUND_IMAGE,
        impact1Es: messagesEs.home.impact.projects,
        impact1En: messagesEn.home.impact.projects,
        impact2Es: messagesEs.home.impact.clients,
        impact2En: messagesEn.home.impact.clients,
        impact3Es: messagesEs.home.impact.sectors,
        impact3En: messagesEn.home.impact.sectors,
      },
    });

    await tx.homeBigCard.upsert({
      where: { id: "home_bigcard" },
      update: {
        titleEs: messagesEs.bigCard.title,
        titleEn: messagesEn.bigCard.title,
        descriptionEs: messagesEs.bigCard.description,
        descriptionEn: messagesEn.bigCard.description,
        image: BIGCARD_IMAGE,
      },
      create: {
        id: "home_bigcard",
        titleEs: messagesEs.bigCard.title,
        titleEn: messagesEn.bigCard.title,
        descriptionEs: messagesEs.bigCard.description,
        descriptionEn: messagesEn.bigCard.description,
        image: BIGCARD_IMAGE,
      },
    });

    await tx.homeProductsHeader.upsert({
      where: { id: "home_products_header" },
      update: {
        titleEs: PRODUCTS_HEADER.titleEs,
        titleEn: PRODUCTS_HEADER.titleEn,
        descriptionEs: PRODUCTS_HEADER.descriptionEs,
        descriptionEn: PRODUCTS_HEADER.descriptionEn,
        secondaryDescriptionEs: PRODUCTS_HEADER.secondaryDescriptionEs,
        secondaryDescriptionEn: PRODUCTS_HEADER.secondaryDescriptionEn,
        imageUrl: PRODUCTS_HEADER.imageUrl,
      },
      create: {
        id: "home_products_header",
        titleEs: PRODUCTS_HEADER.titleEs,
        titleEn: PRODUCTS_HEADER.titleEn,
        descriptionEs: PRODUCTS_HEADER.descriptionEs,
        descriptionEn: PRODUCTS_HEADER.descriptionEn,
        secondaryDescriptionEs: PRODUCTS_HEADER.secondaryDescriptionEs,
        secondaryDescriptionEn: PRODUCTS_HEADER.secondaryDescriptionEn,
        imageUrl: PRODUCTS_HEADER.imageUrl,
      },
    });

    await tx.homeContactInfo.upsert({
      where: { id: "contact_info" },
      update: {
        companyName: CONTACT_INFO.companyName,
        nit: CONTACT_INFO.nit,
        email: CONTACT_INFO.email,
        phone: CONTACT_INFO.phone,
        address: CONTACT_INFO.address,
      },
      create: {
        id: "contact_info",
        companyName: CONTACT_INFO.companyName,
        nit: CONTACT_INFO.nit,
        email: CONTACT_INFO.email,
        phone: CONTACT_INFO.phone,
        address: CONTACT_INFO.address,
      },
    });

    await tx.homeGeneralInfo.upsert({
      where: { id: "general_info" },
      update: {
        companyNameEs: GENERAL_INFO.companyNameEs,
        companyNameEn: GENERAL_INFO.companyNameEn,
        nit: GENERAL_INFO.nit,
        taglineEs: GENERAL_INFO.taglineEs,
        taglineEn: GENERAL_INFO.taglineEn,
        rightsEs: GENERAL_INFO.rightsEs,
        rightsEn: GENERAL_INFO.rightsEn,
      },
      create: {
        id: "general_info",
        companyNameEs: GENERAL_INFO.companyNameEs,
        companyNameEn: GENERAL_INFO.companyNameEn,
        nit: GENERAL_INFO.nit,
        taglineEs: GENERAL_INFO.taglineEs,
        taglineEn: GENERAL_INFO.taglineEn,
        rightsEs: GENERAL_INFO.rightsEs,
        rightsEn: GENERAL_INFO.rightsEn,
      },
    });

    await tx.newsSectionSettings.upsert({
      where: { id: "news_section" },
      update: { newsEnabled: true },
      create: { id: "news_section", newsEnabled: true },
    });

    await tx.adminHomeSectionOrder.createMany({ data: DEFAULT_SECTION_ORDER });
    await tx.homeCaseEntry.createMany({ data: cases });
    await tx.homeProductEntry.createMany({ data: PRODUCTS_ITEMS });
    await tx.homeTeamMemberEntry.createMany({
      data: TEAM_MEMBERS.map((member, index) => ({
        position: index + 1,
        name: member.name,
        role: member.role,
        photo: member.photo,
        linkedin: null,
      })),
    });
    await tx.homeCompanyListEntry.createMany({
      data: [...HOLDINGS_ITEMS, ...CLIENTS_ITEMS],
    });

    await tx.adminAboutSectionOrder.createMany({ data: ABOUT_SECTION_ORDER });
    await tx.adminAboutCardSection.createMany({ data: ABOUT_CARD_SECTIONS });
    await tx.adminAboutValueEntry.createMany({
      data: ABOUT_VALUES.map((item, index) => ({
        position: index + 1,
        valueKey: item.valueKey,
        titleEs: item.titleEs,
        titleEn: item.titleEn,
        descriptionEs: item.descriptionEs,
        descriptionEn: item.descriptionEn,
      })),
    });
    await tx.adminAboutCountryEntry.createMany({
      data: ABOUT_COUNTRIES.map((name, index) => ({
        position: index + 1,
        name,
      })),
    });

    await tx.newsArticle.createMany({ data: NEWS_ARTICLES });
  });

  console.log("Database reset and seeded successfully.");
}

async function main() {
  console.log("Cleaning blob store...");
  await deleteBlobStoreContents();

  console.log("Resetting and seeding database...");
  await resetAndSeedDatabase();
}

main()
  .catch((error) => {
    console.error("Failed to reset and seed home data.");
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
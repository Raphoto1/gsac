import type { LocalizedText } from "./home-bigcard";

export type HomeProductIcon = "business" | "briefcase" | "construct" | "globe" | "rocket" | "settings";

export type HomeProductsHeader = {
  title: LocalizedText;
  description: LocalizedText;
  secondaryDescription: LocalizedText;
  imageUrl: string;
};

export type HomeProductItem = {
  id: number;
  title: LocalizedText;
  description: LocalizedText;
  icon: HomeProductIcon;
  expandTitle: LocalizedText;
  expandText: LocalizedText;
  expandImage: string;
};

export type HomeProductsData = {
  header: HomeProductsHeader;
  products: HomeProductItem[];
};

export type HomeProductsResponse = HomeProductsData;

export const HOME_PRODUCT_ICON_OPTIONS: HomeProductIcon[] = [
  "briefcase",
  "rocket",
  "globe",
  "construct",
  "settings",
  "business",
];

export const DEFAULT_HOME_PRODUCTS_HEADER: HomeProductsHeader = {
  title: { es: "Nuestros servicios", en: "Our Services" },
  description: { es: "Explora nuestro catalogo", en: "Explore our catalog" },
  secondaryDescription: {
    es: "Integramos soluciones pensadas para mejorar control, eficiencia operativa y capacidad de crecimiento en cada etapa del negocio.",
    en: "We integrate solutions designed to improve control, operational efficiency, and growth capacity at every stage of the business.",
  },
  imageUrl: "https://images.pexels.com/photos/7698796/pexels-photo-7698796.jpeg",
};

export const DEFAULT_HOME_PRODUCTS: HomeProductItem[] = [
  {
    id: 1,
    title: { es: "Estrategia y Planeacion Financiera", en: "Financial Strategy & Planning" },
    description: {
      es: "Consultoria estrategica para estructurar, ordenar o redefinir el modelo financiero y la ruta de crecimiento.",
      en: "Strategic consulting to structure, organize, or redefine the financial model and growth path.",
    },
    icon: "briefcase",
    expandTitle: { es: "Estrategia y Planeacion Financiera", en: "Financial Strategy & Planning" },
    expandText: {
      es: "Que es y para quien?\nServicio de consultoria estrategica para organizaciones y empresas que necesitan estructurar, ordenar o redefinir su modelo financiero y su ruta de crecimiento.\n\nDescripcion detallada\nAcompanamos procesos de planeacion financiera y estrategica, alineando objetivos organizacionales con capacidades reales de financiamiento y operacion. Esto incluye la construccion de modelos financieros, definicion de escenarios de crecimiento, analisis de sostenibilidad y estructuracion de hojas de ruta que permitan tomar decisiones informadas en el corto, mediano y largo plazo. El enfoque combina herramientas de planeacion estrategica con rigor financiero, adaptadas al nivel de madurez de cada organizacion.\n\nCuando lo buscan?\n- Cuando la organizacion esta creciendo sin una estructura financiera clara.\n- Cuando necesita ordenar sus finanzas o tomar decisiones estrategicas relevantes.\n- En procesos de expansion, reestructuracion o cambio de modelo.",
      en: "What is it and for whom?\nStrategic consulting service for organizations and companies that need to structure, organize, or redefine their financial model and growth path.\n\nDetailed description\nWe support financial and strategic planning processes, aligning organizational goals with real financing and operating capabilities. This includes building financial models, defining growth scenarios, sustainability analysis, and structuring roadmaps that enable informed decision making in the short, medium, and long term. The approach combines strategic planning tools with financial rigor, adapted to each organization's maturity level.\n\nWhen do clients look for this?\n- When the organization is growing without a clear financial structure.\n- When they need to organize finances or make major strategic decisions.\n- During expansion, restructuring, or business model changes.",
    },
    expandImage: "https://images.pexels.com/photos/6694543/pexels-photo-6694543.jpeg",
  },
  {
    id: 2,
    title: { es: "Estructuracion de Modelos de Fundraising", en: "Fundraising Model Structuring" },
    description: {
      es: "Diseno y optimizacion de estrategias de recaudo para fortalecer y diversificar fuentes de financiamiento.",
      en: "Design and optimization of fundraising strategies to strengthen and diversify funding sources.",
    },
    icon: "rocket",
    expandTitle: { es: "Estructuracion de Modelos de Fundraising", en: "Fundraising Model Structuring" },
    expandText: {
      es: "Que es y para quien?\nDiseno y optimizacion de estrategias de recaudo para organizaciones que dependen o quieren fortalecer sus fuentes de financiamiento.\n\nDescripcion detallada\nEstructuramos modelos de fundraising integrales que combinan distintos canales de ingresos: donantes individuales, corporate, grants y otros mecanismos de financiamiento. Definimos propuestas de valor, segmentacion de fuentes, estructuras de adquisicion y retencion, y metricas de desempeno. El objetivo es construir sistemas de recaudo sostenibles, escalables y medibles, mas alla de acciones aisladas.\n\nCuando lo buscan?\n- Cuando el recaudo es inestable o poco predecible.\n- Cuando quieren escalar sus ingresos de forma estructurada.\n- Cuando estan diversificando fuentes de financiamiento.",
      en: "What is it and for whom?\nDesign and optimization of fundraising strategies for organizations that depend on or want to strengthen their funding sources.\n\nDetailed description\nWe structure comprehensive fundraising models that combine multiple revenue channels: individual donors, corporate, grants, and other financing mechanisms. We define value propositions, source segmentation, acquisition and retention structures, and performance metrics. The goal is to build sustainable, scalable, and measurable fundraising systems beyond isolated campaigns.\n\nWhen do clients look for this?\n- When fundraising is unstable or unpredictable.\n- When they want to scale revenue structurally.\n- When they are diversifying funding sources.",
    },
    expandImage: "https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg",
  },
  {
    id: 3,
    title: { es: "Estructuracion de Proyectos de Inversion", en: "Investment Project Structuring" },
    description: {
      es: "Servicio para estructurar proyectos y acceder a financiamiento o inversion con una base financiera solida.",
      en: "Service to structure projects and access financing or investment with a solid financial foundation.",
    },
    icon: "globe",
    expandTitle: { es: "Estructuracion de Proyectos de Inversion", en: "Investment Project Structuring" },
    expandText: {
      es: "Que es y para quien?\nServicio dirigido a organizaciones y empresas que necesitan estructurar proyectos para acceder a financiamiento o inversion.\n\nDescripcion detallada\nDisenamos la estructura financiera de proyectos, definiendo necesidades de capital, modelos de ingresos, riesgos, retornos esperados (cuando aplica a inversionistas institucionales) y mecanismos de financiacion. Esto incluye la preparacion de documentos clave, modelos financieros y narrativa para potenciales financiadores o inversionistas, asegurando coherencia entre el proyecto, su impacto y su viabilidad financiera.\n\nCuando lo buscan?\n- Cuando tienen un proyecto y necesitan financiarlo.\n- Cuando quieren acceder a inversionistas, grants o blended finance.\n- Cuando requieren estructurar financieramente una iniciativa antes de ejecutarla.",
      en: "What is it and for whom?\nService aimed at organizations and companies that need to structure projects to access financing or investment.\n\nDetailed description\nWe design project financial structures by defining capital requirements, revenue models, risks, expected returns (when applicable for institutional investors), and financing mechanisms. This includes preparing key documents, financial models, and narrative for potential funders or investors, ensuring consistency between project impact and financial viability.\n\nWhen do clients look for this?\n- When they have a project and need financing.\n- When they want access to investors, grants, or blended finance.\n- When they need to financially structure an initiative before execution.",
    },
    expandImage: "https://images.pexels.com/photos/4386370/pexels-photo-4386370.jpeg",
  },
  {
    id: 4,
    title: { es: "Finanzas para el Desarrollo e Inversion de Impacto", en: "Finance for Development & Impact Investment" },
    description: {
      es: "Soluciones financieras con enfoque de impacto para organizaciones y actores que operan en contextos de desarrollo.",
      en: "Financial solutions with an impact focus for organizations and actors operating in development contexts.",
    },
    icon: "construct",
    expandTitle: { es: "Finanzas para el Desarrollo e Inversion de Impacto", en: "Finance for Development & Impact Investment" },
    expandText: {
      es: "Que es y para quien?\nServicio especializado para organizaciones, empresas y actores que operan en contextos de desarrollo y buscan estructurar soluciones financieras con enfoque de impacto.\n\nDescripcion detallada\nAcompanamos la estructuracion de modelos financieros que conectan necesidades sociales o de desarrollo con instrumentos de financiamiento viables. Esto incluye diseno de esquemas de inversion de impacto, estructuras de blended finance y articulacion entre distintos tipos de capital (filantropico, publico y privado). El enfoque busca equilibrar sostenibilidad financiera con generacion de impacto, bajo estandares de rigor y medicion.\n\nCuando lo buscan?\n- Cuando operan en contextos de desarrollo o impacto.\n- Cuando necesitan estructurar soluciones financieras no tradicionales.\n- Cuando buscan integrar impacto y sostenibilidad financiera.",
      en: "What is it and for whom?\nSpecialized service for organizations, companies, and actors operating in development contexts seeking to structure financial solutions with an impact focus.\n\nDetailed description\nWe support financial models that connect social or development needs with viable financing instruments. This includes impact investment schemes, blended finance structures, and articulation across capital types (philanthropic, public, and private). The approach balances financial sustainability with impact generation under clear measurement standards.\n\nWhen do clients look for this?\n- When operating in development or impact contexts.\n- When they need non-traditional financial structures.\n- When they seek to integrate impact with financial sustainability.",
    },
    expandImage: "https://images.pexels.com/photos/6771985/pexels-photo-6771985.jpeg",
  },
  {
    id: 5,
    title: { es: "Asesoria Financiera Estrategica (CFO externo)", en: "Strategic Financial Advisory (External CFO)" },
    description: {
      es: "Acompanamiento continuo para tomar mejores decisiones financieras sin depender de un equipo interno robusto.",
      en: "Ongoing support to make better financial decisions without relying on a large internal team.",
    },
    icon: "settings",
    expandTitle: { es: "Asesoria Financiera Estrategica (CFO externo)", en: "Strategic Financial Advisory (External CFO)" },
    expandText: {
      es: "Que es y para quien?\nAcompanamiento continuo para organizaciones y empresas que requieren soporte financiero estrategico sin tener un equipo interno robusto.\n\nDescripcion detallada\nActuamos como un aliado estrategico en la toma de decisiones financieras, apoyando en analisis, estructuracion, seguimiento de indicadores, evaluacion de oportunidades y gestion de riesgos. Este servicio permite a las organizaciones contar con capacidades financieras de alto nivel sin necesidad de una estructura interna completa, manteniendo consistencia y calidad en sus decisiones.\n\nCuando lo buscan?\n- Cuando no tienen un CFO o equipo financiero estructurado.\n- Cuando necesitan soporte recurrente para toma de decisiones.\n- Cuando estan en procesos de crecimiento o alta complejidad.",
      en: "What is it and for whom?\nOngoing support for organizations and companies that require strategic financial guidance without a large internal team.\n\nDetailed description\nWe act as a strategic ally in financial decision-making, supporting analysis, structuring, KPI tracking, opportunity evaluation, and risk management. This service allows organizations to access high-level financial capability without building a full internal structure while maintaining consistency and quality in decisions.\n\nWhen do clients look for this?\n- When they do not have a CFO or structured finance team.\n- When they need recurring support for decision-making.\n- During growth or high-complexity periods.",
    },
    expandImage: "https://images.pexels.com/photos/3184328/pexels-photo-3184328.jpeg",
  },
];

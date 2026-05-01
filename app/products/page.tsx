import type { Metadata } from "next";
import { getLocale, getTranslations } from "next-intl/server";
import BigCardProps from "@/components/BigCardProps";
import ProductsList from "@/components/products/ProductsList";
import Cases from "@/components/home/Cases";
import type { ProductItem } from "@/components/products/ProductsList";
import { useTranslations } from "next-intl";
import { buildPageMetadata } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const [locale, t] = await Promise.all([getLocale(), getTranslations("seo")]);

  return buildPageMetadata({
    title: t("productsTitle"),
    description: t("productsDescription"),
    path: "/products",
    locale,
    keywords: ["productos GSAC", "soluciones empresariales", "catalogo de soluciones", "consultoria"],
  });
}

export default function Page() {
  const t = useTranslations("products");
  const products: ProductItem[] = [
    {
      title: "Estrategia y Planeación Financiera",
      description: "Consultoría estratégica para estructurar, ordenar o redefinir el modelo financiero y la ruta de crecimiento.",
      icon: "briefcase",
      expandTitle: "Estrategia y Planeación Financiera",
      expandText:
        "¿Qué es y para quién?\nServicio de consultoría estratégica para organizaciones y empresas que necesitan estructurar, ordenar o redefinir su modelo financiero y su ruta de crecimiento.\n\nDescripción detallada\nAcompañamos procesos de planeación financiera y estratégica, alineando objetivos organizacionales con capacidades reales de financiamiento y operación. Esto incluye la construcción de modelos financieros, definición de escenarios de crecimiento, análisis de sostenibilidad y estructuración de hojas de ruta que permitan tomar decisiones informadas en el corto, mediano y largo plazo. El enfoque combina herramientas de planeación estratégica con rigor financiero, adaptadas al nivel de madurez de cada organización.\n\n¿Cuándo lo buscan?\n- Cuando la organización está creciendo sin una estructura financiera clara.\n- Cuando necesita ordenar sus finanzas o tomar decisiones estratégicas relevantes.\n- En procesos de expansión, reestructuración o cambio de modelo.",
      expandImagage: "https://images.pexels.com/photos/6694543/pexels-photo-6694543.jpeg",
    },
    {
      title: "Estructuración de Modelos de Fundraising",
      description: "Diseño y optimización de estrategias de recaudo para fortalecer y diversificar fuentes de financiamiento.",
      icon: "rocket",
      expandTitle: "Estructuración de Modelos de Fundraising",
      expandText:
        "¿Qué es y para quién?\nDiseño y optimización de estrategias de recaudo para organizaciones que dependen o quieren fortalecer sus fuentes de financiamiento.\n\nDescripción detallada\nEstructuramos modelos de fundraising integrales que combinan distintos canales de ingresos: donantes individuales, corporate, grants y otros mecanismos de financiamiento. Definimos propuestas de valor, segmentación de fuentes, estructuras de adquisición y retención, y métricas de desempeño. El objetivo es construir sistemas de recaudo sostenibles, escalables y medibles, más allá de acciones aisladas.\n\n¿Cuándo lo buscan?\n- Cuando el recaudo es inestable o poco predecible.\n- Cuando quieren escalar sus ingresos de forma estructurada.\n- Cuando están diversificando fuentes de financiamiento.",
      expandImagage: "https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg",
    },
    {
      title: "Estructuración de Proyectos de Inversión",
      description: "Servicio para estructurar proyectos y acceder a financiamiento o inversión con una base financiera sólida.",
      icon: "globe",
      expandTitle: "Estructuración de Proyectos de Inversión",
      expandText:
        "¿Qué es y para quién?\nServicio dirigido a organizaciones y empresas que necesitan estructurar proyectos para acceder a financiamiento o inversión.\n\nDescripción detallada\nDiseñamos la estructura financiera de proyectos, definiendo necesidades de capital, modelos de ingresos, riesgos, retornos esperados (cuando aplica a inversionistas institucionales) y mecanismos de financiación. Esto incluye la preparación de documentos clave, modelos financieros y narrativa para potenciales financiadores o inversionistas, asegurando coherencia entre el proyecto, su impacto y su viabilidad financiera.\n\n¿Cuándo lo buscan?\n- Cuando tienen un proyecto y necesitan financiarlo.\n- Cuando quieren acceder a inversionistas, grants o blended finance.\n- Cuando requieren estructurar financieramente una iniciativa antes de ejecutarla.",
      expandImagage: "https://images.pexels.com/photos/4386370/pexels-photo-4386370.jpeg",
    },
    {
      title: "Finanzas para el Desarrollo e Inversión de Impacto",
      description: "Soluciones financieras con enfoque de impacto para organizaciones y actores que operan en contextos de desarrollo.",
      icon: "construct",
      expandTitle: "Finanzas para el Desarrollo e Inversión de Impacto",
      expandText:
        "¿Qué es y para quién?\nServicio especializado para organizaciones, empresas y actores que operan en contextos de desarrollo y buscan estructurar soluciones financieras con enfoque de impacto.\n\nDescripción detallada\nAcompañamos la estructuración de modelos financieros que conectan necesidades sociales o de desarrollo con instrumentos de financiamiento viables. Esto incluye diseño de esquemas de inversión de impacto, estructuras de blended finance y articulación entre distintos tipos de capital (filantrópico, público y privado). El enfoque busca equilibrar sostenibilidad financiera con generación de impacto, bajo estándares de rigor y medición.\n\n¿Cuándo lo buscan?\n- Cuando operan en contextos de desarrollo o impacto.\n- Cuando necesitan estructurar soluciones financieras no tradicionales.\n- Cuando buscan integrar impacto y sostenibilidad financiera.",
      expandImagage: "https://images.pexels.com/photos/6771985/pexels-photo-6771985.jpeg",
    },
    {
      title: "Asesoría Financiera Estratégica (CFO externo)",
      description: "Acompañamiento continuo para tomar mejores decisiones financieras sin depender de un equipo interno robusto.",
      icon: "settings",
      expandTitle: "Asesoría Financiera Estratégica (CFO externo)",
      expandText:
        "¿Qué es y para quién?\nAcompañamiento continuo para organizaciones y empresas que requieren soporte financiero estratégico sin tener un equipo interno robusto.\n\nDescripción detallada\nActuamos como un aliado estratégico en la toma de decisiones financieras, apoyando en análisis, estructuración, seguimiento de indicadores, evaluación de oportunidades y gestión de riesgos. Este servicio permite a las organizaciones contar con capacidades financieras de alto nivel sin necesidad de una estructura interna completa, manteniendo consistencia y calidad en sus decisiones.\n\n¿Cuándo lo buscan?\n- Cuando no tienen un CFO o equipo financiero estructurado.\n- Cuando necesitan soporte recurrente para toma de decisiones.\n- Cuando están en procesos de crecimiento o alta complejidad.",
      expandImagage: "https://images.pexels.com/photos/3184328/pexels-photo-3184328.jpeg",
    },
  ];

  return (
    <div className="flex flex-col justify-center items-center min-w-full">
      <BigCardProps
        title={t("title")}
        description={t("description")}
        secondaryDescription={t("secondaryDescription")}
        imageUrl='https://images.pexels.com/photos/7698796/pexels-photo-7698796.jpeg'
      />
      <ProductsList products={products} />
      <Cases />
    </div>
  );
}

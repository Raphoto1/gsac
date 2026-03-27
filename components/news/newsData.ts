import type { NewsItem } from "@/components/news/types";

export const sampleNews: NewsItem[] = [
  {
    id: 1,
    slug: "solucion-control-financiero-pymes",
    title: "Lanzamos una nueva solucion de control financiero para pymes",
    category: "Producto",
    date: "15 marzo 2026",
    imageUrl:
      "https://images.pexels.com/photos/6694543/pexels-photo-6694543.jpeg?auto=compress&cs=tinysrgb&w=1200",
    excerpt:
      "Presentamos una herramienta enfocada en flujo de caja, proyecciones y alertas para decisiones mas rapidas.",
    content: [
      "Esta nueva solucion permite centralizar ingresos, egresos y previsiones en un solo panel, facilitando la lectura del estado financiero de la empresa en tiempo real.",
      "Ademas, incorpora alertas automaticas para desvios en presupuestos, vencimientos de pagos y variaciones significativas en gastos operativos.",
      "El objetivo es que equipos pequenos puedan gestionar su operacion con mayor claridad y tomar decisiones basadas en datos, sin complejidad tecnica.",
    ],
  },
  {
    id: 2,
    slug: "encuentro-innovacion-empresarial",
    title: "GSAC participa en encuentro regional de innovacion empresarial",
    category: "Eventos",
    date: "2 marzo 2026",
    excerpt:
      "Compartimos casos practicos sobre implementacion tecnologica y optimizacion de procesos en distintos sectores.",
    content: [
      "Durante el evento, presentamos una charla sobre transformacion digital orientada a resultados medibles, con foco en productividad y trazabilidad.",
      "Tambien mostramos experiencias reales con clientes donde la automatizacion redujo tiempos de operacion y mejoro la visibilidad de indicadores clave.",
      "El intercambio con otras empresas permitio identificar nuevas oportunidades de colaboracion para proximos proyectos.",
    ],
  },
  {
    id: 3,
    slug: "alianza-estrategica-consultoria",
    title: "Nueva alianza estrategica para fortalecer servicios de consultoria",
    category: "Alianzas",
    date: "21 febrero 2026",
    imageUrl:
      "https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=1200",
    excerpt:
      "Firmamos un acuerdo para ampliar capacidades en analisis financiero y acompanamiento operativo.",
    content: [
      "La alianza incorpora especialistas con amplia experiencia en planeacion, control de gestion y estructuracion de modelos de crecimiento.",
      "Con esta integracion podremos ofrecer diagnosticos mas completos y planes de accion por etapas, adaptados a cada cliente.",
      "El trabajo conjunto busca acelerar la ejecucion de mejoras y aumentar el impacto de cada implementacion.",
    ],
  },
];

export function getNewsBySlug(slug: string): NewsItem | undefined {
  return sampleNews.find((item) => item.slug === slug);
}

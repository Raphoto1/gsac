import type { NewsItem } from "@/types/news";

export const sampleNews: NewsItem[] = [
  {
    id: 1,
    isActive: true,
    slug: "solucion-control-financiero-pymes",
    title: "Lanzamos una nueva solucion de control financiero para pymes",
    category: "Producto",
    date: "15 marzo 2026",
    imageUrl:
      "https://images.pexels.com/photos/6694543/pexels-photo-6694543.jpeg?auto=compress&cs=tinysrgb&w=1200",
    excerpt:
      "Presentamos una herramienta enfocada en flujo de caja, proyecciones y alertas para decisiones mas rapidas.",
    content: [
      "<h2>Control financiero en un solo lugar</h2><p>Esta nueva solucion permite <strong>centralizar ingresos, egresos y previsiones</strong> en un solo panel, facilitando la lectura del estado financiero de la empresa en tiempo real.</p>",
      "<ul><li><strong>Flujo de caja</strong> actualizado al momento.</li><li><strong>Alertas automáticas</strong> ante desvíos y vencimientos.</li><li><strong>Proyecciones</strong> para anticipar decisiones con mayor claridad.</li></ul>",
      "<blockquote>El objetivo es que equipos pequenos puedan gestionar su operacion con mayor claridad y tomar decisiones basadas en datos, sin complejidad tecnica.</blockquote>",
    ],
  },
  {
    id: 2,
    isActive: true,
    slug: "encuentro-innovacion-empresarial",
    title: "GSAC participa en encuentro regional de innovacion empresarial",
    category: "Eventos",
    date: "2 marzo 2026",
    excerpt:
      "Compartimos casos practicos sobre implementacion tecnologica y optimizacion de procesos en distintos sectores.",
    content: [
      "<h2>Una charla orientada a resultados</h2><p>Durante el evento, presentamos una charla sobre <strong>transformacion digital</strong> orientada a resultados medibles, con foco en productividad y trazabilidad.</p>",
      "<p>Tambien mostramos experiencias reales con clientes donde la automatizacion redujo tiempos de operacion y mejoro la visibilidad de indicadores clave.</p><ul><li>Procesos mas rapidos.</li><li>Datos mas confiables.</li><li>Menos tareas manuales.</li></ul>",
      "<blockquote>El intercambio con otras empresas permitio identificar nuevas oportunidades de colaboracion para proximos proyectos.</blockquote>",
    ],
  },
  {
    id: 3,
    isActive: true,
    slug: "alianza-estrategica-consultoria",
    title: "Nueva alianza estrategica para fortalecer servicios de consultoria",
    category: "Alianzas",
    date: "21 febrero 2026",
    imageUrl:
      "https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=1200",
    excerpt:
      "Firmamos un acuerdo para ampliar capacidades en analisis financiero y acompanamiento operativo.",
    content: [
      "<h2>Mas capacidad para acompanar proyectos</h2><p>La alianza incorpora especialistas con amplia experiencia en <strong>planeacion</strong>, control de gestion y estructuracion de modelos de crecimiento.</p>",
      "<ul><li>Diagnosticos mas completos.</li><li>Planes de accion por etapas.</li><li>Acompañamiento adaptado a cada cliente.</li></ul>",
      "<p>El trabajo conjunto busca acelerar la ejecucion de mejoras y aumentar el impacto de cada implementacion.</p><blockquote>La colaboracion entre equipos permite ejecutar mejoras con mayor claridad y continuidad.</blockquote>",
    ],
  },
];

export function getNewsBySlug(slug: string): NewsItem | undefined {
  return sampleNews.find((item) => item.slug === slug);
}

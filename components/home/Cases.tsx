"use client";

import { useTranslations } from "next-intl";
import CaseCard from "../CaseCard";
import GeometricLinesBackground from "@/components/utils/particles/GeometricLinesBackground";

export default function Cases() {
  const t = useTranslations("cases");
  const cases = [
    {
      companyName: "Case 1",
      organizationType: "Pyme",
      description: "Description for Case 1",
      advancedDescription:
        "Expanded overview for Case 1. Aqui puedes agregar contexto del reto inicial, el enfoque aplicado y los resultados obtenidos despues de la implementacion.",
      impactItems: ["-18% costos", "+24% productividad", "6 meses"],
      image: "https://images.pexels.com/photos/3184423/pexels-photo-3184423.jpeg",
      className: "h-full md:col-span-3 md:col-start-1 md:row-span-2",
    },
    {
      companyName: "Case 2",
      organizationType: "Corporativo",
      description: "Description for Case 2",
      advancedDescription:
        "Expanded overview for Case 2. Este espacio sirve para detallar objetivos, alcance, coordinacion entre equipos y principales mejoras en procesos o indicadores.",
      impactItems: ["4 unidades", "+31% visibilidad", "ROI 9 meses"],
      image: "https://images.pexels.com/photos/3184423/pexels-photo-3184423.jpeg",
      className: "h-full md:col-span-3 md:col-start-4 md:row-start-2 md:row-span-2",
    },
    {
      companyName: "Case 3",
      organizationType: "Startup",
      description: "Description for Case 3",
      advancedDescription:
        "Expanded overview for Case 3. Puedes usarlo para explicar crecimiento, optimizacion operativa, hoja de ruta y decisiones clave tomadas durante el proyecto.",
      impactItems: ["2x pipeline", "-35% tiempos", "+19% conversion"],
      image: "https://images.pexels.com/photos/3184423/pexels-photo-3184423.jpeg",
      className: "h-full md:col-span-3 md:col-start-1 md:row-start-3 md:row-span-2",
    },
    {
      companyName: "Case 4",
      organizationType: "ONG",
      description: "Description for Case 4",
      advancedDescription:
        "Expanded overview for Case 4. Este bloque permite contar el impacto del proyecto, la metodologia empleada y la evolucion del caso con mas profundidad.",
      impactItems: ["+28% alcance", "3 regiones", "-22% reproceso"],
      image: "https://images.pexels.com/photos/3184423/pexels-photo-3184423.jpeg",
      className: "h-full md:col-span-3 md:col-start-4 md:row-start-4 md:row-span-2",
    },
  ];


  return (
    <div className='relative flex w-full min-h-screen flex-col items-center justify-center overflow-hidden bg-base-200 px-4 py-10'>
      <GeometricLinesBackground />
      <h1 className='relative z-20 text-center text-4xl font-bold md:text-6xl'>{t("title")}</h1>
      <div className='relative z-20 grid w-full max-w-6xl grid-cols-1 gap-4 py-6 md:auto-rows-[112px] md:grid-cols-6'>
        {cases.map((caseItem, index) => (
          <CaseCard key={index} {...caseItem} />
        ))}
      </div>
    </div>
  );
}

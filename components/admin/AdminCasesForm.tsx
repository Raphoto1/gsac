"use client";

import React, { ChangeEvent, useState } from "react";
import { AdminField } from "./shared/AdminField";

export type Localized = { es: string; en: string };
export type CaseItem = {
  id: number;
  title: Localized;
  organizationType: string;
  description: Localized;
  advancedDescription: Localized;
  impactItems: Localized; // comma-separated
  image: string;
};

export const DEFAULT_CASES: CaseItem[] = [
  {
    id: 1,
    title: { es: "Optimización de fundraising y performance F2F", en: "Fundraising & F2F Performance Optimization" },
    organizationType: "ONG",
    description: { es: "", en: "" },
    advancedDescription: { es: "", en: "" },
    impactItems: { es: "Menor CPA, Modelo KPI, Ruta escalable", en: "Lower CPA, KPI Model, Scalable Path" },
    image: "https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg"
  },
  {
    id: 2,
    title: { es: "", en: "" },
    organizationType: "",
    description: { es: "", en: "" },
    advancedDescription: { es: "", en: "" },
    impactItems: { es: "", en: "" },
    image: "https://images.pexels.com/photos/3184306/pexels-photo-3184306.jpeg"
  },
  {
    id: 3,
    title: { es: "", en: "" },
    organizationType: "",
    description: { es: "", en: "" },
    advancedDescription: { es: "", en: "" },
    impactItems: { es: "", en: "" },
    image: "https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg"
  },
  {
    id: 4,
    title: { es: "", en: "" },
    organizationType: "",
    description: { es: "", en: "" },
    advancedDescription: { es: "", en: "" },
    impactItems: { es: "", en: "" },
    image: "https://images.pexels.com/photos/3184339/pexels-photo-3184339.jpeg"
  },
];

export default function AdminCasesForm() {
  const [cases, setCases] = useState<CaseItem[]>(DEFAULT_CASES);
  const [saved, setSaved] = useState(false);
  const [expandedId, setExpandedId] = useState<number | null>(1);

  function onChange(id: number, e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value } = e.target;
    setCases((prev) => prev.map((c) => {
      if (c.id !== id) return c;
      if (name.startsWith("title.")) {
        const lang = name.split(".")[1];
        return { ...c, title: { ...c.title, [lang]: value } };
      } else if (name.startsWith("description.")) {
        const lang = name.split(".")[1];
        return { ...c, description: { ...c.description, [lang]: value } };
      } else if (name.startsWith("advancedDescription.")) {
        const lang = name.split(".")[1];
        return { ...c, advancedDescription: { ...c.advancedDescription, [lang]: value } };
      } else if (name.startsWith("impactItems.")) {
        const lang = name.split(".")[1];
        return { ...c, impactItems: { ...c.impactItems, [lang]: value } };
      } else {
        return { ...c, [name]: value };
      }
    }));
    setSaved(false);
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    console.log("Cases:", cases);
    setSaved(true);
    // TODO: DB
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4">
      {saved && <div className="alert alert-success"><span>Guardado.</span></div>}
      {cases.map((c, i) => (
        <div key={c.id} className="card bg-base-100 shadow-sm border border-base-300">
          <div className="card-body gap-3 py-4">
            <button
              type="button"
              className="flex items-center justify-between w-full text-left"
              onClick={() => setExpandedId(expandedId === c.id ? null : c.id)}
            >
              <span className="font-semibold">Caso {i + 1}{c.title?.es ? ` — ${c.title.es}` : ""}</span>
              <span className="text-base-content/50 text-sm">{expandedId === c.id ? "▲" : "▼"}</span>
            </button>
            {expandedId === c.id && (
              <div className="flex flex-col gap-3 pt-2">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <AdminField label="Título del caso (ES)" id={`case-title-es-${c.id}`}>
                    <input id={`case-title-es-${c.id}`} name="title.es" type="text" className="input w-full" value={c.title.es} onChange={(e) => onChange(c.id, e)} required />
                  </AdminField>
                  <AdminField label="Título del caso (EN)" id={`case-title-en-${c.id}`}>
                    <input id={`case-title-en-${c.id}`} name="title.en" type="text" className="input w-full" value={c.title.en} onChange={(e) => onChange(c.id, e)} required />
                  </AdminField>
                  <AdminField label="Tipo de organización" id={`case-org-${c.id}`}>
                    <input id={`case-org-${c.id}`} name="organizationType" type="text" className="input w-full" value={c.organizationType} onChange={(e) => onChange(c.id, e)} placeholder="ONG, Empresa, etc." />
                  </AdminField>
                </div>
                <AdminField label="Imagen (URL)" id={`case-img-${c.id}`}>
                  <input id={`case-img-${c.id}`} name="image" type="url" className="input w-full" value={c.image} onChange={(e) => onChange(c.id, e)} />
                </AdminField>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <AdminField label="Descripción corta (ES)" id={`case-desc-es-${c.id}`}>
                    <textarea id={`case-desc-es-${c.id}`} name="description.es" className="textarea w-full h-20" value={c.description.es} onChange={(e) => onChange(c.id, e)} />
                  </AdminField>
                  <AdminField label="Descripción corta (EN)" id={`case-desc-en-${c.id}`}>
                    <textarea id={`case-desc-en-${c.id}`} name="description.en" className="textarea w-full h-20" value={c.description.en} onChange={(e) => onChange(c.id, e)} />
                  </AdminField>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <AdminField label="Descripción avanzada (ES)" id={`case-adv-es-${c.id}`}>
                    <textarea id={`case-adv-es-${c.id}`} name="advancedDescription.es" className="textarea w-full h-28" value={c.advancedDescription.es} onChange={(e) => onChange(c.id, e)} />
                  </AdminField>
                  <AdminField label="Descripción avanzada (EN)" id={`case-adv-en-${c.id}`}>
                    <textarea id={`case-adv-en-${c.id}`} name="advancedDescription.en" className="textarea w-full h-28" value={c.advancedDescription.en} onChange={(e) => onChange(c.id, e)} />
                  </AdminField>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <AdminField label="Ítems de impacto (ES, separados por coma)" id={`case-imp-es-${c.id}`}>
                    <input id={`case-imp-es-${c.id}`} name="impactItems.es" type="text" className="input w-full" value={c.impactItems.es} onChange={(e) => onChange(c.id, e)} placeholder="Ej: Menor CPA, Modelo KPI, Ruta escalable" />
                  </AdminField>
                  <AdminField label="Impact items (EN, comma separated)" id={`case-imp-en-${c.id}`}>
                    <input id={`case-imp-en-${c.id}`} name="impactItems.en" type="text" className="input w-full" value={c.impactItems.en} onChange={(e) => onChange(c.id, e)} placeholder="e.g. Lower CPA, KPI Model, Scalable Path" />
                  </AdminField>
                </div>
              </div>
            )}
          </div>
        </div>
      ))}
      <div className="flex justify-end">
        <button type="submit" className="btn btn-primary">Guardar todos los casos</button>
      </div>
    </form>
  );
}

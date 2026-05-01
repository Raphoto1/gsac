"use client";

import React, { ChangeEvent, useState } from "react";
import { AdminField } from "./shared/AdminField";
import AdminCasesForm from "./AdminCasesForm";

// ─── Types ─────────────────────────────────────────────────────────────────────

type IconOption = "business" | "briefcase" | "construct" | "globe" | "rocket" | "settings";

type Localized = { es: string; en: string };
type ProductItem = {
  id: number;
  title: Localized;
  description: Localized;
  icon: IconOption;
  expandTitle: Localized;
  expandText: Localized;
  expandImage: string;
};

type HeaderData = {
  title: Localized;
  description: Localized;
  secondaryDescription: Localized;
  imageUrl: string;
};

// ─── Defaults ─────────────────────────────────────────────────────────────────

const DEFAULT_HEADER: HeaderData = {
  title: { es: "Nuestros servicios", en: "Our Services" },
  description: { es: "Explora nuestro catálogo", en: "Explore our catalog" },
  secondaryDescription: {
    es: "Integramos soluciones pensadas para mejorar control, eficiencia operativa y capacidad de crecimiento en cada etapa del negocio.",
    en: "We integrate solutions designed to improve control, operational efficiency, and growth capacity at every stage of the business."
  },
  imageUrl: "https://images.pexels.com/photos/7698796/pexels-photo-7698796.jpeg",
};

const ICON_OPTIONS: IconOption[] = ["briefcase", "rocket", "globe", "construct", "settings", "business"];

const DEFAULT_PRODUCTS: ProductItem[] = [
  {
    id: 1,
    title: { es: "Estrategia y Planeación Financiera", en: "Financial Strategy & Planning" },
    description: {
      es: "Consultoría estratégica para estructurar, ordenar o redefinir el modelo financiero y la ruta de crecimiento.",
      en: "Strategic consulting to structure, organize, or redefine the financial model and growth path."
    },
    icon: "briefcase",
    expandTitle: { es: "Estrategia y Planeación Financiera", en: "Financial Strategy & Planning" },
    expandText: {
      es: "¿Qué es y para quién?\nServicio de consultoría estratégica para organizaciones y empresas que necesitan estructurar, ordenar o redefinir su modelo financiero y su ruta de crecimiento.",
      en: "What is it and for whom?\nStrategic consulting service for organizations and companies that need to structure, organize, or redefine their financial model and growth path."
    },
    expandImage: "https://images.pexels.com/photos/6694543/pexels-photo-6694543.jpeg",
  },
  {
    id: 2,
    title: { es: "Estructuración de Modelos de Fundraising", en: "Fundraising Model Structuring" },
    description: {
      es: "Diseño y optimización de estrategias de recaudo para fortalecer y diversificar fuentes de financiamiento.",
      en: "Design and optimization of fundraising strategies to strengthen and diversify funding sources."
    },
    icon: "rocket",
    expandTitle: { es: "Estructuración de Modelos de Fundraising", en: "Fundraising Model Structuring" },
    expandText: {
      es: "¿Qué es y para quién?\nDiseño y optimización de estrategias de recaudo para organizaciones que dependen o quieren fortalecer sus fuentes de financiamiento.",
      en: "What is it and for whom?\nDesign and optimization of fundraising strategies for organizations that depend on or want to strengthen their funding sources."
    },
    expandImage: "https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg",
  },
  {
    id: 3,
    title: { es: "Estructuración de Proyectos de Inversión", en: "Investment Project Structuring" },
    description: {
      es: "Servicio para estructurar proyectos y acceder a financiamiento o inversión con una base financiera sólida.",
      en: "Service to structure projects and access financing or investment with a solid financial foundation."
    },
    icon: "globe",
    expandTitle: { es: "Estructuración de Proyectos de Inversión", en: "Investment Project Structuring" },
    expandText: {
      es: "¿Qué es y para quién?\nServicio dirigido a organizaciones y empresas que necesitan estructurar proyectos para acceder a financiamiento o inversión.",
      en: "What is it and for whom?\nService aimed at organizations and companies that need to structure projects to access financing or investment."
    },
    expandImage: "https://images.pexels.com/photos/4386370/pexels-photo-4386370.jpeg",
  },
  {
    id: 4,
    title: { es: "Finanzas para el Desarrollo e Inversión de Impacto", en: "Finance for Development & Impact Investment" },
    description: {
      es: "Soluciones financieras con enfoque de impacto para organizaciones y actores que operan en contextos de desarrollo.",
      en: "Financial solutions with an impact focus for organizations and actors operating in development contexts."
    },
    icon: "construct",
    expandTitle: { es: "Finanzas para el Desarrollo e Inversión de Impacto", en: "Finance for Development & Impact Investment" },
    expandText: {
      es: "¿Qué es y para quién?\nServicio especializado para organizaciones, empresas y actores que operan en contextos de desarrollo y buscan estructurar soluciones financieras con enfoque de impacto.",
      en: "What is it and for whom?\nSpecialized service for organizations, companies, and actors operating in development contexts seeking to structure financial solutions with an impact focus."
    },
    expandImage: "https://images.pexels.com/photos/6771985/pexels-photo-6771985.jpeg",
  },
  {
    id: 5,
    title: { es: "Asesoría Financiera Estratégica (CFO externo)", en: "Strategic Financial Advisory (External CFO)" },
    description: {
      es: "Acompañamiento continuo para tomar mejores decisiones financieras sin depender de un equipo interno robusto.",
      en: "Ongoing support to make better financial decisions without relying on a large internal team."
    },
    icon: "settings",
    expandTitle: { es: "Asesoría Financiera Estratégica (CFO externo)", en: "Strategic Financial Advisory (External CFO)" },
    expandText: {
      es: "¿Qué es y para quién?\nAcompañamiento continuo para organizaciones y empresas que requieren soporte financiero estratégico sin tener un equipo interno robusto.",
      en: "What is it and for whom?\nOngoing support for organizations and companies that require strategic financial support without a large internal team."
    },
    expandImage: "https://images.pexels.com/photos/3184328/pexels-photo-3184328.jpeg",
  },
];

// ─── Header form ───────────────────────────────────────────────────────────────

function HeaderForm() {
  const [data, setData] = useState<HeaderData>(DEFAULT_HEADER);
  const [saved, setSaved] = useState(false);

  const onChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name.startsWith("title.")) {
      const lang = name.split(".")[1];
      setData((p) => ({ ...p, title: { ...p.title, [lang]: value } }));
    } else if (name.startsWith("description.")) {
      const lang = name.split(".")[1];
      setData((p) => ({ ...p, description: { ...p.description, [lang]: value } }));
    } else if (name.startsWith("secondaryDescription.")) {
      const lang = name.split(".")[1];
      setData((p) => ({ ...p, secondaryDescription: { ...p.secondaryDescription, [lang]: value } }));
    } else {
      setData((p) => ({ ...p, [name]: value }));
    }
    setSaved(false);
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Products – Header:", data);
    setSaved(true);
    // TODO: DB
  };

  return (
    <form onSubmit={onSubmit} className="card bg-base-100 shadow-sm">
      <div className="card-body gap-4">
        {saved && <div className="alert alert-success"><span>Guardado.</span></div>}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <AdminField label="Título (ES)" id="ph-title-es">
            <input id="ph-title-es" name="title.es" type="text" className="input w-full" value={data.title.es} onChange={onChange} required />
          </AdminField>
          <AdminField label="Título (EN)" id="ph-title-en">
            <input id="ph-title-en" name="title.en" type="text" className="input w-full" value={data.title.en} onChange={onChange} required />
          </AdminField>
          <AdminField label="Imagen (URL)" id="ph-img">
            <input id="ph-img" name="imageUrl" type="url" className="input w-full" value={data.imageUrl} onChange={onChange} />
          </AdminField>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <AdminField label="Descripción (ES)" id="ph-desc-es">
            <textarea id="ph-desc-es" name="description.es" className="textarea w-full h-20" value={data.description.es} onChange={onChange} required />
          </AdminField>
          <AdminField label="Descripción (EN)" id="ph-desc-en">
            <textarea id="ph-desc-en" name="description.en" className="textarea w-full h-20" value={data.description.en} onChange={onChange} required />
          </AdminField>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <AdminField label="Descripción secundaria (ES)" id="ph-desc2-es">
            <textarea id="ph-desc2-es" name="secondaryDescription.es" className="textarea w-full h-20" value={data.secondaryDescription.es} onChange={onChange} />
          </AdminField>
          <AdminField label="Descripción secundaria (EN)" id="ph-desc2-en">
            <textarea id="ph-desc2-en" name="secondaryDescription.en" className="textarea w-full h-20" value={data.secondaryDescription.en} onChange={onChange} />
          </AdminField>
        </div>
        <div className="card-actions justify-end pt-2">
          <button type="submit" className="btn btn-primary">Guardar</button>
        </div>
      </div>
    </form>
  );
}

// ─── Products list form ────────────────────────────────────────────────────────

function ProductsListForm() {
  const [products, setProducts] = useState<ProductItem[]>(DEFAULT_PRODUCTS);
  const [saved, setSaved] = useState(false);
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [nextId, setNextId] = useState(DEFAULT_PRODUCTS.length + 1);

  const onChange = (id: number, e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setProducts((prev) => prev.map((p) => {
      if (p.id !== id) return p;
      if (name.startsWith("title.")) {
        const lang = name.split(".")[1];
        return { ...p, title: { ...p.title, [lang]: value } };
      } else if (name.startsWith("description.")) {
        const lang = name.split(".")[1];
        return { ...p, description: { ...p.description, [lang]: value } };
      } else if (name.startsWith("expandTitle.")) {
        const lang = name.split(".")[1];
        return { ...p, expandTitle: { ...p.expandTitle, [lang]: value } };
      } else if (name.startsWith("expandText.")) {
        const lang = name.split(".")[1];
        return { ...p, expandText: { ...p.expandText, [lang]: value } };
      } else {
        return { ...p, [name]: value };
      }
    }));
    setSaved(false);
  };

  const onAdd = () => {
    const id = nextId;
    setProducts((p) => [
      ...p,
      {
        id,
        title: { es: "", en: "" },
        description: { es: "", en: "" },
        icon: "briefcase",
        expandTitle: { es: "", en: "" },
        expandText: { es: "", en: "" },
        expandImage: ""
      }
    ]);
    setNextId((n) => n + 1);
    setExpandedId(id);
  };

  const onRemove = (id: number) => {
    setProducts((p) => p.filter((item) => item.id !== id));
    if (expandedId === id) setExpandedId(null);
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Products – List:", products);
    setSaved(true);
    // TODO: DB
  };

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4">
      {saved && <div className="alert alert-success"><span>Guardado.</span></div>}
      {products.map((p, i) => (
        <div key={p.id} className="card bg-base-100 shadow-sm border border-base-300">
          <div className="card-body gap-3 py-4">
            <div className="flex items-center justify-between w-full">
              <button
                type="button"
                className="flex items-center gap-2 text-left flex-1"
                onClick={() => setExpandedId(expandedId === p.id ? null : p.id)}
              >
                <span className="font-semibold text-sm">Servicio {i + 1}{p.title?.es ? ` — ${p.title.es}` : ""}</span>
                <span className="text-base-content/50 text-sm">{expandedId === p.id ? "▲" : "▼"}</span>
              </button>
              <button type="button" className="btn btn-ghost btn-xs text-error" onClick={() => onRemove(p.id)}>
                Eliminar
              </button>
            </div>
            {expandedId === p.id && (
              <div className="flex flex-col gap-3 pt-2">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <AdminField label="Título (ES)" id={`ps-title-es-${p.id}`}>
                    <input id={`ps-title-es-${p.id}`} name="title.es" type="text" className="input w-full" value={p.title.es} onChange={(e) => onChange(p.id, e)} required />
                  </AdminField>
                  <AdminField label="Título (EN)" id={`ps-title-en-${p.id}`}>
                    <input id={`ps-title-en-${p.id}`} name="title.en" type="text" className="input w-full" value={p.title.en} onChange={(e) => onChange(p.id, e)} required />
                  </AdminField>
                  <AdminField label="Ícono" id={`ps-icon-${p.id}`}>
                    <select id={`ps-icon-${p.id}`} name="icon" className="select w-full" value={p.icon} onChange={(e) => onChange(p.id, e)}>
                      {ICON_OPTIONS.map((opt) => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                  </AdminField>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <AdminField label="Descripción (ES)" id={`ps-desc-es-${p.id}`}>
                    <textarea id={`ps-desc-es-${p.id}`} name="description.es" className="textarea w-full h-16" value={p.description.es} onChange={(e) => onChange(p.id, e)} required />
                  </AdminField>
                  <AdminField label="Descripción (EN)" id={`ps-desc-en-${p.id}`}>
                    <textarea id={`ps-desc-en-${p.id}`} name="description.en" className="textarea w-full h-16" value={p.description.en} onChange={(e) => onChange(p.id, e)} required />
                  </AdminField>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <AdminField label="Título expandido (ES)" id={`ps-etitle-es-${p.id}`}>
                    <input id={`ps-etitle-es-${p.id}`} name="expandTitle.es" type="text" className="input w-full" value={p.expandTitle.es} onChange={(e) => onChange(p.id, e)} />
                  </AdminField>
                  <AdminField label="Título expandido (EN)" id={`ps-etitle-en-${p.id}`}>
                    <input id={`ps-etitle-en-${p.id}`} name="expandTitle.en" type="text" className="input w-full" value={p.expandTitle.en} onChange={(e) => onChange(p.id, e)} />
                  </AdminField>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <AdminField label="Texto expandido (ES)" id={`ps-etext-es-${p.id}`}>
                    <textarea id={`ps-etext-es-${p.id}`} name="expandText.es" className="textarea w-full h-36" value={p.expandText.es} onChange={(e) => onChange(p.id, e)} />
                  </AdminField>
                  <AdminField label="Texto expandido (EN)" id={`ps-etext-en-${p.id}`}>
                    <textarea id={`ps-etext-en-${p.id}`} name="expandText.en" className="textarea w-full h-36" value={p.expandText.en} onChange={(e) => onChange(p.id, e)} />
                  </AdminField>
                </div>
                <AdminField label="Imagen expandida (URL)" id={`ps-eimg-${p.id}`}>
                  <input id={`ps-eimg-${p.id}`} name="expandImage" type="url" className="input w-full" value={p.expandImage} onChange={(e) => onChange(p.id, e)} />
                </AdminField>
              </div>
            )}
          </div>
        </div>
      ))}
      <button type="button" className="btn btn-outline btn-sm w-fit" onClick={onAdd}>
        + Agregar servicio
      </button>
      <div className="flex justify-end">
        <button type="submit" className="btn btn-primary">Guardar servicios</button>
      </div>
    </form>
  );
}

// ─── Main component ────────────────────────────────────────────────────────────

type Tab = "header" | "services" | "cases";

const TABS: { id: Tab; label: string }[] = [
  { id: "header",   label: "Encabezado" },
  { id: "services", label: "Servicios" },
  { id: "cases",    label: "Casos de éxito" },
];

export default function AdminProducts() {
  const [active, setActive] = useState<Tab>("header");

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Secciones de Servicios</h2>

      <div role="tablist" className="tabs tabs-border mb-8 flex-wrap">
        {TABS.map((t) => (
          <button
            key={t.id}
            role="tab"
            className={`tab ${active === t.id ? "tab-active" : ""}`}
            onClick={() => setActive(t.id)}
            aria-selected={active === t.id}
          >
            {t.label}
          </button>
        ))}
      </div>

      {active === "header"   && <HeaderForm />}
      {active === "services" && <ProductsListForm />}
      {active === "cases"    && <AdminCasesForm />}
    </div>
  );
}


"use client";

import React, { ChangeEvent, useState } from "react";
import { AdminField } from "./shared/AdminField";
import { AdminListEditor } from "./shared/AdminListEditor";

// ─── Types ─────────────────────────────────────────────────────────────────────

type Localized = { es: string; en: string };
type BigCardSection = {
  title: Localized;
  description: Localized;
  imageUrl: string;
};

type ValueItem = {
  id: number;
  key: string;
  title: Localized;
  description: Localized;
};

type CountryItem = {
  id: number;
  name: string;
};

// ─── Defaults ─────────────────────────────────────────────────────────────────

const DEFAULT_INTRO: BigCardSection = {
  title: { es: "Acerca de nosotros", en: "About Us" },
  description: {
    es: "GS Capital acompaña a organizaciones de impacto en la estructuración, fortalecimiento y ejecución de su estrategia financiera, integrando consultoría especializada, diseño de modelos de sostenibilidad, estructuración de proyectos de inversión y estrategias de fundraising.\n\nEl objetivo es alinear su misión social con una capacidad real de operación, crecimiento y escalabilidad en el tiempo.",
    en: "GS Capital supports impact organizations in structuring, strengthening, and executing their financial strategy by integrating specialized consulting, sustainability model design, investment project structuring, and fundraising strategies.\n\nThe goal is to align their social mission with a real capacity for operation, growth, and scalability over time."
  },
  imageUrl: "https://images.pexels.com/photos/48195/document-agreement-documents-sign-48195.jpeg",
};

const DEFAULT_MISSION: BigCardSection = {
  title: { es: "Misión", en: "Mission" },
  description: {
    es: "Acompañar a organizaciones, empresas y actores del ecosistema de desarrollo en la estructuración, fortalecimiento y ejecución de su estrategia financiera, integrando consultoría, fundraising y estructuración de planes de inversión, con el fin de construir modelos sostenibles que permitan crecer, escalar y generar impacto real en el tiempo.",
    en: "To support organizations, companies, and actors within the development ecosystem in structuring, strengthening, and executing their financial strategy by integrating consulting, fundraising, and investment plan structuring, with the aim of building sustainable models that enable growth, scalability, and real long-term impact."
  },
  imageUrl: "https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg",
};

const DEFAULT_VISION: BigCardSection = {
  title: { es: "Visión", en: "Vision" },
  description: {
    es: "Ser una firma referente en América Latina en la estructuración de soluciones financieras para organizaciones y empresas que operan en contextos de desarrollo, reconocida por su capacidad de conectar estrategia, inversiones, capital e impacto.",
    en: "To be a leading firm in Latin America in structuring financial solutions for organizations and companies operating in development contexts, recognized for its ability to connect strategy, investments, capital, and impact, and for transforming the way purpose-driven initiatives are designed, financed, and scaled."
  },
  imageUrl: "https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg",
};

const DEFAULT_SERVICES: BigCardSection = {
  title: { es: "¿Qué servicio específico les prestamos?", en: "What specific service do we provide?" },
  description: {
    es: "GS Capital presta servicios de consultoría, asesoría y estructuración financiera para ONGs, fundaciones y organizaciones de impacto.",
    en: "GS Capital provides consulting, advisory, and financial structuring services for NGOs, foundations, and impact organizations."
  },
  imageUrl: "https://images.pexels.com/photos/48195/document-agreement-documents-sign-48195.jpeg",
};

const DEFAULT_WHY_US: BigCardSection = {
  title: { es: "¿Por qué elegirnos?", en: "Why choose us?" },
  description: {
    es: "GS Capital combina el rigor de una firma financiera con un entendimiento profundo de organizaciones que operan en contextos de desarrollo.",
    en: "GS Capital combines the rigor of a financial firm with a deep understanding of organizations operating in development contexts."
  },
  imageUrl: "https://images.pexels.com/photos/48195/document-agreement-documents-sign-48195.jpeg",
};

const DEFAULT_EXPERIENCE: BigCardSection = {
  title: { es: "Nuestra Experiencia y Origen", en: "Our Experience and Origin" },
  description: {
    es: "GS Capital opera como un spin-off de GSA Financieros S.A.S., firma colombiana fundada en 2013 con una trayectoria consolidada en asesoría bancaria y servicios especializados para el sector financiero.",
    en: "GS Capital operates as a spin-off of GSA Financieros S.A.S., a Colombian firm founded in 2013 with a solid track record in banking advisory and specialized services for the financial sector."
  },
  imageUrl: "https://images.pexels.com/photos/48195/document-agreement-documents-sign-48195.jpeg",
};

const DEFAULT_VALUES: ValueItem[] = [
  { id: 1, key: "financialRigor",            title: { es: "Rigor financiero", en: "Financial rigor" },                    description: { es: "Aplicamos estándares técnicos propios de la industria financiera en cada proceso.", en: "We apply technical standards drawn from the financial industry in every process." } },
  { id: 2, key: "executionFocus",            title: { es: "Enfoque en ejecución", en: "Execution focus" },                description: { es: "No nos limitamos al diagnóstico. Diseñamos soluciones que pueden implementarse en contextos reales.", en: "We do not stop at diagnosis. We design solutions that can be implemented in real contexts." } },
  { id: 3, key: "contextUnderstanding",      title: { es: "Comprensión del contexto", en: "Contextual understanding" },            description: { es: "Entendemos las dinámicas del sector social, empresarial y de desarrollo.", en: "We understand the dynamics of the social, business, and development sectors." } },
  { id: 4, key: "sustainability",            title: { es: "Sostenibilidad como principio", en: "Sustainability as a principle" },       description: { es: "Promovemos modelos financieros que aseguren la continuidad de las organizaciones en el tiempo.", en: "We promote financial models that ensure organizations can endure over time." } },
  { id: 5, key: "strategyCapitalAlignment",  title: { es: "Alineación entre estrategia y capital", en: "Alignment between strategy and capital" }, description: { es: "Conectamos los objetivos estratégicos con estructuras financieras coherentes.", en: "We connect our clients' strategic objectives with coherent financial structures." } },
  { id: 6, key: "longTermRelationships",     title: { es: "Relaciones de largo plazo", en: "Long-term relationships" },           description: { es: "Construimos relaciones basadas en confianza, confidencialidad y acompañamiento continuo.", en: "We build relationships based on trust, confidentiality, and ongoing support." } },
];

const DEFAULT_COUNTRIES: CountryItem[] = [
  { id: 1, name: "Colombia" },
  { id: 2, name: "Mexico" },
  { id: 3, name: "Uruguay" },
  { id: 4, name: "Argentina" },
  { id: 5, name: "Chile" },
];

// ─── Shared BigCard section form ───────────────────────────────────────────────

function BigCardSectionForm({ label, defaults }: { label: string; defaults: BigCardSection }) {
  const [data, setData] = useState<BigCardSection>(defaults);
  const [saved, setSaved] = useState(false);

  const onChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name.startsWith("title.")) {
      const lang = name.split(".")[1];
      setData((p) => ({ ...p, title: { ...p.title, [lang]: value } }));
    } else if (name.startsWith("description.")) {
      const lang = name.split(".")[1];
      setData((p) => ({ ...p, description: { ...p.description, [lang]: value } }));
    } else {
      setData((p) => ({ ...p, [name]: value }));
    }
    setSaved(false);
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(`About – ${label}:`, data);
    setSaved(true);
    // TODO: DB
  };

  return (
    <form onSubmit={onSubmit} className="card bg-base-100 shadow-sm">
      <div className="card-body gap-4">
        {saved && <div className="alert alert-success"><span>Guardado.</span></div>}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <AdminField label="Título (ES)" id={`${label}-title-es`}>
            <input id={`${label}-title-es`} name="title.es" type="text" className="input w-full" value={data.title.es} onChange={onChange} required />
          </AdminField>
          <AdminField label="Título (EN)" id={`${label}-title-en`}>
            <input id={`${label}-title-en`} name="title.en" type="text" className="input w-full" value={data.title.en} onChange={onChange} required />
          </AdminField>
          <AdminField label="Imagen (URL)" id={`${label}-img`}>
            <input id={`${label}-img`} name="imageUrl" type="url" className="input w-full" value={data.imageUrl} onChange={onChange} />
          </AdminField>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <AdminField label="Descripción (ES)" id={`${label}-desc-es`}>
            <textarea id={`${label}-desc-es`} name="description.es" className="textarea w-full h-40" value={data.description.es} onChange={onChange} required />
          </AdminField>
          <AdminField label="Descripción (EN)" id={`${label}-desc-en`}>
            <textarea id={`${label}-desc-en`} name="description.en" className="textarea w-full h-40" value={data.description.en} onChange={onChange} required />
          </AdminField>
        </div>
        <div className="card-actions justify-end pt-2">
          <button type="submit" className="btn btn-primary">Guardar</button>
        </div>
      </div>
    </form>
  );
}

// ─── Values form ───────────────────────────────────────────────────────────────

function ValuesForm() {
  const [values, setValues] = useState<ValueItem[]>(DEFAULT_VALUES);
  const [saved, setSaved] = useState(false);
  const [expandedId, setExpandedId] = useState<number | null>(1);
  const [nextId, setNextId] = useState(DEFAULT_VALUES.length + 1);

  const onChange = (id: number, e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setValues((prev) => prev.map((v) => {
      if (v.id !== id) return v;
      if (name.startsWith("title.")) {
        const lang = name.split(".")[1];
        return { ...v, title: { ...v.title, [lang]: value } };
      } else if (name.startsWith("description.")) {
        const lang = name.split(".")[1];
        return { ...v, description: { ...v.description, [lang]: value } };
      } else {
        return { ...v, [name]: value };
      }
    }));
    setSaved(false);
  };

  const onAdd = () => {
    const id = nextId;
    setValues((p) => [...p, { id, key: `value${id}`, title: { es: "", en: "" }, description: { es: "", en: "" } }]);
    setNextId((n) => n + 1);
    setExpandedId(id);
  };

  const onRemove = (id: number) => {
    setValues((p) => p.filter((v) => v.id !== id));
    if (expandedId === id) setExpandedId(null);
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("About – Values:", values);
    setSaved(true);
    // TODO: DB
  };

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4">
      {saved && <div className="alert alert-success"><span>Guardado.</span></div>}
      {values.map((v, i) => (
        <div key={v.id} className="card bg-base-100 shadow-sm border border-base-300">
          <div className="card-body gap-3 py-4">
            <div className="flex items-center justify-between w-full">
              <button
                type="button"
                className="flex items-center gap-2 text-left flex-1"
                onClick={() => setExpandedId(expandedId === v.id ? null : v.id)}
              >
                <span className="font-semibold text-sm">Valor {i + 1}{v.title?.es ? ` — ${v.title.es}` : ""}</span>
                <span className="text-base-content/50 text-sm">{expandedId === v.id ? "▲" : "▼"}</span>
              </button>
              <button
                type="button"
                className="btn btn-ghost btn-xs text-error"
                onClick={() => onRemove(v.id)}
              >
                Eliminar
              </button>
            </div>
            {expandedId === v.id && (
              <div className="flex flex-col gap-3 pt-2">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <AdminField label="Título (ES)" id={`val-title-es-${v.id}`}>
                    <input id={`val-title-es-${v.id}`} name="title.es" type="text" className="input w-full" value={v.title.es} onChange={(e) => onChange(v.id, e)} required />
                  </AdminField>
                  <AdminField label="Título (EN)" id={`val-title-en-${v.id}`}>
                    <input id={`val-title-en-${v.id}`} name="title.en" type="text" className="input w-full" value={v.title.en} onChange={(e) => onChange(v.id, e)} required />
                  </AdminField>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <AdminField label="Descripción (ES)" id={`val-desc-es-${v.id}`}>
                    <textarea id={`val-desc-es-${v.id}`} name="description.es" className="textarea w-full h-24" value={v.description.es} onChange={(e) => onChange(v.id, e)} required />
                  </AdminField>
                  <AdminField label="Descripción (EN)" id={`val-desc-en-${v.id}`}>
                    <textarea id={`val-desc-en-${v.id}`} name="description.en" className="textarea w-full h-24" value={v.description.en} onChange={(e) => onChange(v.id, e)} required />
                  </AdminField>
                </div>
              </div>
            )}
          </div>
        </div>
      ))}
      <button type="button" className="btn btn-outline btn-sm w-fit" onClick={onAdd}>
        + Agregar valor
      </button>
      <div className="flex justify-end">
        <button type="submit" className="btn btn-primary">Guardar valores</button>
      </div>
    </form>
  );
}

// ─── Countries form ────────────────────────────────────────────────────────────

function CountriesForm() {
  const [countries, setCountries] = useState<CountryItem[]>(DEFAULT_COUNTRIES);
  const [saved, setSaved] = useState(false);
  const [nextId, setNextId] = useState(DEFAULT_COUNTRIES.length + 1);

  const onChange = (id: number, e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setCountries((prev) => prev.map((c) => (c.id === id ? { ...c, [e.target.name]: e.target.value } : c)));
    setSaved(false);
  };

  const onAdd = () => {
    setCountries((p) => [...p, { id: nextId, name: "" }]);
    setNextId((n) => n + 1);
  };

  const onRemove = (id: number) => setCountries((p) => p.filter((c) => c.id !== id));

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("About – Countries:", countries);
    setSaved(true);
    // TODO: DB
  };

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4">
      {saved && <div className="alert alert-success"><span>Guardado.</span></div>}
      <AdminListEditor
        items={countries}
        onItemChange={onChange}
        onAdd={onAdd}
        onRemove={onRemove}
        addLabel="+ Agregar país"
        renderFields={(c) => (
          <AdminField label="Nombre del país" id={`country-name-${c.id}`}>
            <input id={`country-name-${c.id}`} name="name" type="text" className="input w-full" value={c.name} onChange={(e) => onChange(c.id, e)} required />
          </AdminField>
        )}
      />
      <div className="flex justify-end">
        <button type="submit" className="btn btn-primary">Guardar países</button>
      </div>
    </form>
  );
}

// ─── Main component ────────────────────────────────────────────────────────────

type Tab = "intro" | "mission" | "vision" | "values" | "countries" | "services" | "whyUs" | "experience";

const TABS: { id: Tab; label: string }[] = [
  { id: "intro",      label: "Intro" },
  { id: "mission",    label: "Misión" },
  { id: "vision",     label: "Visión" },
  { id: "values",     label: "Valores" },
  { id: "countries",  label: "Países" },
  { id: "services",   label: "Servicios" },
  { id: "whyUs",      label: "¿Por qué nosotros?" },
  { id: "experience", label: "Experiencia" },
];

export default function AdminAbout() {
  const [active, setActive] = useState<Tab>("intro");

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Secciones del About</h2>

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

      {active === "intro"      && <BigCardSectionForm label="intro"      defaults={DEFAULT_INTRO} />}
      {active === "mission"    && <BigCardSectionForm label="mission"    defaults={DEFAULT_MISSION} />}
      {active === "vision"     && <BigCardSectionForm label="vision"     defaults={DEFAULT_VISION} />}
      {active === "values"     && <ValuesForm />}
      {active === "countries"  && <CountriesForm />}
      {active === "services"   && <BigCardSectionForm label="services"   defaults={DEFAULT_SERVICES} />}
      {active === "whyUs"      && <BigCardSectionForm label="whyUs"      defaults={DEFAULT_WHY_US} />}
      {active === "experience" && <BigCardSectionForm label="experience" defaults={DEFAULT_EXPERIENCE} />}
    </div>
  );
}


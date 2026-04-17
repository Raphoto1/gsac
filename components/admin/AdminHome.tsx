"use client";

import React, { ChangeEvent, useState } from "react";
import { AdminField } from "./shared/AdminField";
import AdminCasesForm from "./AdminCasesForm";
import AdminTeamForm from "./AdminTeamForm";
import AdminCompanyListForm, { DEFAULT_HOLDINGS, DEFAULT_CLIENTS } from "./AdminCompanyListForm";

// â”€â”€â”€ Types â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

type HeroData = {
  welcome: { es: string; en: string };
  description: { es: string; en: string };
  backgroundImage: string;
  impact1: { es: string; en: string };
  impact2: { es: string; en: string };
  impact3: { es: string; en: string };
};

type BigCardData = {
  title: { es: string; en: string };
  description: { es: string; en: string };
  image: string;
};

// â”€â”€â”€ Mock defaults (TODO: load from DB) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

const DEFAULT_HERO: HeroData = {
  welcome: { es: "Bienvenido", en: "Welcome" },
  description: { es: "Tu descripción aquí", en: "Your description here" },
  backgroundImage: "https://images.pexels.com/photos/3183197/pexels-photo-3183197.jpeg",
  impact1: { es: "120+ proyectos", en: "120+ projects" },
  impact2: { es: "40+ clientes", en: "40+ clients" },
  impact3: { es: "12 sectores", en: "12 industries" },
};

const DEFAULT_BIGCARD: BigCardData = {
  title: { es: "Nuestro Enfoque", en: "Our Approach" },
  description: {
    es: "GS Capital acompaña a organizaciones de impacto en la estructuración, fortalecimiento y ejecución de su estrategia financiera.",
    en: "GS Capital supports impact organizations in structuring, strengthening, and executing their financial strategy."
  },
  image: "https://images.pexels.com/photos/3184423/pexels-photo-3184423.jpeg",
};

// â”€â”€â”€ Hero form â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

function HeroForm() {
  const [data, setData] = useState<HeroData>(DEFAULT_HERO);
  const [saved, setSaved] = useState(false);
  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value, dataset } = e.target;
    if (dataset.lang) {
      setData((p) => ({ ...p, [name]: { ...p[name as keyof HeroData] as any, [dataset.lang]: value } }));
    } else {
      setData((p) => ({ ...p, [name]: value }));
    }
    setSaved(false);
  };
  const onSubmit = (e: React.FormEvent) => { e.preventDefault(); console.log("Hero:", data); setSaved(true); /* TODO: DB */ };

  return (
    <form onSubmit={onSubmit} className="card bg-base-100 shadow-sm">
      <div className="card-body gap-4">
        {saved && <div className="alert alert-success"><span>Guardado.</span></div>}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <AdminField label="Título de bienvenida (español)" id="hero-welcome-es">
            <input id="hero-welcome-es" name="welcome" data-lang="es" type="text" className="input w-full" value={data.welcome.es} onChange={onChange} required />
          </AdminField>
          <AdminField label="Título de bienvenida (inglés)" id="hero-welcome-en">
            <input id="hero-welcome-en" name="welcome" data-lang="en" type="text" className="input w-full" value={data.welcome.en} onChange={onChange} required />
          </AdminField>
          <AdminField label="Imagen de fondo (URL)" id="hero-bg">
            <input id="hero-bg" name="backgroundImage" type="url" className="input w-full" value={data.backgroundImage} onChange={onChange} />
          </AdminField>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <AdminField label="Descripción (español)" id="hero-desc-es">
            <input id="hero-desc-es" name="description" data-lang="es" type="text" className="input w-full" value={data.description.es} onChange={onChange} />
          </AdminField>
          <AdminField label="Descripción (inglés)" id="hero-desc-en">
            <input id="hero-desc-en" name="description" data-lang="en" type="text" className="input w-full" value={data.description.en} onChange={onChange} />
          </AdminField>
        </div>
        <p className="text-sm font-medium text-base-content/70 mt-1">Indicadores de impacto</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <AdminField label="Impacto 1 (español)" id="hero-i1-es"><input id="hero-i1-es" name="impact1" data-lang="es" type="text" className="input w-full" value={data.impact1.es} onChange={onChange} /></AdminField>
          <AdminField label="Impacto 1 (inglés)" id="hero-i1-en"><input id="hero-i1-en" name="impact1" data-lang="en" type="text" className="input w-full" value={data.impact1.en} onChange={onChange} /></AdminField>
          <AdminField label="Impacto 2 (español)" id="hero-i2-es"><input id="hero-i2-es" name="impact2" data-lang="es" type="text" className="input w-full" value={data.impact2.es} onChange={onChange} /></AdminField>
          <AdminField label="Impacto 2 (inglés)" id="hero-i2-en"><input id="hero-i2-en" name="impact2" data-lang="en" type="text" className="input w-full" value={data.impact2.en} onChange={onChange} /></AdminField>
          <AdminField label="Impacto 3 (español)" id="hero-i3-es"><input id="hero-i3-es" name="impact3" data-lang="es" type="text" className="input w-full" value={data.impact3.es} onChange={onChange} /></AdminField>
          <AdminField label="Impacto 3 (inglés)" id="hero-i3-en"><input id="hero-i3-en" name="impact3" data-lang="en" type="text" className="input w-full" value={data.impact3.en} onChange={onChange} /></AdminField>
        </div>
        <div className="card-actions justify-end pt-2"><button type="submit" className="btn btn-primary">Guardar</button></div>
      </div>
    </form>
  );
}

// â”€â”€â”€ BigCard form â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

function BigCardForm() {
  const [data, setData] = useState<BigCardData>(DEFAULT_BIGCARD);
  const [saved, setSaved] = useState(false);
  const onChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, dataset } = e.target;
    if (dataset.lang) {
      setData((p) => ({ ...p, [name]: { ...p[name as keyof BigCardData] as any, [dataset.lang]: value } }));
    } else {
      setData((p) => ({ ...p, [name]: value }));
    }
    setSaved(false);
  };
  const onSubmit = (e: React.FormEvent) => { e.preventDefault(); console.log("BigCard:", data); setSaved(true); /* TODO: DB */ };

  return (
    <form onSubmit={onSubmit} className="card bg-base-100 shadow-sm">
      <div className="card-body gap-4">
        {saved && <div className="alert alert-success"><span>Guardado.</span></div>}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <AdminField label="Título (español)" id="bc-title-es">
            <input id="bc-title-es" name="title" data-lang="es" type="text" className="input w-full" value={data.title.es} onChange={onChange} required />
          </AdminField>
          <AdminField label="Título (inglés)" id="bc-title-en">
            <input id="bc-title-en" name="title" data-lang="en" type="text" className="input w-full" value={data.title.en} onChange={onChange} required />
          </AdminField>
          <AdminField label="Imagen (URL)" id="bc-img">
            <input id="bc-img" name="image" type="url" className="input w-full" value={data.image} onChange={onChange} />
          </AdminField>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <AdminField label="Descripción (español)" id="bc-desc-es">
            <textarea id="bc-desc-es" name="description" data-lang="es" className="textarea w-full h-28" value={data.description.es} onChange={onChange} required />
          </AdminField>
          <AdminField label="Descripción (inglés)" id="bc-desc-en">
            <textarea id="bc-desc-en" name="description" data-lang="en" className="textarea w-full h-28" value={data.description.en} onChange={onChange} required />
          </AdminField>
        </div>
        <div className="card-actions justify-end pt-2"><button type="submit" className="btn btn-primary">Guardar</button></div>
      </div>
    </form>
  );
}

// â”€â”€â”€ Main component â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

type Section = "hero" | "bigcard" | "cases" | "team" | "holdings" | "clients" | "contact";
type SectionMeta = { id: Section; label: string; fixed: boolean };

const FIXED_TOP: SectionMeta    = { id: "hero",    label: "Hero",     fixed: true };
const FIXED_BOTTOM: SectionMeta = { id: "contact", label: "Contacto", fixed: true };

const REORDERABLE_DEFAULTS: SectionMeta[] = [
  { id: "bigcard",  label: "Enfoque",            fixed: false },
  { id: "cases",    label: "Casos",              fixed: false },
  { id: "team",     label: "Equipo",             fixed: false },
  { id: "holdings", label: "Holdings",           fixed: false },
  { id: "clients",  label: "Clientes & Aliados", fixed: false },
];

function SectionOrderEditor({
  order,
  onMove,
  onSave,
}: {
  order: SectionMeta[];
  onMove: (index: number, dir: -1 | 1) => void;
  onSave: () => void;
}) {
  const all: SectionMeta[] = [FIXED_TOP, ...order, FIXED_BOTTOM];
  return (
    <div className="card bg-base-100 shadow-sm border border-base-300 mb-8">
      <div className="card-body gap-3 py-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <h3 className="font-semibold">Orden de secciones</h3>
          <button type="button" className="btn btn-primary btn-sm" onClick={onSave}>Guardar orden</button>
        </div>
        <ol className="flex flex-col gap-2 mt-1">
          {all.map((s, i) => (
            <li
              key={s.id}
              className={`flex items-center justify-between gap-3 rounded-lg px-4 py-2 border ${
                s.fixed ? "border-base-300 bg-base-200 text-base-content/50" : "border-base-300 bg-base-100"
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-xs font-mono text-base-content/40 w-5 text-right">{i + 1}</span>
                <span className="font-medium text-sm">{s.label}</span>
                {s.fixed && <span className="badge badge-ghost badge-sm">fijo</span>}
              </div>
              {!s.fixed && (
                <div className="flex gap-1">
                  <button type="button" className="btn btn-ghost btn-xs" disabled={i === 1} onClick={() => onMove(i - 1, -1)} aria-label={`Subir ${s.label}`}>▲</button>
                  <button type="button" className="btn btn-ghost btn-xs" disabled={i === all.length - 2} onClick={() => onMove(i - 1, 1)} aria-label={`Bajar ${s.label}`}>▼</button>
                </div>
              )}
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}

export default function AdminHome() {
  const [active, setActive] = useState<Section>("hero");
  const [sectionOrder, setSectionOrder] = useState<SectionMeta[]>(REORDERABLE_DEFAULTS);
  const [orderSaved, setOrderSaved] = useState(false);

  function moveSection(index: number, dir: -1 | 1) {
    setSectionOrder((prev) => {
      const next = [...prev];
      const target = index + dir;
      if (target < 0 || target >= next.length) return prev;
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
    setOrderSaved(false);
  }

  function saveOrder() {
    console.log("Section order:", [FIXED_TOP, ...sectionOrder, FIXED_BOTTOM].map((s) => s.id));
    setOrderSaved(true);
    // TODO: persist to DB
  }

  const allTabs: SectionMeta[] = [FIXED_TOP, ...sectionOrder, FIXED_BOTTOM];

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Secciones del Home</h2>

      {orderSaved && <div className="alert alert-success mb-4"><span>Orden guardado.</span></div>}
      <SectionOrderEditor order={sectionOrder} onMove={moveSection} onSave={saveOrder} />

      <div role="tablist" className="tabs tabs-border mb-8 flex-wrap">
        {allTabs.map((s) => (
          <button key={s.id} role="tab" className={`tab ${active === s.id ? "tab-active" : ""}`} onClick={() => setActive(s.id)} aria-selected={active === s.id}>
            {s.label}
          </button>
        ))}
      </div>

      {active === "hero"     && <HeroForm />}
      {active === "bigcard"  && <BigCardForm />}
      {active === "cases"    && <AdminCasesForm />}
      {active === "team"     && <AdminTeamForm />}
      {active === "holdings" && <AdminCompanyListForm defaultItems={DEFAULT_HOLDINGS} title="Holdings" />}
      {active === "clients"  && <AdminCompanyListForm defaultItems={DEFAULT_CLIENTS} title="Clientes & Aliados" />}
      {active === "contact"  && (
        <div className="alert">
          <span className="text-base-content/60">La secciÃ³n de Contacto se configura en la pestaÃ±a <strong>Contacto</strong> del panel principal.</span>
        </div>
      )}
    </div>
  );
}

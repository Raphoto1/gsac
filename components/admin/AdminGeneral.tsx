"use client";

import React, { ChangeEvent, useState } from "react";
import { AdminField } from "./shared/AdminField";

// ─── Types ─────────────────────────────────────────────────────────────────────

type FooterData = {
  companyName: { es: string; en: string };
  nit: string;
  tagline: { es: string; en: string };
  rights: { es: string; en: string };
};

// ─── Defaults ─────────────────────────────────────────────────────────────────

const DEFAULT_FOOTER: FooterData = {
  companyName: { es: "GS Capital S.A.S.", en: "GS Capital S.A.S." },
  nit: "123456789-0",
  tagline: { es: "Operado por GSA Financieros", en: "Operated by GSA Financieros" },
  rights: { es: "Todos los derechos reservados", en: "All rights reserved" },
};

// ─── Footer form ───────────────────────────────────────────────────────────────

function FooterForm() {
  const [data, setData] = useState<FooterData>(DEFAULT_FOOTER);
  const [saved, setSaved] = useState(false);

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value, dataset } = e.target;
    if (dataset.lang) {
      setData((p) => ({ ...p, [name]: { ...p[name as keyof FooterData] as any, [dataset.lang]: value } }));
    } else {
      setData((p) => ({ ...p, [name]: value }));
    }
    setSaved(false);
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Footer:", data);
    setSaved(true);
    // TODO: DB
  };

  return (
    <form onSubmit={onSubmit} className="card bg-base-100 shadow-sm">
      <div className="card-body gap-4">
        {saved && <div className="alert alert-success"><span>Guardado.</span></div>}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <AdminField label="Nombre de la empresa (español)" id="ft-name-es">
            <input id="ft-name-es" name="companyName" data-lang="es" type="text" className="input w-full" value={data.companyName.es} onChange={onChange} required />
          </AdminField>
          <AdminField label="Nombre de la empresa (inglés)" id="ft-name-en">
            <input id="ft-name-en" name="companyName" data-lang="en" type="text" className="input w-full" value={data.companyName.en} onChange={onChange} required />
          </AdminField>
          <AdminField label="NIT" id="ft-nit">
            <input id="ft-nit" name="nit" type="text" className="input w-full" value={data.nit} onChange={onChange} />
          </AdminField>
          <AdminField label="Tagline (español)" id="ft-tagline-es">
            <input id="ft-tagline-es" name="tagline" data-lang="es" type="text" className="input w-full" value={data.tagline.es} onChange={onChange} />
          </AdminField>
          <AdminField label="Tagline (inglés)" id="ft-tagline-en">
            <input id="ft-tagline-en" name="tagline" data-lang="en" type="text" className="input w-full" value={data.tagline.en} onChange={onChange} />
          </AdminField>
          <AdminField label="Texto de derechos (español)" id="ft-rights-es">
            <input id="ft-rights-es" name="rights" data-lang="es" type="text" className="input w-full" value={data.rights.es} onChange={onChange} />
          </AdminField>
          <AdminField label="Texto de derechos (inglés)" id="ft-rights-en">
            <input id="ft-rights-en" name="rights" data-lang="en" type="text" className="input w-full" value={data.rights.en} onChange={onChange} />
          </AdminField>
        </div>
        <div className="card-actions justify-end pt-2">
          <button type="submit" className="btn btn-primary">Guardar footer</button>
        </div>
      </div>
    </form>
  );
}

// ─── Main component ────────────────────────────────────────────────────────────

export default function AdminGeneral() {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-2">Datos generales</h2>
      <p className="text-base-content/60 mb-8 text-sm">Información global del sitio que aparece en el footer y otras áreas compartidas.</p>

      <h3 className="font-semibold text-lg mb-4">Footer</h3>
      <FooterForm />
    </div>
  );
}

"use client";

import React, { ChangeEvent, useState } from "react";
import { AdminField } from "./shared/AdminField";
import { AdminListEditor } from "./shared/AdminListEditor";

export type CompanyItem = {
  id: number;
  name: string;
  description: string;
  descriptionEn: string;
  logo: string;
  website: string;
};

export const DEFAULT_HOLDINGS: CompanyItem[] = [
  {
    id: 1,
    name: "GSA Financieros",
    description: "Firma especializada en asesoría financiera y cálculo actuarial.",
    descriptionEn: "Firm specialized in financial advisory and actuarial analysis.",
    logo: "",
    website: ""
  },
];

export const DEFAULT_CLIENTS: CompanyItem[] = [
  { id: 1, name: "Fundemex", description: "", descriptionEn: "", logo: "", website: "https://www.fundemex.org.mx/" },
];

type Props = {
  defaultItems: CompanyItem[];
  title: string;
};

export default function AdminCompanyListForm({ defaultItems, title }: Props) {
  const [items, setItems] = useState<CompanyItem[]>(defaultItems);
  const [saved, setSaved] = useState(false);
  const [nextId, setNextId] = useState(defaultItems.length + 1);

  function onChange(id: number, e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setItems((prev) => prev.map((c) => (c.id === id ? { ...c, [e.target.name]: e.target.value } : c)));
    setSaved(false);
  }

  function onAdd() {
    setItems((p) => [...p, { id: nextId, name: "", description: "", descriptionEn: "", logo: "", website: "" }]);
    setNextId((n) => n + 1);
  }

  function onRemove(id: number) {
    setItems((p) => p.filter((c) => c.id !== id));
  }

  function onLogoFileChange(id: number, e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const logoDataUrl = reader.result;
      if (typeof logoDataUrl !== "string") return;
      setItems((prev) => prev.map((c) => (c.id === id ? { ...c, logo: logoDataUrl } : c)));
      setSaved(false);
    };
    reader.readAsDataURL(file);
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    console.log(`${title}:`, items);
    setSaved(true);
    // TODO: DB
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4">
      {saved && <div className="alert alert-success"><span>Guardado.</span></div>}
      <AdminListEditor
        items={items}
        onItemChange={onChange}
        onAdd={onAdd}
        onRemove={onRemove}
        addLabel="+ Agregar empresa"
        renderFields={(c) => (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <AdminField label="Nombre" id={`co-name-${c.id}`}>
              <input id={`co-name-${c.id}`} name="name" type="text" className="input w-full" value={c.name} onChange={(e) => onChange(c.id, e)} required />
            </AdminField>
            <AdminField label="Sitio web (URL)" id={`co-web-${c.id}`}>
              <input id={`co-web-${c.id}`} name="website" type="url" className="input w-full" value={c.website} onChange={(e) => onChange(c.id, e)} />
            </AdminField>

            <AdminField label="Descripción" id={`co-desc-${c.id}`}>
              <textarea id={`co-desc-${c.id}`} name="description" className="textarea w-full h-16" value={c.description} onChange={(e) => onChange(c.id, e)} />
            </AdminField>
            <AdminField label="Descripción (EN)" id={`co-desc-en-${c.id}`}>
              <textarea id={`co-desc-en-${c.id}`} name="descriptionEn" className="textarea w-full h-16" value={c.descriptionEn} onChange={(e) => onChange(c.id, e)} />
            </AdminField>
                        <AdminField label="Logo (URL)" id={`co-logo-${c.id}`}>
              <span className="text-xs text-base-content/60">También puedes subir el logo como archivo (PNG, JPG, SVG, etc.).</span>
              <div className="flex flex-col gap-2">
                <input id={`co-logo-${c.id}`} name="logo" type="url" className="input w-full" value={c.logo} onChange={(e) => onChange(c.id, e)} placeholder="https://..." />
                <input
                  id={`co-logo-file-${c.id}`}
                  type="file"
                  accept="image/*"
                  className="file-input file-input-bordered w-full"
                  onChange={(e) => onLogoFileChange(c.id, e)}
                />
                
                {c.logo && (
                  <img
                    src={c.logo}
                    alt={`Preview logo ${c.name || c.id}`}
                    className="h-12 w-auto object-contain rounded bg-base-200 p-1"
                  />
                )}
              </div>
            </AdminField>
          </div>
        )}
      />
      <div className="flex justify-end">
        <button type="submit" className="btn btn-primary">Guardar {title.toLowerCase()}</button>
      </div>
    </form>
  );
}

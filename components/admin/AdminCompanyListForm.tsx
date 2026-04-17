"use client";

import React, { ChangeEvent, useState } from "react";
import { AdminField } from "./shared/AdminField";
import { AdminListEditor } from "./shared/AdminListEditor";

export type CompanyItem = {
  id: number;
  name: string;
  description: string;
  logo: string;
  website: string;
};

export const DEFAULT_HOLDINGS: CompanyItem[] = [
  { id: 1, name: "GSA Financieros", description: "Firma especializada en asesoría financiera y cálculo actuarial.", logo: "", website: "" },
];

export const DEFAULT_CLIENTS: CompanyItem[] = [
  { id: 1, name: "Fundemex", description: "", logo: "", website: "https://www.fundemex.org.mx/" },
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
    setItems((p) => [...p, { id: nextId, name: "", description: "", logo: "", website: "" }]);
    setNextId((n) => n + 1);
  }

  function onRemove(id: number) {
    setItems((p) => p.filter((c) => c.id !== id));
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
            <AdminField label="Logo (URL)" id={`co-logo-${c.id}`}>
              <input id={`co-logo-${c.id}`} name="logo" type="url" className="input w-full" value={c.logo} onChange={(e) => onChange(c.id, e)} />
            </AdminField>
            <AdminField label="Sitio web (URL)" id={`co-web-${c.id}`}>
              <input id={`co-web-${c.id}`} name="website" type="url" className="input w-full" value={c.website} onChange={(e) => onChange(c.id, e)} />
            </AdminField>
            <AdminField label="Descripción" id={`co-desc-${c.id}`}>
              <textarea id={`co-desc-${c.id}`} name="description" className="textarea w-full h-16" value={c.description} onChange={(e) => onChange(c.id, e)} />
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

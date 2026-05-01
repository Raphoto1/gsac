"use client";

import React, { ChangeEvent, useState } from "react";
import { AdminField } from "./shared/AdminField";
import { AdminListEditor } from "./shared/AdminListEditor";

export type TeamMember = {
  id: number;
  name: string;
  role: string;
  photo: string;
  linkedin: string;
};

export const DEFAULT_TEAM: TeamMember[] = [
  { id: 1, name: "", role: "", photo: "", linkedin: "" },
];

export default function AdminTeamForm() {
  const [members, setMembers] = useState<TeamMember[]>(DEFAULT_TEAM);
  const [saved, setSaved] = useState(false);
  const [nextId, setNextId] = useState(DEFAULT_TEAM.length + 1);

  function onChange(id: number, e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setMembers((prev) => prev.map((m) => (m.id === id ? { ...m, [e.target.name]: e.target.value } : m)));
    setSaved(false);
  }

  function onAdd() {
    setMembers((p) => [...p, { id: nextId, name: "", role: "", photo: "", linkedin: "" }]);
    setNextId((n) => n + 1);
  }

  function onRemove(id: number) {
    setMembers((p) => p.filter((m) => m.id !== id));
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    console.log("Team:", members);
    setSaved(true);
    // TODO: DB
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4">
      {saved && <div className="alert alert-success"><span>Guardado.</span></div>}
      <AdminListEditor
        items={members}
        onItemChange={onChange}
        onAdd={onAdd}
        onRemove={onRemove}
        addLabel="+ Agregar miembro"
        renderFields={(m) => (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <AdminField label="Nombre" id={`tm-name-${m.id}`}>
              <input id={`tm-name-${m.id}`} name="name" type="text" className="input w-full" value={m.name} onChange={(e) => onChange(m.id, e)} required />
            </AdminField>
            <AdminField label="Rol" id={`tm-role-${m.id}`}>
              <input id={`tm-role-${m.id}`} name="role" type="text" className="input w-full" value={m.role} onChange={(e) => onChange(m.id, e)} required />
            </AdminField>
            <AdminField label="Foto (URL)" id={`tm-photo-${m.id}`}>
              <input id={`tm-photo-${m.id}`} name="photo" type="url" className="input w-full" value={m.photo} onChange={(e) => onChange(m.id, e)} />
            </AdminField>
            <AdminField label="LinkedIn (URL)" id={`tm-li-${m.id}`}>
              <input id={`tm-li-${m.id}`} name="linkedin" type="url" className="input w-full" value={m.linkedin} onChange={(e) => onChange(m.id, e)} />
            </AdminField>
          </div>
        )}
      />
      <div className="flex justify-end">
        <button type="submit" className="btn btn-primary">Guardar equipo</button>
      </div>
    </form>
  );
}

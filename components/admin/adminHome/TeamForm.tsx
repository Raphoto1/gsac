"use client";

import { ChangeEvent, useEffect, useState } from "react";
import { AdminField } from "../shared/AdminField";
import { AdminListEditor } from "../shared/AdminListEditor";
import { DEFAULT_HOME_TEAM, type HomeTeamMember } from "@/types/home-team";

async function readApiResponse<T>(response: Response): Promise<{ data: T | null; rawText: string | null }> {
  const contentType = response.headers.get("content-type") || "";

  if (contentType.includes("application/json")) {
    return { data: (await response.json()) as T, rawText: null };
  }

  return { data: null, rawText: await response.text() };
}

type TeamMember = HomeTeamMember & { id: number };

export const DEFAULT_TEAM: TeamMember[] = DEFAULT_HOME_TEAM.map((member, index) => ({
  id: index + 1,
  ...member,
}));

export default function TeamForm() {
  const [members, setMembers] = useState<TeamMember[]>(DEFAULT_TEAM);
  const [saved, setSaved] = useState(false);
  const [nextId, setNextId] = useState(DEFAULT_TEAM.length + 1);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let mounted = true;

    async function loadTeam() {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch("/api/admin/home/team", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error("No se pudo cargar el equipo.");
        }

        const { data } = await readApiResponse<{ members?: HomeTeamMember[] }>(response);

        if (mounted && Array.isArray(data?.members) && data.members.length) {
          const normalized = data.members.map((member, index) => ({ id: index + 1, ...member }));
          setMembers(normalized);
          setNextId(normalized.length + 1);
        }
      } catch (requestError) {
        if (mounted) {
          const message = requestError instanceof Error ? requestError.message : "No se pudo cargar el equipo.";
          setError(message);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    loadTeam();

    return () => {
      mounted = false;
    };
  }, []);

  function onChange(id: number, e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setMembers((prev) => prev.map((m) => (m.id === id ? { ...m, [e.target.name]: e.target.value } : m)));
    setSaved(false);
    setError(null);
  }

  function onAdd() {
    setMembers((p) => [...p, { id: nextId, name: "", role: "", photo: "", linkedin: "" }]);
    setNextId((n) => n + 1);
  }

  function onRemove(id: number) {
    setMembers((p) => p.filter((m) => m.id !== id));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();

    try {
      setSaving(true);
      setSaved(false);
      setError(null);

      const response = await fetch("/api/admin/home/team", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ members: members.map(({ id, ...member }) => member) }),
      });

      const { data, rawText } = await readApiResponse<{ error?: string; members?: HomeTeamMember[] }>(response);

      if (!response.ok) {
        throw new Error(data?.error || (rawText ? `No se pudo guardar el equipo. (${response.status})` : "No se pudo guardar el equipo."));
      }

      if (Array.isArray(data?.members) && data.members.length) {
        const normalized = data.members.map((member, index) => ({ id: index + 1, ...member }));
        setMembers(normalized);
        setNextId(normalized.length + 1);
      }

      setSaved(true);
    } catch (requestError) {
      const message = requestError instanceof Error ? requestError.message : "No se pudo guardar el equipo.";
      setError(message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4">
      {loading && <div className="alert"><span>Cargando equipo...</span></div>}
      {error && <div className="alert alert-error"><span>{error}</span></div>}
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
        <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? "Guardando..." : "Guardar equipo"}</button>
      </div>
    </form>
  );
}
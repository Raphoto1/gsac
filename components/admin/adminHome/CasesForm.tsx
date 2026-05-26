"use client";

import { ChangeEvent, useEffect, useState } from "react";
import { AdminField } from "../shared/AdminField";
import { DEFAULT_HOME_CASES, type HomeCaseItem } from "@/types/home-cases";

async function readApiResponse<T>(response: Response): Promise<{ data: T | null; rawText: string | null }> {
  const contentType = response.headers.get("content-type") || "";

  if (contentType.includes("application/json")) {
    return { data: (await response.json()) as T, rawText: null };
  }

  return { data: null, rawText: await response.text() };
}

const DEFAULT_CASES: HomeCaseItem[] = DEFAULT_HOME_CASES;

type EditableHomeCaseItem = HomeCaseItem & {
  isNew?: boolean;
};

function createNewCase(id: number): EditableHomeCaseItem {
  return {
    id,
    title: { es: "Nuevo caso", en: "New case" },
    organizationType: "",
    description: { es: "", en: "" },
    advancedDescription: { es: "", en: "" },
    impactItems: { es: "", en: "" },
    image: DEFAULT_HOME_CASES[0]?.image ?? "",
    isNew: true,
  };
}

function reindexCases(items: EditableHomeCaseItem[]): EditableHomeCaseItem[] {
  return items.map((item, index) => ({ ...item, id: index + 1 }));
}

function getCasesAfterRemove(
  items: EditableHomeCaseItem[],
  id: number,
  expandedId: number | null,
): { blocked: boolean; nextCases: EditableHomeCaseItem[]; nextExpanded: number | null } {
  if (items.length <= 1) {
    return {
      blocked: true,
      nextCases: items,
      nextExpanded: expandedId,
    };
  }

  const filtered = items.filter((item) => item.id !== id);
  const reindexed = reindexCases(filtered);

  return {
    blocked: false,
    nextCases: reindexed,
    nextExpanded: expandedId === id ? (reindexed[0]?.id ?? null) : expandedId,
  };
}

export default function CasesForm() {
  const [cases, setCases] = useState<EditableHomeCaseItem[]>(DEFAULT_CASES);
  const [saved, setSaved] = useState(false);
  const [expandedId, setExpandedId] = useState<number | null>(1);
  const [pendingDeleteId, setPendingDeleteId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let mounted = true;

    async function loadCases() {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch("/api/admin/home/cases", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error("No se pudo cargar los casos.");
        }

        const { data } = await readApiResponse<{ cases?: HomeCaseItem[] }>(response);
        if (mounted && Array.isArray(data?.cases) && data.cases.length) {
          setCases(data.cases.map((item) => ({ ...item, isNew: false })));
          setExpandedId(data.cases[0]?.id ?? null);
        }
      } catch (requestError) {
        if (mounted) {
          const message = requestError instanceof Error ? requestError.message : "No se pudo cargar los casos.";
          setError(message);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    loadCases();

    return () => {
      mounted = false;
    };
  }, []);

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
    setError(null);
  }

  function addCase() {
    setCases((prev) => {
      const next = [createNewCase(1), ...prev];
      return reindexCases(next);
    });
    setExpandedId(1);
    setSaved(false);
    setError(null);
  }

  function cancelNewCase(id: number) {
    let blocked = false;
    let nextExpanded: number | null = expandedId;

    setCases((prev) => {
      if (prev.length <= 1) {
        blocked = true;
        return prev;
      }

      const target = prev.find((item) => item.id === id);
      if (!target?.isNew) {
        return prev;
      }

      const filtered = prev.filter((item) => item.id !== id);
      const reindexed = reindexCases(filtered);

      if (expandedId === id) {
        nextExpanded = reindexed[0]?.id ?? null;
      }

      return reindexed;
    });

    if (blocked) {
      setError("Debe existir al menos 1 caso.");
      return;
    }

    setExpandedId(nextExpanded);
    setSaved(false);
    setError(null);
  }

  function removeCase(id: number) {
    const { blocked, nextCases, nextExpanded } = getCasesAfterRemove(cases, id, expandedId);

    if (blocked) {
      setError("Debe existir al menos 1 caso.");
      return;
    }

    setCases(nextCases);
    setExpandedId(nextExpanded);
    setSaved(false);
    setError(null);
  }

  function requestRemoveCase(id: number) {
    setPendingDeleteId(id);
  }

  function cancelRemoveCase() {
    setPendingDeleteId(null);
  }

  async function confirmRemoveCase() {
    if (pendingDeleteId === null) {
      return;
    }

    const { blocked, nextCases, nextExpanded } = getCasesAfterRemove(cases, pendingDeleteId, expandedId);

    if (blocked) {
      setError("Debe existir al menos 1 caso.");
      setPendingDeleteId(null);
      return;
    }

    setCases(nextCases);
    setExpandedId(nextExpanded);
    setSaved(false);
    setError(null);
    setPendingDeleteId(null);

    await persistCases(nextCases);
  }

  async function persistCases(nextCasesInput: EditableHomeCaseItem[] = cases) {
    try {
      setSaving(true);
      setSaved(false);
      setError(null);

      const response = await fetch("/api/admin/home/cases", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cases: nextCasesInput.map(({ isNew, ...item }) => item),
        }),
      });

      const { data, rawText } = await readApiResponse<{ error?: string; cases?: HomeCaseItem[] }>(response);

      if (!response.ok) {
        throw new Error(data?.error || (rawText ? `No se pudo guardar los casos. (${response.status})` : "No se pudo guardar los casos."));
      }

      if (Array.isArray(data?.cases) && data.cases.length) {
        setCases(data.cases.map((item) => ({ ...item, isNew: false })));
      }

      setSaved(true);
    } catch (requestError) {
      const message = requestError instanceof Error ? requestError.message : "No se pudo guardar los casos.";
      setError(message);
    } finally {
      setSaving(false);
    }
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    await persistCases();
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4">
      {loading && <div className="alert"><span>Cargando casos...</span></div>}
      {error && <div className="alert alert-error"><span>{error}</span></div>}
      {saved && <div className="alert alert-success"><span>Guardado.</span></div>}
      <div className="flex justify-end">
        <button type="button" className="btn btn-outline btn-sm" onClick={addCase}>
          + Agregar caso
        </button>
      </div>
      {cases.map((c, i) => (
        <div key={c.id} className="card bg-base-100 shadow-sm border border-base-300">
          <div className="card-body gap-3 py-4">
            <div className="flex items-start justify-between gap-3">
              <button
                type="button"
                className="flex items-center justify-between w-full text-left"
                onClick={() => setExpandedId(expandedId === c.id ? null : c.id)}
              >
                <span className="font-semibold">Caso {i + 1}{c.title?.es ? ` — ${c.title.es}` : ""}</span>
                <span className="text-base-content/50 text-sm">{expandedId === c.id ? "▲" : "▼"}</span>
              </button>
              <button
                type="button"
                className="btn btn-ghost btn-xs text-error"
                onClick={() => requestRemoveCase(c.id)}
                disabled={cases.length <= 1}
              >
                Eliminar
              </button>
              {c.isNew ? (
                <button
                  type="button"
                  className="btn btn-ghost btn-xs"
                  onClick={() => cancelNewCase(c.id)}
                >
                  Cancelar
                </button>
              ) : null}
            </div>
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
                <div className="flex justify-end pt-1">
                  <button
                    type="button"
                    className="btn btn-secondary btn-sm"
                    onClick={() => void persistCases()}
                    disabled={saving || loading}
                  >
                    {saving ? "Guardando..." : c.isNew ? "Agregar" : "Actualizar"}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      ))}
      <div className="flex justify-end">
        <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? "Guardando..." : "Guardar todos los casos"}</button>
      </div>

      {pendingDeleteId !== null ? (
        <dialog
          className="modal modal-open"
          open
          onClick={(event) => {
            if (event.target === event.currentTarget) {
              cancelRemoveCase();
            }
          }}
        >
          <div className="modal-box" onClick={(event) => event.stopPropagation()}>
            <h3 className="text-lg font-semibold">Eliminar caso</h3>
            <p className="mt-2 text-sm text-base-content/70">
              Esta accion eliminara el caso seleccionado. Podras recuperarlo solo volviendolo a crear manualmente.
            </p>
            <div className="modal-action">
              <button type="button" className="btn btn-ghost" onClick={cancelRemoveCase}>
                Cancelar
              </button>
              <button type="button" className="btn btn-error" onClick={confirmRemoveCase}>
                Eliminar
              </button>
            </div>
          </div>
        </dialog>
      ) : null}
    </form>
  );
}
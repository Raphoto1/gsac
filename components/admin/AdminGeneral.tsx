"use client";

import React, { ChangeEvent, useEffect, useState } from "react";
import { AdminField } from "./shared/AdminField";
import type { GeneralInfo } from "@/types/general";
import { DEFAULT_GENERAL_INFO } from "@/types/general";

// ─── Types ─────────────────────────────────────────────────────────────────────

// ─── Footer form ───────────────────────────────────────────────────────────────

function FooterForm() {
  const [data, setData] = useState<GeneralInfo>(DEFAULT_GENERAL_INFO);
  const [taglineEnabled, setTaglineEnabled] = useState(false);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchGeneralInfo();
  }, []);

  async function fetchGeneralInfo() {
    try {
      setLoading(true);
      setError("");
      const response = await fetch("/api/admin/home/general");
      if (!response.ok) {
        throw new Error("Failed to fetch general info");
      }

      const result = (await response.json()) as GeneralInfo;
      setData(result);
      setTaglineEnabled(!!(result.tagline.es || result.tagline.en));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch general info");
    } finally {
      setLoading(false);
    }
  }

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value, dataset } = e.target;

    if (dataset.lang) {
      setData((p) => ({
        ...p,
        [name]: {
          ...(p[name as keyof Pick<GeneralInfo, "companyName" | "tagline" | "rights">] as {
            es: string;
            en: string;
          }),
          [dataset.lang]: value,
        },
      }));
    } else {
      setData((p) => ({ ...p, [name]: value }));
    }

    setSaved(false);
    setError("");
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setSaving(true);
      setSaved(false);
      setError("");

      const response = await fetch("/api/admin/home/general", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(
          taglineEnabled ? data : { ...data, tagline: { es: "", en: "" } }
        ),
      });

      const payload = (await response.json()) as GeneralInfo & {
        error?: string;
        message?: string;
      };

      if (!response.ok) {
        throw new Error(payload.message || payload.error || "Failed to update general info");
      }

      setData(payload);
      setSaved(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update general info");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="card bg-base-100 shadow-sm">
        <div className="card-body">
          <span className="loading loading-spinner loading-md" aria-label="Loading" />
          <p className="text-sm opacity-70">Cargando datos generales...</p>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="card bg-base-100 shadow-sm">
      <div className="card-body gap-4">
        {error && <div className="alert alert-error"><span>{error}</span></div>}
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
          <div className="sm:col-span-2 flex items-center gap-3">
            <input
              id="ft-tagline-toggle"
              type="checkbox"
              className="toggle toggle-primary"
              checked={taglineEnabled}
              onChange={(e) => {
                setTaglineEnabled(e.target.checked);
                setSaved(false);
              }}
            />
            <label htmlFor="ft-tagline-toggle" className="text-sm font-medium">Mostrar tagline</label>
          </div>
          {taglineEnabled && (
            <>
              <AdminField label="Tagline (español)" id="ft-tagline-es">
                <input id="ft-tagline-es" name="tagline" data-lang="es" type="text" className="input w-full" value={data.tagline.es} onChange={onChange} />
              </AdminField>
              <AdminField label="Tagline (inglés)" id="ft-tagline-en">
                <input id="ft-tagline-en" name="tagline" data-lang="en" type="text" className="input w-full" value={data.tagline.en} onChange={onChange} />
              </AdminField>
            </>
          )}
          <AdminField label="Texto de derechos (español)" id="ft-rights-es">
            <input id="ft-rights-es" name="rights" data-lang="es" type="text" className="input w-full" value={data.rights.es} onChange={onChange} />
          </AdminField>
          <AdminField label="Texto de derechos (inglés)" id="ft-rights-en">
            <input id="ft-rights-en" name="rights" data-lang="en" type="text" className="input w-full" value={data.rights.en} onChange={onChange} />
          </AdminField>
        </div>
        <div className="card-actions justify-end pt-2">
          <button type="submit" className="btn btn-primary" disabled={saving}>
            {saving ? "Guardando..." : "Guardar footer"}
          </button>
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

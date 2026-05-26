"use client";

import { ChangeEvent, useEffect, useState } from "react";
import { AdminField } from "../shared/AdminField";
import { DEFAULT_BIGCARD, type BigCardData, type BigCardLocalizedField } from "@/types/home-bigcard";

function isBigCardLocalizedField(name: string): name is BigCardLocalizedField {
  return ["title", "description"].includes(name);
}

async function readApiResponse<T>(response: Response): Promise<{ data: T | null; rawText: string | null }> {
  const contentType = response.headers.get("content-type") || "";

  if (contentType.includes("application/json")) {
    return { data: (await response.json()) as T, rawText: null };
  }

  return { data: null, rawText: await response.text() };
}

export default function BigCardForm() {
  const [data, setData] = useState<BigCardData>(DEFAULT_BIGCARD);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    let mounted = true;

    async function loadBigCard() {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch("/api/admin/home/bigcard", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error("No se pudo cargar el BigCard.");
        }

        const { data } = await readApiResponse<{ bigCard?: BigCardData }>(response);
        if (data?.bigCard) {
          if (mounted) {
            setData(data.bigCard);
          }
        }
      } catch (requestError) {
        if (mounted) {
          const message = requestError instanceof Error ? requestError.message : "No se pudo cargar el BigCard.";
          setError(message);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    loadBigCard();

    return () => {
      mounted = false;
    };
  }, []);

  const onChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, dataset } = e.target;

    if (dataset.lang && isBigCardLocalizedField(name) && (dataset.lang === "es" || dataset.lang === "en")) {
      setData((prev) => ({
        ...prev,
        [name]: {
          ...prev[name],
          [dataset.lang]: value,
        },
      }));
    } else {
      setData((prev) => ({ ...prev, [name]: value }));
    }

    setSaved(false);
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      setSaved(false);
      setError(null);

      const response = await fetch("/api/admin/home/bigcard", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bigCard: data }),
      });

      const { data: responseData, rawText } = await readApiResponse<{ error?: string; bigCard?: BigCardData }>(response);

      if (!response.ok) {
        throw new Error(responseData?.error || (rawText ? `No se pudo guardar el BigCard. (${response.status})` : "No se pudo guardar el BigCard."));
      }

      if (responseData?.bigCard) {
        setData(responseData.bigCard);
      }

      setSaved(true);
    } catch (requestError) {
      const message = requestError instanceof Error ? requestError.message : "No se pudo guardar el BigCard.";
      setError(message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="card bg-base-100 shadow-sm">
      <div className="card-body gap-4">
        {loading && (
          <div className="alert">
            <span>Cargando BigCard...</span>
          </div>
        )}
        {error && (
          <div className="alert alert-error">
            <span>{error}</span>
          </div>
        )}
        {saved && (
          <div className="alert alert-success">
            <span>Guardado.</span>
          </div>
        )}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <AdminField label="Descripción (español)" id="bc-desc-es">
            <textarea id="bc-desc-es" name="description" data-lang="es" className="textarea h-28 w-full" value={data.description.es} onChange={onChange} required />
          </AdminField>
          <AdminField label="Descripción (inglés)" id="bc-desc-en">
            <textarea id="bc-desc-en" name="description" data-lang="en" className="textarea h-28 w-full" value={data.description.en} onChange={onChange} required />
          </AdminField>
        </div>
        <div className="card-actions justify-end pt-2">
          <button type="submit" className="btn btn-primary" disabled={saving}>
            {saving ? "Guardando..." : "Guardar"}
          </button>
        </div>
      </div>
    </form>
  );
}
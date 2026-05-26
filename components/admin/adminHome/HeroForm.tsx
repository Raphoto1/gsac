"use client";

import { ChangeEvent, useEffect, useState } from "react";
import { AdminField } from "../shared/AdminField";
import { DEFAULT_HERO, type HeroData, type HeroLocalizedField } from "@/types/home-hero";

async function readApiResponse<T>(response: Response): Promise<{ data: T | null; rawText: string | null }> {
  const contentType = response.headers.get("content-type") || "";

  if (contentType.includes("application/json")) {
    return { data: (await response.json()) as T, rawText: null };
  }

  return { data: null, rawText: await response.text() };
}

function isHeroLocalizedField(name: string): name is HeroLocalizedField {
  return ["welcome", "description", "impact1", "impact2", "impact3"].includes(name);
}

export default function HeroForm() {
  const [data, setData] = useState<HeroData>(DEFAULT_HERO);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    async function loadHero() {
      try {
        const response = await fetch("/api/admin/home/hero", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          cache: "no-store",
        });

        if (!response.ok) {
          return;
        }

        const { data: responseData } = await readApiResponse<{ hero?: HeroData }>(response);
        if (mounted && responseData?.hero) {
          setData(responseData.hero);
        }
      } catch {
        // Keep default values if the API is unavailable.
      }
    }

    loadHero();

    return () => {
      mounted = false;
    };
  }, []);

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value, dataset } = e.target;

    if (dataset.lang && isHeroLocalizedField(name) && (dataset.lang === "es" || dataset.lang === "en")) {
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
    setError(null);
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setSaved(false);
      setError(null);

      const response = await fetch("/api/admin/home/hero", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ hero: data }),
      });

      const { data: responseData, rawText } = await readApiResponse<{ error?: string; hero?: HeroData }>(response);

      if (!response.ok) {
        throw new Error(
          responseData?.error || (rawText ? `No se pudo guardar el Hero. (${response.status})` : "No se pudo guardar el Hero.")
        );
      }

      if (responseData?.hero) {
        setData(responseData.hero);
      }

      setSaved(true);
    } catch (submitError) {
      const message = submitError instanceof Error ? submitError.message : "No se pudo guardar el Hero.";
      setError(message);
    }
  };

  return (
    <form onSubmit={onSubmit} className="card bg-base-100 shadow-sm">
      <div className="card-body gap-4">
        {saved && (
          <div className="alert alert-success">
            <span>Guardado.</span>
          </div>
        )}
        {error && (
          <div className="alert alert-error">
            <span>{error}</span>
          </div>
        )}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <AdminField label="Descripción (español)" id="hero-desc-es">
            <input id="hero-desc-es" name="description" data-lang="es" type="text" className="input w-full" value={data.description.es} onChange={onChange} />
          </AdminField>
          <AdminField label="Descripción (inglés)" id="hero-desc-en">
            <input id="hero-desc-en" name="description" data-lang="en" type="text" className="input w-full" value={data.description.en} onChange={onChange} />
          </AdminField>
        </div>
        <p className="mt-1 text-sm font-medium text-base-content/70">Indicadores de impacto</p>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <AdminField label="Impacto 1 (español)" id="hero-i1-es"><input id="hero-i1-es" name="impact1" data-lang="es" type="text" className="input w-full" value={data.impact1.es} onChange={onChange} /></AdminField>
          <AdminField label="Impacto 1 (inglés)" id="hero-i1-en"><input id="hero-i1-en" name="impact1" data-lang="en" type="text" className="input w-full" value={data.impact1.en} onChange={onChange} /></AdminField>
          <AdminField label="Impacto 2 (español)" id="hero-i2-es"><input id="hero-i2-es" name="impact2" data-lang="es" type="text" className="input w-full" value={data.impact2.es} onChange={onChange} /></AdminField>
          <AdminField label="Impacto 2 (inglés)" id="hero-i2-en"><input id="hero-i2-en" name="impact2" data-lang="en" type="text" className="input w-full" value={data.impact2.en} onChange={onChange} /></AdminField>
          <AdminField label="Impacto 3 (español)" id="hero-i3-es"><input id="hero-i3-es" name="impact3" data-lang="es" type="text" className="input w-full" value={data.impact3.es} onChange={onChange} /></AdminField>
          <AdminField label="Impacto 3 (inglés)" id="hero-i3-en"><input id="hero-i3-en" name="impact3" data-lang="en" type="text" className="input w-full" value={data.impact3.en} onChange={onChange} /></AdminField>
        </div>
        <div className="card-actions justify-end pt-2">
          <button type="submit" className="btn btn-primary">Guardar</button>
        </div>
      </div>
    </form>
  );
}
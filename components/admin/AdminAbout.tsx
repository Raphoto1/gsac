"use client";

import React, { ChangeEvent, useEffect, useState } from "react";
import * as FlagIcons from "country-flag-icons/react/3x2";
import { AdminField } from "./shared/AdminField";
import { AdminListEditor } from "./shared/AdminListEditor";
import type {
  AboutSectionId,
  AboutSectionMeta,
  AboutSectionOrderResponseItem,
} from "@/types/about-sections";
import {
  ABOUT_SECTION_LABELS,
  ABOUT_SECTION_IDS,
} from "@/types/about-sections";
import { AboutSectionOrderEditor } from "./adminAbout/AboutSectionOrderEditor";
import {
  ABOUT_COUNTRY_OPTIONS,
  ABOUT_COUNTRY_OPTION_BY_CODE,
  ABOUT_COUNTRY_OPTION_BY_NAME,
  ABOUT_COUNTRY_LEGACY_NAME_TO_CODE,
  DEFAULT_ABOUT_CARDS,
  DEFAULT_ABOUT_COUNTRIES,
  DEFAULT_ABOUT_VALUES,
  type AboutCardSectionData,
  type AboutCardSectionId,
  type AboutCountryData,
  type AboutValueData,
  type LocalizedText,
} from "@/types/about-content";

// ─── Types ─────────────────────────────────────────────────────────────────────

type ValueFormItem = AboutValueData & {
  id: number;
};

type CountryFormItem = AboutCountryData & {
  id: number;
};

// ─── Shared BigCard section form ───────────────────────────────────────────────

function toFormValues(values: AboutValueData[]): ValueFormItem[] {
  return values.map((value, index) => ({
    id: index + 1,
    key: value.key,
    title: value.title,
    description: value.description,
  }));
}

function toFormCountries(countries: AboutCountryData[]): CountryFormItem[] {
  return countries.map((country, index) => ({
    id: index + 1,
    name: normalizeCountrySelection(country.name),
  }));
}

function getDefaultCountryName(usedNames: Set<string>): string {
  const available = ABOUT_COUNTRY_OPTIONS.find((option) => !usedNames.has(option.code));
  return available ? available.code : ABOUT_COUNTRY_OPTIONS[0].code;
}

function normalizeCountrySelection(value: string): string {
  const normalized = value.trim();
  const uppercase = normalized.toUpperCase();

  if (ABOUT_COUNTRY_OPTION_BY_CODE.has(uppercase)) {
    return uppercase;
  }

  const byName = ABOUT_COUNTRY_OPTION_BY_NAME.get(normalized);
  if (byName) {
    return byName.code;
  }

  const legacy = ABOUT_COUNTRY_LEGACY_NAME_TO_CODE[normalized];
  if (legacy) {
    return legacy;
  }

  return ABOUT_COUNTRY_OPTIONS[0].code;
}

const FLAG_COMPONENTS = FlagIcons as unknown as Record<string, React.ComponentType<{ className?: string }>>;

function nextFormId<T extends { id: number }>(items: T[]): number {
  if (!items.length) {
    return 1;
  }

  return Math.max(...items.map((item) => item.id)) + 1;
}

function BigCardSectionForm({ sectionId, defaults }: { sectionId: AboutCardSectionId; defaults: AboutCardSectionData }) {
  const [data, setData] = useState<AboutCardSectionData>(defaults);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);

  function setPreviewUrl(nextUrl: string | null) {
    setImagePreviewUrl((prev) => {
      if (prev && prev.startsWith("blob:")) {
        URL.revokeObjectURL(prev);
      }

      return nextUrl;
    });
  }

  useEffect(() => {
    return () => {
      if (imagePreviewUrl && imagePreviewUrl.startsWith("blob:")) {
        URL.revokeObjectURL(imagePreviewUrl);
      }
    };
  }, [imagePreviewUrl]);

  useEffect(() => {
    let mounted = true;

    async function loadSection() {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(`/api/admin/about/cards/${sectionId}`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error("No se pudo cargar la seccion.");
        }

        const { data: payload } = await readApiResponse<{ section?: AboutCardSectionData }>(response);
        if (mounted && payload?.section) {
          setData(payload.section);
        }
      } catch (requestError) {
        if (mounted) {
          const message = requestError instanceof Error ? requestError.message : "No se pudo cargar la seccion.";
          setError(message);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    loadSection();

    return () => {
      mounted = false;
    };
  }, [sectionId]);

  const onChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name.startsWith("title.")) {
      const lang = name.split(".")[1];
      setData((p) => ({ ...p, title: { ...p.title, [lang]: value } }));
    } else if (name.startsWith("description.")) {
      const lang = name.split(".")[1];
      setData((p) => ({ ...p, description: { ...p.description, [lang]: value } }));
    } else {
      setData((p) => ({ ...p, [name]: value }));
    }
    setSaved(false);
    setError(null);
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setSaving(true);
      setSaved(false);
      setError(null);

      const response = await fetch(`/api/admin/about/cards/${sectionId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ section: data }),
      });

      const { data: payload, rawText } = await readApiResponse<{ error?: string; section?: AboutCardSectionData }>(response);

      if (!response.ok) {
        throw new Error(payload?.error || (rawText ? `No se pudo guardar la seccion. (${response.status})` : "No se pudo guardar la seccion."));
      }

      if (payload?.section) {
        setData(payload.section);
      }

      setSaved(true);
    } catch (requestError) {
      const message = requestError instanceof Error ? requestError.message : "No se pudo guardar la seccion.";
      setError(message);
    } finally {
      setSaving(false);
    }
  };

  const onImageFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      return;
    }

    try {
      setSaving(true);
      setError(null);
      setSaved(false);

      const localPreview = URL.createObjectURL(file);
      setPreviewUrl(localPreview);

      const formData = new FormData();
      formData.set("file", file);
      formData.set("fileName", `${sectionId}-${file.name}`);
      if (data.imageUrl) {
        formData.set("previousImage", data.imageUrl);
      }

      const response = await fetch(`/api/admin/about/cards/${sectionId}/image`, {
        method: "POST",
        body: formData,
      });

      const { data: payload, rawText } = await readApiResponse<{ error?: string; url?: string }>(response);

      if (!response.ok) {
        throw new Error(payload?.error || (rawText ? `No se pudo subir la imagen. (${response.status})` : "No se pudo subir la imagen."));
      }

      if (typeof payload?.url !== "string" || !payload.url) {
        throw new Error("La subida no devolvio una URL valida.");
      }

      setData((prev) => ({ ...prev, imageUrl: payload.url }));
      setPreviewUrl(null);
    } catch (requestError) {
      const message = requestError instanceof Error ? requestError.message : "No se pudo subir la imagen.";
      setError(message);
    } finally {
      setSaving(false);
      e.target.value = "";
    }
  };

  return (
    <form onSubmit={onSubmit} className="card bg-base-100 shadow-sm">
      <div className="card-body gap-4">
        {loading && <div className="alert"><span>Cargando seccion...</span></div>}
        {error && <div className="alert alert-error"><span>{error}</span></div>}
        {saved && <div className="alert alert-success"><span>Guardado.</span></div>}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <AdminField label="Titulo (ES)" id={`${sectionId}-title-es`}>
            <input id={`${sectionId}-title-es`} name="title.es" type="text" className="input w-full" value={data.title.es} onChange={onChange} required disabled={loading || saving} />
          </AdminField>
          <AdminField label="Titulo (EN)" id={`${sectionId}-title-en`}>
            <input id={`${sectionId}-title-en`} name="title.en" type="text" className="input w-full" value={data.title.en} onChange={onChange} required disabled={loading || saving} />
          </AdminField>
          <AdminField label="Imagen (URL)" id={`${sectionId}-img`}>
            <div className="flex flex-col gap-2">
              <input id={`${sectionId}-img`} name="imageUrl" type="url" className="input w-full" value={data.imageUrl} onChange={onChange} disabled={loading || saving} />
              <input
                id={`${sectionId}-img-file`}
                type="file"
                accept="image/*"
                className="file-input file-input-bordered w-full"
                onChange={onImageFileChange}
                disabled={loading || saving}
              />
              {(imagePreviewUrl || data.imageUrl) ? (
                <img
                  src={imagePreviewUrl || data.imageUrl}
                  alt={`Preview ${sectionId}`}
                  className="h-24 w-auto rounded bg-base-200 p-1 object-cover"
                />
              ) : null}
            </div>
          </AdminField>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <AdminField label="Descripcion (ES)" id={`${sectionId}-desc-es`}>
            <textarea id={`${sectionId}-desc-es`} name="description.es" className="textarea w-full h-40" value={data.description.es} onChange={onChange} required disabled={loading || saving} />
          </AdminField>
          <AdminField label="Descripcion (EN)" id={`${sectionId}-desc-en`}>
            <textarea id={`${sectionId}-desc-en`} name="description.en" className="textarea w-full h-40" value={data.description.en} onChange={onChange} required disabled={loading || saving} />
          </AdminField>
        </div>
        <div className="card-actions justify-end pt-2">
          <button type="submit" className="btn btn-primary" disabled={loading || saving}>{saving ? "Guardando..." : "Guardar"}</button>
        </div>
      </div>
    </form>
  );
}

// ─── Values form ───────────────────────────────────────────────────────────────

function ValuesForm() {
  const [values, setValues] = useState<ValueFormItem[]>(toFormValues(DEFAULT_ABOUT_VALUES));
  const [saved, setSaved] = useState(false);
  const [expandedId, setExpandedId] = useState<number | null>(1);
  const [nextId, setNextId] = useState(nextFormId(toFormValues(DEFAULT_ABOUT_VALUES)));
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    async function loadValues() {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch("/api/admin/about/values", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error("No se pudo cargar los valores.");
        }

        const { data } = await readApiResponse<{ values?: AboutValueData[] }>(response);
        if (mounted && Array.isArray(data?.values) && data.values.length) {
          const nextValues = toFormValues(data.values);
          setValues(nextValues);
          setNextId(nextFormId(nextValues));
          setExpandedId(nextValues[0]?.id ?? null);
        }
      } catch (requestError) {
        if (mounted) {
          const message = requestError instanceof Error ? requestError.message : "No se pudo cargar los valores.";
          setError(message);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    loadValues();

    return () => {
      mounted = false;
    };
  }, []);

  const onChange = (id: number, e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setValues((prev) => prev.map((v) => {
      if (v.id !== id) return v;
      if (name.startsWith("title.")) {
        const lang = name.split(".")[1];
        return { ...v, title: { ...v.title, [lang]: value } };
      } else if (name.startsWith("description.")) {
        const lang = name.split(".")[1];
        return { ...v, description: { ...v.description, [lang]: value } };
      } else {
        return { ...v, [name]: value };
      }
    }));
    setSaved(false);
    setError(null);
  };

  const onAdd = () => {
    const id = nextId;
    setValues((p) => [...p, { id, key: `value${id}`, title: { es: "", en: "" }, description: { es: "", en: "" } }]);
    setNextId((n) => n + 1);
    setExpandedId(id);
  };

  const onRemove = (id: number) => {
    setValues((p) => p.filter((v) => v.id !== id));
    if (expandedId === id) setExpandedId(null);
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setSaving(true);
      setSaved(false);
      setError(null);

      const response = await fetch("/api/admin/about/values", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          values: values.map(({ id, ...item }) => item),
        }),
      });

      const { data, rawText } = await readApiResponse<{ error?: string; values?: AboutValueData[] }>(response);

      if (!response.ok) {
        throw new Error(data?.error || (rawText ? `No se pudo guardar los valores. (${response.status})` : "No se pudo guardar los valores."));
      }

      if (Array.isArray(data?.values) && data.values.length) {
        const nextValues = toFormValues(data.values);
        setValues(nextValues);
        setNextId(nextFormId(nextValues));
      }

      setSaved(true);
    } catch (requestError) {
      const message = requestError instanceof Error ? requestError.message : "No se pudo guardar los valores.";
      setError(message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4">
      {loading && <div className="alert"><span>Cargando valores...</span></div>}
      {error && <div className="alert alert-error"><span>{error}</span></div>}
      {saved && <div className="alert alert-success"><span>Guardado.</span></div>}
      {values.map((v, i) => (
        <div key={v.id} className="card bg-base-100 shadow-sm border border-base-300">
          <div className="card-body gap-3 py-4">
            <div className="flex items-center justify-between w-full">
              <button
                type="button"
                className="flex items-center gap-2 text-left flex-1"
                onClick={() => setExpandedId(expandedId === v.id ? null : v.id)}
              >
                <span className="font-semibold text-sm">Valor {i + 1}{v.title?.es ? ` — ${v.title.es}` : ""}</span>
                <span className="text-base-content/50 text-sm">{expandedId === v.id ? "▲" : "▼"}</span>
              </button>
              <button
                type="button"
                className="btn btn-ghost btn-xs text-error"
                onClick={() => onRemove(v.id)}
              >
                Eliminar
              </button>
            </div>
            {expandedId === v.id && (
              <div className="flex flex-col gap-3 pt-2">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <AdminField label="Título (ES)" id={`val-title-es-${v.id}`}>
                    <input id={`val-title-es-${v.id}`} name="title.es" type="text" className="input w-full" value={v.title.es} onChange={(e) => onChange(v.id, e)} required disabled={loading || saving} />
                  </AdminField>
                  <AdminField label="Titulo (EN)" id={`val-title-en-${v.id}`}>
                    <input id={`val-title-en-${v.id}`} name="title.en" type="text" className="input w-full" value={v.title.en} onChange={(e) => onChange(v.id, e)} required disabled={loading || saving} />
                  </AdminField>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <AdminField label="Descripcion (ES)" id={`val-desc-es-${v.id}`}>
                    <textarea id={`val-desc-es-${v.id}`} name="description.es" className="textarea w-full h-24" value={v.description.es} onChange={(e) => onChange(v.id, e)} required disabled={loading || saving} />
                  </AdminField>
                  <AdminField label="Descripcion (EN)" id={`val-desc-en-${v.id}`}>
                    <textarea id={`val-desc-en-${v.id}`} name="description.en" className="textarea w-full h-24" value={v.description.en} onChange={(e) => onChange(v.id, e)} required disabled={loading || saving} />
                  </AdminField>
                </div>
              </div>
            )}
          </div>
        </div>
      ))}
      <button type="button" className="btn btn-outline btn-sm w-fit" onClick={onAdd} disabled={loading || saving}>
        + Agregar valor
      </button>
      <div className="flex justify-end">
        <button type="submit" className="btn btn-primary" disabled={loading || saving}>{saving ? "Guardando..." : "Guardar valores"}</button>
      </div>
    </form>
  );
}

// ─── Countries form ────────────────────────────────────────────────────────────

function CountriesForm() {
  const [countries, setCountries] = useState<CountryFormItem[]>(toFormCountries(DEFAULT_ABOUT_COUNTRIES));
  const [saved, setSaved] = useState(false);
  const [nextId, setNextId] = useState(nextFormId(toFormCountries(DEFAULT_ABOUT_COUNTRIES)));
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    async function loadCountries() {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch("/api/admin/about/countries", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error("No se pudo cargar los paises.");
        }

        const { data } = await readApiResponse<{ countries?: AboutCountryData[] }>(response);
        if (mounted && Array.isArray(data?.countries) && data.countries.length) {
          const nextCountries = toFormCountries(data.countries);
          setCountries(nextCountries);
          setNextId(nextFormId(nextCountries));
        }
      } catch (requestError) {
        if (mounted) {
          const message = requestError instanceof Error ? requestError.message : "No se pudo cargar los paises.";
          setError(message);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    loadCountries();

    return () => {
      mounted = false;
    };
  }, []);

  const onChange = (id: number, e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setCountries((prev) => prev.map((c) => (c.id === id ? { ...c, [e.target.name]: e.target.value } : c)));
    setSaved(false);
    setError(null);
  };

  const setCountryName = (id: number, name: string) => {
    setCountries((prev) => prev.map((c) => (c.id === id ? { ...c, name: normalizeCountrySelection(name) } : c)));
    setSaved(false);
    setError(null);
  };

  const onAdd = () => {
    const usedNames = new Set(countries.map((country) => country.name));
    const nextName = getDefaultCountryName(usedNames);
    setCountries((p) => [...p, { id: nextId, name: nextName }]);
    setNextId((n) => n + 1);
  };

  const onRemove = (id: number) => setCountries((p) => p.filter((c) => c.id !== id));

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setSaving(true);
      setSaved(false);
      setError(null);

      const response = await fetch("/api/admin/about/countries", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          countries: countries.map(({ id, ...item }) => item),
        }),
      });

      const { data, rawText } = await readApiResponse<{ error?: string; countries?: AboutCountryData[] }>(response);

      if (!response.ok) {
        throw new Error(data?.error || (rawText ? `No se pudo guardar los paises. (${response.status})` : "No se pudo guardar los paises."));
      }

      if (Array.isArray(data?.countries) && data.countries.length) {
        const nextCountries = toFormCountries(data.countries);
        setCountries(nextCountries);
        setNextId(nextFormId(nextCountries));
      }

      setSaved(true);
    } catch (requestError) {
      const message = requestError instanceof Error ? requestError.message : "No se pudo guardar los paises.";
      setError(message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4">
      {loading && <div className="alert"><span>Cargando paises...</span></div>}
      {error && <div className="alert alert-error"><span>{error}</span></div>}
      {saved && <div className="alert alert-success"><span>Guardado.</span></div>}
      <AdminListEditor
        items={countries}
        onItemChange={onChange}
        onAdd={onAdd}
        onRemove={onRemove}
        addLabel="+ Agregar país"
        renderFields={(c) => {
          const selectedOption = ABOUT_COUNTRY_OPTION_BY_CODE.get(normalizeCountrySelection(c.name)) ?? ABOUT_COUNTRY_OPTIONS[0];
          const SelectedFlag = FLAG_COMPONENTS[selectedOption.code];

          return (
            <AdminField label="Nombre del pais" id={`country-name-${c.id}`}>
              <details className="dropdown w-full">
                <summary className="btn w-full justify-start gap-3 border-base-300 bg-base-100 text-left">
                  {SelectedFlag ? (
                    <SelectedFlag className="h-4 w-6 rounded-sm" />
                  ) : (
                    <span className="inline-flex h-4 w-6 items-center justify-center rounded-sm bg-base-200 text-[9px] font-semibold text-base-content/70">
                      {selectedOption.code}
                    </span>
                  )}
                  <span>{selectedOption.name}</span>
                </summary>
                <ul className="menu dropdown-content z-100 mt-1 max-h-72 w-full overflow-y-auto rounded-box border border-base-300 bg-base-100 p-2 shadow-lg">
                  {ABOUT_COUNTRY_OPTIONS.map((option) => {
                    const Flag = FLAG_COMPONENTS[option.code];

                    return (
                      <li key={option.code}>
                        <button
                          type="button"
                          className="justify-start gap-3"
                          onClick={(event) => {
                            setCountryName(c.id, option.code);
                            const details = event.currentTarget.closest("details");
                            if (details instanceof HTMLDetailsElement) {
                              details.open = false;
                            }
                          }}
                          disabled={loading || saving}
                        >
                          {Flag ? (
                            <Flag className="h-4 w-6 rounded-sm" />
                          ) : (
                            <span className="inline-flex h-4 w-6 items-center justify-center rounded-sm bg-base-200 text-[9px] font-semibold text-base-content/70">
                              {option.code}
                            </span>
                          )}
                          <span>{option.name}</span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </details>
            </AdminField>
          );
        }}
      />
      <div className="flex justify-end">
        <button type="submit" className="btn btn-primary" disabled={loading || saving}>{saving ? "Guardando..." : "Guardar paises"}</button>
      </div>
    </form>
  );
}

async function readApiResponse<T>(response: Response): Promise<{ data: T | null; rawText: string | null }> {
  const contentType = response.headers.get("content-type") || "";

  if (contentType.includes("application/json")) {
    return { data: (await response.json()) as T, rawText: null };
  }

  return { data: null, rawText: await response.text() };
}

const DEFAULT_ABOUT_ORDER: AboutSectionMeta[] = ABOUT_SECTION_IDS.map((id) => ({
  id,
  label: ABOUT_SECTION_LABELS[id],
  fixed: false,
  visible: true,
}));

const CARD_SECTION_DEFAULTS: Record<AboutCardSectionId, AboutCardSectionData> = DEFAULT_ABOUT_CARDS;

export default function AdminAbout() {
  const [active, setActive] = useState<AboutSectionId>("intro");
  const [sectionOrder, setSectionOrder] = useState<AboutSectionMeta[]>(DEFAULT_ABOUT_ORDER);
  const [orderSaved, setOrderSaved] = useState(false);
  const [orderError, setOrderError] = useState<string | null>(null);
  const [loadingOrder, setLoadingOrder] = useState(true);
  const [savingOrder, setSavingOrder] = useState(false);

  useEffect(() => {
    let mounted = true;

    async function loadOrder() {
      try {
        setLoadingOrder(true);
        setOrderError(null);

        const response = await fetch("/api/admin/about/sections", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error("No se pudo cargar el orden de secciones de About.");
        }

        const { data } = await readApiResponse<{ sections?: AboutSectionOrderResponseItem[] }>(response);
        if (!data || !Array.isArray(data.sections)) {
          throw new Error("La respuesta del servidor no es válida.");
        }

        const ordered = [...data.sections]
          .sort((a, b) => a.position - b.position)
          .map((section) => ({
            id: section.id,
            label: section.label,
            fixed: section.fixed,
            visible: section.visible,
          }));

        if (mounted && ordered.length) {
          setSectionOrder(ordered);
        }
      } catch (error) {
        if (mounted) {
          const message = error instanceof Error ? error.message : "No se pudo cargar el orden de secciones de About.";
          setOrderError(message);
        }
      } finally {
        if (mounted) {
          setLoadingOrder(false);
        }
      }
    }

    loadOrder();

    return () => {
      mounted = false;
    };
  }, []);

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

  function toggleSectionVisible(id: AboutSectionId) {
    setSectionOrder((prev) => prev.map((section) => (
      section.id === id ? { ...section, visible: !section.visible } : section
    )));
    setOrderSaved(false);
  }

  async function saveOrder() {
    try {
      setSavingOrder(true);
      setOrderSaved(false);
      setOrderError(null);

      const orderedSections = sectionOrder.map((section, index) => ({
        id: section.id,
        visible: section.visible,
        position: index + 1,
      }));

      const response = await fetch("/api/admin/about/sections", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sections: orderedSections }),
      });

      const { data, rawText } = await readApiResponse<{ error?: string; sections?: AboutSectionOrderResponseItem[] }>(response);

      if (!response.ok) {
        throw new Error(data?.error || (rawText ? `No se pudo guardar el orden de secciones de About. (${response.status})` : "No se pudo guardar el orden de secciones de About."));
      }

      if (!data) {
        throw new Error("El servidor devolvió una respuesta no válida al guardar secciones de About.");
      }

      if (Array.isArray(data.sections)) {
        const ordered = [...data.sections]
          .sort((a, b) => a.position - b.position)
          .map((section) => ({
            id: section.id,
            label: section.label,
            fixed: section.fixed,
            visible: section.visible,
          }));

        if (ordered.length) {
          setSectionOrder(ordered);
        }
      }

      setOrderSaved(true);
    } catch (error) {
      const message = error instanceof Error ? error.message : "No se pudo guardar el orden de secciones de About.";
      setOrderError(message);
    } finally {
      setSavingOrder(false);
    }
  }

  const allTabs = sectionOrder;

  useEffect(() => {
    if (!allTabs.some((tab) => tab.id === active)) {
      setActive("intro");
    }
  }, [active, allTabs]);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Secciones del About</h2>

      {loadingOrder && <div className="alert mb-4"><span>Cargando orden de secciones...</span></div>}
      {orderError && <div className="alert alert-error mb-4"><span>{orderError}</span></div>}
      {orderSaved && <div className="alert alert-success mb-4"><span>Orden guardado.</span></div>}

      <AboutSectionOrderEditor
        order={sectionOrder}
        onMove={moveSection}
        onToggleVisible={toggleSectionVisible}
        onSave={saveOrder}
        isSaving={savingOrder}
      />

      <div role="tablist" className="tabs tabs-border mb-8 flex-wrap">
        {allTabs.map((t) => (
          <button
            key={t.id}
            role="tab"
            className={`tab ${active === t.id ? "tab-active" : ""}`}
            onClick={() => setActive(t.id)}
            aria-selected={active === t.id}
          >
            {t.label}
          </button>
        ))}
      </div>

      {active === "intro"      && <BigCardSectionForm sectionId="intro"      defaults={CARD_SECTION_DEFAULTS.intro} />}
      {active === "mission"    && <BigCardSectionForm sectionId="mission"    defaults={CARD_SECTION_DEFAULTS.mission} />}
      {active === "vision"     && <BigCardSectionForm sectionId="vision"     defaults={CARD_SECTION_DEFAULTS.vision} />}
      {active === "values"     && <ValuesForm />}
      {active === "countries"  && <CountriesForm />}
      {active === "services"   && <BigCardSectionForm sectionId="services"   defaults={CARD_SECTION_DEFAULTS.services} />}
      {active === "whyUs"      && <BigCardSectionForm sectionId="whyUs"      defaults={CARD_SECTION_DEFAULTS.whyUs} />}
      {active === "experience" && <BigCardSectionForm sectionId="experience" defaults={CARD_SECTION_DEFAULTS.experience} />}
    </div>
  );
}


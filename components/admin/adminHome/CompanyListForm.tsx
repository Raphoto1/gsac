"use client";

import { ChangeEvent, useEffect, useRef, useState } from "react";
import { AdminField } from "../shared/AdminField";
import { AdminListEditor } from "../shared/AdminListEditor";
import { DEFAULT_CLIENTS_ITEMS, DEFAULT_HOLDINGS_ITEMS } from "@/components/home/company-list/defaults";
import { normalizeLocalizedText, resolveLocalizedText, type CompanyListItem, type CompanyListKind, type LocalizedText, type LocaleCode } from "@/types/company-list";
import { useLocale } from "next-intl";

export type CompanyItem = CompanyListItem & {
  id: number;
  isNew?: boolean;
};

const EMPTY_LOCALIZED_TEXT: LocalizedText = { es: "", en: "" };

type LocalizedField = "name" | "description" | "relationship" | "relationshipLabel" | "websiteLabel" | "caseLabel";

function normalizeCompanyItemForForm(item: CompanyItem): CompanyItem {
  return {
    ...item,
    name: normalizeLocalizedText(item.name) ?? EMPTY_LOCALIZED_TEXT,
    description: normalizeLocalizedText(item.description) ?? EMPTY_LOCALIZED_TEXT,
    relationship: item.relationship ? normalizeLocalizedText(item.relationship) : undefined,
    relationshipLabel: item.relationshipLabel ? normalizeLocalizedText(item.relationshipLabel) : undefined,
    websiteLabel: item.websiteLabel ? normalizeLocalizedText(item.websiteLabel) : undefined,
    caseLabel: item.caseLabel ? normalizeLocalizedText(item.caseLabel) : undefined,
  };
}

function getLocalizedValue(value: CompanyListItem[LocalizedField] | undefined, locale: LocaleCode): string {
  return resolveLocalizedText(value, locale);
}

function updateLocalizedValue(value: CompanyListItem[LocalizedField] | undefined, locale: LocaleCode, nextValue: string): LocalizedText {
  const normalized = normalizeLocalizedText(value) ?? EMPTY_LOCALIZED_TEXT;
  return {
    ...normalized,
    [locale]: nextValue,
  };
}

export const DEFAULT_HOLDINGS: CompanyItem[] = DEFAULT_HOLDINGS_ITEMS.map((item, index) => normalizeCompanyItemForForm({ id: index + 1, isNew: false, ...item }));

export const DEFAULT_CLIENTS: CompanyItem[] = DEFAULT_CLIENTS_ITEMS.map((item, index) => normalizeCompanyItemForForm({ id: index + 1, isNew: false, ...item }));

type Props = {
  defaultItems: CompanyItem[];
  title: string;
  kind: CompanyListKind;
};

async function readApiResponse<T>(response: Response): Promise<{ data: T | null; rawText: string | null }> {
  const contentType = response.headers.get("content-type") || "";

  if (contentType.includes("application/json")) {
    return { data: (await response.json()) as T, rawText: null };
  }

  return { data: null, rawText: await response.text() };
}

export default function CompanyListForm({ defaultItems, title, kind }: Props) {
  const locale = useLocale() === "es" ? "es" : "en";
  const [items, setItems] = useState<CompanyItem[]>(defaultItems.map(normalizeCompanyItemForForm));
  const [saved, setSaved] = useState(false);
  const [nextId, setNextId] = useState(defaultItems.length + 1);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [logoPreviewById, setLogoPreviewById] = useState<Record<number, string>>({});
  const [brokenLogoIds, setBrokenLogoIds] = useState<Record<number, true>>({});
  const previewUrlsRef = useRef<string[]>([]);

  function rememberPreviewUrl(id: number, url: string) {
    setLogoPreviewById((prev) => {
      const previous = prev[id];
      if (previous && previous.startsWith("blob:")) {
        URL.revokeObjectURL(previous);
      }

      previewUrlsRef.current = previewUrlsRef.current.filter((current) => current !== previous);
      previewUrlsRef.current.push(url);

      return { ...prev, [id]: url };
    });
  }

  function clearPreviewUrl(id: number) {
    setLogoPreviewById((prev) => {
      const previous = prev[id];
      if (previous && previous.startsWith("blob:")) {
        URL.revokeObjectURL(previous);
      }

      previewUrlsRef.current = previewUrlsRef.current.filter((current) => current !== previous);
      const next = { ...prev };
      delete next[id];
      return next;
    });
  }

  function markLogoBroken(id: number) {
    setBrokenLogoIds((prev) => ({ ...prev, [id]: true }));
  }

  function clearLogoBroken(id: number) {
    setBrokenLogoIds((prev) => {
      if (!(id in prev)) {
        return prev;
      }

      const next = { ...prev };
      delete next[id];
      return next;
    });
  }

  useEffect(() => {
    return () => {
      previewUrlsRef.current.forEach((url) => {
        if (url.startsWith("blob:")) {
          URL.revokeObjectURL(url);
        }
      });
    };
  }, []);

  useEffect(() => {
    let mounted = true;

    async function loadItems() {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(`/api/admin/home/company-list/${kind}`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error("No se pudo cargar la lista.");
        }

        const { data } = await readApiResponse<{ companies?: CompanyListItem[] }>(response);

        if (mounted && Array.isArray(data?.companies) && data.companies.length) {
          const normalized = data.companies.map((item, index) => normalizeCompanyItemForForm({ id: index + 1, isNew: false, ...item }));
          setItems(normalized);
          setNextId(normalized.length + 1);
        }
      } catch (requestError) {
        if (mounted) {
          const message = requestError instanceof Error ? requestError.message : "No se pudo cargar la lista.";
          setError(message);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    loadItems();

    return () => {
      mounted = false;
    };
  }, [kind]);

  function onChange(id: number, e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setItems((prev) => prev.map((c) => (c.id === id ? { ...c, [e.target.name]: e.target.value } : c)));
    if (e.target.name === "logo") {
      clearLogoBroken(id);
    }
    setSaved(false);
    setError(null);
  }

  function onLocalizedChange(id: number, field: LocalizedField, locale: LocaleCode, value: string) {
    setItems((prev) =>
      prev.map((item) => {
        if (item.id !== id) {
          return item;
        }

        return {
          ...item,
          [field]: updateLocalizedValue(item[field], locale, value),
        } as CompanyItem;
      }),
    );
    setSaved(false);
    setError(null);
  }

  function onAdd() {
    setItems((p) => [...p, { id: nextId, isNew: true, name: EMPTY_LOCALIZED_TEXT, description: EMPTY_LOCALIZED_TEXT, logo: "", website: "" }]);
    setNextId((n) => n + 1);
  }

  function onRemove(id: number) {
    const nextItems = items.filter((c) => c.id !== id);
    void persistItems(nextItems, items);
  }

  async function onLogoFileChange(id: number, e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setSaving(true);
      setError(null);

      const localPreviewUrl = URL.createObjectURL(file);
      rememberPreviewUrl(id, localPreviewUrl);
      clearLogoBroken(id);

      const previousLogo = items.find((item) => item.id === id)?.logo;

      const formData = new FormData();
      formData.set("file", file);
      formData.set("fileName", `${kind}-${id}-${file.name}`);
      if (previousLogo) {
        formData.set("previousLogo", previousLogo);
      }

      const response = await fetch(`/api/admin/home/company-list/${kind}/logo`, {
        method: "POST",
        body: formData,
      });

      const { data, rawText } = await readApiResponse<{ url?: string; error?: string }>(response);

      if (!response.ok) {
        throw new Error(data?.error || (rawText ? `No se pudo subir el logo. (${response.status})` : "No se pudo subir el logo."));
      }

      if (typeof data?.url !== "string" || !data.url) {
        throw new Error("La subida no devolvió una URL válida.");
      }

      setItems((prev) => prev.map((c) => (c.id === id ? { ...c, logo: data.url } : c)));
      clearPreviewUrl(id);
      setSaved(false);
    } catch (requestError) {
      const message = requestError instanceof Error ? requestError.message : "No se pudo subir el logo.";
      setError(message);
    } finally {
      setSaving(false);
      e.target.value = "";
    }
  }

  async function persistItems(nextItems: CompanyItem[], previousItems: CompanyItem[] = items) {
    try {
      setSaving(true);
      setSaved(false);
      setError(null);

      const response = await fetch(`/api/admin/home/company-list/${kind}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ companies: nextItems.map(({ id, isNew, ...item }) => item) }),
      });

      const { data, rawText } = await readApiResponse<{ error?: string; companies?: CompanyListItem[] }>(response);

      if (!response.ok) {
        throw new Error(data?.error || (rawText ? `No se pudo guardar la lista. (${response.status})` : "No se pudo guardar la lista."));
      }

      if (Array.isArray(data?.companies) && data.companies.length) {
        const normalized = data.companies.map((item, index) => normalizeCompanyItemForForm({ id: index + 1, isNew: false, ...item }));
        const removedIds = previousItems
          .filter((previousItem) => !nextItems.some((nextItem) => nextItem.id === previousItem.id))
          .map((item) => item.id);

        removedIds.forEach((removedId) => {
          clearPreviewUrl(removedId);
          clearLogoBroken(removedId);
        });

        setItems(normalized);
        setNextId(normalized.length + 1);
      }

      setSaved(true);
    } catch (requestError) {
      const message = requestError instanceof Error ? requestError.message : "No se pudo guardar la lista.";
      setError(message);
    } finally {
      setSaving(false);
    }
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    await persistItems(items, items);
  }

  async function onUpdateItem() {
    await persistItems(items, items);
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4">
      {loading && <div className="alert"><span>Cargando lista...</span></div>}
      {error && <div className="alert alert-error"><span>{error}</span></div>}
      {saved && <div className="alert alert-success"><span>Guardado.</span></div>}
      <AdminListEditor
        items={items}
        onItemChange={onChange}
        onAdd={onAdd}
        onRemove={onRemove}
        useAccordion
        getItemTitle={(item, index) => {
          const localizedName = resolveLocalizedText(item.name, locale).trim();
          return localizedName ? `${index + 1}. ${localizedName}` : `Ítem ${index + 1}`;
        }}
        getRemoveConfirmation={(item) => ({
          title: `Eliminar ${resolveLocalizedText(item.name, locale) || "empresa"}`,
          description: `Esta acción eliminará "${resolveLocalizedText(item.name, locale) || "esta empresa"}" de la lista. Si quieres volver a usarla tendrás que cargarla otra vez.`,
          confirmLabel: "Sí, eliminar",
          cancelLabel: "Cancelar",
        })}
        renderActions={(item) => (
          <button type="button" className="btn btn-sm btn-secondary" onClick={() => void onUpdateItem()} disabled={saving || loading}>
            {saving ? "Guardando..." : item.isNew ? "Crear" : "Update"}
          </button>
        )}
        addLabel="+ Agregar empresa"
        renderFields={(c) => (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <AdminField label="Nombre" id={`co-name-${c.id}`}>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                <label className="flex flex-col gap-1 text-xs font-medium text-base-content/70">
                  ES
                  <input id={`co-name-es-${c.id}`} type="text" className="input w-full" value={getLocalizedValue(c.name, "es")} onChange={(e) => onLocalizedChange(c.id, "name", "es", e.target.value)} required />
                </label>
                <label className="flex flex-col gap-1 text-xs font-medium text-base-content/70">
                  EN
                  <input id={`co-name-en-${c.id}`} type="text" className="input w-full" value={getLocalizedValue(c.name, "en")} onChange={(e) => onLocalizedChange(c.id, "name", "en", e.target.value)} required />
                </label>
              </div>
            </AdminField>

            <AdminField label="Descripción" id={`co-desc-${c.id}`}>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                <label className="flex flex-col gap-1 text-xs font-medium text-base-content/70">
                  ES
                  <textarea id={`co-desc-es-${c.id}`} className="textarea w-full h-24" value={getLocalizedValue(c.description, "es")} onChange={(e) => onLocalizedChange(c.id, "description", "es", e.target.value)} />
                </label>
                <label className="flex flex-col gap-1 text-xs font-medium text-base-content/70">
                  EN
                  <textarea id={`co-desc-en-${c.id}`} className="textarea w-full h-24" value={getLocalizedValue(c.description, "en")} onChange={(e) => onLocalizedChange(c.id, "description", "en", e.target.value)} />
                </label>
              </div>
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
                  brokenLogoIds[c.id] ? (
                    <div className="flex h-12 w-full items-center justify-center rounded bg-base-200 px-3 text-xs text-base-content/60">
                      Preview no disponible
                    </div>
                  ) : (
                    <img
                      src={logoPreviewById[c.id] || c.logo}
                      alt={`Preview logo ${c.name || c.id}`}
                      className="h-12 w-auto object-contain rounded bg-base-200 p-1"
                      onError={() => markLogoBroken(c.id)}
                      onLoad={() => clearLogoBroken(c.id)}
                    />
                  )
                )}
              </div>
            </AdminField>

            <AdminField label="Sitio web (URL)" id={`co-web-${c.id}`}>
              <input id={`co-web-${c.id}`} name="website" type="url" className="input w-full" value={c.website || ""} onChange={(e) => onChange(c.id, e)} />
            </AdminField>

            {kind === "clients" ? (
              <>
                <AdminField label="Relación" id={`co-rel-${c.id}`}>
                  <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                    <label className="flex flex-col gap-1 text-xs font-medium text-base-content/70">
                      ES
                      <input id={`co-rel-es-${c.id}`} type="text" className="input w-full" value={getLocalizedValue(c.relationship, "es")} onChange={(e) => onLocalizedChange(c.id, "relationship", "es", e.target.value)} />
                    </label>
                    <label className="flex flex-col gap-1 text-xs font-medium text-base-content/70">
                      EN
                      <input id={`co-rel-en-${c.id}`} type="text" className="input w-full" value={getLocalizedValue(c.relationship, "en")} onChange={(e) => onLocalizedChange(c.id, "relationship", "en", e.target.value)} />
                    </label>
                  </div>
                </AdminField>
                <AdminField label="Label relación" id={`co-rel-label-${c.id}`}>
                  <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                    <label className="flex flex-col gap-1 text-xs font-medium text-base-content/70">
                      ES
                      <input id={`co-rel-label-es-${c.id}`} type="text" className="input w-full" value={getLocalizedValue(c.relationshipLabel, "es")} onChange={(e) => onLocalizedChange(c.id, "relationshipLabel", "es", e.target.value)} />
                    </label>
                    <label className="flex flex-col gap-1 text-xs font-medium text-base-content/70">
                      EN
                      <input id={`co-rel-label-en-${c.id}`} type="text" className="input w-full" value={getLocalizedValue(c.relationshipLabel, "en")} onChange={(e) => onLocalizedChange(c.id, "relationshipLabel", "en", e.target.value)} />
                    </label>
                  </div>
                </AdminField>
                <AdminField label="Label sitio web" id={`co-web-label-${c.id}`}>
                  <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                    <label className="flex flex-col gap-1 text-xs font-medium text-base-content/70">
                      ES
                      <input id={`co-web-label-es-${c.id}`} type="text" className="input w-full" value={getLocalizedValue(c.websiteLabel, "es")} onChange={(e) => onLocalizedChange(c.id, "websiteLabel", "es", e.target.value)} />
                    </label>
                    <label className="flex flex-col gap-1 text-xs font-medium text-base-content/70">
                      EN
                      <input id={`co-web-label-en-${c.id}`} type="text" className="input w-full" value={getLocalizedValue(c.websiteLabel, "en")} onChange={(e) => onLocalizedChange(c.id, "websiteLabel", "en", e.target.value)} />
                    </label>
                  </div>
                </AdminField>
                <AdminField label="Caso (URL)" id={`co-case-${c.id}`}>
                  <input id={`co-case-${c.id}`} name="caseHref" type="url" className="input w-full" value={c.caseHref || ""} onChange={(e) => onChange(c.id, e)} />
                </AdminField>
                <AdminField label="Label caso" id={`co-case-label-${c.id}`}>
                  <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                    <label className="flex flex-col gap-1 text-xs font-medium text-base-content/70">
                      ES
                      <input id={`co-case-label-es-${c.id}`} type="text" className="input w-full" value={getLocalizedValue(c.caseLabel, "es")} onChange={(e) => onLocalizedChange(c.id, "caseLabel", "es", e.target.value)} />
                    </label>
                    <label className="flex flex-col gap-1 text-xs font-medium text-base-content/70">
                      EN
                      <input id={`co-case-label-en-${c.id}`} type="text" className="input w-full" value={getLocalizedValue(c.caseLabel, "en")} onChange={(e) => onLocalizedChange(c.id, "caseLabel", "en", e.target.value)} />
                    </label>
                  </div>
                </AdminField>
              </>
            ) : null}
          </div>
        )}
      />
      <div className="flex justify-end">
        <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? "Guardando..." : `Guardar ${title.toLowerCase()}`}</button>
      </div>
    </form>
  );
}
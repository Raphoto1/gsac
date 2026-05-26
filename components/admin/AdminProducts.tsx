"use client";

import React, { ChangeEvent, useEffect, useMemo, useState } from "react";
import type { IconType } from "react-icons";
import {
  IoBriefcase,
  IoBusiness,
  IoConstruct,
  IoGlobe,
  IoRocket,
  IoSettings,
} from "react-icons/io5";
import { AdminField } from "./shared/AdminField";
import AdminCasesForm from "./AdminCasesForm";
import {
  DEFAULT_HOME_PRODUCTS_HEADER,
  HOME_PRODUCT_ICON_OPTIONS,
  type HomeProductIcon,
  type HomeProductItem,
  type HomeProductsHeader,
} from "@/types/home-products";

type EditableProductItem = HomeProductItem & {
  isNew?: boolean;
};

const PRODUCT_ICON_COMPONENTS: Record<HomeProductIcon, IconType> = {
  business: IoBusiness,
  briefcase: IoBriefcase,
  construct: IoConstruct,
  globe: IoGlobe,
  rocket: IoRocket,
  settings: IoSettings,
};

async function readApiResponse<T>(response: Response): Promise<{ data: T | null; rawText: string | null }> {
  const contentType = response.headers.get("content-type") || "";

  if (contentType.includes("application/json")) {
    return { data: (await response.json()) as T, rawText: null };
  }

  return { data: null, rawText: await response.text() };
}

function reindexProducts(items: EditableProductItem[]): EditableProductItem[] {
  return items.map((item, index) => ({ ...item, id: index + 1 }));
}

function HeaderForm() {
  const [data, setData] = useState<HomeProductsHeader>(DEFAULT_HOME_PRODUCTS_HEADER);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    async function loadHeader() {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch("/api/admin/home/products", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error("No se pudo cargar el encabezado de productos.");
        }

        const { data: responseData } = await readApiResponse<{ header?: HomeProductsHeader }>(response);
        if (mounted && responseData?.header) {
          setData(responseData.header);
        }
      } catch (requestError) {
        if (mounted) {
          const message = requestError instanceof Error ? requestError.message : "No se pudo cargar el encabezado de productos.";
          setError(message);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    loadHeader();

    return () => {
      mounted = false;
    };
  }, []);

  const onChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name.startsWith("title.")) {
      const lang = name.split(".")[1];
      setData((p) => ({ ...p, title: { ...p.title, [lang]: value } }));
    } else if (name.startsWith("description.")) {
      const lang = name.split(".")[1];
      setData((p) => ({ ...p, description: { ...p.description, [lang]: value } }));
    } else if (name.startsWith("secondaryDescription.")) {
      const lang = name.split(".")[1];
      setData((p) => ({ ...p, secondaryDescription: { ...p.secondaryDescription, [lang]: value } }));
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

      const response = await fetch("/api/admin/home/products", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ header: data }),
      });

      const { data: responseData, rawText } = await readApiResponse<{ error?: string; header?: HomeProductsHeader }>(response);
      if (!response.ok) {
        throw new Error(responseData?.error || (rawText ? `No se pudo guardar el encabezado. (${response.status})` : "No se pudo guardar el encabezado."));
      }

      if (responseData?.header) {
        setData(responseData.header);
      }

      setSaved(true);
    } catch (requestError) {
      const message = requestError instanceof Error ? requestError.message : "No se pudo guardar el encabezado.";
      setError(message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="card bg-base-100 shadow-sm">
      <div className="card-body gap-4">
        {loading && <div className="alert"><span>Cargando encabezado...</span></div>}
        {error && <div className="alert alert-error"><span>{error}</span></div>}
        {saved && <div className="alert alert-success"><span>Guardado.</span></div>}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <AdminField label="Título (ES)" id="ph-title-es">
            <input id="ph-title-es" name="title.es" type="text" className="input w-full" value={data.title.es} onChange={onChange} required />
          </AdminField>
          <AdminField label="Título (EN)" id="ph-title-en">
            <input id="ph-title-en" name="title.en" type="text" className="input w-full" value={data.title.en} onChange={onChange} required />
          </AdminField>
          <AdminField label="Imagen (URL)" id="ph-img">
            <input id="ph-img" name="imageUrl" type="url" className="input w-full" value={data.imageUrl} onChange={onChange} />
          </AdminField>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <AdminField label="Descripción (ES)" id="ph-desc-es">
            <textarea id="ph-desc-es" name="description.es" className="textarea w-full h-20" value={data.description.es} onChange={onChange} required />
          </AdminField>
          <AdminField label="Descripción (EN)" id="ph-desc-en">
            <textarea id="ph-desc-en" name="description.en" className="textarea w-full h-20" value={data.description.en} onChange={onChange} required />
          </AdminField>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <AdminField label="Descripción secundaria (ES)" id="ph-desc2-es">
            <textarea id="ph-desc2-es" name="secondaryDescription.es" className="textarea w-full h-20" value={data.secondaryDescription.es} onChange={onChange} />
          </AdminField>
          <AdminField label="Descripción secundaria (EN)" id="ph-desc2-en">
            <textarea id="ph-desc2-en" name="secondaryDescription.en" className="textarea w-full h-20" value={data.secondaryDescription.en} onChange={onChange} />
          </AdminField>
        </div>
        <div className="card-actions justify-end pt-2">
          <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? "Guardando..." : "Guardar"}</button>
        </div>
      </div>
    </form>
  );
}

function ProductsListForm() {
  const [products, setProducts] = useState<EditableProductItem[]>([]);
  const [saved, setSaved] = useState(false);
  const [updatedId, setUpdatedId] = useState<number | null>(null);
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [pendingRemoveId, setPendingRemoveId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [updatingId, setUpdatingId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    async function loadProducts() {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch("/api/admin/home/products", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error("No se pudieron cargar los servicios.");
        }

        const { data: responseData } = await readApiResponse<{ products?: HomeProductItem[] }>(response);
        if (mounted && Array.isArray(responseData?.products)) {
          const nextProducts = reindexProducts(responseData.products).map((item) => ({ ...item, isNew: false }));
          setProducts(nextProducts);
          setExpandedId(nextProducts[0]?.id ?? null);
        }
      } catch (requestError) {
        if (mounted) {
          const message = requestError instanceof Error ? requestError.message : "No se pudieron cargar los servicios.";
          setError(message);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    loadProducts();

    return () => {
      mounted = false;
    };
  }, []);

  const nextId = useMemo(
    () => (products.length ? Math.max(...products.map((product) => product.id)) + 1 : 1),
    [products],
  );

  const onChange = (id: number, e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setProducts((prev) => prev.map((p) => {
      if (p.id !== id) return p;
      if (name.startsWith("title.")) {
        const lang = name.split(".")[1];
        return { ...p, title: { ...p.title, [lang]: value } };
      } else if (name.startsWith("description.")) {
        const lang = name.split(".")[1];
        return { ...p, description: { ...p.description, [lang]: value } };
      } else if (name.startsWith("expandTitle.")) {
        const lang = name.split(".")[1];
        return { ...p, expandTitle: { ...p.expandTitle, [lang]: value } };
      } else if (name.startsWith("expandText.")) {
        const lang = name.split(".")[1];
        return { ...p, expandText: { ...p.expandText, [lang]: value } };
      } else {
        return { ...p, [name]: value };
      }
    }));

    setSaved(false);
    setError(null);
  };

  const onAdd = () => {
    const newProduct: EditableProductItem = {
      id: nextId,
      title: { es: "", en: "" },
      description: { es: "", en: "" },
      icon: "briefcase",
      expandTitle: { es: "", en: "" },
      expandText: { es: "", en: "" },
      expandImage: "",
      isNew: true,
    };

    setProducts((previous) => [...previous, newProduct]);
    setExpandedId(newProduct.id);
    setSaved(false);
    setError(null);
  };

  const onIconPick = (id: number, icon: HomeProductIcon) => {
    setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, icon } : p)));
    setSaved(false);
    setError(null);
  };

  const requestRemoveService = (id: number) => {
    setPendingRemoveId(id);
  };

  const cancelRemoveService = () => {
    setPendingRemoveId(null);
  };

  const confirmRemoveService = async () => {
    if (pendingRemoveId === null) return;

    const removeId = pendingRemoveId;
    const payloadProducts = reindexProducts(products.filter((item) => item.id !== removeId));

    try {
      setPendingRemoveId(null);
      setUpdatingId(removeId);
      setSaved(false);
      setUpdatedId(null);
      setError(null);

      const response = await fetch("/api/admin/home/products", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ products: payloadProducts }),
      });

      const { data: responseData, rawText } = await readApiResponse<{ error?: string; products?: HomeProductItem[] }>(response);
      if (!response.ok) {
        throw new Error(responseData?.error || (rawText ? `No se pudo eliminar el servicio. (${response.status})` : "No se pudo eliminar el servicio."));
      }

      if (Array.isArray(responseData?.products)) {
        const nextProducts = reindexProducts(responseData.products).map((item) => ({ ...item, isNew: false }));
        setProducts(nextProducts);
        setExpandedId((prevExpandedId) => {
          if (prevExpandedId === removeId) {
            return nextProducts[0]?.id ?? null;
          }

          if (prevExpandedId && !nextProducts.some((item) => item.id === prevExpandedId)) {
            return nextProducts[0]?.id ?? null;
          }

          return prevExpandedId;
        });
      }
    } catch (requestError) {
      const message = requestError instanceof Error ? requestError.message : "No se pudo eliminar el servicio.";
      setError(message);
    } finally {
      setUpdatingId(null);
    }
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setSaving(true);
      setSaved(false);
      setError(null);

      const payloadProducts = reindexProducts(products);
      const response = await fetch("/api/admin/home/products", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ products: payloadProducts }),
      });

      const { data: responseData, rawText } = await readApiResponse<{ error?: string; products?: HomeProductItem[] }>(response);

      if (!response.ok) {
        throw new Error(responseData?.error || (rawText ? `No se pudo guardar los servicios. (${response.status})` : "No se pudo guardar los servicios."));
      }

      if (Array.isArray(responseData?.products)) {
        const nextProducts = reindexProducts(responseData.products).map((item) => ({ ...item, isNew: false }));
        setProducts(nextProducts);
        setExpandedId(nextProducts[0]?.id ?? null);
      }

      setSaved(true);
      setUpdatedId(null);
    } catch (requestError) {
      const message = requestError instanceof Error ? requestError.message : "No se pudo guardar los servicios.";
      setError(message);
    } finally {
      setSaving(false);
    }
  };

  const onUpdateService = async (id: number) => {
    try {
      setUpdatingId(id);
      setSaved(false);
      setUpdatedId(null);
      setError(null);

      const payloadProducts = reindexProducts(products);
      const response = await fetch("/api/admin/home/products", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ products: payloadProducts }),
      });

      const { data: responseData, rawText } = await readApiResponse<{ error?: string; products?: HomeProductItem[] }>(response);
      if (!response.ok) {
        throw new Error(responseData?.error || (rawText ? `No se pudo actualizar el servicio. (${response.status})` : "No se pudo actualizar el servicio."));
      }

      if (Array.isArray(responseData?.products)) {
        const nextProducts = reindexProducts(responseData.products).map((item) => ({ ...item, isNew: false }));
        setProducts(nextProducts);
      }

      setUpdatedId(id);
    } catch (requestError) {
      const message = requestError instanceof Error ? requestError.message : "No se pudo actualizar el servicio.";
      setError(message);
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4">
      {loading && <div className="alert"><span>Cargando servicios...</span></div>}
      {error && <div className="alert alert-error"><span>{error}</span></div>}
      {saved && <div className="alert alert-success"><span>Guardado.</span></div>}
      {products.map((p, i) => (
        <div key={p.id} className="card bg-base-100 shadow-sm border border-base-300">
          <div className="card-body gap-3 py-4">
            <div className="flex items-center justify-between w-full">
              <button
                type="button"
                className="flex items-center gap-2 text-left flex-1"
                onClick={() => setExpandedId(expandedId === p.id ? null : p.id)}
              >
                <span className="font-semibold text-sm">Servicio {i + 1}{p.title?.es ? ` — ${p.title.es}` : ""}</span>
                <span className="text-base-content/50 text-sm">{expandedId === p.id ? "▲" : "▼"}</span>
              </button>
              <div className="flex items-center gap-2">
                <button type="button" className="btn btn-ghost btn-xs text-error" onClick={() => requestRemoveService(p.id)} disabled={updatingId === p.id}>
                  Eliminar
                </button>
              </div>
            </div>
            {updatedId === p.id && <div className="text-success text-xs">Servicio actualizado.</div>}
            {expandedId === p.id && (
              <div className="flex flex-col gap-3 pt-2">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <AdminField label="Título (ES)" id={`ps-title-es-${p.id}`}>
                    <input id={`ps-title-es-${p.id}`} name="title.es" type="text" className="input w-full" value={p.title.es} onChange={(e) => onChange(p.id, e)} required />
                  </AdminField>
                  <AdminField label="Título (EN)" id={`ps-title-en-${p.id}`}>
                    <input id={`ps-title-en-${p.id}`} name="title.en" type="text" className="input w-full" value={p.title.en} onChange={(e) => onChange(p.id, e)} required />
                  </AdminField>
                  <AdminField label="Ícono" id={`ps-icon-${p.id}`}>
                    <select id={`ps-icon-${p.id}`} name="icon" className="select w-full" value={p.icon} onChange={(e) => onChange(p.id, e)}>
                      {HOME_PRODUCT_ICON_OPTIONS.map((opt) => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                  </AdminField>
                  <div className="rounded-xl border border-base-300 bg-base-200/40 p-3">
                    <p className="text-xs uppercase tracking-wide text-base-content/70">Preview ícono</p>
                    <div className="mt-2 flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-content">
                        {React.createElement(PRODUCT_ICON_COMPONENTS[p.icon], { size: 20 })}
                      </div>
                      <span className="text-sm font-medium">{p.icon}</span>
                    </div>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {HOME_PRODUCT_ICON_OPTIONS.map((iconOption) => (
                        <button
                          key={iconOption}
                          type="button"
                          className={`btn btn-sm ${p.icon === iconOption ? "btn-primary" : "btn-ghost"}`}
                          onClick={() => onIconPick(p.id, iconOption)}
                          aria-label={`Usar ícono ${iconOption}`}
                          title={iconOption}
                        >
                          {React.createElement(PRODUCT_ICON_COMPONENTS[iconOption], { size: 16 })}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <AdminField label="Descripción (ES)" id={`ps-desc-es-${p.id}`}>
                    <textarea id={`ps-desc-es-${p.id}`} name="description.es" className="textarea w-full h-16" value={p.description.es} onChange={(e) => onChange(p.id, e)} required />
                  </AdminField>
                  <AdminField label="Descripción (EN)" id={`ps-desc-en-${p.id}`}>
                    <textarea id={`ps-desc-en-${p.id}`} name="description.en" className="textarea w-full h-16" value={p.description.en} onChange={(e) => onChange(p.id, e)} required />
                  </AdminField>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <AdminField label="Título expandido (ES)" id={`ps-etitle-es-${p.id}`}>
                    <input id={`ps-etitle-es-${p.id}`} name="expandTitle.es" type="text" className="input w-full" value={p.expandTitle.es} onChange={(e) => onChange(p.id, e)} />
                  </AdminField>
                  <AdminField label="Título expandido (EN)" id={`ps-etitle-en-${p.id}`}>
                    <input id={`ps-etitle-en-${p.id}`} name="expandTitle.en" type="text" className="input w-full" value={p.expandTitle.en} onChange={(e) => onChange(p.id, e)} />
                  </AdminField>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <AdminField label="Texto expandido (ES)" id={`ps-etext-es-${p.id}`}>
                    <textarea id={`ps-etext-es-${p.id}`} name="expandText.es" className="textarea w-full h-36" value={p.expandText.es} onChange={(e) => onChange(p.id, e)} />
                  </AdminField>
                  <AdminField label="Texto expandido (EN)" id={`ps-etext-en-${p.id}`}>
                    <textarea id={`ps-etext-en-${p.id}`} name="expandText.en" className="textarea w-full h-36" value={p.expandText.en} onChange={(e) => onChange(p.id, e)} />
                  </AdminField>
                </div>
                <AdminField label="Imagen expandida (URL)" id={`ps-eimg-${p.id}`}>
                  <input id={`ps-eimg-${p.id}`} name="expandImage" type="url" className="input w-full" value={p.expandImage} onChange={(e) => onChange(p.id, e)} />
                </AdminField>
                <div className="flex justify-start pt-1">
                  <button
                    type="button"
                    className={`btn btn-sm ${p.isNew ? "btn-secondary" : "btn-primary"}`}
                    onClick={() => onUpdateService(p.id)}
                    disabled={saving || updatingId === p.id}
                  >
                    {updatingId === p.id ? (p.isNew ? "Agregando..." : "Actualizando...") : (p.isNew ? "Agregar" : "Actualizar")}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      ))}
      <button type="button" className="btn btn-outline btn-sm w-fit" onClick={onAdd}>
        + Agregar servicio
      </button>
      <div className="flex justify-end">
        <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? "Guardando..." : "Guardar servicios"}</button>
      </div>

      {pendingRemoveId !== null ? (
        <dialog
          className="modal modal-open"
          open
          onClick={(event) => {
            if (event.target === event.currentTarget) {
              cancelRemoveService();
            }
          }}
        >
          <div className="modal-box" onClick={(event) => event.stopPropagation()}>
            <h3 className="text-lg font-semibold">Eliminar servicio</h3>
            <p className="mt-2 text-sm text-base-content/70">
              Esta accion eliminara el servicio seleccionado. Podras recuperarlo solo volviendolo a crear manualmente.
            </p>
            <div className="modal-action">
              <button type="button" className="btn btn-ghost" onClick={cancelRemoveService}>
                Cancelar
              </button>
              <button type="button" className="btn btn-error" onClick={confirmRemoveService}>
                Eliminar
              </button>
            </div>
          </div>
        </dialog>
      ) : null}
    </form>
  );
}

type Tab = "header" | "services" | "cases";

const TABS: { id: Tab; label: string }[] = [
  { id: "header",   label: "Encabezado" },
  { id: "services", label: "Servicios" },
  { id: "cases",    label: "Casos de éxito" },
];

export default function AdminProducts() {
  const [active, setActive] = useState<Tab>("header");

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Secciones de Servicios</h2>

      <div role="tablist" className="tabs tabs-border mb-8 flex-wrap">
        {TABS.map((t) => (
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

      {active === "header"   && <HeaderForm />}
      {active === "services" && <ProductsListForm />}
      {active === "cases"    && <AdminCasesForm />}
    </div>
  );
}


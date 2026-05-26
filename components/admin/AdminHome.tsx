"use client";

import React, { useEffect, useState } from "react";
import type { SectionId, SectionMeta, SectionOrderResponseItem } from "@/types/home-sections";
import {
  FIXED_BOTTOM,
  FIXED_TOP,
  REORDERABLE_DEFAULTS,
  SectionOrderEditor,
} from "./SectionOrderEditor";
import HeroTab from "./adminHome/HeroTab";
import BigCardTab from "./adminHome/BigCardTab";
import CasesTab from "./adminHome/CasesTab";
import TeamTab from "./adminHome/TeamTab";
import CompanyListTab from "./adminHome/CompanyListTab";
import ContactTab from "./adminHome/ContactTab";
import { DEFAULT_CLIENTS, DEFAULT_HOLDINGS } from "./adminHome/CompanyListForm";

async function readApiResponse<T>(response: Response): Promise<{ data: T | null; rawText: string | null }> {
  const contentType = response.headers.get("content-type") || "";

  if (contentType.includes("application/json")) {
    return { data: (await response.json()) as T, rawText: null };
  }

  return { data: null, rawText: await response.text() };
}

export default function AdminHome() {
  const [active, setActive] = useState<SectionId>("hero");
  const [sectionOrder, setSectionOrder] = useState<SectionMeta[]>(REORDERABLE_DEFAULTS);
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

        const response = await fetch("/api/admin/home/sections", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error("No se pudo cargar el orden de secciones.");
        }

        const { data } = await readApiResponse<{ sections?: SectionOrderResponseItem[] }>(response);
        if (!data || !Array.isArray(data.sections)) {
          throw new Error("La respuesta del servidor no es válida.");
        }

        const ordered = [...data.sections]
          .sort((a, b) => a.position - b.position)
          .filter((section) => !section.fixed)
          .map((section) => ({ id: section.id, label: section.label, fixed: section.fixed, visible: section.visible }));

        if (mounted && ordered.length) {
          setSectionOrder(ordered);
        }
      } catch (error) {
        if (mounted) {
          const message = error instanceof Error ? error.message : "No se pudo cargar el orden de secciones.";
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

  function toggleSectionVisible(id: SectionId) {
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

      const orderedSections = [FIXED_TOP, ...sectionOrder, FIXED_BOTTOM].map((section, index) => ({
        id: section.id,
        visible: section.visible,
        position: index + 1,
      }));

      const response = await fetch("/api/admin/home/sections", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sections: orderedSections }),
      });

      const { data, rawText } = await readApiResponse<{ error?: string; sections?: SectionOrderResponseItem[] }>(response);

      if (!response.ok) {
        throw new Error(data?.error || (rawText ? `No se pudo guardar el orden de secciones. (${response.status})` : "No se pudo guardar el orden de secciones."));
      }

      if (!data) {
        throw new Error("El servidor devolvió una respuesta no válida al guardar secciones.");
      }

      if (Array.isArray(data.sections)) {
        const ordered = [...data.sections]
          .sort((a, b) => a.position - b.position)
          .filter((section) => !section.fixed)
          .map((section) => ({ id: section.id, label: section.label, fixed: section.fixed, visible: section.visible }));

        if (ordered.length) {
          setSectionOrder(ordered);
        }
      }

      setOrderSaved(true);
    } catch (error) {
      const message = error instanceof Error ? error.message : "No se pudo guardar el orden de secciones.";
      setOrderError(message);
    } finally {
      setSavingOrder(false);
    }
  }

  const allTabs: SectionMeta[] = [FIXED_TOP, ...sectionOrder, FIXED_BOTTOM];

  return (
    <div>
      <h2 className="mb-6 text-2xl font-bold">Secciones del Home</h2>

      {loadingOrder && <div className="alert mb-4"><span>Cargando orden de secciones...</span></div>}
      {orderError && <div className="alert alert-error mb-4"><span>{orderError}</span></div>}
      {orderSaved && <div className="alert alert-success mb-4"><span>Orden guardado.</span></div>}
      <SectionOrderEditor order={sectionOrder} onMove={moveSection} onToggleVisible={toggleSectionVisible} onSave={saveOrder} isSaving={savingOrder} />

      <div role="tablist" className="tabs tabs-border mb-8 flex-wrap">
        {allTabs.map((section) => (
          <button key={section.id} role="tab" className={`tab ${active === section.id ? "tab-active" : ""}`} onClick={() => setActive(section.id)} aria-selected={active === section.id}>
            {section.label}
          </button>
        ))}
      </div>

      {active === "hero" && <HeroTab />}
      {active === "bigcard" && <BigCardTab />}
      {active === "cases" && <CasesTab />}
      {active === "team" && <TeamTab />}
      {active === "holdings" && <CompanyListTab defaultItems={DEFAULT_HOLDINGS} title="Holdings" kind="holdings" />}
      {active === "clients" && <CompanyListTab defaultItems={DEFAULT_CLIENTS} title="Clientes & Aliados" kind="clients" />}
      {active === "contact" && <ContactTab />}
    </div>
  );
}

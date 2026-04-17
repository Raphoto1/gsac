"use client";

import React, { useState } from "react";
import AdminHome from "./AdminHome";
import AdminAbout from "./AdminAbout";
import AdminProducts from "./AdminProducts";
import AdminContact from "./AdminContact";
import ContactAsked from "./ContactAsked";
import AdminGeneral from "./AdminGeneral";

type Tab = "home" | "about" | "products" | "contact" | "contactAsked" | "general";

const TABS: { id: Tab; label: string }[] = [
  { id: "home", label: "Inicio" },
  { id: "about", label: "Nosotros" },
  { id: "products", label: "Servicios" },
  { id: "contact", label: "Contacto" },
  { id: "contactAsked", label: "Solicitudes de Contacto" },
  { id: "general", label: "Datos Generales" },
];

export default function AdminPanel() {
  const [activeTab, setActiveTab] = useState<Tab>("home");

  return (
    <div className='mt-10'>
      {/* Tab navigation */}
      <div role='tablist' className='tabs tabs-border tabs-lg'>
        {TABS.map((tab) => (
          <button
            key={tab.id}
            role='tab'
            className={`tab font-medium ${activeTab === tab.id ? "tab-active" : ""}`}
            onClick={() => setActiveTab(tab.id)}
            aria-selected={activeTab === tab.id}>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab panels */}
      <div className='mt-8'>
        {activeTab === "home" && (
          <section aria-labelledby='tab-home-title'>
            <AdminHome />
          </section>
        )}

        {activeTab === "about" && (
          <section aria-labelledby='tab-about-title'>
            <AdminAbout />
          </section>
        )}

        {activeTab === "products" && (
          <section aria-labelledby='tab-products-title'>
            <AdminProducts />
          </section>
        )}

        {activeTab === "contact" && (
          <section aria-labelledby='tab-contact-title' className='flex flex-col gap-12'>
            <AdminContact />
            <div>
              <h2 className='text-2xl font-bold mb-6'>Solicitudes de Contacto</h2>
              <ContactAsked />
            </div>
          </section>
        )}

        {activeTab === "contactAsked" && (
          <section aria-labelledby='tab-contactAsked-title'>
            <ContactAsked />
          </section>
        )}

        {activeTab === "general" && (
          <section aria-labelledby='tab-general-title'>
            <AdminGeneral />
          </section>
        )}
      </div>
    </div>
  );
}

"use client";

import React, { useState } from "react";
import TableForAskedContact, { ContactRequest } from "./TableForAskedContact";

type NewUrgentForm = {
  name: string;
  email: string;
  company: string;
  message: string;
};

const EMPTY_FORM: NewUrgentForm = { name: "", email: "", company: "", message: "" };

// TODO: replace with DB data
const MOCK_REQUESTS: ContactRequest[] = [
  {
    id: 1,
    name: "María López",
    email: "maria@empresa.com",
    company: "Empresa S.A.",
    message: "Me gustaría obtener más información sobre sus servicios de consultoría.",
    date: "2026-04-15",
    attended: false,
    priority: "normal",
  },
  {
    id: 2,
    name: "Carlos Pérez",
    email: "carlos@corp.com",
    company: "Corp Ltd.",
    message: "Necesito asesoría para la reestructuración de mi empresa.",
    date: "2026-04-16",
    attended: false,
    priority: "urgent",
  },
  {
    id: 3,
    name: "Ana García",
    email: "ana@startup.io",
    company: "",
    message: "¿Tienen disponibilidad para una reunión esta semana?",
    date: "2026-04-10",
    attended: true,
    priority: "normal",
  },
];

export default function ContactAsked() {
  const [requests, setRequests] = useState<ContactRequest[]>(MOCK_REQUESTS);
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [showUrgentForm, setShowUrgentForm] = useState(false);
  const [urgentForm, setUrgentForm] = useState<NewUrgentForm>(EMPTY_FORM);
  const [nextId, setNextId] = useState(MOCK_REQUESTS.length + 1);

  const urgent = requests.filter((r) => r.priority === "urgent" && !r.attended);
  const pending = requests.filter((r) => r.priority === "normal" && !r.attended);
  const attended = requests.filter((r) => r.attended);

  function markAttended(id: number) {
    setRequests((prev) => prev.map((r) => (r.id === id ? { ...r, attended: true } : r)));
  }

  function deleteRequest(id: number) {
    setRequests((prev) => prev.filter((r) => r.id !== id));
    // TODO: delete from DB
  }

  function clearAttended() {
    setRequests((prev) => prev.filter((r) => !r.attended));
    // TODO: delete from DB
  }

  function markUrgent(id: number) {
    setRequests((prev) => prev.map((r) => (r.id === id ? { ...r, priority: "urgent", attended: false } : r)));
    // TODO: persist to DB
  }

  function toggleExpand(id: number) {
    setExpandedId((prev) => (prev === id ? null : id));
  }

  function handleUrgentFormChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value } = e.target;
    setUrgentForm((prev) => ({ ...prev, [name]: value }));
  }

  function handleAddUrgent(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const today = new Date().toISOString().split("T")[0];
    setRequests((prev) => [
      {
        id: nextId,
        name: urgentForm.name.trim(),
        email: urgentForm.email.trim().toLowerCase(),
        company: urgentForm.company.trim(),
        message: urgentForm.message.trim(),
        date: today,
        attended: false,
        priority: "urgent",
      },
      ...prev,
    ]);
    setNextId((n) => n + 1);
    setUrgentForm(EMPTY_FORM);
    setShowUrgentForm(false);
    // TODO: persist to DB
  }

  return (
    <div className="flex flex-col gap-10">

      {/* ── Urgent ── */}
      <div>
        <div className="flex items-center justify-between gap-4 mb-4 flex-wrap">
          <div className="flex items-center gap-3">
            <h3 className="text-xl font-semibold">Solicitudes urgentes</h3>
            {urgent.length > 0 && <span className="badge badge-error">{urgent.length}</span>}
          </div>
          <button className="btn btn-error btn-sm" onClick={() => setShowUrgentForm((v) => !v)}>
            {showUrgentForm ? "Cancelar" : "+ Agregar urgente"}
          </button>
        </div>

        {showUrgentForm && (
          <form onSubmit={handleAddUrgent} className="card bg-base-100 border border-error mb-6">
            <div className="card-body gap-4">
              <h4 className="font-semibold text-error">Nueva solicitud urgente</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <fieldset className="fieldset">
                  <label className="label" htmlFor="uf-name">Nombre</label>
                  <input id="uf-name" name="name" type="text" className="input w-full"
                    placeholder="Nombre del contacto" value={urgentForm.name}
                    onChange={handleUrgentFormChange} required />
                </fieldset>
                <fieldset className="fieldset">
                  <label className="label" htmlFor="uf-email">Email</label>
                  <input id="uf-email" name="email" type="email" className="input w-full"
                    placeholder="correo@ejemplo.com" value={urgentForm.email}
                    onChange={handleUrgentFormChange} required />
                </fieldset>
                <fieldset className="fieldset">
                  <label className="label" htmlFor="uf-company">Empresa</label>
                  <input id="uf-company" name="company" type="text" className="input w-full"
                    placeholder="Opcional" value={urgentForm.company}
                    onChange={handleUrgentFormChange} />
                </fieldset>
              </div>
              <fieldset className="fieldset">
                <label className="label" htmlFor="uf-message">Mensaje / Motivo</label>
                <textarea id="uf-message" name="message" className="textarea w-full h-24"
                  placeholder="Describe el motivo de urgencia" value={urgentForm.message}
                  onChange={handleUrgentFormChange} required />
              </fieldset>
              <div className="card-actions justify-end">
                <button type="submit" className="btn btn-error">Agregar solicitud urgente</button>
              </div>
            </div>
          </form>
        )}

        <TableForAskedContact
          rows={urgent}
          expandedId={expandedId}
          onToggleExpand={toggleExpand}
          emptyMessage="No hay solicitudes urgentes pendientes."
          borderClass="border-error"
          headClass="bg-error/10"
          onMarkAttended={markAttended}
        />
      </div>

      {/* ── Pending ── */}
      <div>
        <div className="flex items-center gap-3 mb-4">
          <h3 className="text-xl font-semibold">Solicitudes nuevas</h3>
          {pending.length > 0 && <span className="badge badge-primary">{pending.length}</span>}
        </div>
        <TableForAskedContact
          rows={pending}
          expandedId={expandedId}
          onToggleExpand={toggleExpand}
          emptyMessage="No hay solicitudes pendientes."
          onMarkAttended={markAttended}
          onMarkUrgent={markUrgent}
        />
      </div>

      {/* ── Attended ── */}
      <div>
        <div className="flex items-center justify-between gap-4 mb-4 flex-wrap">
          <h3 className="text-xl font-semibold">Solicitudes atendidas</h3>
          {attended.length > 0 && (
            <button
              className="btn btn-ghost btn-sm text-error border border-error"
              onClick={clearAttended}
            >
              Vaciar atendidas
            </button>
          )}
        </div>
        <div className="opacity-80">
          <TableForAskedContact
            rows={attended}
            expandedId={expandedId}
            onToggleExpand={toggleExpand}
            emptyMessage="No hay solicitudes atendidas aún."
            showPriority
            onMarkUrgent={markUrgent}
            onDelete={deleteRequest}
          />
        </div>
      </div>

    </div>
  );
}



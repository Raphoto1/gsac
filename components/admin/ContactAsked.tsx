
"use client";

import React, { useState, useEffect, useCallback } from "react";
import TableForAskedContact, { ContactRequest } from "./TableForAskedContact";

type NewUrgentForm = {
	name: string;
	email: string;
	company: string;
	message: string;
};

const EMPTY_FORM: NewUrgentForm = { name: "", email: "", company: "", message: "" };

function toContactRequest(raw: {
	id: string;
	name: string;
	email: string;
	company: string;
	message: string;
	resendId: string;
	priority: string;
	attended: boolean;
	createdAt: string;
}): ContactRequest {
	return {
		id: raw.id,
		name: raw.name,
		email: raw.email,
		company: raw.company,
		message: raw.message,
		resendId: raw.resendId,
		priority: raw.priority as "normal" | "urgent",
		attended: raw.attended,
		date: raw.createdAt.split("T")[0],
	};
}

export default function ContactAsked() {
	const [requests, setRequests] = useState<ContactRequest[]>([]);
	const [loading, setLoading] = useState(true);
	const [expandedId, setExpandedId] = useState<string | null>(null);
	const [showUrgentForm, setShowUrgentForm] = useState(false);
	const [urgentForm, setUrgentForm] = useState<NewUrgentForm>(EMPTY_FORM);
	const [saving, setSaving] = useState(false);

	const urgent = requests.filter((r) => r.priority === "urgent" && !r.attended);
	const pending = requests.filter((r) => r.priority === "normal" && !r.attended);
	const attended = requests.filter((r) => r.attended);

	const fetchRequests = useCallback(async () => {
		try {
			const res = await fetch("/api/admin/contact");
			if (res.ok) {
				const data = await res.json();
				setRequests(data.map(toContactRequest));
			}
		} catch (err) {
			console.error("Failed to fetch contact submissions:", err);
		} finally {
			setLoading(false);
		}
	}, []);

	useEffect(() => {
		fetchRequests();
	}, [fetchRequests]);

	async function markAttended(id: string) {
		setRequests((prev) => prev.map((r) => (r.id === id ? { ...r, attended: true } : r)));
		await fetch(`/api/admin/contact/${id}`, {
			method: "PATCH",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ attended: true }),
		}).catch(console.error);
	}

	async function deleteRequest(id: string) {
		setRequests((prev) => prev.filter((r) => r.id !== id));
		await fetch(`/api/admin/contact/${id}`, { method: "DELETE" }).catch(console.error);
	}

	async function clearAttended() {
		setRequests((prev) => prev.filter((r) => !r.attended));
		await fetch("/api/admin/contact/clear", { method: "DELETE" }).catch(console.error);
	}

	async function markUrgent(id: string) {
		setRequests((prev) =>
			prev.map((r) =>
				r.id === id ? { ...r, priority: "urgent" as const, attended: false } : r
			)
		);
		await fetch(`/api/admin/contact/${id}`, {
			method: "PATCH",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ priority: "urgent", attended: false }),
		}).catch(console.error);
	}

	function toggleExpand(id: string) {
		setExpandedId((prev) => (prev === id ? null : id));
	}

	function handleUrgentFormChange(
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
	) {
		const { name, value } = e.target;
		setUrgentForm((prev) => ({ ...prev, [name]: value }));
	}

	async function handleAddUrgent(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();
		setSaving(true);
		try {
			const res = await fetch("/api/admin/contact", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					name: urgentForm.name.trim(),
					email: urgentForm.email.trim().toLowerCase(),
					company: urgentForm.company.trim(),
					message: urgentForm.message.trim(),
				}),
			});
			if (res.ok) {
				const created = await res.json();
				setRequests((prev) => [toContactRequest(created), ...prev]);
				setUrgentForm(EMPTY_FORM);
				setShowUrgentForm(false);
			}
		} catch (err) {
			console.error("Failed to add urgent request:", err);
		} finally {
			setSaving(false);
		}
	}

	if (loading) {
		return (
			<div className="flex justify-center py-12">
				<span className="loading loading-spinner loading-lg" />
			</div>
		);
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
					<button
						className="btn btn-error btn-sm"
						onClick={() => setShowUrgentForm((v) => !v)}
					>
						{showUrgentForm ? "Cancelar" : "+ Agregar urgente"}
					</button>
				</div>

				{showUrgentForm && (
					<form
						onSubmit={handleAddUrgent}
						className="card bg-base-100 border border-error mb-6"
					>
						<div className="card-body gap-4">
							<h4 className="font-semibold text-error">Nueva solicitud urgente</h4>
							<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
								<fieldset className="fieldset">
									<label className="label" htmlFor="uf-name">Nombre</label>
									<input
										id="uf-name"
										name="name"
										type="text"
										className="input w-full"
										placeholder="Nombre del contacto"
										value={urgentForm.name}
										onChange={handleUrgentFormChange}
										required
									/>
								</fieldset>
								<fieldset className="fieldset">
									<label className="label" htmlFor="uf-email">Email</label>
									<input
										id="uf-email"
										name="email"
										type="email"
										className="input w-full"
										placeholder="correo@ejemplo.com"
										value={urgentForm.email}
										onChange={handleUrgentFormChange}
										required
									/>
								</fieldset>
								<fieldset className="fieldset">
									<label className="label" htmlFor="uf-company">Empresa</label>
									<input
										id="uf-company"
										name="company"
										type="text"
										className="input w-full"
										placeholder="Opcional"
										value={urgentForm.company}
										onChange={handleUrgentFormChange}
									/>
								</fieldset>
							</div>
							<fieldset className="fieldset">
								<label className="label" htmlFor="uf-message">Mensaje / Motivo</label>
								<textarea
									id="uf-message"
									name="message"
									className="textarea w-full h-24"
									placeholder="Describe el motivo de urgencia"
									value={urgentForm.message}
									onChange={handleUrgentFormChange}
									required
								/>
							</fieldset>
							<div className="card-actions justify-end">
								<button type="submit" className="btn btn-error" disabled={saving}>
									{saving ? (
										<span className="loading loading-spinner loading-sm" />
									) : (
										"Agregar solicitud urgente"
									)}
								</button>
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
					{pending.length > 0 && (
						<span className="badge badge-primary">{pending.length}</span>
					)}
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


import React from "react";

export type Priority = "normal" | "urgent";

export type ContactRequest = {
  id: number;
  name: string;
  email: string;
  company: string;
  message: string;
  date: string;
  attended: boolean;
  priority: Priority;
};

type Props = {
  rows: ContactRequest[];
  expandedId: number | null;
  onToggleExpand: (id: number) => void;
  emptyMessage: string;
  borderClass?: string;
  headClass?: string;
  showPriority?: boolean;
  onMarkAttended?: (id: number) => void;
  onMarkUrgent?: (id: number) => void;
  onDelete?: (id: number) => void;
};

export default function TableForAskedContact({
  rows,
  expandedId,
  onToggleExpand,
  emptyMessage,
  borderClass = "border-base-300",
  headClass = "",
  showPriority = false,
  onMarkAttended,
  onMarkUrgent,
  onDelete,
}: Props) {
  const hasActions = onMarkAttended || onMarkUrgent || onDelete;
  const colSpan = (showPriority ? 5 : 4) + 1 + (hasActions ? 1 : 0); // fixed cols + msg + actions

  if (rows.length === 0) {
    return (
      <div className="alert">
        <span className="text-base-content/60">{emptyMessage}</span>
      </div>
    );
  }

  return (
    <div className={`overflow-x-auto rounded-box border ${borderClass}`}>
      <table className="table table-zebra w-full">
        <thead className={headClass}>
          <tr>
            <th>Nombre</th>
            <th>Email</th>
            <th>Empresa</th>
            <th>Fecha</th>
            {showPriority && <th>Prioridad</th>}
            <th>Mensaje</th>
            {hasActions && <th className="text-center">Acciones</th>}
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <React.Fragment key={r.id}>
              <tr>
                <td className="font-medium">{r.name}</td>
                <td>
                  <a href={`mailto:${r.email}`} className="link link-hover text-sm">
                    {r.email}
                  </a>
                </td>
                <td className="text-sm text-base-content/70">{r.company || "—"}</td>
                <td className="text-sm text-base-content/70 whitespace-nowrap">{r.date}</td>
                {showPriority && (
                  <td>
                    <span className={`badge badge-sm ${r.priority === "urgent" ? "badge-error" : "badge-ghost"}`}>
                      {r.priority === "urgent" ? "Urgente" : "Normal"}
                    </span>
                  </td>
                )}
                <td>
                  <button
                    className="btn btn-ghost btn-xs"
                    onClick={() => onToggleExpand(r.id)}
                    aria-expanded={expandedId === r.id}
                  >
                    {expandedId === r.id ? "Ocultar" : "Ver"}
                  </button>
                </td>
                {hasActions && (
                  <td>
                    <div className="flex items-center justify-center gap-2">
                      {onMarkUrgent && r.priority !== "urgent" && (
                        <button className="btn btn-error btn-sm" onClick={() => onMarkUrgent(r.id)}>
                          Urgente
                        </button>
                      )}
                      {onMarkAttended && (
                        <button className="btn btn-success btn-sm" onClick={() => onMarkAttended(r.id)}>
                          Atendida
                        </button>
                      )}
                      {onDelete && (
                        <button className="btn btn-ghost btn-sm text-error" onClick={() => onDelete(r.id)}>
                          Eliminar
                        </button>
                      )}
                    </div>
                  </td>
                )}
              </tr>
              {expandedId === r.id && (
                <tr>
                  <td colSpan={colSpan} className="bg-base-200 px-6 py-3 text-sm text-base-content/80 italic">
                    {r.message}
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
}

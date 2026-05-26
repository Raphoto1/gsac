import type { AboutSectionMeta } from "@/types/about-sections";

type AboutSectionOrderEditorProps = {
  order: AboutSectionMeta[];
  onMove: (index: number, dir: -1 | 1) => void;
  onToggleVisible: (id: AboutSectionMeta["id"]) => void;
  onSave: () => void;
  isSaving: boolean;
};

export function AboutSectionOrderEditor({
  order,
  onMove,
  onToggleVisible,
  onSave,
  isSaving,
}: AboutSectionOrderEditorProps) {
  return (
    <div className="card mb-8 border border-base-300 bg-base-100 shadow-sm">
      <div className="card-body gap-3 py-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h3 className="font-semibold">Orden de secciones (About)</h3>
          <button type="button" className="btn btn-primary btn-sm" onClick={onSave} disabled={isSaving}>
            {isSaving ? "Guardando..." : "Guardar orden"}
          </button>
        </div>

        <ol className="mt-1 flex flex-col gap-2">
          {order.map((section, index) => (
            <li
              key={section.id}
              className="flex items-center justify-between gap-3 rounded-lg border border-base-300 bg-base-100 px-4 py-2"
            >
              <div className="flex items-center gap-3">
                <span className="w-5 text-right font-mono text-xs text-base-content/40">{index + 1}</span>
                <span className="text-sm font-medium">{section.label}</span>
                <span className={`badge badge-sm ${section.visible ? "badge-success badge-outline" : "badge-ghost"}`}>
                  {section.visible ? "visible" : "oculta"}
                </span>
              </div>

              <div className="flex items-center gap-1">
                <button
                  type="button"
                  className="btn btn-ghost btn-xs"
                  onClick={() => onToggleVisible(section.id)}
                  aria-label={`${section.visible ? "Ocultar" : "Mostrar"} ${section.label}`}
                >
                  {section.visible ? "Ocultar" : "Mostrar"}
                </button>
                <button
                  type="button"
                  className="btn btn-ghost btn-xs"
                  disabled={index === 0}
                  onClick={() => onMove(index, -1)}
                  aria-label={`Subir ${section.label}`}
                >
                  ▲
                </button>
                <button
                  type="button"
                  className="btn btn-ghost btn-xs"
                  disabled={index === order.length - 1}
                  onClick={() => onMove(index, 1)}
                  aria-label={`Bajar ${section.label}`}
                >
                  ▼
                </button>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}

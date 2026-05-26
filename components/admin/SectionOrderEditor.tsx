import type { SectionMeta } from "@/types/home-sections";

export const FIXED_TOP: SectionMeta = { id: "hero", label: "Hero", fixed: true, visible: true };
export const FIXED_BOTTOM: SectionMeta = { id: "contact", label: "Contacto", fixed: true, visible: true };

export const REORDERABLE_DEFAULTS: SectionMeta[] = [
  { id: "bigcard", label: "Enfoque", fixed: false, visible: true },
  { id: "cases", label: "Casos", fixed: false, visible: true },
  { id: "team", label: "Equipo", fixed: false, visible: true },
  { id: "holdings", label: "Holdings", fixed: false, visible: true },
  { id: "clients", label: "Clientes & Aliados", fixed: false, visible: true },
];

type SectionOrderEditorProps = {
  order: SectionMeta[];
  onMove: (index: number, dir: -1 | 1) => void;
  onToggleVisible: (id: SectionMeta["id"]) => void;
  onSave: () => void;
  isSaving: boolean;
};

export function SectionOrderEditor({ order, onMove, onToggleVisible, onSave, isSaving }: SectionOrderEditorProps) {
  const all: SectionMeta[] = [FIXED_TOP, ...order, FIXED_BOTTOM];

  return (
    <div className="card mb-8 border border-base-300 bg-base-100 shadow-sm">
      <div className="card-body gap-3 py-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h3 className="font-semibold">Orden de secciones</h3>
          <button type="button" className="btn btn-primary btn-sm" onClick={onSave} disabled={isSaving}>
            {isSaving ? "Guardando..." : "Guardar orden"}
          </button>
        </div>
        <ol className="mt-1 flex flex-col gap-2">
          {all.map((section, index) => (
            <li
              key={section.id}
              className={`flex items-center justify-between gap-3 rounded-lg border px-4 py-2 ${section.fixed ? "border-base-300 bg-base-200 text-base-content/50" : "border-base-300 bg-base-100"}`}
            >
              <div className="flex items-center gap-3">
                <span className="w-5 text-right font-mono text-xs text-base-content/40">{index + 1}</span>
                <span className="text-sm font-medium">{section.label}</span>
                {section.fixed && <span className="badge badge-ghost badge-sm">fijo</span>}
                {!section.fixed && (
                  <span className={`badge badge-sm ${section.visible ? "badge-success badge-outline" : "badge-ghost"}`}>
                    {section.visible ? "visible" : "oculta"}
                  </span>
                )}
              </div>
              {!section.fixed && (
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    className="btn btn-ghost btn-xs"
                    onClick={() => onToggleVisible(section.id)}
                    aria-label={`${section.visible ? "Ocultar" : "Mostrar"} ${section.label}`}>
                    {section.visible ? "Ocultar" : "Mostrar"}
                  </button>
                  <button type="button" className="btn btn-ghost btn-xs" disabled={index === 1} onClick={() => onMove(index - 1, -1)} aria-label={`Subir ${section.label}`}>▲</button>
                  <button type="button" className="btn btn-ghost btn-xs" disabled={index === all.length - 2} onClick={() => onMove(index - 1, 1)} aria-label={`Bajar ${section.label}`}>▼</button>
                </div>
              )}
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}

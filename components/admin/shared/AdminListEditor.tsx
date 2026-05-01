import React, { ChangeEvent } from "react";

type Props<T extends { id: number }> = {
  items: T[];
  onItemChange: (id: number, e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onAdd: () => void;
  onRemove: (id: number) => void;
  renderFields: (item: T) => React.ReactNode;
  addLabel: string;
};

export function AdminListEditor<T extends { id: number }>({
  items,
  onItemChange: _onItemChange,
  onAdd,
  onRemove,
  renderFields,
  addLabel,
}: Props<T>) {
  return (
    <div className="flex flex-col gap-4">
      {items.map((item, i) => (
        <div key={item.id} className="card bg-base-100 shadow-sm border border-base-300">
          <div className="card-body gap-3 py-4">
            <div className="flex items-center justify-between mb-1">
              <span className="font-semibold text-sm text-base-content/60">Ítem {i + 1}</span>
              {items.length > 1 && (
                <button
                  type="button"
                  className="btn btn-ghost btn-xs text-error"
                  onClick={() => onRemove(item.id)}
                >
                  Eliminar
                </button>
              )}
            </div>
            {renderFields(item)}
          </div>
        </div>
      ))}
      <button type="button" className="btn btn-outline btn-sm w-fit" onClick={onAdd}>
        {addLabel}
      </button>
    </div>
  );
}

import React, { ChangeEvent, useEffect, useMemo, useState } from "react";

type RemoveConfirmation = {
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
};

type Props<T extends { id: number }> = {
  items: T[];
  onItemChange: (id: number, e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onAdd: () => void;
  onRemove: (id: number) => void;
  renderFields: (item: T) => React.ReactNode;
  renderActions?: (item: T) => React.ReactNode;
  getRemoveConfirmation?: (item: T) => RemoveConfirmation | null;
  addLabel: string;
  useAccordion?: boolean;
  getItemTitle?: (item: T, index: number) => string;
};

export function AdminListEditor<T extends { id: number }>({
  items,
  onItemChange: _onItemChange,
  onAdd,
  onRemove,
  renderFields,
  renderActions,
  getRemoveConfirmation,
  addLabel,
  useAccordion = false,
  getItemTitle,
}: Props<T>) {
  const [pendingRemoveItem, setPendingRemoveItem] = useState<T | null>(null);
  const [expandedById, setExpandedById] = useState<Record<number, boolean>>({});

  const pendingRemoveConfirmation = useMemo(
    () => (pendingRemoveItem && getRemoveConfirmation ? getRemoveConfirmation(pendingRemoveItem) : null),
    [getRemoveConfirmation, pendingRemoveItem],
  );

  useEffect(() => {
    if (!useAccordion || items.length === 0) {
      return;
    }

    const latestItem = items[items.length - 1];
    setExpandedById((prev) => {
      if (Object.prototype.hasOwnProperty.call(prev, latestItem.id)) {
        return prev;
      }

      return {
        ...prev,
        [latestItem.id]: true,
      };
    });
  }, [items, useAccordion]);

  function requestRemove(item: T) {
    if (!getRemoveConfirmation) {
      onRemove(item.id);
      return;
    }

    setPendingRemoveItem(item);
  }

  function cancelRemove() {
    setPendingRemoveItem(null);
  }

  function confirmRemove() {
    if (!pendingRemoveItem) {
      return;
    }

    onRemove(pendingRemoveItem.id);
    setPendingRemoveItem(null);
  }

  function toggleExpanded(id: number) {
    setExpandedById((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  }

  return (
    <>
      <div className="flex flex-col gap-4">
        {items.map((item, i) => (
          <div key={item.id} className="card bg-base-100 shadow-sm border border-base-300">
            <div className="card-body gap-3 py-4">
              <div className="flex items-center justify-between gap-3 mb-1">
                {useAccordion ? (
                  <button
                    type="button"
                    className="btn btn-ghost btn-sm justify-start gap-2 px-2 min-h-0 h-auto"
                    onClick={() => toggleExpanded(item.id)}
                    aria-expanded={Boolean(expandedById[item.id])}
                  >
                    <span className="text-base-content/80">{expandedById[item.id] ? "▾" : "▸"}</span>
                    <span className="font-semibold text-sm text-base-content/70 text-left">
                      {getItemTitle ? getItemTitle(item, i) : `Ítem ${i + 1}`}
                    </span>
                  </button>
                ) : (
                  <span className="font-semibold text-sm text-base-content/60">Ítem {i + 1}</span>
                )}
                {items.length > 1 && (
                  <button
                    type="button"
                    className="btn btn-ghost btn-xs text-error"
                    onClick={() => requestRemove(item)}
                  >
                    Eliminar
                  </button>
                )}
              </div>

              {!useAccordion || expandedById[item.id] ? (
                <>
                  {renderFields(item)}
                  {renderActions ? <div className="mt-2 flex justify-end gap-2">{renderActions(item)}</div> : null}
                </>
              ) : null}
            </div>
          </div>
        ))}
        <button type="button" className="btn btn-outline btn-sm w-fit" onClick={onAdd}>
          {addLabel}
        </button>
      </div>

      {pendingRemoveItem && pendingRemoveConfirmation ? (
        <dialog
          className="modal modal-open"
          open
          onClick={(event) => {
            if (event.target === event.currentTarget) {
              cancelRemove();
            }
          }}
        >
          <div className="modal-box" onClick={(event) => event.stopPropagation()}>
            <h3 className="text-lg font-semibold">{pendingRemoveConfirmation.title}</h3>
            <p className="mt-2 text-sm text-base-content/70">{pendingRemoveConfirmation.description}</p>
            <div className="modal-action">
              <button type="button" className="btn btn-ghost" onClick={cancelRemove}>
                {pendingRemoveConfirmation.cancelLabel ?? "Cancelar"}
              </button>
              <button type="button" className="btn btn-error" onClick={confirmRemove}>
                {pendingRemoveConfirmation.confirmLabel ?? "Eliminar"}
              </button>
            </div>
          </div>
        </dialog>
      ) : null}
    </>
  );
}

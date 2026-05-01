"use client";

import { useEffect, type ReactNode } from "react";
import { createPortal } from "react-dom";
import Loader from "@/components/utils/loader/Loader";

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  title?: string;
  isLoading?: boolean;
  loadingLabel?: string;
  hideHeader?: boolean;
};

export default function Modal({
  isOpen,
  onClose,
  children,
  title,
  isLoading = false,
  loadingLabel,
  hideHeader = false,
}: ModalProps) {
  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-100 overflow-y-auto bg-base-content/45 p-3 md:flex md:items-center md:justify-center md:p-4"
      role="presentation"
      onClick={onClose}
    >
      <div
        className="my-4 w-full max-w-xl overflow-hidden rounded-2xl border border-base-300 bg-base-100 shadow-2xl md:my-0 md:max-h-[calc(100dvh-2rem)] md:min-h-0"
        role="dialog"
        aria-modal="true"
        aria-label={title ?? "Modal"}
        onClick={(event) => event.stopPropagation()}
      >
        {hideHeader ? null : (
          <div className="flex items-center justify-between border-b border-base-300 px-5 py-4">
            <h2 className="text-lg font-semibold">{title ?? "Dialog"}</h2>
            <button
              type="button"
              className="btn btn-ghost btn-sm"
              onClick={onClose}
              aria-label="Close modal"
            >
              X
            </button>
          </div>
        )}
        <div className="px-5 py-4 md:max-h-[calc(100dvh-2rem)] md:overflow-y-auto">{isLoading ? <Loader label={loadingLabel} /> : children}</div>
      </div>
    </div>,
    document.body,
  );
}

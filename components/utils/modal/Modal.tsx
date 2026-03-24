"use client";

import { useEffect, type ReactNode } from "react";
import Loader from "@/components/utils/loader/Loader";

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  title?: string;
  isLoading?: boolean;
  loadingLabel?: string;
};

export default function Modal({
  isOpen,
  onClose,
  children,
  title,
  isLoading = false,
  loadingLabel,
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

  return (
    <div
      className="fixed inset-0 z-100 flex items-center justify-center bg-base-content/45 p-4"
      role="presentation"
      onClick={onClose}
    >
      <div
        className="w-full max-w-xl rounded-2xl border border-base-300 bg-base-100 shadow-2xl"
        role="dialog"
        aria-modal="true"
        aria-label={title ?? "Modal"}
        onClick={(event) => event.stopPropagation()}
      >
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

        <div className="px-5 py-4">{isLoading ? <Loader label={loadingLabel} /> : children}</div>
      </div>
    </div>
  );
}

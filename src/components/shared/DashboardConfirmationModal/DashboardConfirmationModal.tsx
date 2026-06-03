"use client";

import { useEffect, type ReactNode } from "react";
import Image from "next/image";
import styles from "./DashboardConfirmationModal.module.scss";

export type DashboardConfirmationVariant = "activate" | "deactivate" | "delete";

export interface DashboardConfirmationModalProps {
  open: boolean;
  variant?: DashboardConfirmationVariant;
  title: string;
  message: ReactNode;
  cancelLabel?: string;
  confirmLabel: string;
  confirmDisabled?: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const iconSrcByVariant: Record<DashboardConfirmationVariant, string> = {
  activate: "/images/dashboard/activate-modal.svg",
  deactivate: "/images/dashboard/delete-modal.svg",
  delete: "/images/dashboard/delete-modal.svg",
};

export default function DashboardConfirmationModal({
  open,
  variant = "delete",
  title,
  message,
  cancelLabel = "Cancel",
  confirmLabel,
  confirmDisabled = false,
  onClose,
  onConfirm,
}: DashboardConfirmationModalProps) {
  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose, open]);

  if (!open) return null;

  const confirmClassName =
    variant === "activate" ? styles.activateButton : styles.destructiveButton;

  return (
    <div className={styles.overlay} role="presentation" onMouseDown={onClose}>
      <section
        className={styles.modal}
        role="dialog"
        aria-modal="true"
        aria-labelledby="dashboard-confirmation-modal-title"
        aria-describedby="dashboard-confirmation-modal-message"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className={styles.content}>
          <div className={styles.body}>
            <Image
              src={iconSrcByVariant[variant]}
              alt=""
              width={100}
              height={100}
              className={styles.icon}
              aria-hidden
            />

            <div className={styles.copy}>
              <h2 id="dashboard-confirmation-modal-title">{title}</h2>
              <p id="dashboard-confirmation-modal-message">{message}</p>
            </div>
          </div>

          <footer className={styles.actions}>
            <button type="button" className={styles.cancelButton} onClick={onClose}>
              {cancelLabel}
            </button>
            <button
              type="button"
              className={confirmClassName}
              disabled={confirmDisabled}
              onClick={onConfirm}
            >
              {confirmLabel}
            </button>
          </footer>
        </div>
      </section>
    </div>
  );
}

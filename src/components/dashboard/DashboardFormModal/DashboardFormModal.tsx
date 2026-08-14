"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { DashboardField } from "@/components/dashboard/shared";;
import styles from "./DashboardFormModal.module.scss";

export interface DashboardFormModalField {
  id: string;
  label: string;
  type?: "text" | "email" | "select";
  placeholder?: string;
  value: string;
  options?: string[];
  required?: boolean;
}

interface DashboardFormModalProps {
  open: boolean;
  title: string;
  subtitle: string;
  mode?: "create" | "edit";
  fields: DashboardFormModalField[];
  primaryLabel: string;
  primaryDisabled?: boolean;
  onClose: () => void;
  onSubmit: () => void;
  onFieldChange: (fieldId: string, value: string) => void;
}

function CloseIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={styles.closeSvg}>
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  );
}

function ChevronIcon() {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true" className={styles.chevronSvg}>
      <path d="m3.5 6 4.5 4 4.5-4" />
    </svg>
  );
}

export default function DashboardFormModal({
  open,
  title,
  subtitle,
  mode = "create",
  fields,
  primaryLabel,
  primaryDisabled,
  onClose,
  onSubmit,
  onFieldChange,
}: DashboardFormModalProps) {
  const [hasSubmitted, setHasSubmitted] = useState(false);

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

  return (
    <div className={styles.overlay} role="presentation" onMouseDown={onClose}>
      <section
        className={styles.modal}
        role="dialog"
        aria-modal="true"
        aria-labelledby="dashboard-form-modal-title"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <header className={styles.header}>
          <div className={styles.headerIcon}>
            <Image
              src={
                mode === "create"
                  ? "/images/dashboard/user-add.svg"
                  : "/images/dashboard/user-edit.svg"
              }
              alt=""
              width={20}
              height={20}
              className={styles.headerAsset}
              aria-hidden
            />
          </div>
          <div className={styles.headerText}>
            <h2 id="dashboard-form-modal-title">{title}</h2>
            <p>{subtitle}</p>
          </div>
          <button type="button" className={styles.closeButton} aria-label="Close modal" onClick={onClose}>
            <CloseIcon />
          </button>
        </header>

        <form
          noValidate
          className={styles.form}
          onSubmit={(event) => {
            event.preventDefault();
            setHasSubmitted(true);
            const hasError = fields.some((field) => field.required && !field.value.trim());
            if (hasError) return;
            onSubmit();
            setHasSubmitted(false);
          }}
        >
          <div className={styles.fields}>
            {fields.map((field) => (
              <div
                className={field.type === "select" ? styles.selectField : styles.field}
                key={field.id}
              >
                {field.type === "select" ? (
                  <DashboardField
                    id={`dashboard-modal-${field.id}`}
                    variant="modal"
                    control="select"
                    label={field.label}
                    value={field.value}
                    required={field.required}
                    options={[
                      { label: field.placeholder ?? "Select", value: "", disabled: true },
                      ...(field.options ?? []).map((option) => ({
                        label: option,
                        value: option,
                      })),
                    ]}
                    onChange={(event) => {
                      onFieldChange(field.id, event.target.value);
                      if (hasSubmitted) setHasSubmitted(false);
                    }}
                    endAdornment={<ChevronIcon />}
                    error={hasSubmitted && field.required && !field.value.trim() ? "This field is required" : undefined}
                  />
                ) : (
                  <DashboardField
                    id={`dashboard-modal-${field.id}`}
                    variant="modal"
                    label={field.label}
                    type={field.type ?? "text"}
                    value={field.value}
                    required={field.required}
                    placeholder={field.placeholder}
                    onChange={(event) => {
                      onFieldChange(field.id, event.target.value);
                      if (hasSubmitted) setHasSubmitted(false);
                    }}
                    error={hasSubmitted && field.required && !field.value.trim() ? "This field is required" : undefined}
                  />
                )}
              </div>
            ))}
          </div>

          <footer className={styles.actions}>
            <button type="button" className={styles.cancelButton} onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className={styles.primaryButton} disabled={primaryDisabled}>
              {primaryLabel}
              {mode === "edit" ? (
                <Image
                  src="/images/dashboard/save.svg"
                  alt=""
                  width={24}
                  height={24}
                  className={styles.saveAsset}
                  aria-hidden
                />
              ) : null}
            </button>
          </footer>
        </form>
      </section>
    </div>
  );
}

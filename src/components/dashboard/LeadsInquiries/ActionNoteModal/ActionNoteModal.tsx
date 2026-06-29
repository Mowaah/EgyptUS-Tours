"use client";

import React, { useState, useEffect } from "react";
import { ModalHeader, ModalFooter } from "@/components/dashboard/shared";;
import DashboardField from "@/components/dashboard/shared/DashboardField/DashboardField";
import styles from "./ActionNoteModal.module.scss";

export interface ActionNoteModalConfig {
  title: string;
  subtitle?: string;
  iconSrc: string;
  label: string;
  primaryLabel: string;
  placeholder: string;
  isDanger?: boolean;
}

interface ActionNoteModalProps {
  open: boolean;
  config: ActionNoteModalConfig | null;
  onClose: () => void;
  onSubmit: (note: string) => void;
}

export default function ActionNoteModal({ open, config, onClose, onSubmit }: ActionNoteModalProps) {
  const [note, setNote] = useState("");
  const [hasSubmitted, setHasSubmitted] = useState(false);

  useEffect(() => {
    if (!open) return;
    setNote("");
    setHasSubmitted(false);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  if (!open || !config) return null;

  const handleSubmit = () => {
    setHasSubmitted(true);
    if (!note.trim()) return;
    onSubmit(note);
    onClose();
  };

  return (
    <div className={styles.overlay} onMouseDown={onClose}>
      <div className={styles.modal} onMouseDown={(e) => e.stopPropagation()}>
        <ModalHeader
          title={config.title}
          subtitle={config.subtitle}
          iconSrc={config.iconSrc}
          onClose={onClose}
          id="action-note-modal"
          isDanger={config.isDanger}
        />
        <div className={styles.body}>
          <DashboardField
            control="textarea"
            id="note-input"
            label={config.label}
            variant="modal"
            placeholder={config.placeholder}
            value={note}
            onChange={(e) => {
              setNote(e.target.value);
              if (hasSubmitted) setHasSubmitted(false);
            }}
            style={{ minHeight: "140px", resize: "none" }}
            error={hasSubmitted && !note.trim() ? "This field is required" : undefined}
          />
        </div>
        <ModalFooter
          primaryLabel={config.primaryLabel}
          secondaryLabel="Cancel"
          primaryOnClick={handleSubmit}
          secondaryOnClick={onClose}
          isDanger={config.isDanger}
        />
      </div>
    </div>
  );
}

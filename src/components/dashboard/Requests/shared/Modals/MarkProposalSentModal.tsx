"use client";

import React, { useState, useEffect } from "react";
import { ModalHeader, ModalFooter } from "@/components/dashboard/shared";
import DashboardField from "@/components/dashboard/shared/DashboardField/DashboardField";
import styles from "./RequestModals.module.scss";

interface MarkProposalSentModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (note: string) => void;
}

export default function MarkProposalSentModal({ open, onClose, onSubmit }: MarkProposalSentModalProps) {
  const [note, setNote] = useState("");

  useEffect(() => {
    if (!open) return;
    setNote("");
    
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

  if (!open) return null;

  const handleSubmit = () => {
    onSubmit(note);
    onClose();
  };

  return (
    <div className={styles.overlay} onMouseDown={onClose}>
      <div className={styles.modal} onMouseDown={(e) => e.stopPropagation()}>
        <ModalHeader
          title="Mark Proposal As Sent"
          iconSrc="/images/dashboard/inquiries/mark_complete.svg"
          onClose={onClose}
          id="mark-proposal-sent-modal"
        />
        <div className={styles.body}>
          <div className={styles.fieldGroup}>
            <DashboardField
              control="textarea"
              id="activity-note"
              label="Activity Note"
              variant="modal"
              placeholder="Describe how the proposal was shared with the customer"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              style={{ minHeight: "160px", resize: "none" }}
            />
          </div>
        </div>
        <ModalFooter
          primaryLabel="Mark as Sent"
          secondaryLabel="Cancel"
          primaryOnClick={handleSubmit}
          secondaryOnClick={onClose}
        />
      </div>
    </div>
  );
}

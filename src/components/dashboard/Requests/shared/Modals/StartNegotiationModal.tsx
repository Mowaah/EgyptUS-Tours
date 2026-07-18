"use client";

import React, { useState, useEffect } from "react";
import { ModalHeader, ModalFooter } from "@/components/dashboard/shared";
import DashboardField from "@/components/dashboard/shared/DashboardField/DashboardField";
import styles from "./RequestModals.module.scss";

interface StartNegotiationModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (reason: string) => void;
}

export default function StartNegotiationModal({ open, onClose, onSubmit }: StartNegotiationModalProps) {
  const [reason, setReason] = useState("");

  useEffect(() => {
    if (!open) return;
    setReason("");
    
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
    onSubmit(reason);
    onClose();
  };

  return (
    <div className={styles.overlay} onMouseDown={onClose}>
      <div className={styles.modal} onMouseDown={(e) => e.stopPropagation()}>
        <ModalHeader
          title="Start Negotiation"
          iconSrc="/images/dashboard/send.svg"
          onClose={onClose}
          id="start-negotiation-modal"
        />
        <div className={styles.body}>
          <div className={styles.fieldGroup}>
            <DashboardField
              control="textarea"
              id="negotiation-reason"
              label="Negotiation Reason"
              variant="modal"
              placeholder="Customer requested a lower price and a different hotel"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              style={{ minHeight: "160px", resize: "none" }}
            />
          </div>
        </div>
        <ModalFooter
          primaryLabel="Start Negotiation"
          secondaryLabel="Cancel"
          primaryOnClick={handleSubmit}
          secondaryOnClick={onClose}
        />
      </div>
    </div>
  );
}

"use client";

import React, { useState, useEffect } from "react";
import { ModalHeader, ModalFooter } from "@/components/dashboard/shared";
import DashboardField from "@/components/dashboard/shared/DashboardField/DashboardField";
import { UploadDropzone } from "@/components/dashboard/FormFields/UploadDropzone";
import styles from "./RefundModal.module.scss";

import { RefundSummary } from "@/utils/cancellationPolicy";

interface RefundModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: { reference: string; notes: string; file: File }) => void;
  refundSummary?: RefundSummary;
}

export default function RefundModal({ open, onClose, onSubmit, refundSummary }: RefundModalProps) {
  const [reference, setReference] = useState("");
  const [notes, setNotes] = useState("");
  const [file, setFile] = useState<File | undefined>();
  const [hasSubmitted, setHasSubmitted] = useState(false);

  useEffect(() => {
    if (!open) return;
    setReference("");
    setNotes("");
    setFile(undefined);
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

  if (!open) return null;

  const handleSubmit = () => {
    setHasSubmitted(true);
    if (!reference.trim() || !file) return;
    onSubmit({ reference, notes, file });
  };

  return (
    <div className={styles.overlay} onMouseDown={onClose}>
      <div className={styles.modal} onMouseDown={(e) => e.stopPropagation()}>
        <ModalHeader
          title="Refund Payment"
          iconSrc="/images/dashboard/booking/refund.svg"
          onClose={onClose}
        />

        <div className={styles.content}>
          <div className={styles.summarySection}>
            <div className={styles.summaryRow}>
              <span className={styles.summaryLabel}>Package Total</span>
              <span className={styles.summaryValue}>£{refundSummary?.package_total?.toLocaleString() ?? "0"}</span>
            </div>
            <div className={styles.summaryRow}>
              <span className={styles.summaryLabel}>Days Before Travel</span>
              <span className={styles.summaryValue}>{refundSummary?.days_before_travel ?? "0"} Days</span>
            </div>
            <div className={styles.summaryRow}>
              <span className={styles.summaryLabel}>Cancellation Policy Applied</span>
              <span className={styles.summaryValue}>{refundSummary?.policy_applied ?? "N/A"}</span>
            </div>
            <div className={styles.summaryRow}>
              <span className={styles.summaryLabel}>Deduction</span>
              <span className={styles.summaryValue}>{refundSummary?.deduction_percentage ?? "0"}%</span>
            </div>
            <div className={styles.summaryRow}>
              <span className={styles.summaryLabel}>Deduction Amount</span>
              <span className={styles.summaryValue}>£{refundSummary?.deduction_amount?.toLocaleString() ?? "0"}</span>
            </div>
            <div className={styles.summaryRow}>
              <span className={styles.summaryLabel}>Refund Amount</span>
              <span className={styles.refundAmountValue}>£{refundSummary?.refund_amount?.toLocaleString() ?? "0"}</span>
            </div>
          </div>

          <DashboardField
            label="Transaction Reference *"
            placeholder="Enter transaction/reference number"
            value={reference}
            onChange={(e) => setReference(e.target.value)}
            error={hasSubmitted && !reference.trim() ? "Transaction Reference is required" : undefined}
          />

          <div className={styles.uploadField}>
            <label className={styles.uploadLabel}>Upload Refund Receipt *</label>
            <UploadDropzone
              onFileSelect={(f) => setFile(f ?? undefined)}
              value={file}
              accept="application/pdf, image/png"
              title="Click to upload an PDF File or PNG"
              subtitle="up to 10MB"
            />
            {hasSubmitted && !file && (
              <span className={styles.errorText}>Refund Receipt is required</span>
            )}
          </div>

          <DashboardField
            label="Notes"
            control="textarea"
            placeholder="Add any additional notes or important details related to this refund here."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </div>

        <ModalFooter
          secondaryLabel="Cancel"
          primaryLabel="Confirm Refund"
          secondaryOnClick={onClose}
          primaryOnClick={handleSubmit}
        />
      </div>
    </div>
  );
}

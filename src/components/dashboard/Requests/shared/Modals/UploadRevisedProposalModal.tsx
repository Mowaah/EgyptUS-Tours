"use client";

import React, { useState, useEffect } from "react";
import { ModalHeader, ModalFooter } from "@/components/dashboard/shared";
import DashboardField from "@/components/dashboard/shared/DashboardField/DashboardField";
import { UploadDropzone } from "@/components/dashboard/FormFields/UploadDropzone";
import styles from "./RequestModals.module.scss";

interface UploadRevisedProposalModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (file: File | undefined, note: string) => Promise<void>;
}

export default function UploadRevisedProposalModal({ open, onClose, onSubmit }: UploadRevisedProposalModalProps) {
  const [file, setFile] = useState<File | undefined>(undefined);
  const [note, setNote] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!open) return;
    setFile(undefined);
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

  const handleSubmit = async () => {
    if (!file) return;
    setSubmitting(true);
    try {
      await onSubmit(file, note);
      onClose();
    } catch (err) {
      console.error("Proposal upload failed:", err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className={styles.overlay} onMouseDown={onClose}>
      <div className={styles.modal} onMouseDown={(e) => e.stopPropagation()}>
        <ModalHeader
          title="Upload Revised Proposal"
          iconSrc="/images/dashboard/requests/footer/create-proposal.svg"
          onClose={onClose}
          id="upload-revised-proposal-modal"
        />
        <div className={styles.body}>
          
          <div className={styles.fieldGroup}>
            <label className={styles.fieldLabel}>Proposal File</label>
            <UploadDropzone
              value={file}
              onFileSelect={(f) => setFile(f ?? undefined)}
              accept="application/pdf, application/msword, application/vnd.openxmlformats-officedocument.wordprocessingml.document"
              title="Click to upload an image or drag & drop"
              subtitle="PDF up to 10MB"
            />
          </div>

          <div className={styles.fieldGroup}>
            <DashboardField
              control="textarea"
              id="revised-internal-notes"
              label="Internal Notes (Optional)"
              variant="modal"
              placeholder="Enter any internal notes or comments regarding this revised proposal..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
              style={{ minHeight: "160px", resize: "none" }}
            />
          </div>
          
        </div>
        <ModalFooter
          primaryLabel={submitting ? "Uploading..." : "Upload Proposal"}
          secondaryLabel="Cancel"
          primaryOnClick={handleSubmit}
          secondaryOnClick={onClose}
          primaryDisabled={submitting || !file}
        />
      </div>
    </div>
  );
}

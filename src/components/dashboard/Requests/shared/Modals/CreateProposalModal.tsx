"use client";

import React, { useState, useEffect } from "react";
import { ModalHeader, ModalFooter } from "@/components/dashboard/shared";
import DashboardField from "@/components/dashboard/shared/DashboardField/DashboardField";
import { UploadDropzone } from "@/components/dashboard/FormFields/UploadDropzone";
import styles from "./RequestModals.module.scss";

interface CreateProposalModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (file: File | undefined, note: string) => void;
}

export default function CreateProposalModal({ open, onClose, onSubmit }: CreateProposalModalProps) {
  const [file, setFile] = useState<File | undefined>(undefined);
  const [note, setNote] = useState("");

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

  const handleSubmit = () => {
    onSubmit(file, note);
    onClose();
  };

  return (
    <div className={styles.overlay} onMouseDown={onClose}>
      <div className={styles.modal} onMouseDown={(e) => e.stopPropagation()}>
        <ModalHeader
          title="Create Proposal"
          iconSrc="/images/dashboard/requests/footer/create-proposal.svg"
          onClose={onClose}
          id="create-proposal-modal"
        />
        <div className={styles.body}>
          
          <div className={styles.fieldGroup}>
            <label className={styles.fieldLabel}>Proposal File</label>
            <UploadDropzone
              value={file}
              onFileSelect={setFile}
              accept="application/pdf, application/msword, application/vnd.openxmlformats-officedocument.wordprocessingml.document"
              title="Click to upload an image or drag & drop"
              subtitle="PDF up to 10MB"
            />
          </div>

          <div className={styles.fieldGroup}>
            <DashboardField
              control="textarea"
              id="internal-notes"
              label="Internal Notes (Optional)"
              variant="modal"
              placeholder="Enter any internal notes or comments regarding this proposal..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
              style={{ minHeight: "160px", resize: "none" }}
            />
          </div>
          
        </div>
        <ModalFooter
          primaryLabel="Upload Proposal"
          secondaryLabel="Cancel"
          primaryOnClick={handleSubmit}
          secondaryOnClick={onClose}
        />
      </div>
    </div>
  );
}

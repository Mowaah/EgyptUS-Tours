"use client";

import { useEffect, useState } from "react";
import ModalHeader from "@/components/dashboard/shared/ModalHeader/ModalHeader";
import ModalFooter from "@/components/dashboard/shared/ModalFooter/ModalFooter";
import { UploadDropzone } from "@/components/dashboard/FormFields";
import DashboardField from "@/components/dashboard/shared/DashboardField/DashboardField";
import fieldStyles from "@/components/dashboard/shared/DashboardField/DashboardField.module.scss";
import styles from "./DestinationModal.module.scss";

interface DestinationModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: { name: string; file?: File }) => void;
  initialName?: string;
  isEdit?: boolean;
}

export default function DestinationModal({
  open,
  onClose,
  onSave,
  initialName = "",
  isEdit = false,
}: DestinationModalProps) {
  const [name, setName] = useState(initialName);
  const [file, setFile] = useState<File | undefined>(undefined);

  useEffect(() => {
    if (open) {
      setName(initialName);
      setFile(undefined);
    }
  }, [open, initialName]);

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

  const handleSave = () => {
    onSave({ name, file });
  };

  return (
    <div className={styles.overlay} role="presentation" onMouseDown={onClose}>
      <section
        className={styles.modal}
        role="dialog"
        aria-modal="true"
        aria-labelledby="destination-modal-title"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <ModalHeader
          iconSrc="/images/dashboard/catalog/destinations.svg"
          title={isEdit ? "Edit Destination" : "Add New Destination"}
          onClose={onClose}
          id="destination-modal-title"
        />

        <div className={styles.body}>
          <DashboardField
            label="Destination Name"
            id="destination-name"
            placeholder="Enter destination name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            variant="modal"
          />

          <div className={`${fieldStyles.field} ${fieldStyles.modalField}`}>
            <label className={`${fieldStyles.label} ${fieldStyles.modalLabel}`}>
              Destination photo
            </label>
            <UploadDropzone
              value={file}
              onFileSelect={setFile}
              title="Click to upload an image or drag & drop"
              subtitle="PNG, JPG up to 10MB"
            />
          </div>
        </div>

        <ModalFooter
          secondaryLabel="Cancel"
          secondaryOnClick={onClose}
          primaryLabel={isEdit ? "Save" : "Add"}
          primaryOnClick={handleSave}
          primaryDisabled={!name.trim()}
        />
      </section>
    </div>
  );
}

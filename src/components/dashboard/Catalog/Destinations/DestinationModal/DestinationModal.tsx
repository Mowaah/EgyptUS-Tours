"use client";

import { useEffect, useState } from "react";
import ModalHeader from "@/components/dashboard/shared/ModalHeader/ModalHeader";
import ModalFooter from "@/components/dashboard/shared/ModalFooter/ModalFooter";
import { UploadDropzone } from "@/components/dashboard/FormFields";
import DashboardField from "@/components/dashboard/shared/DashboardField/DashboardField";
import fieldStyles from "@/components/dashboard/shared/DashboardField/DashboardField.module.scss";
import LanguageTabs, { Language } from "@/components/shared/LanguageTabs/LanguageTabs";
import styles from "./DestinationModal.module.scss";

interface DestinationModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: { translations: Record<string, { name: string }>; file?: File }) => void;
  initialName?: Record<string, string>;
  initialImage?: string;
  isEdit?: boolean;
}

export default function DestinationModal({
  open,
  onClose,
  onSave,
  initialName = {},
  initialImage,
  isEdit = false,
}: DestinationModalProps) {
  const [lang, setLang] = useState<Language>("English");
  const [names, setNames] = useState<Record<Language, string>>({
    English: initialName.en || initialName.English || "",
    Italian: initialName.it || initialName.Italian || "",
    Spanish: initialName.es || initialName.Spanish || "",
  });
  const [file, setFile] = useState<File | string | undefined>(initialImage);

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
    onSave({ 
      translations: {
        en: { name: names.English },
        it: { name: names.Italian },
        es: { name: names.Spanish },
      }, 
      file: typeof file === 'string' ? undefined : file 
    });
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
          <LanguageTabs active={lang} onChange={setLang} />
          <DashboardField
            label="Destination Name"
            id={`destination-name-${lang}`}
            placeholder="Enter destination name"
            value={names[lang]}
            onChange={(e) => setNames((prev) => ({ ...prev, [lang]: e.target.value }))}
            variant="modal"
          />

          <div className={`${fieldStyles.field} ${fieldStyles.modalField}`}>
            <label className={`${fieldStyles.label} ${fieldStyles.modalLabel}`}>
              Destination photo
            </label>
            <UploadDropzone
              value={file}
              onFileSelect={(newFile) => setFile(newFile)}
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
          primaryDisabled={!names.English.trim()}
        />
      </section>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import ModalHeader from "@/components/dashboard/shared/ModalHeader/ModalHeader";
import ModalFooter from "@/components/dashboard/shared/ModalFooter/ModalFooter";
import DashboardField from "@/components/dashboard/shared/DashboardField/DashboardField";
import LanguageTabs, { Language } from "@/components/shared/LanguageTabs/LanguageTabs";
import styles from "./CategoryModal.module.scss";

interface CategoryModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: { name: string }) => void;
  initialName?: string;
  isEdit?: boolean;
}

export default function CategoryModal({
  open,
  onClose,
  onSave,
  initialName = "",
  isEdit = false,
}: CategoryModalProps) {
  const [lang, setLang] = useState<Language>("English");
  const [names, setNames] = useState<Record<Language, string>>({
    English: initialName,
    Italian: "",
    Spanish: "",
  });

  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose, open]);

  if (!open) return null;

  const handleSave = () => {
    onSave({ name: names.English });
  };

  return (
    <div className={styles.overlay} role="presentation" onMouseDown={onClose}>
      <section
        className={styles.modal}
        role="dialog"
        aria-modal="true"
        aria-labelledby="category-modal-title"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <ModalHeader
          iconSrc="/images/dashboard/catalog/categories.svg"
          title={isEdit ? "Edit Trip Categories" : "Add New Trip Categories"}
          onClose={onClose}
          id="category-modal-title"
        />

        <div className={styles.body}>
          <LanguageTabs active={lang} onChange={setLang} />
          <DashboardField
            label="Trip Category Name"
            id={`category-name-${lang}`}
            placeholder="Enter trip category name"
            value={names[lang]}
            onChange={(e) => setNames((prev) => ({ ...prev, [lang]: e.target.value }))}
            variant="modal"
          />
        </div>

        <ModalFooter
          primaryLabel={isEdit ? "Edit" : "Add"}
          secondaryLabel="Cancel"
          secondaryOnClick={onClose}
          primaryOnClick={handleSave}
          primaryDisabled={!names.English.trim() || (isEdit && names.English === initialName)}
        />
      </section>
    </div>
  );
}

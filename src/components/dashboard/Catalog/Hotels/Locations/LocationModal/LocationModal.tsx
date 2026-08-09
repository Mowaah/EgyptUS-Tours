"use client";

import { useEffect, useState } from "react";
import ModalHeader from "@/components/dashboard/shared/ModalHeader/ModalHeader";
import ModalFooter from "@/components/dashboard/shared/ModalFooter/ModalFooter";
import DashboardField from "@/components/dashboard/shared/DashboardField/DashboardField";
import LanguageTabs, { Language } from "@/components/shared/LanguageTabs/LanguageTabs";
import styles from "./LocationModal.module.scss";

interface LocationModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: { translations: Record<string, { name: string }> }) => void;
  initialName?: Record<string, any>;
  isEdit?: boolean;
}

export default function LocationModal({
  open,
  onClose,
  onSave,
  initialName = {},
  isEdit = false,
}: LocationModalProps) {
  const [lang, setLang] = useState<Language>("English");

  const getInitial = (key: string, altKey: string) => {
    const val = (initialName as any)[key] || (initialName as any)[altKey];
    if (val && typeof val === "object") return val.name || "";
    return typeof val === "string" ? val : "";
  };

  const [names, setNames] = useState<Record<Language, string>>({
    English: getInitial("en", "English"),
    Italian: getInitial("it", "Italian"),
    Spanish: getInitial("es", "Spanish"),
  });

  useEffect(() => {
    if (open) {
      setLang("English");
      setNames({
        English: getInitial("en", "English"),
        Italian: getInitial("it", "Italian"),
        Spanish: getInitial("es", "Spanish"),
      });
    }
  }, [open, initialName]);

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
    onSave({
      translations: {
        en: { name: names.English },
        it: { name: names.Italian },
        es: { name: names.Spanish },
      },
    });
  };

  const hasChanges = isEdit ? (
    names.English !== getInitial("en", "English") ||
    names.Italian !== getInitial("it", "Italian") ||
    names.Spanish !== getInitial("es", "Spanish")
  ) : true;

  return (
    <div className={styles.overlay} role="presentation" onMouseDown={onClose}>
      <section
        className={styles.modal}
        role="dialog"
        aria-modal="true"
        aria-labelledby="location-modal-title"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <ModalHeader
          iconSrc="/images/dashboard/catalog/locations.svg"
          title={isEdit ? "Edit Location" : "Add New Location"}
          onClose={onClose}
          id="location-modal-title"
        />

        <div className={styles.body}>
          <LanguageTabs active={lang} onChange={setLang} />
          <DashboardField
            label="Location Name"
            id={`location-name-${lang}`}
            placeholder="Enter location name"
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
          primaryDisabled={!names.English.trim() || (isEdit && !hasChanges)}
        />
      </section>
    </div>
  );
}

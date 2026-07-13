"use client";

import { useEffect, useState } from "react";
import ModalHeader from "@/components/dashboard/shared/ModalHeader/ModalHeader";
import ModalFooter from "@/components/dashboard/shared/ModalFooter/ModalFooter";
import DashboardField from "@/components/dashboard/shared/DashboardField/DashboardField";
import LanguageTabs, { Language } from "@/components/shared/LanguageTabs/LanguageTabs";
import styles from "./AdditionalServiceModal.module.scss";

interface AdditionalServiceModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: { name: string; price: string }) => void;
  initialName?: string;
  initialPrice?: string;
  isEdit?: boolean;
}

export default function AdditionalServiceModal({
  open,
  onClose,
  onSave,
  initialName = "",
  initialPrice = "",
  isEdit = false,
}: AdditionalServiceModalProps) {
  const [lang, setLang] = useState<Language>("English");
  const [names, setNames] = useState<Record<Language, string>>({
    English: initialName,
    Italian: "",
    Spanish: "",
  });
  const [price, setPrice] = useState(initialPrice);

  useEffect(() => {
    if (open) {
      setLang("English");
      setNames({ English: initialName, Italian: "", Spanish: "" });
      setPrice(initialPrice);
    }
  }, [open, initialName, initialPrice]);

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
    onSave({ name: names.English, price });
  };

  const handleIncrement = () => {
    const rawVal = price.replace(/[^0-9.]/g, "");
    const current = parseFloat(rawVal) || 0;
    setPrice((current + 1).toString() + "$");
  };

  const handleDecrement = () => {
    const rawVal = price.replace(/[^0-9.]/g, "");
    const current = parseFloat(rawVal) || 0;
    if (current > 0) {
      setPrice((current - 1).toString() + "$");
    }
  };

  return (
    <div className={styles.overlay} role="presentation" onMouseDown={onClose}>
      <section
        className={styles.modal}
        role="dialog"
        aria-modal="true"
        aria-labelledby="additional-service-modal-title"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <ModalHeader
          iconSrc="/images/dashboard/catalog/categories.svg"
          title={isEdit ? "Edit Additional Service" : "Add New Additional Service"}
          onClose={onClose}
          id="additional-service-modal-title"
        />

        <div className={styles.body}>
          <LanguageTabs active={lang} onChange={setLang} />
          <DashboardField
            label="Additional Service Name"
            id={`additional-service-name-${lang}`}
            placeholder="Enter Additional Service name"
            value={names[lang]}
            onChange={(e) => setNames((prev) => ({ ...prev, [lang]: e.target.value }))}
            variant="modal"
          />
          <DashboardField
            label="Price"
            id="additional-service-price"
            placeholder="0$"
            value={price}
            onChange={(e) => {
              const raw = e.target.value.replace(/[^0-9.]/g, "");
              setPrice(raw ? raw + "$" : "");
            }}
            variant="modal"
            endAdornment={
              <div className={styles.spinnerWrapper}>
                <button type="button" onClick={handleIncrement} className={styles.spinnerButton}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="18 15 12 9 6 15"></polyline>
                  </svg>
                </button>
                <button type="button" onClick={handleDecrement} className={styles.spinnerButton}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="6 9 12 15 18 9"></polyline>
                  </svg>
                </button>
              </div>
            }
          />
        </div>

        <ModalFooter
          primaryLabel={isEdit ? "Edit" : "Add"}
          secondaryLabel="Cancel"
          secondaryOnClick={onClose}
          primaryOnClick={handleSave}
          primaryDisabled={!names.English.trim()}
        />
      </section>
    </div>
  );
}

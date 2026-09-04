"use client";

import { useEffect, useState } from "react";
import ModalHeader from "@/components/dashboard/shared/ModalHeader/ModalHeader";
import ModalFooter from "@/components/dashboard/shared/ModalFooter/ModalFooter";
import DashboardField from "@/components/dashboard/shared/DashboardField/DashboardField";
import LanguageTabs, { Language } from "@/components/shared/LanguageTabs/LanguageTabs";
import { DASHBOARD_CURRENCY } from "@/constants/currency";
import { CurrencyField } from "@/components/dashboard/shared";
import styles from "./AdditionalServiceModal.module.scss";

interface AdditionalServiceModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: { translations: Record<string, { name: string }>; price: string; currency_code?: string }) => void;
  initialName?: Record<string, string>;
  initialPrice?: string;
  isEdit?: boolean;
}

export default function AdditionalServiceModal({
  open,
  onClose,
  onSave,
  initialName = {},
  initialPrice = "",
  isEdit = false,
}: AdditionalServiceModalProps) {
  const [lang, setLang] = useState<Language>("English");
  const [names, setNames] = useState<Record<Language, string>>({
    English: initialName.en || initialName.English || "",
    Italian: initialName.it || initialName.Italian || "",
    Spanish: initialName.es || initialName.Spanish || "",
  });
  const [price, setPrice] = useState(initialPrice || "");
  const [hasSubmitted, setHasSubmitted] = useState(false);

  useEffect(() => {
    if (open) {
      setLang("English");
      setNames({
        English: initialName.en || initialName.English || "",
        Italian: initialName.it || initialName.Italian || "",
        Spanish: initialName.es || initialName.Spanish || "",
      });
      setPrice(initialPrice || "");
      setHasSubmitted(false);
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
    setHasSubmitted(true);
    const langs: Language[] = ["English", "Italian", "Spanish"];
    for (const l of langs) {
      if (!names[l].trim()) {
        setLang(l);
        return;
      }
    }

    onSave({
      translations: {
        en: { name: names.English },
        it: { name: names.Italian },
        es: { name: names.Spanish },
      },
      price,
      currency_code: DASHBOARD_CURRENCY.code,
    });
  };

  const hasChanges = isEdit ? (
    names.English !== (initialName.en || initialName.English || "") ||
    names.Italian !== (initialName.it || initialName.Italian || "") ||
    names.Spanish !== (initialName.es || initialName.Spanish || "") ||
    price !== (initialPrice || "")
  ) : true;

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
            label="Service Name"
            id={`service-name-${lang}`}
            placeholder="Enter service name"
            value={names[lang]}
            onChange={(e) => setNames((prev) => ({ ...prev, [lang]: e.target.value }))}
            error={hasSubmitted && !names[lang].trim() ? `${lang} name is required` : ""}
            variant="modal"
          />
          <CurrencyField
            label={`Price (${DASHBOARD_CURRENCY.code})`}
            id="additional-service-price"
            placeholder="0"
            value={price}
            onChange={setPrice}
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

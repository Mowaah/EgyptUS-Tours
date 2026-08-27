"use client";

import { useEffect, useState } from "react";
import { LanguageTabs, type Language } from "@/components/shared";
import { ModalHeader, ModalFooter } from "@/components/dashboard/shared";;
import styles from "./FaqViewModal.module.scss";


import { getLangKey } from "@/components/dashboard/shared/i18n";

interface FaqViewModalProps {
  open: boolean;
  index: number;
  title: string;
  content: string;
  rawTranslations?: any;
  onClose: () => void;
  onEdit: () => void;
}

function ChevronUpIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={styles.chevronSvg}>
      <path d="m6 15 6-6 6 6" />
    </svg>
  );
}

export default function FaqViewModal({
  open,
  index,
  title,
  content,
  rawTranslations,
  onClose,
  onEdit,
}: FaqViewModalProps) {
  const [activeLang, setActiveLang] = useState<Language>("English");

  const langKey = getLangKey(activeLang);
  const localizedTitle = rawTranslations?.[langKey]?.question || rawTranslations?.[langKey]?.title || (langKey === "en" ? title : "") || title;
  const localizedContent = rawTranslations?.[langKey]?.answer || rawTranslations?.[langKey]?.content || (langKey === "en" ? content : "") || content;

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

  return (
    <div className={styles.overlay} role="presentation" onMouseDown={onClose}>
      <section
        className={styles.modal}
        role="dialog"
        aria-modal="true"
        aria-labelledby="faq-view-modal-title"
        onMouseDown={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <ModalHeader
          onClose={onClose}
          iconSrc="/images/dashboard/view.svg"
          title="Website Preview"
          subtitle="How this question appears to visitors."
          id="faq-view-modal-title"
        />

        {/* Body */}
        <div className={styles.body}>
          {/* Language tabs */}
          <LanguageTabs active={activeLang} onChange={setActiveLang} />

          <div className={styles.faqCard}>
            {/* Question row */}
            <div className={styles.questionRow}>
              <div className={styles.questionLeft}>
                <span className={styles.questionNumber}>{String(index).padStart(2, "0")}</span>
                <span className={styles.questionTitle}>{localizedTitle}</span>
              </div>
              <button type="button" className={styles.chevronButton} aria-label="Toggle answer">
                <ChevronUpIcon />
              </button>
            </div>

            {/* Answer */}
            <div className={styles.answerBox}>
              <div 
                className={styles.answerText}
                dangerouslySetInnerHTML={{ 
                  __html: /<[a-z][\s\S]*>/i.test(localizedContent) 
                    ? localizedContent 
                    : localizedContent.split("\n\n").map((p: string) => `<p>${p.replace(/\n/g, "<br>")}</p>`).join("") 
                }} 
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <ModalFooter
          secondaryLabel="Close"
          secondaryOnClick={onClose}
          primaryLabel="Edit"
          primaryOnClick={onEdit}
        />
      </section>
    </div>
  );
}

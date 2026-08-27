"use client";

import { useEffect, useState } from "react";
import { LanguageTabs, type Language } from "@/components/shared";
import { ModalHeader, ModalFooter } from "@/components/dashboard/shared";;
import styles from "./DocumentViewModal.module.scss";

import { getLangKey } from "@/components/dashboard/shared/i18n";

interface DocumentViewModalProps {
  open: boolean;
  title: string;
  content: string;
  rawTranslations?: any;
  modalSubtitle: string;
  onClose: () => void;
  onEdit: () => void;
}


export default function DocumentViewModal({ open, title, content, rawTranslations, modalSubtitle, onClose, onEdit }: DocumentViewModalProps) {
  const [activeLang, setActiveLang] = useState<Language>("English");

  const langKey = getLangKey(activeLang);
  const localizedTitle = rawTranslations?.[langKey]?.title || rawTranslations?.[langKey]?.question || (langKey === "en" ? title : "") || title;
  const localizedContent = rawTranslations?.[langKey]?.content || rawTranslations?.[langKey]?.answer || (langKey === "en" ? content : "") || content;

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener("keydown", onKey);
    };
  }, [onClose, open]);

  if (!open) return null;

  return (
    <div className={styles.overlay} role="presentation" onMouseDown={onClose}>
      <section
        className={styles.modal}
        role="dialog"
        aria-modal="true"
        aria-labelledby="privacy-view-modal-title"
        onMouseDown={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <ModalHeader
          onClose={onClose}
          iconSrc="/images/dashboard/view.svg"
          title="Website Preview"
          subtitle={modalSubtitle}
          id="document-view-modal-title"
        />

        {/* Body */}
        <div className={styles.body}>
          {/* Language tabs */}
          <LanguageTabs active={activeLang} onChange={setActiveLang} />

          {/* Content card */}
          <div className={styles.contentCard}>
            <div className={styles.contentCardInner}>
              <div className={styles.contentTitleRow}>
                <span className={styles.dot} aria-hidden />
                <span className={styles.contentTitle}>{localizedTitle}</span>
              </div>
              <div className={`${styles.contentBody} tiptap-content`}>
                <div 
                  dangerouslySetInnerHTML={{ 
                    __html: /<[a-z][\s\S]*>/i.test(localizedContent) 
                      ? localizedContent 
                      : localizedContent.split("\n\n").map((p: string) => `<p>${p.replace(/\n/g, "<br>")}</p>`).join("") 
                  }} 
                />
              </div>
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

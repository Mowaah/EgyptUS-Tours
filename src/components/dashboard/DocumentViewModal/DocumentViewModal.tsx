"use client";

import { useEffect, useState } from "react";
import { LanguageTabs, type Language } from "@/components/shared";
import { ModalHeader, ModalFooter } from "@/components/dashboard/shared";;
import styles from "./DocumentViewModal.module.scss";

interface DocumentViewModalProps {
  open: boolean;
  title: string;
  content: string;
  modalSubtitle: string;
  onClose: () => void;
  onEdit: () => void;
}


export default function DocumentViewModal({ open, title, content, modalSubtitle, onClose, onEdit }: DocumentViewModalProps) {
  const [activeLang, setActiveLang] = useState<Language>("English");

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
                <span className={styles.contentTitle}>{title}</span>
              </div>
              <div className={`${styles.contentBody} tiptap-content`}>
                <div 
                  dangerouslySetInnerHTML={{ 
                    __html: /<[a-z][\s\S]*>/i.test(content) 
                      ? content 
                      : content.split("\n\n").map((p) => `<p>${p.replace(/\n/g, "<br>")}</p>`).join("") 
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

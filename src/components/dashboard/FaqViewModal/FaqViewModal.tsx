"use client";

import { useEffect } from "react";
import Image from "next/image";
import styles from "./FaqViewModal.module.scss";

interface FaqViewModalProps {
  open: boolean;
  index: number;
  title: string;
  content: string;
  onClose: () => void;
  onEdit: () => void;
}

function CloseIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={styles.closeSvg}>
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  );
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
  onClose,
  onEdit,
}: FaqViewModalProps) {
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
        <header className={styles.header}>
          <div className={styles.headerIcon}>
            <Image src="/images/dashboard/view.svg" alt="" width={20} height={20} aria-hidden />
          </div>
          <div className={styles.headerText}>
            <h2 id="faq-view-modal-title">Website Preview</h2>
            <p>How this question appears to visitors.</p>
          </div>
          <button type="button" className={styles.closeButton} aria-label="Close modal" onClick={onClose}>
            <CloseIcon />
          </button>
        </header>

        {/* Body */}
        <div className={styles.body}>
          <div className={styles.faqCard}>
            {/* Question row */}
            <div className={styles.questionRow}>
              <div className={styles.questionLeft}>
                <span className={styles.questionNumber}>{String(index).padStart(2, "0")}</span>
                <span className={styles.questionTitle}>{title}</span>
              </div>
              <button type="button" className={styles.chevronButton} aria-label="Toggle answer">
                <ChevronUpIcon />
              </button>
            </div>

            {/* Answer */}
            <div className={styles.answerBox}>
              <p className={styles.answerText}>{content}</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className={styles.footer}>
          <button type="button" className={styles.closeBtn} onClick={onClose}>
            Close
          </button>
          <button type="button" className={styles.editBtn} onClick={onEdit}>
            Edit
          </button>
        </footer>
      </section>
    </div>
  );
}

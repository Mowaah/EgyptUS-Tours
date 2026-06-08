"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import styles from "./FaqFormModal.module.scss";

interface FaqFormModalProps {
  open: boolean;
  mode?: "add" | "edit";
  initialData?: { question: string; answer: string; status: "Published" | "Draft" };
  onClose: () => void;
  onSave: (question: string, answer: string, published: boolean) => void;
}

function CloseIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={styles.closeSvg}>
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  );
}

export default function FaqFormModal({ open, mode = "add", initialData, onClose, onSave }: FaqFormModalProps) {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [published, setPublished] = useState(true);

  // Sync initialData when modal opens
  useEffect(() => {
    if (open) {
      if (mode === "edit" && initialData) {
        setQuestion(initialData.question);
        setAnswer(initialData.answer);
        setPublished(initialData.status === "Published");
      } else {
        setQuestion("");
        setAnswer("");
        setPublished(true);
      }
    }
  }, [open, mode, initialData]);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const handleKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handleKey);
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener("keydown", handleKey);
    };
  }, [onClose, open]);

  const handleDiscard = () => {
    onClose();
  };

  const handleSave = () => {
    if (!question.trim() || !answer.trim()) return;
    onSave(question.trim(), answer.trim(), published);
  };

  if (!open) return null;

  return (
    <div className={styles.overlay} role="presentation" onMouseDown={onClose}>
      <section
        className={styles.modal}
        role="dialog"
        aria-modal="true"
        aria-labelledby="faq-form-modal-title"
        onMouseDown={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <header className={styles.header}>
          <div className={styles.headerIcon} aria-hidden>
            {mode === "add" ? (
              <Image src="/images/dashboard/add-modal.svg" alt="Add" width={20} height={20} />
            ) : (
              <Image src="/images/dashboard/edit-modal.svg" alt="Edit" width={20} height={20} />
            )}
          </div>
          <div className={styles.headerText}>
            <h2 id="faq-form-modal-title">{mode === "add" ? "Add New Question" : "Edit Question"}</h2>
            <p>{mode === "add" ? "Create a new question that will appear to visitors on the website." : "Make changes to the question and answer."}</p>
          </div>
          <button type="button" className={styles.closeButton} aria-label="Close modal" onClick={onClose}>
            <CloseIcon />
          </button>
        </header>

        {/* Body */}
        <div className={styles.body}>
          {/* Question field */}
          <div className={styles.fieldGroup}>
            <label className={styles.fieldLabel} htmlFor="faq-question">Question</label>
            <input
              id="faq-question"
              type="text"
              className={styles.inputPill}
              placeholder="Example: How can I cancel my booking?"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
            />
          </div>

          {/* Answer field */}
          <div className={styles.fieldGroup}>
            <label className={styles.fieldLabel} htmlFor="faq-answer">Answer</label>
            <textarea
              id="faq-answer"
              className={styles.textarea}
              placeholder="Write the answer here..."
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
            />
          </div>

          {/* Status toggle */}
          <div className={styles.statusRow}>
            <div className={styles.statusInfo}>
              <span className={styles.statusLabel}>Status</span>
              <span className={styles.statusDesc}>Enable the toggle to publish this question and make it visible to website visitors.</span>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={published}
              aria-label="Publish status"
              className={`${styles.toggle} ${published ? styles.toggleOn : styles.toggleOff}`}
              onClick={() => setPublished((v) => !v)}
            >
              <span className={styles.toggleThumb} />
            </button>
          </div>
        </div>

        {/* Footer */}
        <footer className={styles.footer}>
          <button type="button" className={styles.discardBtn} onClick={handleDiscard}>
            Discard
          </button>
          <button type="button" className={styles.saveBtn} onClick={handleSave}>
            {mode === "add" ? "Add Question" : "Save Edits"}
          </button>
        </footer>
      </section>
    </div>
  );
}


"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { LanguageTabs, type Language } from "@/components/shared";
import { ModalHeader, ModalFooter } from "@/components/dashboard/shared";;
import styles from "./FaqFormModal.module.scss";

interface FaqFormModalProps {
  open: boolean;
  mode?: "add" | "edit";
  initialData?: { question: string; answer: string; status: "Published" | "Draft" };
  onClose: () => void;
  onSave: (question: string, answer: string, published: boolean) => void;
}

export default function FaqFormModal({ open, mode = "add", initialData, onClose, onSave }: FaqFormModalProps) {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [published, setPublished] = useState(true);
  const [activeLang, setActiveLang] = useState<Language>("English");
  const [hasSubmitted, setHasSubmitted] = useState(false);

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
      setHasSubmitted(false);
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
    setHasSubmitted(true);
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
        <ModalHeader
          onClose={onClose}
          iconSrc={mode === "add" ? "/images/dashboard/add-modal.svg" : "/images/dashboard/edit-modal.svg"}
          title={mode === "add" ? "Add New Question" : "Edit Question"}
          subtitle={mode === "add" ? "Create a new question that will appear to visitors on the website." : "Make changes to the question and answer."}
          id="faq-form-modal-title"
        />

        {/* Body */}
        <div className={styles.body}>
          {/* Language tabs */}
          <LanguageTabs active={activeLang} onChange={setActiveLang} />

          {/* Question field */}
          <div className={styles.fieldGroup}>
            <label className={styles.fieldLabel} htmlFor="faq-question">Question</label>
            <input
              id="faq-question"
              type="text"
              className={`${styles.inputPill} ${hasSubmitted && !question.trim() ? styles.inputError : ""}`}
              placeholder="Example: How can I cancel my booking?"
              value={question}
              onChange={(e) => {
                setQuestion(e.target.value);
                if (hasSubmitted) setHasSubmitted(false);
              }}
            />
            {hasSubmitted && !question.trim() && (
              <div className={styles.errorText}>
                <Image src="/images/information-fill.svg" alt="" width={16} height={16} aria-hidden="true" />
                <span>This field is required</span>
              </div>
            )}
          </div>

          {/* Answer field */}
          <div className={styles.fieldGroup}>
            <label className={styles.fieldLabel} htmlFor="faq-answer">Answer</label>
            <textarea
              id="faq-answer"
              className={`${styles.textarea} ${hasSubmitted && !answer.trim() ? styles.inputError : ""}`}
              placeholder="Write the answer here..."
              value={answer}
              onChange={(e) => {
                setAnswer(e.target.value);
                if (hasSubmitted) setHasSubmitted(false);
              }}
            />
            {hasSubmitted && !answer.trim() && (
              <div className={styles.errorText}>
                <Image src="/images/information-fill.svg" alt="" width={16} height={16} aria-hidden="true" />
                <span>This field is required</span>
              </div>
            )}
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
        <ModalFooter
          secondaryLabel="Discard"
          secondaryOnClick={handleDiscard}
          primaryLabel={mode === "add" ? "Add Question" : "Save Edits"}
          primaryOnClick={handleSave}
        />
      </section>
    </div>
  );
}


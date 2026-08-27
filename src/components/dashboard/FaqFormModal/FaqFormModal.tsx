"use client";

import { useEffect, useState, useMemo } from "react";
import Image from "next/image";
import { LanguageTabs, type Language } from "@/components/shared";
import { ModalHeader, ModalFooter } from "@/components/dashboard/shared";;
import styles from "./FaqFormModal.module.scss";

interface FaqFormModalProps {
  open: boolean;
  mode?: "add" | "edit";
  initialData?: { question: string; answer: string; status: "Published" | "Unpublished", rawTranslations?: any };
  onClose: () => void;
  onSave: (translations: any, published: boolean) => void;
}

export default function FaqFormModal({ open, mode = "add", initialData, onClose, onSave }: FaqFormModalProps) {
  const [questions, setQuestions] = useState<Record<Language, string>>({ English: "", Italian: "", Spanish: "" });
  const [answers, setAnswers] = useState<Record<Language, string>>({ English: "", Italian: "", Spanish: "" });
  const [published, setPublished] = useState(true);
  const [activeLang, setActiveLang] = useState<Language>("English");
  const [hasSubmitted, setHasSubmitted] = useState(false);

  // Sync initialData when modal opens
  useEffect(() => {
    if (open) {
      if (mode === "edit" && initialData) {
        setQuestions({
          English: initialData.rawTranslations?.en?.question || initialData.question || "",
          Italian: initialData.rawTranslations?.it?.question || "",
          Spanish: initialData.rawTranslations?.es?.question || "",
        });
        setAnswers({
          English: initialData.rawTranslations?.en?.answer || initialData.answer || "",
          Italian: initialData.rawTranslations?.it?.answer || "",
          Spanish: initialData.rawTranslations?.es?.answer || "",
        });
        setPublished(initialData.status === "Published");
      } else {
        setQuestions({ English: "", Italian: "", Spanish: "" });
        setAnswers({ English: "", Italian: "", Spanish: "" });
        setPublished(true);
      }
      setHasSubmitted(false);
      setActiveLang("English");
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

  const isDirty = useMemo(() => {
    if (mode === "add") return true;
    if (!initialData) return true;

    const initialQuestions = {
      English: initialData.rawTranslations?.en?.question || initialData.question || "",
      Italian: initialData.rawTranslations?.it?.question || "",
      Spanish: initialData.rawTranslations?.es?.question || "",
    };

    const initialAnswers = {
      English: initialData.rawTranslations?.en?.answer || initialData.answer || "",
      Italian: initialData.rawTranslations?.it?.answer || "",
      Spanish: initialData.rawTranslations?.es?.answer || "",
    };

    const initialPublished = initialData.status === "Published";

    if (published !== initialPublished) return true;

    for (const lang of ["English", "Italian", "Spanish"] as Language[]) {
      if (questions[lang] !== initialQuestions[lang]) return true;
      if (answers[lang] !== initialAnswers[lang]) return true;
    }

    return false;
  }, [mode, initialData, questions, answers, published]);

  const handleDiscard = () => {
    onClose();
  };

  const handleSave = () => {
    setHasSubmitted(true);
    
    const langs: Language[] = ["English", "Italian", "Spanish"];
    for (const lang of langs) {
      if (!questions[lang].trim() || !answers[lang].trim()) {
        setActiveLang(lang);
        return;
      }
    }

    const translations = {
      en: { question: questions["English"].trim(), answer: answers["English"].trim() },
      it: { question: questions["Italian"].trim(), answer: answers["Italian"].trim() },
      es: { question: questions["Spanish"].trim(), answer: answers["Spanish"].trim() },
    };
    onSave(translations, published);
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
              className={`${styles.inputPill} ${hasSubmitted && !questions[activeLang].trim() ? styles.inputError : ""}`}
              placeholder="Example: How can I cancel my booking?"
              value={questions[activeLang]}
              onChange={(e) => {
                setQuestions(prev => ({ ...prev, [activeLang]: e.target.value }));
                if (hasSubmitted) setHasSubmitted(false);
              }}
            />
            {hasSubmitted && !questions[activeLang].trim() && (
              <div className={styles.errorText}>
                <Image src="/images/information-fill.svg" alt="" width={16} height={16} aria-hidden="true" />
                <span>Question in {activeLang} is required</span>
              </div>
            )}
          </div>

          {/* Answer field */}
          <div className={styles.fieldGroup}>
            <label className={styles.fieldLabel} htmlFor="faq-answer">Answer</label>
            <textarea
              id="faq-answer"
              className={`${styles.textarea} ${hasSubmitted && !answers[activeLang].trim() ? styles.inputError : ""}`}
              placeholder="Write the answer here..."
              value={answers[activeLang]}
              onChange={(e) => {
                setAnswers((prev) => ({ ...prev, [activeLang]: e.target.value }));
                if (hasSubmitted) setHasSubmitted(false);
              }}
            />
            {hasSubmitted && !answers[activeLang].trim() && (
              <div className={styles.errorText}>
                <Image src="/images/information-fill.svg" alt="" width={16} height={16} aria-hidden="true" />
                <span>Answer in {activeLang} is required</span>
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
          primaryLabel={mode === "add" ? "Publish" : "Save Edits"}
          primaryOnClick={handleSave}
          primaryDisabled={!isDirty}
        />
      </section>
    </div>
  );
}

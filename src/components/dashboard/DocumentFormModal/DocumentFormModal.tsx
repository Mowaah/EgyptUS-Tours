"use client";

import { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import { LanguageTabs, type Language, ModalHeader, ModalFooter, RichTextEditor } from "@/components/shared";
import styles from "./DocumentFormModal.module.scss";

interface DocumentFormModalProps {
  open: boolean;
  mode?: "add" | "edit";
  initialData?: { title: string; content: string; status: "Published" | "Draft" };
  modalTitleAdd: string;
  modalTitleEdit: string;
  modalSubtitleAdd: string;
  modalSubtitleEdit: string;
  titleLabel: string;
  titlePlaceholder?: string;
  editorPlaceholder?: string;
  showColorPicker?: boolean;
  onClose: () => void;
  onSave: (title: string, content: string, published: boolean) => void;
}

export default function DocumentFormModal({
  open,
  mode = "add",
  initialData,
  modalTitleAdd,
  modalTitleEdit,
  modalSubtitleAdd,
  modalSubtitleEdit,
  titleLabel,
  titlePlaceholder = "Enter title here",
  editorPlaceholder = "Write your content here....",
  showColorPicker = false,
  onClose,
  onSave
}: DocumentFormModalProps) {
  const [activeLang, setActiveLang] = useState<Language>("English");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [published, setPublished] = useState(true);
  const [hasSubmitted, setHasSubmitted] = useState(false);

  useEffect(() => {
    if (!open) return;
    if (mode === "edit" && initialData) {
      setTitle(initialData.title);
      setPublished(initialData.status === "Published");
      
      // If initial data is raw text with newlines (from old mock data), convert to paragraphs
      // If it already has HTML tags (like <p>), use it directly.
      const hasHtml = /<[a-z][\s\S]*>/i.test(initialData.content);
      const htmlContent = hasHtml 
        ? initialData.content 
        : initialData.content.split("\n\n").map((p) => `<p>${p.replace(/\n/g, "<br>")}</p>`).join("");
        
      setContent(htmlContent);
    } else {
      setTitle("");
      setPublished(true);
      setContent("");
    }
    setHasSubmitted(false);
  }, [open, mode, initialData]);

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
  }, [open, onClose]);

  const handleSave = useCallback(() => {
    setHasSubmitted(true);
    if (!title.trim() || !content.trim() || content === "<p></p>") return;
    onSave(title, content, published);
  }, [content, title, published, onSave]);

  if (!open) return null;

  return (
    <div className={styles.overlay} role="presentation" onMouseDown={onClose}>
      <section
        className={styles.modal}
        role="dialog"
        aria-modal="true"
        aria-labelledby="terms-form-modal-title"
        onMouseDown={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <ModalHeader
          onClose={onClose}
          iconSrc={mode === "add" ? "/images/dashboard/add-modal.svg" : "/images/dashboard/edit-modal.svg"}
          title={mode === "add" ? modalTitleAdd : modalTitleEdit}
          subtitle={mode === "add" ? modalSubtitleAdd : modalSubtitleEdit}
          id="document-form-modal-title"
        />

        {/* Body */}
        <div className={styles.body}>
          {/* Language tabs */}
          <LanguageTabs active={activeLang} onChange={setActiveLang} />

          {/* Title */}
          <div className={styles.fieldGroup}>
            <label className={styles.fieldLabel} htmlFor="document-title">{titleLabel}</label>
            <input 
              id="document-title" 
              type="text" 
              className={`${styles.titleInput} ${hasSubmitted && !title.trim() ? styles.inputError : ""}`} 
              placeholder={titlePlaceholder} 
              value={title} 
              onChange={(e) => {
                setTitle(e.target.value);
                if (hasSubmitted) setHasSubmitted(false);
              }} 
            />
            {hasSubmitted && !title.trim() && (
              <div className={styles.errorText}>
                <Image src="/images/information-fill.svg" alt="" width={16} height={16} aria-hidden="true" />
                <span>This field is required</span>
              </div>
            )}
          </div>

          {/* Editor */}
          <div className={styles.fieldGroup}>
            <label className={styles.fieldLabel}>Content</label>
            <RichTextEditor
              value={content}
              onChange={(html) => {
                setContent(html);
                if (hasSubmitted) setHasSubmitted(false);
              }}
              placeholder={editorPlaceholder}
              showColorPicker={showColorPicker}
              error={hasSubmitted && (!content.trim() || content === "<p></p>")}
            />
            {hasSubmitted && (!content.trim() || content === "<p></p>") && (
              <div className={styles.errorText}>
                <Image src="/images/information-fill.svg" alt="" width={16} height={16} aria-hidden="true" />
                <span>This field is required</span>
              </div>
            )}
          </div>

          {/* Publish toggle */}
          <div className={styles.statusRow}>
            <div className={styles.statusLabel}>
              <span className={styles.statusTitle}>Publish Status</span>
              <span className={styles.statusDesc}>Turn on the toggle to make it live</span>
            </div>
            <button type="button" aria-label="Publish status" className={`${styles.toggle} ${published ? styles.toggleOn : styles.toggleOff}`} onClick={() => setPublished((v) => !v)}>
              <span className={styles.toggleThumb} />
            </button>
          </div>
        </div>

        {/* Footer */}
        <ModalFooter
          secondaryLabel="Discard"
          secondaryOnClick={onClose}
          primaryLabel={mode === "add" ? "Publish" : "Save Edits"}
          primaryOnClick={handleSave}
        />
      </section>
    </div>
  );
}

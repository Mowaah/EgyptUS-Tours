"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import Image from "next/image";
import { LanguageTabs, type Language, RichTextEditor } from "@/components/shared";
import { ModalHeader, ModalFooter } from "@/components/dashboard/shared";;
import styles from "./DocumentFormModal.module.scss";

interface DocumentFormModalProps {
  open: boolean;
  mode?: "add" | "edit";
  initialData?: { title: string; content: string; status: "Published" | "Unpublished", rawTranslations?: any };
  modalTitleAdd: string;
  modalTitleEdit: string;
  modalSubtitleAdd: string;
  modalSubtitleEdit: string;
  titleLabel: string;
  titlePlaceholder?: string;
  editorPlaceholder?: string;
  showColorPicker?: boolean;
  onClose: () => void;
  onSave: (translations: any, published: boolean) => void;
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
  const [titles, setTitles] = useState<Record<Language, string>>({ English: "", Italian: "", Spanish: "" });
  const [contents, setContents] = useState<Record<Language, string>>({ English: "", Italian: "", Spanish: "" });
  const [published, setPublished] = useState(true);
  const [hasSubmitted, setHasSubmitted] = useState(false);

  useEffect(() => {
    if (!open) return;
    if (mode === "edit" && initialData) {
      setTitles({
        English: initialData.rawTranslations?.en?.title || initialData.title || "",
        Italian: initialData.rawTranslations?.it?.title || "",
        Spanish: initialData.rawTranslations?.es?.title || "",
      });
      setPublished(initialData.status === "Published");
      
      const formatHtml = (val: string) => {
        if (!val) return "";
        return /<[a-z][\s\S]*>/i.test(val) ? val : val.split("\n\n").map((p) => `<p>${p.replace(/\n/g, "<br>")}</p>`).join("");
      };

      setContents({
        English: formatHtml(initialData.rawTranslations?.en?.content || initialData.content),
        Italian: formatHtml(initialData.rawTranslations?.it?.content),
        Spanish: formatHtml(initialData.rawTranslations?.es?.content),
      });
    } else {
      setTitles({ English: "", Italian: "", Spanish: "" });
      setPublished(true);
      setContents({ English: "", Italian: "", Spanish: "" });
    }
    setHasSubmitted(false);
    setActiveLang("English");
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

  const isDirty = useMemo(() => {
    if (mode === "add") return true;
    if (!initialData) return true;

    const initialTitles = {
      English: initialData.rawTranslations?.en?.title || initialData.title || "",
      Italian: initialData.rawTranslations?.it?.title || "",
      Spanish: initialData.rawTranslations?.es?.title || "",
    };

    const formatHtml = (val?: string) => {
      if (!val) return "";
      return /<[a-z][\s\S]*>/i.test(val) ? val : val.split("\n\n").map((p) => `<p>${p.replace(/\n/g, "<br>")}</p>`).join("");
    };

    const initialContents = {
      English: formatHtml(initialData.rawTranslations?.en?.content || initialData.content),
      Italian: formatHtml(initialData.rawTranslations?.it?.content),
      Spanish: formatHtml(initialData.rawTranslations?.es?.content),
    };

    const initialPublished = initialData.status === "Published";

    if (published !== initialPublished) return true;

    for (const lang of ["English", "Italian", "Spanish"] as Language[]) {
      if (titles[lang] !== initialTitles[lang]) return true;
      if (contents[lang] !== initialContents[lang]) return true;
    }

    return false;
  }, [mode, initialData, titles, contents, published]);

  const handleSave = useCallback(() => {
    setHasSubmitted(true);
    const langs: Language[] = ["English", "Italian", "Spanish"];
    
    // Check if any title or content is empty
    for (const lang of langs) {
      if (!titles[lang].trim() || !contents[lang].trim() || contents[lang] === "<p></p>") {
        setActiveLang(lang);
        return;
      }
    }
    
    const unformat = (val: string) => val === "<p></p>" ? "" : val.trim();

    const translations = {
      en: { title: titles["English"].trim(), content: unformat(contents["English"]) },
      it: { title: titles["Italian"].trim(), content: unformat(contents["Italian"]) },
      es: { title: titles["Spanish"].trim(), content: unformat(contents["Spanish"]) },
    };

    onSave(translations, published);
  }, [contents, titles, published, onSave]);

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
              className={`${styles.titleInput} ${hasSubmitted && !titles[activeLang].trim() ? styles.inputError : ""}`} 
              placeholder={titlePlaceholder} 
              value={titles[activeLang]} 
              onChange={(e) => {
                setTitles(prev => ({ ...prev, [activeLang]: e.target.value }));
                if (hasSubmitted) setHasSubmitted(false);
              }} 
            />
            {hasSubmitted && !titles[activeLang].trim() && (
              <div className={styles.errorText}>
                <Image src="/images/information-fill.svg" alt="" width={16} height={16} aria-hidden="true" />
                <span>Title in {activeLang} is required</span>
              </div>
            )}
          </div>

          {/* Editor */}
          <div className={styles.fieldGroup}>
            <label className={styles.fieldLabel}>Content</label>
            <RichTextEditor
              value={contents[activeLang]}
              onChange={(html) => {
                setContents(prev => ({ ...prev, [activeLang]: html }));
                if (hasSubmitted) setHasSubmitted(false);
              }}
              placeholder={editorPlaceholder}
              showColorPicker={showColorPicker}
              className={`${hasSubmitted && (!contents[activeLang].trim() || contents[activeLang] === "<p></p>") ? styles.editorError : ""}`}
            />
            {hasSubmitted && (!contents[activeLang].trim() || contents[activeLang] === "<p></p>") && (
              <div className={styles.errorText}>
                <Image src="/images/information-fill.svg" alt="" width={16} height={16} aria-hidden="true" />
                <span>Content in {activeLang} is required</span>
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
          primaryDisabled={!isDirty}
        />
      </section>
    </div>
  );
}

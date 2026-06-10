"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import Image from "next/image";
import { useEditor, EditorContent, type Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import CharacterCount from "@tiptap/extension-character-count";
import { LanguageTabs, type Language, ModalHeader, ModalFooter } from "@/components/shared";
import styles from "./TermsFormModal.module.scss";

interface TermsFormModalProps {
  open: boolean;
  mode?: "add" | "edit";
  initialData?: { title: string; content: string; status: "Published" | "Draft" };
  onClose: () => void;
  onSave: (title: string, content: string, published: boolean) => void;
}

const LANGS = ["English", "Italian", "Spanish"] as const;


/* ── Simple Toolbar for Terms & Conditions ── */
const HEADING_OPTIONS = [
  { label: "Paragraph", value: "paragraph" as const, short: "P" },
  { label: "Heading 1", value: "h1" as const, short: "H1" },
  { label: "Heading 2", value: "h2" as const, short: "H2" },
  { label: "Heading 3", value: "h3" as const, short: "H3" },
];

function Toolbar({ editor }: { editor: Editor }) {
  const [showHeadingMenu, setShowHeadingMenu] = useState(false);
  const [showAlignMenu, setShowAlignMenu] = useState(false);
  const headingRef = useRef<HTMLDivElement>(null);
  const alignRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (!headingRef.current?.contains(e.target as Node)) setShowHeadingMenu(false);
      if (!alignRef.current?.contains(e.target as Node)) setShowAlignMenu(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const currentHeading = HEADING_OPTIONS.find((h) => {
    if (h.value === "paragraph") return editor.isActive("paragraph") && !editor.isActive("heading");
    return editor.isActive("heading", { level: parseInt(h.value.replace("h", "")) });
  }) ?? HEADING_OPTIONS[0];

  const applyHeading = (value: typeof HEADING_OPTIONS[number]["value"]) => {
    if (value === "paragraph") editor.chain().focus().setParagraph().run();
    else editor.chain().focus().setHeading({ level: parseInt(value.replace("h", "")) as 1|2|3 }).run();
    setShowHeadingMenu(false);
  };

  const setLink = () => {
    const previousUrl = editor.getAttributes("link").href;
    const url = window.prompt("URL", previousUrl);
    if (url === null) return; // cancelled
    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  };

  const ALIGN_OPTIONS = [
    { label: "Align Left",   value: "left"   as const, short: "Left",   icon: <Image src="/images/dashboard/editor/text-align-left.svg" alt="Left" width={20} height={20} /> },
    { label: "Align Center", value: "center" as const, short: "Center", icon: <Image src="/images/dashboard/editor/text-align-center.svg" alt="Center" width={20} height={20} /> },
    { label: "Align Right",  value: "right"  as const, short: "Right",  icon: <Image src="/images/dashboard/editor/text-align-left.svg" alt="Right" width={20} height={20} style={{ transform: "scaleX(-1)" }} /> },
  ];

  const currentAlign = ALIGN_OPTIONS.find((a) => editor.isActive({ textAlign: a.value })) ?? ALIGN_OPTIONS[0];

  const applyAlign = (value: "left" | "center" | "right") => {
    editor.chain().focus().setTextAlign(value).run();
    setShowAlignMenu(false);
  };

  return (
    <div className={styles.toolbar} role="toolbar" aria-label="Text formatting">
      {/* Undo / Redo */}
      <div className={styles.toolbarGroup}>
        <button type="button" onClick={() => editor.chain().focus().undo().run()} className={styles.toolbarBtn} title="Undo">
          <Image src="/images/dashboard/editor/undo.svg" alt="Undo" width={20} height={20} />
        </button>
        <button type="button" onClick={() => editor.chain().focus().redo().run()} className={styles.toolbarBtn} title="Redo">
          <Image src="/images/dashboard/editor/undo.svg" alt="Redo" width={20} height={20} style={{ transform: "scaleX(-1)" }} />
        </button>
      </div>

      <div className={styles.toolbarDivider} />

      {/* Heading Dropdown */}
      <div className={styles.toolbarGroup} ref={headingRef}>
        <div className={styles.dropdownWrap}>
          <button
            type="button"
            className={`${styles.toolbarBtn} ${styles.dropdownTrigger} ${showHeadingMenu ? styles.active : ""}`}
            onClick={() => setShowHeadingMenu((v) => !v)}
            tabIndex={-1}
          >
            <span className={styles.triggerText}>{currentHeading.short}</span>
            <Image src="/images/dashboard/editor/chevron-down.svg" alt="" width={16} height={16} />
          </button>
          {showHeadingMenu && (
            <div className={styles.dropdownMenu}>
              {HEADING_OPTIONS.map((h) => (
                <button
                  key={h.value}
                  type="button"
                  className={`${styles.dropdownItem} ${currentHeading.value === h.value ? styles.dropdownItemActive : ""}`}
                  onClick={() => applyHeading(h.value)}
                  tabIndex={-1}
                >
                  <span className={`${styles.dropdownItemShort} ${currentHeading.value === h.value ? styles.dropdownItemShortActive : ""}`}>{h.short}</span>
                  <span className={styles.dropdownItemLabel}>{h.label}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className={styles.toolbarDivider} />

      {/* Basic Marks */}
      <div className={styles.toolbarGroup}>
        <button type="button" onClick={() => editor.chain().focus().toggleBold().run()} className={`${styles.toolbarBtn} ${editor.isActive("bold") ? styles.active : ""}`} title="Bold">
          <Image src="/images/dashboard/editor/text-bold.svg" alt="Bold" width={20} height={20} />
        </button>
        <button type="button" onClick={() => editor.chain().focus().toggleItalic().run()} className={`${styles.toolbarBtn} ${editor.isActive("italic") ? styles.active : ""}`} title="Italic">
          <Image src="/images/dashboard/editor/text-italic.svg" alt="Italic" width={20} height={20} />
        </button>
        <button type="button" onClick={() => editor.chain().focus().toggleStrike().run()} className={`${styles.toolbarBtn} ${editor.isActive("strike") ? styles.active : ""}`} title="Strikethrough">
          <Image src="/images/dashboard/editor/text-strikethrough.svg" alt="Strikethrough" width={20} height={20} />
        </button>
        <button type="button" onClick={() => editor.chain().focus().toggleUnderline().run()} className={`${styles.toolbarBtn} ${editor.isActive("underline") ? styles.active : ""}`} title="Underline">
          <Image src="/images/dashboard/editor/text-underline.svg" alt="Underline" width={20} height={20} />
        </button>
        <button type="button" onClick={() => editor.chain().focus().unsetAllMarks().run()} className={styles.toolbarBtn} title="Clear formatting">
          <Image src="/images/dashboard/editor/text-clear-format.svg" alt="Clear Formatting" width={20} height={20} />
        </button>
      </div>

      <div className={styles.toolbarDivider} />

      {/* Alignment Dropdown */}
      <div className={styles.toolbarGroup} ref={alignRef}>
        <div className={styles.dropdownWrap}>
          <button
            type="button"
            className={`${styles.toolbarBtn} ${styles.dropdownTrigger} ${showAlignMenu ? styles.active : ""}`}
            onClick={() => setShowAlignMenu((v) => !v)}
            tabIndex={-1}
          >
            <span className={styles.triggerIcon}>{currentAlign.icon}</span>
            <Image src="/images/dashboard/editor/chevron-down.svg" alt="" width={16} height={16} />
          </button>
          {showAlignMenu && (
            <div className={styles.dropdownMenu}>
              {ALIGN_OPTIONS.map((a) => (
                <button
                  key={a.value}
                  type="button"
                  className={`${styles.dropdownItem} ${currentAlign.value === a.value ? styles.dropdownItemActive : ""}`}
                  onClick={() => applyAlign(a.value)}
                  tabIndex={-1}
                >
                  <span className={`${styles.dropdownItemShort} ${currentAlign.value === a.value ? styles.dropdownItemShortActive : ""}`}>{a.icon}</span>
                  <span className={styles.dropdownItemLabel}>{a.label}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className={styles.toolbarDivider} />

      {/* Lists */}
      <div className={styles.toolbarGroup}>
        <button type="button" onClick={() => editor.chain().focus().toggleBulletList().run()} className={`${styles.toolbarBtn} ${editor.isActive("bulletList") ? styles.active : ""}`} title="Bullet List">
          <Image src="/images/dashboard/editor/list-bulleted.svg" alt="Bullet List" width={20} height={20} />
        </button>
        <button type="button" onClick={() => editor.chain().focus().toggleOrderedList().run()} className={`${styles.toolbarBtn} ${editor.isActive("orderedList") ? styles.active : ""}`} title="Numbered List">
          <Image src="/images/dashboard/editor/list-numbered.svg" alt="Numbered List" width={20} height={20} />
        </button>
      </div>

      <div className={styles.toolbarDivider} />

      {/* Links */}
      <div className={styles.toolbarGroup}>
        <button type="button" onClick={setLink} className={`${styles.toolbarBtn} ${editor.isActive("link") ? styles.active : ""}`} title="Link">
          <Image src="/images/dashboard/editor/link.svg" alt="Link" width={20} height={20} />
        </button>
      </div>
    </div>
  );
}

export default function TermsFormModal({ open, mode = "add", initialData, onClose, onSave }: TermsFormModalProps) {
  const [activeLang, setActiveLang] = useState<Language>("English");
  const [title, setTitle] = useState("");
  const [published, setPublished] = useState(true);
  const [wordCount, setWordCount] = useState(0);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Link.configure({ openOnClick: false }),
      Placeholder.configure({ placeholder: "Write your Terms & Conditions content here...." }),
      CharacterCount,
    ],
    content: "",
    onUpdate({ editor }) {
      setWordCount(editor.storage.characterCount.words());
    },
  });

  useEffect(() => {
    if (!open || !editor) return;
    if (mode === "edit" && initialData) {
      setTitle(initialData.title);
      setPublished(initialData.status === "Published");
      editor.commands.setContent(
        initialData.content.split("\n\n").map((p) => `<p>${p.replace(/\n/g, "<br>")}</p>`).join("")
      );
      setWordCount(editor.storage.characterCount.words());
    } else {
      setTitle("");
      setPublished(true);
      editor.commands.clearContent();
      setWordCount(0);
    }
  }, [open, mode, initialData, editor]);

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
    const html = editor?.getHTML() ?? "";
    const plain = html
      .replace(/<p>/g, "").replace(/<\/p>/g, "\n\n")
      .replace(/<br\s*\/?>/g, "\n").replace(/<[^>]+>/g, "").trim();
    onSave(title, plain, published);
  }, [editor, title, published, onSave]);

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
          title={mode === "add" ? "Add New Terms & Conditions" : "Edit Terms & Conditions"}
          subtitle={mode === "add" ? "Create a new Terms that will appear to visitors on the website." : "Update the Terms & Conditions content displayed to website"}
          id="terms-form-modal-title"
        />

        {/* Body */}
        <div className={styles.body}>
          {/* Language tabs */}
          <LanguageTabs active={activeLang} onChange={setActiveLang} />

          {/* Title */}
          <div className={styles.fieldGroup}>
            <label className={styles.fieldLabel} htmlFor="terms-title">Terms & Conditions Title</label>
            <input id="terms-title" type="text" className={styles.titleInput} placeholder="Enter title here" value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>

          {/* Editor */}
          <div className={styles.fieldGroup}>
            <label className={styles.fieldLabel}>Content</label>
            <div className={styles.editorWrapper}>
              {editor && <Toolbar editor={editor} />}
              <EditorContent editor={editor} className={styles.editorContent} />
            </div>
            {editor && (
              <div className={styles.wordCount}>
                {wordCount} {wordCount === 1 ? 'word' : 'words'}
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

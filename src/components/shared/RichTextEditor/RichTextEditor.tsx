"use client";

import React, { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { EditorContent, useEditor, type Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import CharacterCount from "@tiptap/extension-character-count";
import { Color } from "@tiptap/extension-color";
import { TextStyle } from "@tiptap/extension-text-style";
import styles from "./RichTextEditor.module.scss";

interface RichTextEditorProps {
  value?: string;
  onChange?: (value: string, plainText: string) => void;
  placeholder?: string;
  className?: string;
  showColorPicker?: boolean;
  error?: string | boolean;
}

const HEADING_OPTIONS = [
  { label: "Paragraph", value: "paragraph" as const, short: "P" },
  { label: "Heading 1", value: "h1" as const, short: "H1" },
  { label: "Heading 2", value: "h2" as const, short: "H2" },
  { label: "Heading 3", value: "h3" as const, short: "H3" },
];

const ALIGN_OPTIONS = [
  { label: "Align Left",   value: "left"   as const, short: "Left",   icon: <Image src="/images/dashboard/editor/text-align-left.svg" alt="Left" width={20} height={20} /> },
  { label: "Align Center", value: "center" as const, short: "Center", icon: <Image src="/images/dashboard/editor/text-align-center.svg" alt="Center" width={20} height={20} /> },
  { label: "Align Right",  value: "right"  as const, short: "Right",  icon: <Image src="/images/dashboard/editor/text-align-left.svg" alt="Right" width={20} height={20} style={{ transform: "scaleX(-1)" }} /> },
];

const COLORS = [
  "#000000", "#FF5527", "#FF6600", "#EAB308", "#10B981", "#2971E6", "#A855F7", "#EF4444", "#6B7280"
];

function Toolbar({ editor, showColorPicker }: { editor: Editor; showColorPicker: boolean }) {
  const [showHeadingMenu, setShowHeadingMenu] = useState(false);
  const [showAlignMenu, setShowAlignMenu] = useState(false);
  const [showColorMenu, setShowColorMenu] = useState(false);
  
  const headingRef = useRef<HTMLDivElement>(null);
  const alignRef = useRef<HTMLDivElement>(null);
  const colorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (!headingRef.current?.contains(e.target as Node)) setShowHeadingMenu(false);
      if (!alignRef.current?.contains(e.target as Node)) setShowAlignMenu(false);
      if (!colorRef.current?.contains(e.target as Node)) setShowColorMenu(false);
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
    if (url === null) return;
    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  };

  const currentAlign = ALIGN_OPTIONS.find((a) => editor.isActive({ textAlign: a.value })) ?? ALIGN_OPTIONS[0];

  const applyAlign = (value: "left" | "center" | "right") => {
    editor.chain().focus().setTextAlign(value).run();
    setShowAlignMenu(false);
  };

  const applyColor = (color: string) => {
    editor.chain().focus().setColor(color).run();
    setShowColorMenu(false);
  };

  return (
    <div className={styles.toolbar} role="toolbar" aria-label="Text formatting">
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

      {/* Color Dropdown */}
      {showColorPicker && (
        <>
          <div className={styles.toolbarGroup} ref={colorRef}>
            <div className={styles.dropdownWrap}>
              <button
                type="button"
                className={`${styles.toolbarBtn} ${showColorMenu ? styles.active : ""}`}
                style={{ position: 'relative' }}
                onClick={() => setShowColorMenu((v) => !v)}
                title="Text Color"
              >
                {/* simple color icon indicator */}
                <span style={{ 
                  display: 'block', 
                  width: 16, 
                  height: 16, 
                  borderRadius: '50%', 
                  backgroundColor: editor.getAttributes('textStyle').color || '#000',
                  border: '1px solid #E5E7EB'
                }} />
              </button>
              {showColorMenu && (
                <div className={styles.colorMenu}>
                  {COLORS.map((color) => (
                      <button
                        key={color}
                        type="button"
                        className={styles.colorSwatch}
                        style={{ backgroundColor: color }}
                        onMouseDown={(e) => {
                          e.preventDefault();
                          applyColor(color);
                        }}
                        title={color}
                      />
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className={styles.toolbarDivider} />
        </>
      )}

      {/* Alignment */}
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

      {/* Quote */}
      <div className={styles.toolbarGroup}>
        <button type="button" onClick={() => editor.chain().focus().toggleBlockquote().run()} className={`${styles.toolbarBtn} ${editor.isActive("blockquote") ? styles.active : ""}`} title="Blockquote">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
            <path d="M10 11H6V7H10V11ZM10 11H6C6 14.5 8 16 10 17L11 15.5C9.5 15 8 14 8 11H10V11ZM20 11H16V7H20V11ZM20 11H16C16 14.5 18 16 20 17L21 15.5C19.5 15 18 14 18 11H20V11Z"/>
          </svg>
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

export default function RichTextEditor({ value, onChange, placeholder = "Start typing...", className = "", showColorPicker = false, error = false }: RichTextEditorProps) {
  const [wordCount, setWordCount] = useState(0);
  const [, forceUpdate] = useState({});

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      TextStyle,
      Color,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Link.configure({ openOnClick: false }),
      Placeholder.configure({ placeholder }),
      CharacterCount,
    ],
    content: value,
    onUpdate({ editor }) {
      const html = editor.getHTML();
      const plainText = editor.getText();
      setWordCount(editor.storage.characterCount.words());
      if (onChange) {
        onChange(html, plainText);
      }
    },
    onSelectionUpdate() {
      forceUpdate({});
    },
  });

  useEffect(() => {
    if (editor && editor.getHTML() !== value) {
      const currentPos = editor.state.selection;
      editor.commands.setContent(value || "", { emitUpdate: false });
      editor.commands.setTextSelection(currentPos);
      setWordCount(editor.storage.characterCount.words());
    }
  }, [value, editor]);

  if (!editor) return null;

  return (
    <div className={className}>
      <div className={`${styles.editorWrapper} ${error ? styles.editorError : ""}`}>
        <Toolbar editor={editor} showColorPicker={showColorPicker} />
        <EditorContent editor={editor} className={styles.editorContent} />
      </div>
      <div className={styles.footerWrap}>
        {error ? (
          <div className={styles.errorText} role="alert">
            <img src="/images/information-fill.svg" alt="" width={16} height={16} aria-hidden="true" />
            <span>{error}</span>
          </div>
        ) : <div />}
        <div className={styles.wordCount}>
          {wordCount} {wordCount === 1 ? 'word' : 'words'}
        </div>
      </div>
    </div>
  );
}

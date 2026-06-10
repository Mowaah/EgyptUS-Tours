"use client";

import styles from "./LanguageTabs.module.scss";

const LANGS = ["English", "Italian", "Spanish"] as const;
export type Language = typeof LANGS[number];

interface LanguageTabsProps {
  active: Language;
  onChange: (lang: Language) => void;
}

export default function LanguageTabs({ active, onChange }: LanguageTabsProps) {
  return (
    <div className={styles.langTabs} role="tablist" aria-label="Language">
      {LANGS.map((lang) => (
        <button
          key={lang}
          role="tab"
          type="button"
          aria-selected={active === lang}
          className={`${styles.langTab} ${active === lang ? styles.langTabActive : ""}`}
          onClick={() => onChange(lang)}
        >
          {lang}
        </button>
      ))}
    </div>
  );
}

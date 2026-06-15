"use client";

import styles from "./LanguageTabs.module.scss";

const LANGS = ["English", "Italian", "Spanish"] as const;
export type Language = typeof LANGS[number];

interface LanguageTabsProps {
  active: Language;
  onChange: (lang: Language) => void;
  className?: string;
}

export default function LanguageTabs({ active, onChange, className = "" }: LanguageTabsProps) {
  return (
    <div className={`${styles.langTabs} ${className}`} role="tablist" aria-label="Language">
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

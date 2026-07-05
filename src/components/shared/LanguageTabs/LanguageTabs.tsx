"use client";

import styles from "./LanguageTabs.module.scss";

const LANGS = ["English", "Italian", "Spanish"] as const;
export type Language = typeof LANGS[number];

interface LanguageTabsProps {
  active: Language;
  onChange: (lang: Language) => void;
  className?: string;
  variant?: "default" | "white";
}

export default function LanguageTabs({ active, onChange, className = "", variant = "default" }: LanguageTabsProps) {
  const bgClass = variant === "white" ? styles.langTabsWhite : "";
  return (
    <div className={`${styles.langTabs} ${bgClass} ${className}`} role="tablist" aria-label="Language">
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

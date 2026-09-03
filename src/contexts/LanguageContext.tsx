"use client";

import React, { createContext, useCallback, useContext, useMemo, useState, useEffect } from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import {
  SupportedLanguage,
  SUPPORTED_LANGUAGES,
  DEFAULT_LANGUAGE,
  LanguageOption,
  TranslationNamespace,
  normalizeLanguage,
  LANGUAGE_STORAGE_KEY,
  LANGUAGE_COOKIE_KEY,
} from "@/i18n";
import { getTranslation } from "@/i18n";

export { LANGUAGE_STORAGE_KEY, LANGUAGE_COOKIE_KEY };

interface LanguageContextValue {
  language: SupportedLanguage;
  activeOption: LanguageOption;
  setLanguage: (lang: SupportedLanguage) => void;
  t: (namespace: TranslationNamespace, key: string, params?: Record<string, string | number>) => string;
  dir: "ltr";
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

interface LanguageProviderProps {
  children: React.ReactNode;
  initialLanguage?: SupportedLanguage;
}

export function LanguageProvider({ children, initialLanguage }: LanguageProviderProps) {
  const router = useRouter();
  const [language, setLanguageState] = useState<SupportedLanguage>(
    initialLanguage || DEFAULT_LANGUAGE
  );

  // Sync state if initialLanguage changes (e.g. server re-render on cookie change)
  useEffect(() => {
    if (initialLanguage && initialLanguage !== language) {
      setLanguageState(initialLanguage);
    }
  }, [initialLanguage]);

  // Restore persisted language preference on mount
  useEffect(() => {
    const stored =
      Cookies.get(LANGUAGE_COOKIE_KEY) ||
      (typeof window !== "undefined" ? window.localStorage.getItem(LANGUAGE_STORAGE_KEY) : null);

    const normalized = normalizeLanguage(stored);
    if (normalized !== language) {
      setLanguageState(normalized);
      Cookies.set(LANGUAGE_COOKIE_KEY, normalized, { expires: 365, path: "/" });
    }
  }, []);

  const setLanguage = useCallback(
    (nextLang: SupportedLanguage) => {
      const normalized = normalizeLanguage(nextLang);
      setLanguageState(normalized);
      try {
        window.localStorage.setItem(LANGUAGE_STORAGE_KEY, normalized);
        Cookies.set(LANGUAGE_COOKIE_KEY, normalized, { expires: 365, path: "/" });
        // Set document lang attribute
        if (typeof document !== "undefined") {
          document.documentElement.lang = normalized;
        }
        // Refresh router so server-side fetched data re-runs with the new language cookie
        router.refresh();
      } catch (e) {
        console.error("Error persisting language preference:", e);
      }
    },
    [router]
  );

  const activeOption = useMemo(
    () =>
      SUPPORTED_LANGUAGES.find((opt) => opt.locale === language) ??
      SUPPORTED_LANGUAGES[0],
    [language]
  );

  const t = useCallback(
    (namespace: TranslationNamespace, key: string, params?: Record<string, string | number>) => {
      return getTranslation(language, namespace, key, params);
    },
    [language]
  );

  const value = useMemo(
    () => ({
      language,
      activeOption,
      setLanguage,
      t,
      dir: "ltr" as const,
    }),
    [language, activeOption, setLanguage, t]
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

const defaultContextValue: LanguageContextValue = {
  language: DEFAULT_LANGUAGE,
  activeOption: SUPPORTED_LANGUAGES[0],
  setLanguage: () => {},
  t: (namespace: TranslationNamespace, key: string, params?: Record<string, string | number>) => {
    return getTranslation(DEFAULT_LANGUAGE, namespace, key, params);
  },
  dir: "ltr",
};

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  return ctx || defaultContextValue;
}

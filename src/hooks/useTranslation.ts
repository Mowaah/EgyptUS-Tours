"use client";

import { useCallback } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { TranslationNamespace } from "@/i18n/types";

export function useTranslation(defaultNamespace: TranslationNamespace = "common") {
  const { language, setLanguage, activeOption, dir, t: rawT } = useLanguage();

  const t = useCallback(
    (
      key: string,
      fallbackOrParams?: string | Record<string, string | number>,
      maybeParams?: Record<string, string | number>
    ): string => {
      let fallback: string | undefined;
      let params: Record<string, string | number> | undefined;

      if (typeof fallbackOrParams === "string") {
        fallback = fallbackOrParams;
        params = maybeParams;
      } else if (typeof fallbackOrParams === "object" && fallbackOrParams !== null) {
        params = fallbackOrParams;
      }

      let namespace = defaultNamespace;
      let actualKey = key;

      // Allow explicit namespace syntax: "events:overview.title"
      if (key.includes(":")) {
        const [ns, ...rest] = key.split(":");
        namespace = ns as TranslationNamespace;
        actualKey = rest.join(":");
      }

      const res = rawT(namespace, actualKey, params);

      // If missing and fallback provided, return fallback
      if ((!res || res === actualKey) && fallback !== undefined) {
        return fallback;
      }

      return res || fallback || actualKey;
    },
    [rawT, defaultNamespace]
  );

  return {
    t,
    language,
    setLanguage,
    activeOption,
    dir,
  };
}

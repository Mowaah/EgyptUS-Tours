export type SupportedLanguage = "en" | "it" | "es";

export interface LanguageOption {
  code: string; // "EN" | "IT" | "ES"
  locale: SupportedLanguage; // "en" | "it" | "es"
  name: string;
  icon: string;
}

export const SUPPORTED_LANGUAGES: LanguageOption[] = [
  { code: "EN", locale: "en", name: "English", icon: "/images/en.svg" },
  { code: "IT", locale: "it", name: "Italian", icon: "/images/it.svg" },
  { code: "ES", locale: "es", name: "Spanish", icon: "/images/es.svg" },
];

export const DEFAULT_LANGUAGE: SupportedLanguage = "en";
export const LANGUAGE_STORAGE_KEY = "egyptus_display_language";
export const LANGUAGE_COOKIE_KEY = "egyptus_lang";

export function normalizeLanguage(value: string | null | undefined): SupportedLanguage {
  if (!value) return DEFAULT_LANGUAGE;
  const lower = value.toLowerCase();
  const match = SUPPORTED_LANGUAGES.find(
    (l) => l.locale === lower || l.code.toLowerCase() === lower
  );
  return match ? match.locale : DEFAULT_LANGUAGE;
}

export type TranslationNamespace =
  | "common"
  | "home"
  | "events"
  | "b2b"
  | "about"
  | "contact"
  | "trips"
  | "hotels"
  | "transportation"
  | "faq"
  | "legal"
  | "booking";

export type TranslationDictionary = Record<string, any>;

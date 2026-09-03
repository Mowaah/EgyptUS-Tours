import { SupportedLanguage, TranslationNamespace, DEFAULT_LANGUAGE } from "./types";

// English dictionaries
import enCommon from "./locales/en/common.json";
import enHome from "./locales/en/home.json";
import enEvents from "./locales/en/events.json";
import enB2B from "./locales/en/b2b.json";
import enAbout from "./locales/en/about.json";
import enContact from "./locales/en/contact.json";
import enTrips from "./locales/en/trips.json";
import enHotels from "./locales/en/hotels.json";
import enTransportation from "./locales/en/transportation.json";
import enFaq from "./locales/en/faq.json";
import enLegal from "./locales/en/legal.json";

// Italian dictionaries
import itCommon from "./locales/it/common.json";
import itHome from "./locales/it/home.json";
import itEvents from "./locales/it/events.json";
import itB2B from "./locales/it/b2b.json";
import itAbout from "./locales/it/about.json";
import itContact from "./locales/it/contact.json";
import itTrips from "./locales/it/trips.json";
import itHotels from "./locales/it/hotels.json";
import itTransportation from "./locales/it/transportation.json";
import itFaq from "./locales/it/faq.json";
import itLegal from "./locales/it/legal.json";

// Spanish dictionaries
import esCommon from "./locales/es/common.json";
import esHome from "./locales/es/home.json";
import esEvents from "./locales/es/events.json";
import esB2B from "./locales/es/b2b.json";
import esAbout from "./locales/es/about.json";
import esContact from "./locales/es/contact.json";
import esTrips from "./locales/es/trips.json";
import esHotels from "./locales/es/hotels.json";
import esTransportation from "./locales/es/transportation.json";
import esFaq from "./locales/es/faq.json";
import esLegal from "./locales/es/legal.json";

export * from "./types";

const DICTIONARIES: Record<SupportedLanguage, Record<TranslationNamespace, Record<string, any>>> = {
  en: {
    common: enCommon,
    home: enHome,
    events: enEvents,
    b2b: enB2B,
    about: enAbout,
    contact: enContact,
    trips: enTrips,
    hotels: enHotels,
    transportation: enTransportation,
    faq: enFaq,
    legal: enLegal,
  },
  it: {
    common: itCommon,
    home: itHome,
    events: itEvents,
    b2b: itB2B,
    about: itAbout,
    contact: itContact,
    trips: itTrips,
    hotels: itHotels,
    transportation: itTransportation,
    faq: itFaq,
    legal: itLegal,
  },
  es: {
    common: esCommon,
    home: esHome,
    events: esEvents,
    b2b: esB2B,
    about: esAbout,
    contact: esContact,
    trips: esTrips,
    hotels: esHotels,
    transportation: esTransportation,
    faq: esFaq,
    legal: esLegal,
  },
};

/**
 * Resolves a nested key in an object using dot notation (e.g. "overview.tabOverview")
 */
function resolveNestedKey(obj: Record<string, any> | undefined, keyPath: string): any {
  if (!obj || !keyPath) return undefined;
  const parts = keyPath.split(".");
  let current: any = obj;
  for (const part of parts) {
    if (current === undefined || current === null || typeof current !== "object") {
      return undefined;
    }
    current = current[part];
  }
  return current;
}

/**
 * Interpolates variables formatted as {varName} in the translated string.
 */
function interpolate(text: string, params?: Record<string, string | number>): string {
  if (!params || typeof text !== "string") return text;
  return text.replace(/\{(\w+)\}/g, (_, key) => {
    return params[key] !== undefined ? String(params[key]) : `{${key}}`;
  });
}

/**
 * Core translation resolver with automatic fallback to English.
 */
export function getTranslation(
  locale: SupportedLanguage,
  namespace: TranslationNamespace,
  key: string,
  params?: Record<string, string | number>
): string {
  const currentDict = DICTIONARIES[locale]?.[namespace];
  const fallbackDict = DICTIONARIES[DEFAULT_LANGUAGE]?.[namespace];

  let value = resolveNestedKey(currentDict, key);

  // Fall back to English if missing or empty string
  if (value === undefined || value === "") {
    value = resolveNestedKey(fallbackDict, key);
  }

  // If still not found, return the key as fallback
  if (value === undefined || value === null) {
    return key;
  }

  return typeof value === "string" ? interpolate(value, params) : String(value);
}

/**
 * Helper to get a localized value from an object that might have:
 * 1. An already overlaid field (e.g. obj[field])
 * 2. A nested translations map (e.g. obj.translations?.[locale]?.[field])
 * 3. Fallback to English (e.g. obj.translations?.en?.[field] or obj[field])
 */
export function getLocalizedValue<T = string>(
  obj: any,
  field: string,
  locale: SupportedLanguage = DEFAULT_LANGUAGE,
  fallback = ""
): T {
  if (!obj) return fallback as unknown as T;

  // 1. Direct field match if already localized by backend
  if (obj[field] !== undefined && obj[field] !== null && obj[field] !== "") {
    return obj[field] as T;
  }

  // 2. Nested translations object: obj.translations[locale][field]
  const translations = obj.translations;
  if (translations && typeof translations === "object") {
    if (translations[locale]?.[field]) {
      return translations[locale][field] as T;
    }
    if (translations[DEFAULT_LANGUAGE]?.[field]) {
      return translations[DEFAULT_LANGUAGE][field] as T;
    }
  }

  return fallback as unknown as T;
}

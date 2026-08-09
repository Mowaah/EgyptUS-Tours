import { z } from "zod";
import type { Language } from "@/components/shared/LanguageTabs/LanguageTabs";

export const getLangKey = (lang: Language): "en" | "it" | "es" => {
  switch (lang) {
    case "English": return "en";
    case "Italian": return "it";
    case "Spanish": return "es";
    default: return "en";
  }
};

export function getLocalizedName(item: any, lang: Language = "English"): string {
  if (!item) return "";
  const key = getLangKey(lang);
  const trans = item.translations?.[key];
  const en = item.translations?.en;
  
  return trans?.name || trans?.title || en?.name || en?.title || item.name || item.title || "";
}

export const localizedStringSchema = z.object({
  en: z.string().optional(),
  it: z.string().optional(),
  es: z.string().optional(),
});

export const requiredLocalizedStringSchema = (requiredMessage: string) => z.object({
  en: z.string({ message: requiredMessage }).min(1, requiredMessage),
  it: z.string().optional(),
  es: z.string().optional(),
});

export type LocalizedString = z.infer<typeof localizedStringSchema>;

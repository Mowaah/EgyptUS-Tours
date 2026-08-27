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
  en: z.string().min(1, "English translation is required"),
  it: z.string().min(1, "Italian translation is required"),
  es: z.string().min(1, "Spanish translation is required"),
});

export const requiredLocalizedStringSchema = (requiredMessage: string) => z.object({
  en: z.string({ message: requiredMessage }).min(1, requiredMessage),
  it: z.string({ message: requiredMessage }).min(1, requiredMessage),
  es: z.string({ message: requiredMessage }).min(1, requiredMessage),
});

const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const slugString = (requiredMessage: string) => z.string({ message: requiredMessage })
  .trim()
  .min(1, requiredMessage)
  .regex(slugRegex, "Slug can only contain lowercase letters, numbers, and hyphens (no spaces)");

export const localizedSlugSchema = (requiredMessage: string = "Slug is required") => z.object({
  en: slugString(requiredMessage),
  it: slugString(requiredMessage),
  es: slugString(requiredMessage),
});

export type LocalizedString = z.infer<typeof localizedStringSchema>;

import { z } from "zod";

const isBrowser = typeof window !== "undefined";

const ALLOWED_IMAGE_TYPES = ["image/png", "image/jpeg", "image/jpg", "image/webp", "image/gif"];

const fileSchema = z.any()
  .refine((value) => {
    if (!isBrowser) return true;
    // Allow null/undefined (no image)
    if (!value) return true;
    // Allow existing URL strings from the API
    if (typeof value === "string") return true;
    // Allow valid File objects with correct MIME type
    if (value instanceof File) return ALLOWED_IMAGE_TYPES.includes(value.type);
    // Allow FileList
    if (value instanceof FileList && value.length > 0) return ALLOWED_IMAGE_TYPES.includes(value[0].type);
    // Allow arrays of files
    if (Array.isArray(value) && value.length > 0 && value[0] instanceof File) return ALLOWED_IMAGE_TYPES.includes(value[0].type);
    return false;
  }, "Only PNG, JPG, WebP, or GIF images are allowed.")
  .transform((value) => {
    if (!isBrowser) return null;
    if (!value) return null;
    // Pass through existing URL strings unchanged
    if (typeof value === "string") return value;
    if (value instanceof File) return value;
    if (value instanceof FileList && value.length > 0) return value[0];
    if (Array.isArray(value) && value.length > 0 && value[0] instanceof File) return value[0];
    return null;
  });

// All locales are required
const localizedString = (message: string) => z.object({
  en: z.string().min(1, message),
  es: z.string().min(1, message),
  it: z.string().min(1, message),
});

const localizedStringMax = (max: number, message: string) => z.object({
  en: z.string().min(1, message).max(max, `Cannot exceed ${max} characters.`),
  es: z.string().min(1, message).max(max, `Cannot exceed ${max} characters.`),
  it: z.string().min(1, message).max(max, `Cannot exceed ${max} characters.`),
});

const localizedStringOptional = () => z.object({
  en: z.string().optional().default(""),
  es: z.string().optional().default(""),
  it: z.string().optional().default(""),
});

// Slug: lowercase letters, numbers, hyphens only — no spaces or special chars.
// Empty string allowed (home page canonical = site root).
const slugString = z
  .string()
  .refine(
    (v) => v === "" || /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(v),
    "Slug must be lowercase letters, numbers, and hyphens only (e.g. my-page)"
  );

const localizedSlug = () => z.object({
  en: slugString,
  es: slugString,
  it: slugString,
});

export const seoConfigurationSchema = z.object({
  imageFile: fileSchema.optional(),
  imageTitle: localizedStringOptional(),
  imageAlt: localizedStringOptional(),
  metaTitle: localizedStringMax(70, "Meta Title is required"),
  metaDescription: localizedStringMax(300, "Meta Description is required"),
  metaKeywords: localizedString("Meta Keywords are required"),
  slug: localizedSlug(),
});

export type SEOConfigurationValues = z.infer<typeof seoConfigurationSchema>;


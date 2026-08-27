import { z } from "zod";

const isBrowser = typeof window !== "undefined";

const fileSchema = z.any()
  .refine((files) => {
    if (!isBrowser) return true;
    return !files || files.length === 0 || files instanceof FileList || Array.isArray(files) || files instanceof File;
  }, "Invalid file format.")
  .transform((files) => {
    if (!isBrowser) return null;
    if (!files) return null;
    if (files instanceof File) return files;
    if (files instanceof FileList && files.length > 0) return files[0];
    if (Array.isArray(files) && files.length > 0 && files[0] instanceof File) return files[0];
    return null;
  });

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

export const seoConfigurationSchema = z.object({
  imageFile: fileSchema,
  imageTitle: localizedString("Image Title is required"),
  imageAlt: localizedString("Image Alt is required"),
  metaTitle: localizedStringMax(70, "Meta Title is required"),
  metaDescription: localizedStringMax(300, "Meta Description is required"),
  metaKeywords: localizedString("Meta Keywords are required"), // Keywords field uses a comma-separated string in the UI
  slug: localizedString("Slug is required"),
});

export type SEOConfigurationValues = z.infer<typeof seoConfigurationSchema>;

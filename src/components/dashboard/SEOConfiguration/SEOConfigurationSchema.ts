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

const localizedString = z.object({
  en: z.string().optional(),
  es: z.string().optional(),
  it: z.string().optional(),
}).optional();

const localizedStringMax = (max: number) => z.object({
  en: z.string().max(max, `Cannot exceed ${max} characters.`).optional(),
  es: z.string().max(max, `Cannot exceed ${max} characters.`).optional(),
  it: z.string().max(max, `Cannot exceed ${max} characters.`).optional(),
}).optional();

export const seoConfigurationSchema = z.object({
  imageFile: fileSchema,
  imageTitle: localizedString,
  imageAlt: localizedString,
  metaTitle: localizedStringMax(70),
  metaDescription: localizedStringMax(300),
  metaKeywords: localizedString, // Keywords field uses a comma-separated string in the UI
  slug: localizedString,
});

export type SEOConfigurationValues = z.infer<typeof seoConfigurationSchema>;

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

export const seoConfigurationSchema = z.object({
  imageFile: fileSchema,
  imageTitle: z.string().optional(),
  imageAlt: z.string().optional(),
  metaTitle: z.string().optional(),
  metaDescription: z.string().max(300, "Description cannot exceed 300 characters.").optional(),
  metaKeywords: z.string().optional(),
  slug: z.string().optional(),
});

export type SEOConfigurationValues = z.infer<typeof seoConfigurationSchema>;

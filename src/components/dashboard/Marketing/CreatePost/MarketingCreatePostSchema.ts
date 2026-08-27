import { z } from "zod";

const localizedFieldsSchema = z.object({
  title: z.string().min(1, "Title is required"),
  shortDescription: z.string().min(1, "Short Description is required").max(300, "Maximum 300 characters"),
  content: z.string().min(1, "Content is required"),
  thumbnailTitle: z.string().min(1, "Thumbnail Title is required"),
  thumbnailAlt: z.string().min(1, "Thumbnail Alt is required"),
  imageTitle: z.string().min(1, "Main Image Title is required"),
  imageAlt: z.string().min(1, "Main Image Alt is required"),
  metaTitle: z.string().min(1, "Meta Title is required"),
  metaDescription: z.string().min(1, "Meta Description is required"),
  metaKeywords: z.string().min(1, "Meta Keywords are required"),
  slug: z.string().min(1, "Slug is required"),
});

export const marketingCreatePostSchema = z.object({
  // Upload Thumbnail
  thumbnailFile: z.any().optional(),

  // Upload Image
  imageFile: z.any().optional(),

  // Publish Settings
  scheduledDate: z.string().optional().superRefine((val, ctx) => {
    if (!val) return;
    const date = new Date(val);
    if (isNaN(date.getTime())) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Invalid date" });
      return;
    }
    if (date <= new Date()) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Scheduled date must be in the future" });
    }
  }),
  autoApply: z.boolean().optional(),
  status: z.string().optional(),

  // Details
  category: z.string({ message: "Category is required" }).min(1, "Category is required"),

  // Author
  author: z.string({ message: "Author is required" }).min(1, "Author is required"),

  // Translations
  translations: z.object({
    en: localizedFieldsSchema,
    it: localizedFieldsSchema,
    es: localizedFieldsSchema,
  }),
});

export type MarketingCreatePostValues = z.infer<typeof marketingCreatePostSchema>;

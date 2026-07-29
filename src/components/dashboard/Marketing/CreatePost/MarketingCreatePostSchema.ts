import { z } from "zod";

export const marketingCreatePostSchema = z.object({
  // Upload Thumbnail
  thumbnailFile: z.any().optional(), // Using any since File is browser specific
  thumbnailTitle: z.string().optional(),
  thumbnailAlt: z.string().optional(),

  // Upload Image
  imageFile: z.any().optional(),
  imageTitle: z.string().optional(),
  imageAlt: z.string().optional(),

  // Content
  title: z.string({ message: "Title is required" }).min(1, "Title is required"),
  shortDescription: z.string().max(300, "Short description must be 300 characters or less").optional(),
  content: z.string({ message: "Content is required" }).min(1, "Content is required"),

  // Publish Settings
  scheduledDate: z.string().optional(),
  autoApply: z.boolean().optional(),
  status: z.string().optional(),

  // Details
  category: z.string({ message: "Category is required" }).min(1, "Category is required"),

  // SEO Settings
  metaTitle: z.string().optional(),
  metaDescription: z.string().max(300, "Meta description must be 300 characters or less").optional(),
  metaKeywords: z.string().optional(),
  slug: z.string().optional(),

  // Author
  author: z.string({ message: "Author is required" }).min(1, "Author is required"),
});

export type MarketingCreatePostValues = z.infer<typeof marketingCreatePostSchema>;

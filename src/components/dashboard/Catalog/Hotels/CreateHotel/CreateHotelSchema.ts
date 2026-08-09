import { z } from "zod";
import { localizedStringSchema, requiredLocalizedStringSchema } from "@/components/dashboard/shared/i18n";

export const roomSchema = z.object({
  id: z.union([z.string(), z.number()]).optional(),
  category: z.string().min(1, "Category is required"),
  type: z.string().min(1, "Type is required"),
  view: z.string().optional(),
  pricePerNight: z.string().min(1, "Price is required"), // We'll convert to number on submit
  pricePerNightEgp: z.string().optional(),
  description: localizedStringSchema,
  facilities: z.array(z.string()).default([]),
  photos: z.array(z.any()).default([]),
});

export const createHotelSchema = z.object({
  hotelName: requiredLocalizedStringSchema("Hotel Name is required"),
  totalRooms: z.string().min(1, "Total Rooms is required"),
  subtitle: localizedStringSchema,
  cityLocation: z.string().min(1, "Location is required"),
  address: z.string().optional(),
  starRating: z.string().refine((val) => {
    const num = parseFloat(val);
    return !isNaN(num) && num >= 0 && num <= 5;
  }, "Star Rating must be a number between 0 and 5"),
  facilities: z.array(z.string()).default([]),
  description: localizedStringSchema,
  secondDescription: localizedStringSchema,
  
  // SEO
  metaTitle: localizedStringSchema,
  metaDescription: localizedStringSchema,
  metaKeywords: localizedStringSchema,
  slug: localizedStringSchema,
  
  // Pricing
  basePrice: z.string().optional(), // Now read-only derived from rooms
  vat: z.string().optional(),
  insurance: z.string().optional(),
  
  // Media
  photos: z
    .array(z.any())
    .refine(
      (photos) => {
        const hero = photos?.[0];
        const file = hero?.file;
        return file instanceof File || (typeof file === "string" && file.trim() !== "");
      },
      { message: "A hero/thumbnail image is required" }
    )
    .refine(
      (photos) => {
        const galleryCount = (photos ?? []).slice(1).filter((p: { file?: unknown }) => {
          const file = p?.file;
          return file instanceof File || (typeof file === "string" && (file as string).trim() !== "");
        }).length;
        return galleryCount >= 5;
      },
      { message: "At least 5 gallery images are required" }
    )
    .optional(),

  // Rooms
  rooms: z
    .array(roomSchema)
    .min(1, "At least one room is required")
    .default([]),
});

export type CreateHotelValues = z.infer<typeof createHotelSchema>;

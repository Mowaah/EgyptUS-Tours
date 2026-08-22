import { z } from "zod";
import { localizedStringSchema, requiredLocalizedStringSchema } from "@/components/dashboard/shared/i18n";

export const createVehicleSchema = z.object({
  vehicleName: requiredLocalizedStringSchema("Vehicle Name is required"),
  model: z.string().min(1, "Model Year is required"),
  category: z.string().min(1, "Category is required"),
  duration: z.string().optional(),
  passengerCapacity: z.string().min(1, "Passenger Capacity is required"),
  luggageCapacity: z.string().optional(),
  starRating: z.string().optional().refine((val) => {
    if (!val) return true;
    const num = parseFloat(val);
    return !isNaN(num) && num >= 0 && num <= 5;
  }, "Star Rating must be a number between 0 and 5"),
  features: z.object({
    en: z.array(z.string()).default([]),
    it: z.array(z.string()).default([]),
    es: z.array(z.string()).default([]),
  }),
  description: localizedStringSchema,

  // Pricing
  basePrice: z.string().min(1, "Base Price is required"),
  pricePerKm: z.string().min(1, "Price Per KM is required"),
  additionalServices: z.array(z.string()).default([]),

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
    ),

  // SEO
  seoTitle: localizedStringSchema,
  seoDescription: localizedStringSchema,
  seoKeywords: localizedStringSchema,
  seoSlug: localizedStringSchema,
});

export type CreateVehicleValues = z.infer<typeof createVehicleSchema>;

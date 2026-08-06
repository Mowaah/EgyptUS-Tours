import { z } from "zod";

export const createVehicleSchema = z.object({
  vehicleName: z.string().min(1, "Vehicle Name is required"),
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
  features: z.array(z.string()).default([]),
  description: z.string().optional(),

  // Pricing
  basePrice: z.string().min(1, "Base Price is required"),
  vat: z.string().min(1, "VAT is required"),
  insurance: z.string().min(1, "Insurance is required"),
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
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
  seoKeywords: z.string().optional(),
  seoSlug: z.string().optional(),
});

export type CreateVehicleValues = z.infer<typeof createVehicleSchema>;

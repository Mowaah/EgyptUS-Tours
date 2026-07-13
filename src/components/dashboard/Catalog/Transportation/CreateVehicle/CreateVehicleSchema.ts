import { z } from "zod";

export const createVehicleSchema = z.object({
  vehicleName: z.string().min(1, "Vehicle Name is required"),
  model: z.string().min(1, "Model is required"),
  category: z.string().min(1, "Category is required"),
  duration: z.string().optional(),
  passengerCapacity: z.string().min(1, "Passenger Capacity is required"),
  luggageCapacity: z.string().optional(),
  starRating: z.string().optional(),
  features: z.array(z.string()).default([]),
  description: z.string().optional(),

  // Pricing
  basePrice: z.string().optional(),
  vat: z.string().optional(),
  insurance: z.string().optional(),
  pricePerKm: z.string().optional(),
  additionalServices: z.array(z.string()).default([]),

  // Media
  photos: z.array(z.any()).optional(),

  // SEO
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
  seoKeywords: z.string().optional(),
  seoSlug: z.string().optional(),
});

export type CreateVehicleValues = z.infer<typeof createVehicleSchema>;

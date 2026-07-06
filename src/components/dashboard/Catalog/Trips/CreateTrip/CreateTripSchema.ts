import { z } from "zod";

export const createTripSchema = z.object({
  // Basic Information
  tripName: z.string({ message: "Trip Name is required" }).min(1, "Trip Name is required"),
  category: z.string({ message: "Category is required" }).min(1, "Category is required"),
  destinations: z.array(z.string()).min(1, "At least one destination is required"),
  duration: z.string({ message: "Duration is required" }).min(1, "Duration is required"),
  tourTypes: z.array(z.string()).min(1, "At least one tour type is required"),
  brochureFile: z.any().optional(),

  // Trip Content
  description: z.string().optional(),
  culturalValue: z.string().optional(),
  whoIsTripFor: z.string().optional(),
  // Inclusions Step
  inclusions: z.array(z.string()),
  exclusions: z.array(z.string()),
});

export type CreateTripValues = z.infer<typeof createTripSchema>;

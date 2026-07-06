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
  
  // Pricing Step
  pricing: z.object({
    privateTour: z.object({
      basePrice: z.string().optional(),
      seasons: z.array(
        z.object({
          dateRange: z.string().optional(),
          singleRoom: z.string().optional(),
          doubleRoom: z.string().optional(),
          tripleRoom: z.string().optional(),
        })
      ).optional(),
    }).optional(),
    groupTour: z.object({
      basePrice: z.string().optional(),
      seasons: z.array(
        z.object({
          dateRange: z.string().optional(),
          singleRoom: z.string().optional(),
          doubleRoom: z.string().optional(),
          tripleRoom: z.string().optional(),
        })
      ).optional(),
    }).optional(),
  }).optional(),

  // Itinerary Step
  itinerary: z.array(
    z.object({
      title: z.string().optional(),
      subtitle: z.string().optional(),
      description: z.string().optional(),
      highlights: z.array(z.string()).optional(),
      image: z.any().optional(),
    })
  ).optional(),

  // Dates & Availability Step
  datesAvailability: z.object({
    enabled: z.boolean().optional(),
    dates: z.array(
      z.object({
        dateRange: z.string().optional(),
        spots: z.string().optional(),
      })
    ).optional(),
  }).optional(),

  // SEO Step
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
  metaKeywords: z.string().optional(),
  slug: z.string().optional(),
});

export type CreateTripValues = z.infer<typeof createTripSchema>;

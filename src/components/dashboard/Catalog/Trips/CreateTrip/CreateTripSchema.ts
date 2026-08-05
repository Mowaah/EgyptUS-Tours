import { z } from "zod";

export const createTripSchema = z
  .object({
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
    pricing: z
      .object({
        privateTour: z
          .object({
            basePrice: z.string().optional(),
            seasons: z
              .array(
                z.object({
                  dateRange: z.string().optional(),
                  singleRoom: z.string().optional(),
                  doubleRoom: z.string().optional(),
                  tripleRoom: z.string().optional(),
                })
              )
              .optional(),
          })
          .optional(),
        groupTour: z
          .object({
            basePrice: z.string().optional(),
            seasons: z
              .array(
                z.object({
                  dateRange: z.string().optional(),
                  singleRoom: z.string().optional(),
                  doubleRoom: z.string().optional(),
                  tripleRoom: z.string().optional(),
                })
              )
              .optional(),
          })
          .optional(),
      })
      .optional(),

    // Itinerary Step
    itinerary: z
      .array(
        z.object({
          id: z.union([z.string(), z.number()]).optional(),
          title: z.string().optional(),
          subtitle: z.string().optional(),
          description: z.string().optional(),
          highlights: z.array(z.string()).optional(),
          image: z.any().optional(),
        })
      )
      .optional(),

    // Dates & Availability Step
    datesAvailability: z
      .object({
        enabled: z.boolean().optional(),
        dates: z
          .array(
            z.object({
              dateRange: z.string().optional(),
              spots: z.string().optional(),
            })
          )
          .optional(),
      })
      .optional(),

    // Hotels Step
    hotels: z.array(z.string()).min(1, "At least one hotel is required"),

    // Media Step
    photos: z
      .array(z.any())
      .refine(
        (photos) => {
          const hero = photos?.[0];
          const file = hero?.file;
          // Accept: a File object, or a non-empty URL string from the server
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

    // SEO Step
    metaTitle: z.string().optional(),
    metaDescription: z.string().optional(),
    metaKeywords: z.string().optional(),
    slug: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    // Validate Pricing based on selected tourTypes
    const isPrivate = data.tourTypes?.includes("private-tour");
    const isGroup = data.tourTypes?.includes("group-tour");

    if (isPrivate) {
      const basePrice = data.pricing?.privateTour?.basePrice;
      if (!basePrice || String(basePrice).trim() === "") {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["pricing", "privateTour", "basePrice"],
          message: "Private tour base price is required",
        });
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["pricing"],
          message: "Private tour base price is required",
        });
      }

      const seasons = data.pricing?.privateTour?.seasons || [];
      const validSeasons = seasons.filter(
        (s) => s.dateRange || s.singleRoom || s.doubleRoom || s.tripleRoom
      );
      if (validSeasons.length === 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["pricing", "privateTour", "seasons"],
          message: "Private tour season pricing is required",
        });
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["pricing"],
          message: "Private tour season pricing is required",
        });
      } else {
        seasons.forEach((season, idx) => {
          if (!season.singleRoom || !season.doubleRoom || !season.tripleRoom) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              path: ["pricing", "privateTour", "seasons", idx],
              message: "Private tour seasons need single, double, and triple room prices",
            });
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              path: ["pricing"],
              message: "Private tour seasons need single, double, and triple room prices",
            });
          }
        });
      }
    }

    if (isGroup) {
      const basePrice = data.pricing?.groupTour?.basePrice;
      if (!basePrice || String(basePrice).trim() === "") {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["pricing", "groupTour", "basePrice"],
          message: "Group tour base price is required",
        });
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["pricing"],
          message: "Group tour base price is required",
        });
      }

      const seasons = data.pricing?.groupTour?.seasons || [];
      const validSeasons = seasons.filter(
        (s) => s.dateRange || s.singleRoom || s.doubleRoom || s.tripleRoom
      );
      if (validSeasons.length === 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["pricing", "groupTour", "seasons"],
          message: "Group tour season pricing is required",
        });
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["pricing"],
          message: "Group tour season pricing is required",
        });
      } else {
        seasons.forEach((season, idx) => {
          if (!season.singleRoom || !season.doubleRoom || !season.tripleRoom) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              path: ["pricing", "groupTour", "seasons", idx],
              message: "Group tour seasons need single, double, and triple room prices",
            });
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              path: ["pricing"],
              message: "Group tour seasons need single, double, and triple room prices",
            });
          }
        });
      }
    }
  });

export type CreateTripValues = z.infer<typeof createTripSchema>;

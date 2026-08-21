import { z } from "zod";
import { localizedStringSchema, requiredLocalizedStringSchema } from "@/components/dashboard/shared/i18n";

function normalizeDateRangeKey(value: string): string {
  // Must have both start and end separated by " - "
  const dashIdx = value.indexOf(" - ");
  if (dashIdx === -1) return "";
  const startRaw = value.slice(0, dashIdx).trim();
  const endRaw = value.slice(dashIdx + 3).trim();
  // Incomplete range (end not picked yet)
  if (!startRaw || !endRaw) return "";

  const parseSingle = (s: string) => {
    // YYYY-MM-DD
    if (/^\d{4}-\d{2}-\d{2}$/.test(s)) return s;
    // MM/DD/YYYY
    const slashParts = s.split("/");
    if (slashParts.length === 3) {
      const [m, d, y] = slashParts.map(Number);
      if (!Number.isNaN(m) && !Number.isNaN(d) && !Number.isNaN(y)) {
        return `${y}-${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
      }
    }
    return "";
  };

  const start = parseSingle(startRaw);
  const end = parseSingle(endRaw);
  if (!start || !end) return "";
  return `${start}|${end}`;
}

export const createTripSchema = z
  .object({
    // Basic Information
    tripName: requiredLocalizedStringSchema("Trip Name is required"),
    category: z.string({ message: "Category is required" }).min(1, "Category is required"),
    destinations: z.array(z.string()).min(1, "At least one destination is required"),
    duration: z.string({ message: "Duration is required" }).min(1, "Duration is required"),
    tourTypes: z.array(z.string()).min(1, "At least one tour type is required"),
    starRating: z.string().optional().refine((val) => {
      if (!val) return true;
      const num = parseFloat(val);
      return !isNaN(num) && num >= 0 && num <= 5;
    }, "Star Rating must be a number between 0 and 5"),
    brochureFile: z.any().optional(),

    // Trip Content
    description: localizedStringSchema,
    culturalValue: localizedStringSchema,
    whoIsTripFor: localizedStringSchema,
    
    // Inclusions Step
    inclusions: z.array(localizedStringSchema),
    exclusions: z.array(localizedStringSchema),
    
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
          title: localizedStringSchema,
          subtitle: localizedStringSchema,
          description: localizedStringSchema,
          highlights: z.array(localizedStringSchema).optional(),
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
              id: z.union([z.string(), z.number()]).optional(),
              dateRange: z.string().optional(),
              spots: z.string().optional(),
            })
          )
          .optional(),
      })
      .superRefine((val, ctx) => {
        if (val?.enabled) {
          const validDates = (val.dates || []).filter(
            (d) => d.dateRange && d.dateRange.trim() !== ""
          );
          if (validDates.length === 0) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: "At least one departure date range is required when dates & availability is enabled",
              path: ["dates"],
            });
          }

          // Check for duplicate date ranges
          const seen = new Map<string, number>();
          (val.dates || []).forEach((item, index) => {
            const range = item.dateRange?.trim();
            if (range) {


              const key = normalizeDateRangeKey(range);
              if (key) {
                if (seen.has(key)) {
                  ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: "This date range has already been added.",
                    path: ["dates", index, "dateRange"],
                  });
                } else {
                  seen.set(key, index);
                }
              }
            }
          });
        }
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
    metaTitle: localizedStringSchema,
    metaDescription: localizedStringSchema,
    metaKeywords: localizedStringSchema,
    slug: localizedStringSchema,
  })
  .superRefine((data, ctx) => {
    // Validate Pricing based on selected tourTypes
    const isPrivate = data.tourTypes?.includes("private-tour");
    const isGroup = data.tourTypes?.includes("group-tour");

    const durationStr = data.duration || "";
    const durationDays = durationStr ? parseInt(durationStr.split('d')[0], 10) || 0 : 0;

    if (data.datesAvailability?.enabled && durationDays > 0) {
      (data.datesAvailability.dates || []).forEach((item, index) => {
        const range = item.dateRange?.trim();
        if (range) {
          const parts = range.split(" to ");
          if (parts.length === 2) {
            const start = new Date(parts[0]);
            const end = new Date(parts[1]);
            const diffTime = Math.abs(end.getTime() - start.getTime());
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // +1 to include both start and end days
            if (diffDays !== durationDays) {
              ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: `Date range must exactly match the trip duration (${durationDays} days)`,
                path: ["datesAvailability", "dates", index, "dateRange"],
              });
            }
          }
        }
      });
    }

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

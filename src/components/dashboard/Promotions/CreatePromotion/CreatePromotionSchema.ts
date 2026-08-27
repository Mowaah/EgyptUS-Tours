import { z } from "zod";

export const appliesToItemSchema = z.object({
  id: z.string(), // for mapping array keys
  category: z.string().min(1, "Trip Category is required"),
  specificTrip: z.array(z.string()).min(1, "Specific Trip is required"),
});

const localizedFieldsSchema = z.object({
  title: z.string().min(1, "Title is required"),
  shortDescription: z.string().min(1, "Short Description is required").max(300, "Maximum 300 characters"),
});

export const createPromotionSchema = z.object({
  discountValue: z.number().min(0, "Must be positive").max(100, "Cannot exceed 100"),
  appliesToType: z.enum(["trips", "hotels", "transportation"]),
  appliesToItems: z.array(appliesToItemSchema),
  isActive: z.boolean(),
  startDate: z.string().min(1, "Start Date is required"),
  endDate: z.string().min(1, "End Date is required"),
  translations: z.object({
    en: localizedFieldsSchema,
    it: localizedFieldsSchema,
    es: localizedFieldsSchema,
  }),
}).superRefine((data, ctx) => {
  if (data.startDate && data.endDate) {
    const start = new Date(data.startDate);
    const end = new Date(data.endDate);
    if (end < start) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "End Date cannot be before Start Date",
        path: ["endDate"],
      });
    }
  }
});

export type AppliesToItem = z.infer<typeof appliesToItemSchema>;
export type CreatePromotionValues = z.infer<typeof createPromotionSchema>;

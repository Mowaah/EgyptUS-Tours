import { z } from "zod";

export const roomSchema = z.object({
  category: z.string().min(1, "Category is required"),
  type: z.string().min(1, "Type is required"),
  view: z.string().optional(),
  pricePerNight: z.string().optional(),
  description: z.string().optional(),
  facilities: z.array(z.string()).default([]),
  photos: z.array(z.any()).default([]),
});

export const createHotelSchema = z.object({
  hotelName: z.string().min(1, "Hotel Name is required"),
  totalRooms: z.string().min(1, "Total Rooms is required"),
  subtitle: z.string().optional(),
  cityLocation: z.string().min(1, "Location is required"),
  starRating: z.string().min(1, "Star Rating is required"),
  facilities: z.array(z.string()).default([]),
  description: z.string().optional(),
  secondDescription: z.string().optional(),
  
  // Basic placeholders, will expand later
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
  seoKeywords: z.string().optional(),
  seoSlug: z.string().optional(),
  
  // Pricing
  basePrice: z.string().optional(),
  vat: z.string().optional(),
  insurance: z.string().optional(),
  
  // Rooms
  rooms: z.array(roomSchema).default([]),
});

export type CreateHotelValues = z.infer<typeof createHotelSchema>;

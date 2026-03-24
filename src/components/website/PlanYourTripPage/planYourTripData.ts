import type { PlanDestination, PlanStep } from "./planYourTripTypes";

export const DESTINATIONS: PlanDestination[] = [
  {
    id: "egypt",
    name: "Egypt",
    image:
      "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "dubai-1",
    name: "Dubai",
    image:
      "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "saudi-1",
    name: "Saudi Arabia",
    image:
      "https://images.unsplash.com/photo-1614071403589-1e5d37b04b2d?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "qatar-1",
    name: "Qatar",
    image:
      "https://images.unsplash.com/photo-1614003488101-4fe3b4a6f4f8?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "turkey-1",
    name: "Turkey",
    image:
      "https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "greece-1",
    name: "Greece",
    image:
      "https://images.unsplash.com/photo-1505735454785-337d7d3f7c2b?auto=format&fit=crop&w=1200&q=80",
  },
];

export const TRANSPORT_OPTIONS = [
  "Shared Transport",
  "Private Transport",
  "VIP Luxury Car",
  "Airport Transfer Only",
  "I don't need transport",
] as const;

export type HotelCategoryOption = {
  value: string;
  /** Star tier 3–5, or null for text-only rows */
  starCount: 3 | 4 | 5 | null;
};

export const HOTEL_CATEGORY_OPTIONS: HotelCategoryOption[] = [
  { value: "5.0", starCount: 5 },
  { value: "4.0", starCount: 4 },
  { value: "3.0", starCount: 3 },
  { value: "Luxury Boutique", starCount: null },
  { value: "I don't need hotel", starCount: null },
];

export const ROOM_TYPE_OPTIONS = [
  "Standard Room",
  "Nile View",
  "Suite",
  "I don't need hotel",
] as const;

export const EXPERIENCE_OPTIONS = [
  "Private Tour Guide",
  "Photographer",
  "Special Event during trip",
  "Nile Cruise",
  "Desert Safari",
] as const;

export const STEPS: Array<{ number: PlanStep; label: string }> = [
  { number: 1, label: "Destination" },
  { number: 2, label: "Traveler Information" },
  { number: 3, label: "Travel Preferences" },
];

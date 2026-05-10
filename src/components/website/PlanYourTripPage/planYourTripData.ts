import type { PlanDestination, PlanStep } from "./planYourTripTypes";

export const DESTINATIONS: PlanDestination[] = [
  {
    id: "egypt",
    name: "Egypt",
    image:
      "/images/planyourtrip/egypt.jpg",
  },
  {
    id: "spain",
    name: "Spain",
    image:
      "/images/planyourtrip/spain.jpg",
  },
  {
    id: "dubai",
    name: "Dubai",
    image:
      "/images/planyourtrip/dubai.jpg",
  },
  {
    id: "italy",
    name: "Italy",
    image:
      "/images/planyourtrip/italy.jpg",
  },
  {
    id: "brazil",
    name: "Brazil",
    image:
      "/images/planyourtrip/brazil.jpg",
  },
  {
    id: "greece",
    name: "Greece",
    image:
      "/images/planyourtrip/greece.jpg",
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

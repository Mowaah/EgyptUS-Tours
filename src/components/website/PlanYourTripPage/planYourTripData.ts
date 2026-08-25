import type { PlanStep } from "./planYourTripTypes";
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
  "Luxury Yacht",
  "Honeymoon Setup",
  "Romantic Dinner",
] as const;

export const TRIP_CATEGORY_OPTIONS = [
  "Honeymoon",
  "Multi-Country Tour",
  "Luxury Tour",
  "Desert Adventure",
  "Historical Tour",
] as const;

export const DURATION_OPTIONS = [
  "1-3 Days",
  "4-6 Days",
  "7-10 Days",
  "11-14 Days",
  "15+ Days",
  "Flexible",
] as const;

export const BUDGET_OPTIONS = [
  "£500 - £1,000",
  "£1,000 - £3,000",
  "£3,000 - £5,000",
  "£5,000+",
  "Flexible",
] as const;

export const ACTIVITIES_OPTIONS = [
  "Shopping",
  "Food Tours",
  "Diving",
  "Hiking",
  "Snorkeling",
  "Snorkeling & Diving",
] as const;

export const CONTACT_METHOD_OPTIONS = [
  "WhatsApp",
  "Email",
  "Phone Call",
] as const;

export const STEPS: Array<{ number: PlanStep; label: string }> = [
  { number: 1, label: "Destination" },
  { number: 2, label: "Traveler Information" },
  { number: 3, label: "Trip Details & Preferences" },
  { number: 4, label: "Review & Submit" },
];

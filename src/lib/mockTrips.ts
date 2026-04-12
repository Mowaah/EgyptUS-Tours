import { Trip } from "@/types";

export const mockTrips: Trip[] = Array.from({ length: 6 }, (_, i) => ({
  id: `trip-${i + 1}`,
  title: "Luxury 5 days Luxor and Aswan Nile Cruise",
  description:
    "Explore the wonders of ancient Egypt on our luxury Nile cruise. Visit the Valley of the Kings, Karnak Temple, and more in style.",
  image: "/images/home/hero-bg.jpg",
  location: "Luxor & Aswan",
  price: 2000,
  currency: "$",
  duration: { days: 8, nights: 7 },
  isFavorite: false,
}));

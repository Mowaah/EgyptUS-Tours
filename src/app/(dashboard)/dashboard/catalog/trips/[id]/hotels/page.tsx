import Image from "next/image";
import { IncludedHotelCard } from "@/components/shared";
import styles from "./page.module.scss";

// TODO: Replace with real API data
const HOTELS_DATA = [
  {
    name: "Steigenberger Nile Palace Luxor",
    location: "Luxor, Egypt",
    description: "Elegant 5-star hotel on the Nile with stunning temple views, outdoor pool, and rooftop terrace.",
    image: "/images/hotels/hotel1.jpg", // placeholder
    rating: 4.8,
    reviewCount: 2847,
    amenities: ["Free WIFI", "Pool", "Restaurant", "Spa"],
  },
  {
    name: "Steigenberger Nile Palace Luxor",
    location: "Luxor, Egypt",
    description: "Elegant 5-star hotel on the Nile with stunning temple views, outdoor pool, and rooftop terrace.",
    image: "/images/hotels/hotel3.jpg",
    rating: 4.8,
    reviewCount: 2847,
    amenities: ["Free WIFI", "Pool", "Restaurant", "Spa"],
  },
  {
    name: "Steigenberger Nile Palace Luxor",
    location: "Luxor, Egypt",
    description: "Elegant 5-star hotel on the Nile with stunning temple views, outdoor pool, and rooftop terrace.",
    image: "/images/hotels/hotel5.jpg",
    rating: 4.8,
    reviewCount: 2847,
    amenities: ["Free WIFI", "Pool", "Restaurant", "Spa"],
  },
  {
    name: "Steigenberger Nile Palace Luxor",
    location: "Luxor, Egypt",
    description: "Elegant 5-star hotel on the Nile with stunning temple views, outdoor pool, and rooftop terrace.",
    image: "/images/hotels/hotel2.jpg",
    rating: 4.8,
    reviewCount: 2847,
    amenities: ["Free WIFI", "Pool", "Restaurant", "Spa"],
  }
];

export default function TripHotelsPage() {
  return (
    <div className={styles.container}>
      <div className={styles.titleRow}>
        <div className={styles.iconWrap}>
          <Image src="/images/dashboard/catalog/trips/hotels.svg" alt="" width={20} height={20} />
        </div>
        <h2>Hotels Available for the Trip</h2>
      </div>

      <div className={styles.grid}>
        {HOTELS_DATA.map((hotel, i) => (
          <IncludedHotelCard key={i} hotel={hotel as any} />
        ))}
      </div>
    </div>
  );
}

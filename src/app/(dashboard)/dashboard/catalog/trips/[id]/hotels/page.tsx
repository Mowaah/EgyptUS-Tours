"use client";

import Image from "next/image";
import { IncludedHotelCard } from "@/components/shared";
import styles from "./page.module.scss";
import { useTripDetailContext } from "../layout";

export default function TripHotelsPage() {
  const { trip, loading } = useTripDetailContext();

  if (loading || !trip) {
    return <div style={{ padding: "24px" }}>Loading...</div>;
  }

  const hotelLinks: any[] = trip.hotel_links || [];
  const hotels = hotelLinks.map((link: any) => link.hotel).filter(Boolean);

  return (
    <div className={styles.container}>
      <div className={styles.titleRow}>
        <div className={styles.iconWrap}>
          <Image src="/images/dashboard/catalog/trips/hotels.svg" alt="" width={20} height={20} />
        </div>
        <h2>Hotels Available for the Trip</h2>
      </div>

      {hotels.length === 0 ? (
        <p style={{ color: "#9ca3af", fontSize: "14px", padding: "24px 0" }}>No hotels have been added to this trip.</p>
      ) : (
        <div className={styles.grid}>
          {hotels.map((hotel: any, i: number) => (
            <IncludedHotelCard key={hotel.hotel_id || i} hotel={{
              slug: hotel.slug || String(hotel.hotel_id || i),
              name: hotel.name,
              location: hotel.location_text,
              description: "",
              image: hotel.image_url,
              rating: parseFloat(hotel.rating_avg) || 0,
              reviewCount: hotel.review_count || 0,
              amenities: [],
            }} />
          ))}
        </div>
      )}
    </div>
  );
}

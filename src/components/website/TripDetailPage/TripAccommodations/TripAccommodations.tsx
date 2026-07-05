"use client";

import { useState } from "react";
import { Trip, TripHotel } from "@/types";
import { IncludedHotelCard } from "@/components/shared";
import HotelModal from "./HotelModal";
import styles from "./TripAccommodations.module.scss";

interface TripAccommodationsProps {
  trip: Trip;
}

const getAmenityIcon = (amenity: string) => {
  const a = amenity.toLowerCase();
  if (a.includes("wifi")) return "/images/accommodation/wifi.svg";
  if (a.includes("pool")) return "/images/accommodation/pool.svg";
  if (a.includes("beach access")) return "/images/accommodation/pool.svg";
  if (a.includes("airport transfer")) return "/images/accommodation/spa.svg";
  if (a.includes("restaurant") || a.includes("dining")) return "/images/accommodation/restaurant.svg";
  if (a.includes("spa")) return "/images/accommodation/spa.svg";
  if (a.includes("gym")) return "/images/accommodation/gym.svg";
  if (a.includes("bar")) return "/images/accommodation/bar.svg";
  return null;
};

export default function TripAccommodations({ trip }: TripAccommodationsProps) {
  const hotels = trip.hotels ?? [];
  const [selectedHotel, setSelectedHotel] = useState<TripHotel | null>(null);

  if (!hotels.length) return null;

  return (
    <section id="luxury-accommodations" className={styles.section}>
      <div className={styles.header}>
        <h2 className={styles.heading}>Your Luxury Accommodations</h2>
        <p className={styles.subtitle}>
          Experience Egyptian hospitality at its finest with our carefully selected 5-star hotels along the Nile
        </p>
      </div>

      <div className={styles.grid}>
        {hotels.map((hotel, i) => (
          <IncludedHotelCard 
            key={i} 
            hotel={hotel} 
            onClick={() => setSelectedHotel(hotel)} 
          />
        ))}
      </div>

      {selectedHotel && (
        <HotelModal hotel={selectedHotel} onClose={() => setSelectedHotel(null)} />
      )}
    </section>
  );
}

"use client";

import { useState } from "react";
import Image from "next/image";
import { Trip, TripHotel } from "@/types";
import styles from "./TripAccommodations.module.scss";
import HotelModal from "./HotelModal";
import { RatingBadge } from "@/components/shared";

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
          <article key={i} className={styles.card} onClick={() => setSelectedHotel(hotel)} style={{ cursor: "pointer" }}>
            <div className={styles.imageWrap}>
              <Image
                src={hotel.image}
                alt={hotel.name}
                fill
                sizes="400px"
                className={styles.image}
              />
              <span className={styles.badge}>✓ INCLUDED</span>
              <RatingBadge
                rating={hotel.rating}
                reviews={hotel.reviewCount}
                size="sm"
                className={styles.ratingBadge}
              />
            </div>

            <div className={styles.content}>
              <div className={styles.info}>
                <h3 className={styles.name}>{hotel.name}</h3>
                <p className={styles.location}>
                  <Image src="/images/location.svg" alt="" width={14} height={14} />
                  {hotel.location}
                </p>
              </div>
              <p className={styles.description}>{hotel.description}</p>
              <div className={styles.amenities}>
                {hotel.amenities.map((a, ai) => {
                  const icon = getAmenityIcon(a);
                  return (
                    <span key={ai} className={styles.amenity}>
                      {icon && <Image src={icon} alt="" width={16} height={16} />}
                      {a}
                    </span>
                  );
                })}
              </div>
            </div>
          </article>
        ))}
      </div>

      {selectedHotel && (
        <HotelModal hotel={selectedHotel} onClose={() => setSelectedHotel(null)} />
      )}
    </section>
  );
}

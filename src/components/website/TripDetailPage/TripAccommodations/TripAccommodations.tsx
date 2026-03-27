import Image from "next/image";
import { Trip } from "@/types";
import styles from "./TripAccommodations.module.scss";

interface TripAccommodationsProps {
  trip: Trip;
}

export default function TripAccommodations({ trip }: TripAccommodationsProps) {
  const hotels = trip.hotels ?? [];
  if (!hotels.length) return null;

  return (
    <section id="vip-experiences" className={styles.section}>
      <div className={styles.header}>
        <h2 className={styles.heading}>Your Luxury Accommodations</h2>
        <p className={styles.subtitle}>
          Experience Egyptian hospitality at its finest with our carefully selected 5-star hotels along the Nile
        </p>
      </div>

      <div className={styles.grid}>
        {hotels.map((hotel, i) => (
          <article key={i} className={styles.card}>
            <div className={styles.imageWrap}>
              <Image
                src={hotel.image}
                alt={hotel.name}
                fill
                sizes="400px"
                className={styles.image}
              />
              <span className={styles.badge}>✓ INCLUDED</span>
              <div className={styles.ratingBadge}>
                <svg width="14" height="14" viewBox="0 0 20 20" fill="#FF6600">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <span>{hotel.rating}</span>
                <span className={styles.reviewCount}>({hotel.reviewCount.toLocaleString()})</span>
              </div>
            </div>

            <div className={styles.content}>
              <h3 className={styles.name}>{hotel.name}</h3>
              <p className={styles.location}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 0 1 0-5 2.5 2.5 0 0 1 0 5z" />
                </svg>
                {hotel.location}
              </p>
              <p className={styles.description}>{hotel.description}</p>
              <div className={styles.amenities}>
                {hotel.amenities.map((a, ai) => (
                  <span key={ai} className={styles.amenity}>{a}</span>
                ))}
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

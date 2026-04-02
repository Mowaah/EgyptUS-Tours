import Image from "next/image";
import { Trip } from "@/types";
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
                <svg width="14" height="14" viewBox="0 0 20 20" fill="#FFA600">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <span>{hotel.rating}</span>
                <span className={styles.reviewCount}>({hotel.reviewCount.toLocaleString()})</span>
              </div>
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
    </section>
  );
}

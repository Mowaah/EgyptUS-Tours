import Image from "next/image";
import { Hotel } from "@/types";
import Button from "../Button/Button";
import { StarRating } from "@/components/shared";
import styles from "./HotelCard.module.scss";

interface HotelCardProps {
  hotel: Hotel;
}

export default function HotelCard({ hotel }: HotelCardProps) {
  return (
    <div className={styles.card}>
      <div className={styles.imageWrapper}>
        <Image
          src={hotel.image}
          alt={hotel.name}
          fill
          sizes="(max-width: 768px) 100vw, 320px"
          className={styles.image}
        />
        <div className={styles.overlay}>
          <h3 className={styles.name}>{hotel.name}</h3>
          <span className={styles.location}>{hotel.location}</span>
        </div>
      </div>

      <div className={styles.content}>
        <div className={styles.ratingRow}>
          <span className={styles.starLabel}>
            {hotel.stars}-Star Luxury Hotel
          </span>
          <StarRating filled={hotel.stars} value={hotel.rating} className={styles.starRating} />
        </div>

        <div className={styles.stats}>
          <div className={styles.stat}>
            <span className={styles.statValue}>{hotel.rooms}</span>
            <span className={styles.statLabel}>Rooms</span>
          </div>
          <div className={styles.stat}>
            <span className={styles.statValue}>${hotel.pricePerNight}</span>
            <span className={styles.statLabel}>/night</span>
          </div>
          <div className={styles.stat}>
            <span className={styles.statValue}>{hotel.reviews}</span>
            <span className={styles.statLabel}>Reviews</span>
          </div>
        </div>

        <div className={styles.separator} />

        <div className={styles.footer}>
          <div className={styles.price}>
            <span className={styles.priceLabel}>Starting from</span>
            <span className={styles.priceValue}>
              ${hotel.pricePerNight}
              <small>/night</small>
            </span>
          </div>
          <Button variant="primary" size="sm">
            Book Now
          </Button>
        </div>
      </div>
    </div>
  );
}

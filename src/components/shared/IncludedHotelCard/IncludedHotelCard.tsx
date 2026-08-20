import Image from "next/image";
import { RatingBadge } from "@/components/shared";
import { TripHotel } from "@/types";
import styles from "./IncludedHotelCard.module.scss";

interface IncludedHotelCardProps {
  hotel: TripHotel;
  selected?: boolean;
  onClick?: () => void;
}

export default function IncludedHotelCard({ hotel, selected, onClick }: IncludedHotelCardProps) {
  const imageSrc = hotel.image || "/images/hotels/hotel1.jpg";

  return (
    <article 
      className={`${styles.card} ${selected ? styles.selected : ""}`} 
      onClick={onClick} 
      style={onClick ? { cursor: "pointer" } : undefined}
    >
      <div className={styles.imageWrap}>
        <div style={{ width: '100%', height: '100%', background: '#E2E8F0', display: 'block', position: 'relative' }}>
          <Image
            src={imageSrc}
            alt={hotel.name}
            fill
            sizes="400px"
            className={styles.image}
          />
        </div>
        {selected && <span className={styles.badge}>✓ INCLUDED</span>}
        <RatingBadge
          rating={hotel.rating}
          size="sm"
          className={styles.ratingBadge}
        />
      </div>

      <div className={styles.content}>
        <div className={styles.info}>
          <h3 className={styles.name}>{hotel.name}</h3>
          <p className={styles.location}>
            <Image src="/images/location-blue-filled.svg" alt="" width={14} height={14} />
            {hotel.location}
          </p>
        </div>
        
        <p className={styles.description}>{hotel.description}</p>
        
        <div className={styles.amenities}>
          {hotel.amenities.map((amenity, ai) => (
            <span key={ai} className={styles.amenity}>
              <div className={styles.checkIcon}>
                <Image src="/images/check-blue.svg" alt="" width={10} height={10} />
              </div>
              {amenity}
            </span>
          ))}
        </div>
      </div>
    </article>
  );
}

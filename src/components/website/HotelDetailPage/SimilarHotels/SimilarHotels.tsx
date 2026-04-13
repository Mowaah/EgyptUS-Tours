import { HotelCard, Button } from "@/components/shared";
import Image from "next/image";
import { Hotel } from "@/types";
import styles from "./SimilarHotels.module.scss";

interface SimilarHotelsProps {
  hotel: Hotel;
}

// Mocking similar hotels
const SIMILAR_HOTELS: Hotel[] = Array(4).fill({
  id: "similar-hotel-mock",
  name: "Pyramids View Luxury Hotel",
  location: "Giza",
  image: "/images/hotels/hotel1.jpg",
  stars: 5,
  rating: 4.2,
  rooms: 245,
  pricePerNight: 180,
  reviews: 1847,
} as Hotel);

export default function SimilarHotels({ hotel }: SimilarHotelsProps) {
  return (
    <section id="similar-hotels" className={styles.section}>
      <div className={styles.header}>
        <div className={styles.headerText}>
          <h2 className={styles.heading}>Similar Hotels</h2>
          <p className={styles.subtitle}>
            Love this style? Discover our handpicked selection of similar hotels that share the same vibe, luxury standards, and prime location to ensure you find your perfect match.
          </p>
        </div>
        <Button
          variant="primary"
          size="md"
          icon={
            <Image
              src="/images/arrows/arrow-right.svg"
              alt=""
              width={24}
              height={24}
            />
          }
        >
          Explore More
        </Button>
      </div>

      <div className={styles.grid}>
        {SIMILAR_HOTELS.map((h, i) => (
          <HotelCard key={i} hotel={h} imageHeight={225} />
        ))}
      </div>
    </section>
  );
}

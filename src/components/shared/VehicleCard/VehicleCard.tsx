import Image from "next/image";
import Link from "next/link";
import Button from "../Button/Button";
import styles from "./VehicleCard.module.scss";

export interface Vehicle {
  id: string;
  title: string;
  description: string;
  image: string;
  passengers: number;
  luggage: number;
  durationHours: string;
  features: string[]; // e.g. ["WIFI", "Water Bottles", "Air Conditioning"]
  rating: number;
  reviews: number;
  price: string;
}

interface VehicleCardProps {
  vehicle: Vehicle;
}

export default function VehicleCard({ vehicle }: VehicleCardProps) {
  return (
    <div className={styles.card}>
      <div className={styles.imageArea}>
        <Image
          src={vehicle.image}
          alt={vehicle.title}
          fill
          className={styles.image}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>

      <div className={styles.content}>
        <div className={styles.header}>
          <div className={styles.titleWrapper}>
            <div className={styles.titleRow}>
              <h3 className={styles.title}>{vehicle.title}</h3>
              <div className={styles.badge}>
                <Image src="/images/profile2.svg" alt="" width={12} height={12} />
                <span>1-{vehicle.passengers}</span>
              </div>
            </div>
            <p className={styles.description}>{vehicle.description}</p>
          </div>
          <div className={styles.rating}>
            <Image src="/images/star-yellow.svg" alt="" width={10} height={10} />
            <span>{vehicle.rating}</span>
            <span className={styles.reviews}>({vehicle.reviews})</span>
          </div>
        </div>

        <div className={styles.divider} />

        <div className={styles.specs}>
          <div className={styles.specItem}>
            <span className={styles.specLabel}>Passengers</span>
            <span className={styles.specValue}>{vehicle.passengers} seats</span>
          </div>
          <div className={styles.specItem}>
            <span className={styles.specLabel}>Luggage</span>
            <span className={styles.specValue}>{vehicle.luggage} bags</span>
          </div>
          <div className={styles.specItem}>
            <span className={styles.specLabel}>Duration</span>
            <span className={styles.specValue}>{vehicle.durationHours} hours</span>
          </div>
        </div>

        <div className={styles.features}>
          {vehicle.features.map((feature, idx) => (
            <div key={idx} className={styles.featureTag}>
              <Image src="/images/summary/checkmark-green.svg" alt="" width={14} height={14} />
              <span>{feature}</span>
            </div>
          ))}
        </div>

        <div className={styles.footerWrapper}>
          <div className={styles.footer}>
            <div className={styles.priceCol}>
              <span className={styles.priceLabel}>Starting from</span>
              <span className={styles.priceValue}>{vehicle.price}</span>
            </div>
            {/* Defaulting to a placeholder booking action for now */}
            <Button variant="primary" href={`/transportation/book/${vehicle.id}`} className={styles.bookBtn}>
              Book Now
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

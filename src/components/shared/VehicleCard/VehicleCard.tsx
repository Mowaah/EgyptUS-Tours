import Image from "next/image";
import Link from "next/link";
import Button from "../Button/Button";
import styles from "./VehicleCard.module.scss";

export interface Vehicle {
  id: string;
  title: string;
  type?: string;
  description?: string;
  image: string;
  passengers: number;
  luggage: string;
  durationHours?: string;
  features?: string[]; // e.g. ["WIFI", "Water Bottles", "Air Conditioning"]
  rating: number;
  reviews: number;
  price: string;
}

interface VehicleCardProps {
  vehicle: Vehicle;
  view?: "grid" | "list";
}
export default function VehicleCard({ vehicle, view = "grid" }: VehicleCardProps) {
  const isList = view === "list";
  const vehicleDetailsHref = `/transportation/${vehicle.id}`;

  return (
    <div className={`${styles.card} ${isList ? styles.listCard : ""}`}>
      <Link href={vehicleDetailsHref} className={`${styles.imageArea} ${isList ? styles.listImageArea : ""}`}>
        <Image
          src={vehicle.image || "/images/sedan.png"}
          alt={vehicle.title || "Vehicle Image"}
          fill
          className={styles.image}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </Link>

      <div className={`${styles.content} ${isList ? styles.listContent : ""}`}>
        <Link href={vehicleDetailsHref} className={`${styles.header} ${isList ? styles.listHeader : ""}`}>
          <div className={styles.titleWrapper}>
            <div className={styles.titleRow}>
              <h3 className={styles.title}>{vehicle.title}</h3>
              <div className={styles.badge}>
                <Image src="/images/profile2-orange.svg" alt="" width={12} height={12} />
                <span>1-{vehicle.passengers}</span>
              </div>
            </div>
            {vehicle.description && <p className={styles.description}>{vehicle.description}</p>}
          </div>
          <div className={`${styles.rating} ${isList ? styles.listRating : ""}`}>
            <Image src="/images/star-yellow3.svg" alt="" width={12} height={12} />
            <span>{vehicle.rating}</span>
            <span className={styles.reviews}>({vehicle.reviews})</span>
          </div>
        </Link>


        <div className={`${styles.specs} ${isList ? styles.listSpecs : ""}`}>
          <div className={styles.specItem}>
            <span className={styles.specLabel}>Passengers</span>
            <span className={styles.specValue}>{vehicle.passengers} seats</span>
          </div>
          <div className={styles.specItem}>
            <span className={styles.specLabel}>Luggage</span>
            <span className={styles.specValue}>{vehicle.luggage}</span>
          </div>
          {vehicle.durationHours && (
            <div className={styles.specItem}>
              <span className={styles.specLabel}>Duration</span>
              <span className={styles.specValue}>{vehicle.durationHours} hours</span>
            </div>
          )}
        </div>

        <div className={styles.features}>
          {(vehicle.features || []).map((feature, idx) => (
            <div key={idx} className={styles.featureTag}>
              <Image src="/images/summary/checkmark-green.svg" alt="" width={14} height={14} />
              <span>{feature}</span>
            </div>
          ))}
        </div>

        <div className={`${styles.footerWrapper} ${isList ? styles.listFooterWrapper : ""}`}>
          <div className={styles.footer}>
            <div className={styles.priceCol}>
              <span className={styles.priceLabel}>Total Price</span>
              <span className={styles.priceValue}>{vehicle.price}</span>
            </div>
            {/* Defaulting to a placeholder booking action for now */}
            <Button variant="primary" size="sm" href={`/transportation/book/${vehicle.id}`}>
              Book Now
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

import Image from "next/image";
import styles from "./ViewTransportation.module.scss";

interface TransportationPriceDetailsProps {
  details: any;
  overview: any;
  vehicleCard: any;
}

export default function TransportationPriceDetails({ details, overview, vehicleCard }: TransportationPriceDetailsProps) {
  const items = details?.items || [];
  const title = vehicleCard?.name ? `${vehicleCard.vehicle_type} - ${vehicleCard.name}` : "Booking Details";

  return (
    <div className={`${styles.card} ${styles.firstRowCard}`}>
      <div className={styles.cardTitle}>
        <div className={styles.titleLeft}>
          <div className={styles.titleIcon}>
            <Image src="/images/dashboard/booking/booking.svg" alt="" width={20} height={20} aria-hidden />
          </div>
          Booking Details
        </div>
      </div>

      <div className={styles.priceDetailsWrapper}>
        <div className={styles.priceImageContainer}>
          <Image 
            src={vehicleCard?.image_url || "/images/car1.jpg"} 
            alt={title} 
            fill
            style={{ objectFit: 'cover' }}
          />
        </div>

        <div className={styles.priceListContainer}>
          <div className={styles.priceTitleRow}>
            <span className={styles.priceTitle}>
              {title}
            </span>
            <button type="button" className={styles.exportButton}>
              <Image src="/images/dashboard/booking/trips/view/export.svg" alt="export" width={20} height={20} />
            </button>
          </div>

          <div className={styles.priceList}>
            {items.map((item: any, idx: number) => (
              <div key={idx} className={styles.priceListItem}>
                <span className={styles.priceItemName}>{item.quantity ? `${item.quantity} × ` : ""}{item.name}</span>
                <span className={styles.priceItemCost}>${item.price || item.amount}</span>
              </div>
            ))}
            {items.length === 0 && (
              <div className={styles.priceListItem}>
                <span className={styles.priceItemName}>Base Price</span>
                <span className={styles.priceItemCost}>${overview?.total || "0"}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

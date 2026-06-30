import Image from "next/image";
import styles from "./ViewTransportation.module.scss";

interface TransportationPriceDetailsProps {
  transportation: any;
}

export default function TransportationPriceDetails({ transportation }: TransportationPriceDetailsProps) {
  return (
    <div className={`${styles.card} ${styles.firstRowCard}`}>
      <div className={styles.cardTitle}>
        <div className={styles.titleLeft}>
          <div className={styles.titleIcon}>
            <Image src="/images/dashboard/booking/booking.svg" alt="" width={20} height={20} aria-hidden />
          </div>
          Booking #{transportation.id}
        </div>
      </div>

      <div className={styles.priceDetailsWrapper}>
        <div className={styles.priceImageContainer}>
          <Image 
            src="/images/car1.jpg" 
            alt={transportation.vehicleClass} 
            fill
            style={{ objectFit: 'cover' }}
          />
        </div>

        <div className={styles.priceListContainer}>
          <div className={styles.priceTitleRow}>
            <span className={styles.priceTitle}>
              Premium Sedan - {transportation.vehicleClass}
            </span>
            <button type="button" className={styles.exportButton}>
              <Image src="/images/dashboard/booking/trips/view/export.svg" alt="export" width={20} height={20} />
            </button>
          </div>

          <div className={styles.priceList}>
            <div className={styles.priceListItem}>
              <span className={styles.priceItemName}>Base Price</span>
              <span className={styles.priceItemCost}>$85.42</span>
            </div>

            <div className={styles.priceListItem}>
              <span className={styles.priceItemName}>Service Fee</span>
              <span className={styles.priceItemCost}>$5.00</span>
            </div>

            <div className={styles.priceListItem}>
              <span className={styles.priceItemName}>Insurance</span>
              <span className={styles.priceItemCost}>$10.00</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

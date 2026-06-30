import React from "react";
import Image from "next/image";
import styles from "./ViewTrip.module.scss";

export default function PriceDetails() {
  return (
    <div className={`${styles.card} ${styles.firstRowCard}`}>
      <div className={styles.cardTitle}>
        <div className={styles.titleLeft}>
          <div className={styles.titleIcon}>
            <Image
              src="/images/dashboard/booking/trips/view/price.svg"
              alt=""
              width={20}
              height={20}
              aria-hidden
            />
          </div>
          Price Details
        </div>
      </div>

      <div className={styles.priceDetailsWrapper}>
        <div className={styles.priceImageContainer}>
          <Image 
            src="/images/pyramids2.jpg" // placeholder image
            alt="Luxor & Aswan Nile Cruise Experience"
            fill
            style={{ objectFit: 'cover' }}
          />
        </div>

        <div className={styles.priceListContainer}>
          <div className={styles.priceTitleRow}>
            <span className={styles.priceTitle}>
              Luxor & Aswan Nile Cruise Experience
            </span>
            <button type="button" className={styles.exportButton}>
              <Image src="/images/dashboard/booking/trips/view/export.svg" alt="export" width={20} height={20} />
            </button>
          </div>

          <div className={styles.priceList}>
            <div className={styles.priceListItem}>
              <span className={styles.priceItemName}>1 × Double Room - Sea View</span>
              <span className={styles.priceItemCost}>$250.00</span>
            </div>
            
            <div className={styles.priceListItem}>
              <span className={styles.priceItemName}>1 × Double Room - Pool View</span>
              <span className={styles.priceItemCost}>$250.00</span>
            </div>

            <div className={styles.priceListItem}>
              <span className={styles.priceItemName}>1 × Triple Room - Garden View</span>
              <span className={styles.priceItemCost}>$500.00</span>
            </div>

            <div className={styles.priceListItem}>
              <span className={styles.priceItemName}>1 × Triple Room - Garden View</span>
              <span className={styles.priceItemCost}>$500.00</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

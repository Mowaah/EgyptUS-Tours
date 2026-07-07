"use client";

import styles from "./page.module.scss";
import Image from "next/image";

export default function HotelPricingPage() {
  return (
    <div className={styles.pricingLayout}>
      <div className={styles.titleRow}>
        <div className={styles.iconWrap}>
          <Image src="/images/dashboard/catalog/trips/pricing.svg" alt="" width={20} height={20} />
        </div>
        <h2>General Pricing</h2>
      </div>

      <div className={styles.pricingContent}>
        <div className={styles.pricingRow}>
          <div className={styles.priceCard}>
            <span className={styles.label}>Base Price / Person</span>
            <span className={styles.value}>$350</span>
          </div>
          <div className={styles.priceCard}>
            <span className={styles.label}>VAT (14%)</span>
            <span className={styles.value}>$50</span>
          </div>
        </div>

        <div className={styles.totalCard}>
          <span className={styles.label}>Total Price Person</span>
          <span className={styles.value}>400$</span>
        </div>
      </div>
    </div>
  );
}

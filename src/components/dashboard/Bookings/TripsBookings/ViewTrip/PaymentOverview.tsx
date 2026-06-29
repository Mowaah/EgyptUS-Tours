"use client";

import React from "react";
import Image from "next/image";
import styles from "./ViewTrip.module.scss";

export default function PaymentOverview() {
  return (
    <div className={styles.card}>
      <div className={styles.cardTitle}>
        <div className={styles.titleLeft}>
          <div className={styles.titleIcon}>
            <Image
              src="/images/dashboard/booking/trips/view/payment.svg"
              alt=""
              width={20}
              height={20}
              aria-hidden
            />
          </div>
          Payment Overview
        </div>
      </div>

      <div className={styles.infoList}>
        <div className={styles.infoRow}>
          <span className={styles.infoLabel}>Total Package</span>
          <span className={`${styles.infoValue} ${styles.paymentTotal}`}>$2,500</span>
        </div>
        
        <div className={styles.infoRow}>
          <span className={styles.infoLabel}>Deposit (30%)</span>
          <span className={`${styles.infoValue} ${styles.paymentAmount}`}>$750</span>
        </div>

        <div className={styles.infoRow}>
          <span className={styles.infoLabel}>Remaining (70%)</span>
          <span className={`${styles.infoValue} ${styles.paymentAmount}`}>$1,750</span>
        </div>
      </div>
    </div>
  );
}

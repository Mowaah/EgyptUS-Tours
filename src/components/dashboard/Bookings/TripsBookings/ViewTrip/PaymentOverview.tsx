import React from "react";
import Image from "next/image";
import styles from "./ViewTrip.module.scss";

interface PaymentOverviewProps {
  overview: any;
}

export default function PaymentOverview({ overview }: PaymentOverviewProps) {
  return (
    <div className={styles.card}>
      <div className={styles.cardTitle}>
        <div className={styles.titleLeft}>
          <div className={styles.titleIcon}>
            <Image src="/images/dashboard/booking/trips/view/payment.svg" alt="" width={20} height={20} aria-hidden />
          </div>
          Payment Overview
        </div>
      </div>

      <div className={styles.infoList}>
        <div className={styles.infoRow}>
          <span className={styles.infoLabel}>Total Package</span>
          <span className={`${styles.infoValue} ${styles.paymentTotal}`}>${overview?.total || "0"}</span>
        </div>
        
        <div className={styles.infoRow}>
          <span className={styles.infoLabel}>Paid Amount</span>
          <span className={`${styles.infoValue} ${styles.paymentAmount}`}>${overview?.total_paid || "0"}</span>
        </div>

        <div className={styles.infoRow}>
          <span className={styles.infoLabel}>Remaining Balance</span>
          <span className={`${styles.infoValue} ${styles.paymentAmount}`}>${overview?.total_due || "0"}</span>
        </div>
        
        {overview?.refunded_amount > 0 && (
          <div className={styles.infoRow}>
            <span className={styles.infoLabel}>Refunded Amount</span>
            <span className={`${styles.infoValue} ${styles.paymentAmount}`} style={{ color: "#E02424" }}>${overview.refunded_amount}</span>
          </div>
        )}
      </div>
    </div>
  );
}

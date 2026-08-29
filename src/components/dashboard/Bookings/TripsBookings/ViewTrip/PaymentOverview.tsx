import React from "react";
import Image from "next/image";
import styles from "./ViewTrip.module.scss";

interface PaymentOverviewProps {
  overview: any;
  payload?: any;
}

export default function PaymentOverview({ overview, payload }: PaymentOverviewProps) {
  let total = Number(overview?.total || 0);
  let totalPaid = Number(overview?.total_paid || 0);
  let totalDue = Number(overview?.total_due || 0);
  const refunded = Number(overview?.refunded_amount || 0);

  if (total === 0 && payload) {
    const pTotal = payload.total_price || payload.total_amount;
    let calcTotal = Number(pTotal || 0);
    
    if (calcTotal === 0 && payload.price_details) {
      const items = payload.price_details.items || payload.price_details.line_items || [];
      const sum = items.reduce((acc: number, item: any) => acc + Number(item.price || item.amount || item.line_total || 0), 0);
      calcTotal = sum;
    }

    if (calcTotal > 0) {
      total = calcTotal;
      const isPaid = payload.remaining_payment_status === "paid" || payload.payment_status === "paid";
      const isPartiallyPaid = payload.remaining_payment_status === "partially_paid" || payload.payment_status === "partially_paid";
      
      let paid = Number(payload.amount_paid || payload.paid_amount || payload.total_paid || 0);
      if (isPaid) {
        paid = calcTotal;
      } else if (paid === 0 && isPartiallyPaid) {
        paid = calcTotal * 0.3;
      } else if (paid === 0 && payload?.payment_summary?.paid_amount) {
        paid = Number(payload?.payment_summary?.paid_amount);
      }
      
      totalPaid = paid;
      totalDue = calcTotal - paid;
    }
    // Also use payment_summary if total wasn't 0 but totalPaid is 0
    if (totalPaid === 0 && payload?.payment_summary?.paid_amount) {
      totalPaid = Number(payload?.payment_summary?.paid_amount);
      totalDue = total - totalPaid;
    }
  }

  // Final fallback: if totalPaid is still 0, but we have a payments array, sum it up
  if (totalPaid === 0 && payload?.payments && Array.isArray(payload.payments)) {
    const sum = payload.payments.reduce((acc: number, p: any) => acc + Number(p.amount || 0), 0);
    if (sum > 0) {
      totalPaid = sum;
      totalDue = total - sum;
    }
  }

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
          <span className={`${styles.infoValue} ${styles.paymentTotal}`}>${total}</span>
        </div>
        
        <div className={styles.infoRow}>
          <span className={styles.infoLabel}>Paid Amount</span>
          <span className={`${styles.infoValue} ${styles.paymentAmount}`}>${totalPaid}</span>
        </div>

        <div className={styles.infoRow}>
          <span className={styles.infoLabel}>Remaining Balance</span>
          <span className={`${styles.infoValue} ${styles.paymentAmount}`}>${totalDue}</span>
        </div>
        
        {refunded > 0 && (
          <div className={styles.infoRow}>
            <span className={styles.infoLabel}>Refunded Amount</span>
            <span className={`${styles.infoValue} ${styles.paymentAmount}`} style={{ color: "#E02424" }}>${refunded}</span>
          </div>
        )}
      </div>
    </div>
  );
}

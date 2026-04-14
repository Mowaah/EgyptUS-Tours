"use client";

import React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/shared';
import styles from './BookingWidget.module.scss';

interface BookingWidgetProps {
  vehicleId: string;
}

export default function BookingWidget({ vehicleId }: BookingWidgetProps) {
  const router = useRouter();

  const handleBook = () => {
    router.push(`/transportation/${vehicleId}/book`);
  };
  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <h3 className={styles.cardTitle}>Book This Vehicle</h3>
        <p className={styles.cardDesc}>Customize your journey across Egypt with ease</p>
      </div>

      <div className={styles.divider} />

      <div className={styles.rowsSection}>
        <div className={styles.row}>
          <span className={styles.label}>Base Price</span>
          <span className={styles.value}>$85.42</span>
        </div>
        <div className={styles.row}>
          <span className={styles.label}>Service Fee</span>
          <span className={styles.value}>$10.00</span>
        </div>
        <div className={styles.row}>
          <span className={styles.label}>Insurance</span>
          <span className={styles.value}>$5.00</span>
        </div>
      </div>

      <div className={styles.totalContainer}>
        <div className={styles.totalBox}>
          <div className={styles.totalLabelWrap}>
            <span className={styles.totalLabel}>Start From</span>
            <span className={styles.perDay}>Per Day</span>
          </div>
          <span className={styles.totalPrice}>$1299</span>
        </div>
      </div>

      <div className={styles.footer}>
        <Button
          variant="secondary"
          fullWidth
          className={styles.bookBtn}
          icon={<Image src="/images/money-send.svg" alt="" width={20} height={20} />}
          iconPosition="right"
          onClick={handleBook}
        >
          Book Now
        </Button>
      </div>
    </div>
  );
}

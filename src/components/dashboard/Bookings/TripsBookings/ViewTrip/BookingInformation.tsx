"use client";

import React from "react";
import Image from "next/image";
import styles from "./ViewTrip.module.scss";

export default function BookingInformation() {
  return (
    <div className={styles.card}>
      <div className={styles.cardTitle}>
        <div className={styles.titleLeft}>
          <div className={styles.titleIcon}>
            <Image
              src="/images/dashboard/booking/trips/view/booking.svg"
              alt=""
              width={20}
              height={20}
              aria-hidden
            />
          </div>
          Booking Information
        </div>
      </div>

      <div className={styles.bookingInfoWrapper}>
        <div className={styles.bookingInfoBox}>
          <div className={styles.boxTitle}>Trip Time</div>
          <div className={styles.dateRow}>
            <div className={styles.dateBlock}>
              <div className={styles.dateTopRow}>
                <Image src="/images/dashboard/booking/trips/view/date.svg" alt="" width={24} height={24} />
                <span className={styles.dateLabel}>Start Date</span>
              </div>
              <div className={styles.dateBottomRow}>
                <span className={styles.dateValue}>Sun, Mar 15</span>
              </div>
            </div>
            
            <div className={styles.dateBlock}>
              <div className={styles.dateTopRow}>
                <Image src="/images/dashboard/booking/trips/view/date.svg" alt="" width={24} height={24} />
                <span className={styles.dateLabel}>End Date</span>
              </div>
              <div className={styles.dateBottomRow}>
                <span className={styles.dateValue}>Sun, Mar 15</span>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.bookingInfoBox}>
          <div className={styles.boxTitle}>Pax Distribution</div>
          <div className={styles.paxDistributionList}>
            <span className={styles.nationalityBadge}>
              <Image src="/images/dashboard/booking/trips/view/adults.svg" alt="" width={16} height={16} />
              2 Adults
            </span>
            <span className={styles.nationalityBadge}>
              <Image src="/images/dashboard/booking/trips/view/children.svg" alt="" width={16} height={16} />
              2 Children
            </span>
            <span className={styles.nationalityBadge}>
              <Image src="/images/dashboard/booking/trips/view/infants.svg" alt="" width={16} height={16} />
              2 Infants
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

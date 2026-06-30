import React from "react";
import Image from "next/image";
import styles from "./ViewTrip.module.scss";

export default function RoomSelection() {
  return (
    <div className={styles.card}>
      <div className={styles.cardTitle}>
        <div className={styles.titleLeft}>
          <div className={styles.titleIcon}>
            <Image
              src="/images/dashboard/booking/trips/view/room.svg"
              alt=""
              width={20}
              height={20}
              aria-hidden
            />
          </div>
          Room Selection
        </div>
      </div>

      <div className={styles.bookingInfoBox}>
        <div className={styles.boxTitle}>Type of Room</div>
        <div className={styles.roomBadgeList}>
          <div className={styles.roomBadge}>
            <Image src="/images/dashboard/booking/trips/view/single_room.svg" alt="" width={20} height={20} />
            <div className={styles.roomBadgeText}>
              <span className={styles.roomBadgeTitle}>Single Room - Garden View</span>
              <span className={styles.roomBadgeSubtitle}>1 person</span>
            </div>
          </div>
          
          <div className={styles.roomBadge}>
            <Image src="/images/dashboard/booking/trips/view/double_room.svg" alt="" width={24} height={24} />
            <div className={styles.roomBadgeText}>
              <span className={styles.roomBadgeTitle}>Double Room - Garden View</span>
              <span className={styles.roomBadgeSubtitle}>1 person</span>
            </div>
          </div>

          <div className={styles.roomBadge}>
            <Image src="/images/dashboard/booking/trips/view/triple_room.svg" alt="" width={24} height={24} />
            <div className={styles.roomBadgeText}>
              <span className={styles.roomBadgeTitle}>Triple Room - Garden View</span>
              <span className={styles.roomBadgeSubtitle}>1 person</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

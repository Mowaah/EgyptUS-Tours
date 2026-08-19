import React from "react";
import Image from "next/image";
import styles from "./ViewTrip.module.scss";

interface RoomSelectionProps {
  selections: any[];
}

export default function RoomSelection({ selections }: RoomSelectionProps) {
  if (!selections || selections.length === 0) return null;

  return (
    <div className={styles.card}>
      <div className={styles.cardTitle}>
        <div className={styles.titleLeft}>
          <div className={styles.titleIcon}>
            <Image src="/images/dashboard/booking/trips/view/room.svg" alt="" width={20} height={20} aria-hidden />
          </div>
          Room Selection
        </div>
      </div>

      <div className={styles.bookingInfoBox}>
        <div className={styles.boxTitle}>Type of Room</div>
        <div className={styles.roomBadgeList}>
          {selections.map((sel, idx) => {
            const icon = sel.room_type?.toLowerCase().includes("single") ? "single_room.svg" : 
                         sel.room_type?.toLowerCase().includes("double") ? "double_room.svg" : 
                         "triple_room.svg";
            
            return (
              <div key={idx} className={styles.roomBadge}>
                <Image src={`/images/dashboard/booking/trips/view/${icon}`} alt="" width={24} height={24} />
                <div className={styles.roomBadgeText}>
                  <span className={styles.roomBadgeTitle}>{sel.room_type || `Room ${idx + 1}`} - {sel.count}x</span>
                  <span className={styles.roomBadgeSubtitle}>{sel.guests || 1} person</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

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
            const roomTypeStr = sel.room_type || sel.type_label || "";
            const icon = roomTypeStr.toLowerCase().includes("single") ? "single_room.svg" : 
                         roomTypeStr.toLowerCase().includes("double") ? "double_room.svg" : 
                         "triple_room.svg";
            
            const label = [sel.room_type || sel.type_label, sel.view_label].filter(Boolean).join(" - ") || `Room ${idx + 1}`;
            const count = sel.count ?? sel.quantity ?? 1;
            const guests = sel.guests || (roomTypeStr.toLowerCase().includes("single") ? 1 : roomTypeStr.toLowerCase().includes("double") ? 2 : 3);
            
            return (
              <div key={idx} className={styles.roomBadge}>
                <Image src={`/images/dashboard/booking/trips/view/${icon}`} alt="" width={24} height={24} />
                <div className={styles.roomBadgeText}>
                  <span className={styles.roomBadgeTitle}>{label} - {count}x</span>
                  <span className={styles.roomBadgeSubtitle}>{guests} {guests === 1 ? 'person' : 'people'}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

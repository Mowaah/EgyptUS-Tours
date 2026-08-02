"use client";

import Image from "next/image";
import styles from "./page.module.scss";
import { useTripDetailContext } from "../layout";

export default function TripInclusionsPage() {
  const { trip, loading } = useTripDetailContext();

  if (loading || !trip) {
    return <div style={{ padding: "24px" }}>Loading...</div>;
  }

  const inclusions: any[] = trip.inclusions || [];
  const exclusions: any[] = trip.exclusions || [];

  return (
    <div className={styles.container}>
      <div className={styles.titleRow}>
        <div className={styles.iconWrap}>
          <Image src="/images/dashboard/catalog/trips/inclusions.svg" alt="" width={20} height={20} />
        </div>
        <h2>Inclusions</h2>
      </div>

      <div className={styles.columnsWrapper}>
        
        {/* Included Column */}
        <div className={styles.column}>
          <h3 className={styles.columnTitle}>Included</h3>
          <div className={styles.listContainer}>
            {inclusions.length > 0 ? inclusions.map((item: any) => (
              <div key={item.id} className={styles.listItem}>
                <div className={styles.checkIcon}>
                  <Image src="/images/check-blue.svg" alt="Included" width={12} height={12} />
                </div>
                <span className={styles.itemText}>{item.text}</span>
              </div>
            )) : <p style={{ color: "#9ca3af", fontSize: "14px" }}>No inclusions added.</p>}
          </div>
        </div>

        {/* Not Included Column */}
        <div className={styles.column}>
          <h3 className={styles.columnTitle}>Not- Included</h3>
          <div className={styles.listContainer}>
            {exclusions.length > 0 ? exclusions.map((item: any) => (
              <div key={item.id} className={styles.listItem}>
                <div className={styles.closeIcon}>
                  <Image src="/images/close-red.svg" alt="Not Included" width={10} height={10} />
                </div>
                <span className={styles.itemText}>{item.text}</span>
              </div>
            )) : <p style={{ color: "#9ca3af", fontSize: "14px" }}>No exclusions added.</p>}
          </div>
        </div>

      </div>
    </div>
  );
}

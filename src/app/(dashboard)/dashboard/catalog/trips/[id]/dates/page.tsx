"use client";

import Image from "next/image";
import styles from "./page.module.scss";
import { useTripDetailContext } from "../layout";

const CircularProgress = ({ percentage }: { percentage: number }) => {
  const radius = 6;
  const strokeWidth = 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;
  const circlePath = "M 8 2 A 6 6 0 1 0 8 14 A 6 6 0 1 0 8 2";

  return (
    <svg width="14.33" height="14.33" viewBox="0 0 16 16">
      <path d={circlePath} stroke="currentColor" strokeWidth={strokeWidth} fill="none" opacity="0.2" />
      <path
        d={circlePath}
        stroke="currentColor"
        strokeWidth={strokeWidth}
        fill="none"
        strokeDasharray={circumference}
        strokeDashoffset={strokeDashoffset}
        strokeLinecap="round"
      />
    </svg>
  );
};

interface AvailabilitySlot {
  id?: number | string;
  start_date: string;
  end_date: string;
  capacity_total?: number;
  capacity_remaining?: number;
}

export default function TripDatesPage() {
  const { trip, loading } = useTripDetailContext();

  if (loading || !trip) {
    return <div style={{ padding: "24px" }}>Loading...</div>;
  }

  const slots: AvailabilitySlot[] = trip.availability_slots || [];

  return (
    <div className={styles.container}>
      {/* Title Row */}
      <div className={styles.titleRow}>
        <div className={styles.iconWrap}>
          <Image src="/images/dashboard/catalog/trips/dates.svg" alt="" width={20} height={20} />
        </div>
        <h2>Dates & Availability</h2>
      </div>

      {slots.length === 0 ? (
        <p style={{ color: "#9ca3af", fontSize: "14px", padding: "24px 0" }}>No availability slots have been added yet.</p>
      ) : (
        <div className={styles.grid}>
          {slots.map((slot) => {
            const spotsLeft = slot.capacity_remaining ?? 0;
            const total = slot.capacity_total || 1;
            const percentage = Math.round(((total - spotsLeft) / total) * 100);
            const isAlmostFull = spotsLeft <= 3;
            const statusColor = isAlmostFull ? "red" : percentage >= 60 ? "blue" : "green";
            const status = isAlmostFull ? "Almost Full!" : `${percentage}% Full`;
            const startDate = new Date(slot.start_date).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
            const endDate = new Date(slot.end_date).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });

            return (
              <div key={slot.id} className={styles.card}>
                {/* Top row */}
                <div className={styles.cardHeader}>
                  <span className={styles.dateRange}>{startDate} – {endDate}</span>
                  <span className={styles.duration}>{trip.duration_label || `${trip.duration_days} Days`}</span>
                </div>

                {/* Middle row */}
                <div className={styles.spotsBox}>
                  <div className={styles.spotsContent}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{ color: "#6B7280" }}>
                      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <span className={styles.spotsText}>{spotsLeft} Spots left</span>
                  </div>
                </div>

                {/* Bottom row (status) */}
                <div className={`${styles.statusRow} ${styles[statusColor]}`}>
                  {statusColor === "red" && (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" style={{ color: "#D80027" }}>
                      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.8" />
                      <path d="M12 8v4M12 16h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                  )}
                  {(statusColor === "blue" || statusColor === "green") && <CircularProgress percentage={percentage} />}
                  <span>{status}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

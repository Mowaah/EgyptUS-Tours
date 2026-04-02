"use client";
import { useState } from "react";
import { Trip } from "@/types";
import { SortButton } from "@/components/shared";
import styles from "./TripAvailability.module.scss";

interface Props {
  trip: Trip;
}

function getAvailability(spotsLeft: number, total: number) {
  const pct = Math.round(((total - spotsLeft) / total) * 100);
  if (spotsLeft <= 3) return { label: "Almost Full!", pct, color: "hot" as const };
  if (pct >= 60) return { label: `${pct}% Full`, pct, color: "warm" as const };
  return { label: `${pct}% Full`, pct, color: "cool" as const };
}

export default function TripAvailability({ trip }: Props) {
  const slots = trip.availability ?? [];
  const [sort, setSort] = useState("month");
  if (!slots.length) return null;

  return (
    <section id="reviews" className={styles.section}>
      <h2 className={styles.heading}>Dates &amp; Availability</h2>
      <p className={styles.subtitle}>
        Select your preferred departure date for the {trip.duration.days}-day{" "}
        {trip.location} journey
      </p>

      <div className={styles.toolbar}>
        <span className={styles.count}>{slots.length} Trips Founded</span>
        <SortButton
          options={[
            { value: "month", label: "Month" },
            { value: "spots", label: "Spots" },
            { value: "price", label: "Price" },
          ]}
          defaultValue={sort}
          onChange={setSort}
        />
      </div>

      <div className={styles.grid}>
        {slots.map((slot, i) => {
          const { label, pct, color } = getAvailability(slot.spotsLeft, slot.totalSpots);
          return (
            <div key={i} className={styles.card}>
              <p className={styles.dates}>{slot.dates}</p>
              <p className={styles.duration}>{slot.duration}</p>
              <div className={`${styles.spotsBadge} ${styles[color]}`}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                {slot.spotsLeft} Spots left
              </div>
              {slot.spotsLeft <= 4 ? (
                <div className={styles.almostFull}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.8" />
                    <path d="M12 8v4M12 16h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                  Almost Full!
                </div>
              ) : (
                <p className={styles.pctLabel}>{pct}% Full</p>
              )}
            </div>
          );
        })}
      </div>

      <div className={styles.note}>
        <strong>Note:</strong> All departures are guaranteed with a minimum of 2 travelers. Private tours available upon request.
      </div>
    </section>
  );
}

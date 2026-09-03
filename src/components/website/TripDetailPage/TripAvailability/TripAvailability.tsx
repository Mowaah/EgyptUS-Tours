"use client";
import { useState } from "react";
import { Trip } from "@/types";
import { SortButton } from "@/components/shared";
import { useTranslation } from "@/hooks/useTranslation";
import styles from "./TripAvailability.module.scss";

interface Props {
  trip: Trip;
}

function getStatus(spotsLeft: number, total: number) {
  const pct = Math.round(((total - spotsLeft) / total) * 100);
  let color = "green"; // Default when plenty of spots
  if (spotsLeft <= 4) color = "orange";
  else if (pct >= 50) color = "blue";
  return { pct, color };
}

const ALL_MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

export default function TripAvailability({ trip }: Props) {
  const { t } = useTranslation("trips");
  const slots = trip.availability ?? [];
  const [selectedMonth, setSelectedMonth] = useState("all");
  
  if (!slots.length) return null;

  const filteredSlots = selectedMonth === "all"
    ? slots
    : slots.filter(slot => {
        const parts = slot.dates.split(" - ");
        if (parts.length > 0) {
          const d = new Date(parts[0]);
          if (!isNaN(d.getTime())) {
            const m = d.toLocaleString("default", { month: "long" }).toLowerCase();
            return m === selectedMonth.toLowerCase();
          }
        }
        return slot.dates.toLowerCase().includes(selectedMonth.toLowerCase());
      });

  const formatDateRange = (datesStr: string) => {
    const parts = datesStr.split(" - ");
    if (parts.length !== 2) return datesStr;
    const d1 = new Date(parts[0]);
    const d2 = new Date(parts[1]);
    if (isNaN(d1.getTime()) || isNaN(d2.getTime())) return datesStr;
    const m1 = d1.toLocaleString("default", { month: "short" });
    const m2 = d2.toLocaleString("default", { month: "short" });
    if (d1.getFullYear() !== d2.getFullYear()) {
      return `${m1} ${d1.getDate()}, ${d1.getFullYear()} - ${m2} ${d2.getDate()}, ${d2.getFullYear()}`;
    }
    if (m1 === m2) {
      return `${m1} ${d1.getDate()}-${d2.getDate()}, ${d1.getFullYear()}`;
    }
    return `${m1} ${d1.getDate()} - ${m2} ${d2.getDate()}, ${d1.getFullYear()}`;
  };

  return (
    <section id="dates-availability" className={styles.section}>
      <h2 className={styles.heading}>{t("availability.heading", "Dates & Availability")}</h2>
      <p className={styles.subtitle}>
        {t("availability.subtitle", "Select your preferred departure date for the {days}-day {location} journey")
          .replace("{days}", String(trip.duration.days))
          .replace("{location}", trip.location)}
      </p>

      <div className={styles.toolbar}>
        <span className={styles.count}>
          {t("availability.tripsFound", "{count} Trips Found").replace("{count}", String(filteredSlots.length))}
        </span>
        <SortButton
          options={[
            { value: "all", label: t("availability.allMonths", "All Months") },
            ...ALL_MONTHS.map(month => ({ value: month.toLowerCase(), label: month }))
          ]}
          defaultValue={selectedMonth}
          onChange={setSelectedMonth}
        />
      </div>

      <div className={styles.grid}>
        {filteredSlots.map((slot, i) => {
          const { pct, color } = getStatus(slot.spotsLeft, slot.totalSpots);
          return (
            <div key={i} className={styles.card}>
              <p className={styles.dates}>{formatDateRange(slot.dates)}</p>
              <p className={styles.duration}>{slot.duration}</p>
              <div className={`${styles.spotsBadge} ${styles[color]}`}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                {t("availability.spotsLeft", "{count} Spots left").replace("{count}", String(slot.spotsLeft))}
              </div>
              {slot.spotsLeft <= 4 ? (
                <div className={`${styles.statusText} ${styles[color + "Text"]}`}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.8" />
                    <path d="M12 8v4M12 16h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                  {t("availability.almostFull", "Almost Full!")}
                </div>
              ) : (
                <p className={`${styles.statusText} ${styles[color + "Text"]}`}>
                  {t("availability.full", "{pct}% Full").replace("{pct}", String(pct))}
                </p>
              )}
            </div>
          );
        })}
      </div>

      <div className={styles.note}>
        <strong>{t("availability.noteLabel", "Note:")}</strong> {t("availability.noteText", "All departures are guaranteed with a minimum of 2 travelers. Private tours available upon request.")}
      </div>
    </section>
  );
}

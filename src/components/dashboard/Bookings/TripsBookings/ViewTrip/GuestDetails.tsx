import React from "react";
import Image from "next/image";
import styles from "./ViewTrip.module.scss";
import type { TripBookingRow } from "../types";

interface GuestDetailsProps {
  guest: any;
  booking: any;
}

import { getNationalityName, resolveCountryCode } from "@/utils/nationality";

export default function GuestDetails({ guest, booking }: GuestDetailsProps) {
  const name = guest?.full_name || "Unknown Guest";
  const email = guest?.email || "-";
  const phone = guest?.phone || "-";
  const nationality = guest?.nationality || "";
  const countryCode = resolveCountryCode(nationality);
  const countryName = getNationalityName(nationality);

  return (
    <div className={`${styles.card} ${styles.firstRowCard}`}>
      <div className={styles.cardTitle}>
        <div className={styles.titleLeft}>
          <div className={styles.titleIcon}>
            <Image src="/images/dashboard/booking/trips/view/guest.svg" alt="" width={20} height={20} aria-hidden />
          </div>
          Guest Details
        </div>
        <span className={`${styles.pillBadge} ${booking?.tour_type === "group" ? styles.blue : styles.orange}`}>
          {booking?.tour_type === "group" ? (
            <Image src="/images/dashboard/booking/trips/group.svg" alt="" width={16} height={16} />
          ) : (
            <Image src="/images/dashboard/booking/trips/private.svg" alt="" width={16} height={16} />
          )}
          {booking?.tour_type ? booking.tour_type.charAt(0).toUpperCase() + booking.tour_type.slice(1) : "Private"} Tour
        </span>
      </div>

      <div className={styles.infoList}>
        <div className={styles.infoRow}>
          <span className={styles.infoLabel}>Guest Name</span>
          <span className={styles.infoValue}>{name}</span>
        </div>
        
        <div className={styles.infoRow}>
          <span className={styles.infoLabel}>Guest E-mail</span>
          <span className={styles.infoValue}>{email}</span>
        </div>

        <div className={styles.infoRow}>
          <span className={styles.infoLabel}>Phone Number</span>
          <span className={styles.infoValue}>{phone}</span>
        </div>

        <div className={styles.infoRow}>
          <span className={styles.infoLabel}>Nationality</span>
          <div className={styles.infoValue}>
            <span className={styles.nationalityBadge}>
              <img 
                src={`https://hatscripts.github.io/circle-flags/flags/${countryCode}.svg`}
                alt={countryName} 
                className={styles.avatar}
                style={{ width: 16, height: 16 }}
                onError={(e) => { e.currentTarget.src = "https://hatscripts.github.io/circle-flags/flags/un.svg"; }}
              />
              {countryName}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

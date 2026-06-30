import React from "react";
import Image from "next/image";
import styles from "./ViewTrip.module.scss";
import type { TripBookingRow } from "../types";

interface GuestDetailsProps {
  trip?: TripBookingRow;
}

export default function GuestDetails({ trip }: GuestDetailsProps) {
  // Generate some dynamic dummy data based on the customer name
  const name = trip?.customerName || "Ahmed Khaled Hassan";
  const firstName = name.split(" ")[0].toLowerCase();
  const lastName = name.split(" ")[1]?.toLowerCase() || "guest";
  const email = `${firstName}.${lastName}89@gmail.com`;
  
  // Try to determine nationality from name, otherwise default to US
  const isEgyptian = name.includes("Ahmed") || name.includes("Karim") || name.includes("Mohammad") || name.includes("Hassan");
  const countryCode = isEgyptian ? "eg" : "us";
  const countryName = isEgyptian ? "Egyptian" : "American";

  return (
    <div className={`${styles.card} ${styles.firstRowCard}`}>
      <div className={styles.cardTitle}>
        <div className={styles.titleLeft}>
          <div className={styles.titleIcon}>
            <Image
              src="/images/dashboard/booking/trips/view/guest.svg"
              alt=""
              width={20}
              height={20}
              aria-hidden
            />
          </div>
          Guest Details
        </div>
        <span className={`${styles.pillBadge} ${styles.orange}`}>
          {trip?.tourType === "Group" ? (
            <Image src="/images/dashboard/booking/trips/group.svg" alt="" width={16} height={16} />
          ) : (
            <Image src="/images/dashboard/booking/trips/private.svg" alt="" width={16} height={16} />
          )}
          {trip?.tourType || "Private"} Tour
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
          <span className={styles.infoLabel}>phone Number</span>
          <span className={styles.infoValue}>{isEgyptian ? "20 10 5678 2341" : "1 555 123 4567"}</span>
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
              />
              {countryName}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

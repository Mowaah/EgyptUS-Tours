import Image from "next/image";
import styles from "./ViewTransportation.module.scss";

interface PassengerInformationProps {
  guest?: any;
}

import { getNationalityName, resolveCountryCode } from "@/utils/nationality";

export default function PassengerInformation({ guest }: PassengerInformationProps) {
  const name = guest?.full_name || "Unknown";
  const email = guest?.email || "-";
  const phone = guest?.phone || "-";
  const nationality = guest?.nationality || "";
  const countryCode = resolveCountryCode(nationality);
  const countryName = getNationalityName(nationality);
  const specialRequests = guest?.special_requests || "None";

  return (
    <div className={styles.card}>
      <div className={styles.cardTitle}>
        <div className={styles.titleLeft}>
          <div className={styles.titleIcon}>
            <Image src="/images/dashboard/booking/trips/view/guest.svg" alt="" width={20} height={20} aria-hidden />
          </div>
          Passenger Information
        </div>
      </div>

      <div className={styles.infoList}>
        <div className={styles.infoRow}>
          <span className={styles.infoLabel}>Name</span>
          <span className={styles.infoValue}>{name}</span>
        </div>

        <div className={styles.infoRow}>
          <span className={styles.infoLabel}>Email</span>
          <span className={styles.infoValue}>{email}</span>
        </div>

        <div className={styles.infoRow}>
          <span className={styles.infoLabel}>Phone</span>
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

        <div className={styles.infoRow}>
          <span className={styles.infoLabel}>Special Requests</span>
          <span className={styles.infoValue} style={{ maxWidth: '400px', lineHeight: '1.4', wordBreak: 'break-word' }}>
            {specialRequests}
          </span>
        </div>
      </div>
    </div>
  );
}

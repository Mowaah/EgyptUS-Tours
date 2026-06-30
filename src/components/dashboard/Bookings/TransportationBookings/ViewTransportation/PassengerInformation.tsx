import Image from "next/image";
import styles from "./ViewTransportation.module.scss";

interface PassengerInformationProps {
  transportation?: any;
}

export default function PassengerInformation({ transportation }: PassengerInformationProps) {
  const name = transportation?.customerName || "Sara Mohamed";
  const email = `${name.split(' ')[0].toLowerCase()}@email.com`;
  const isEgyptian = name.includes("Ahmed") || name.includes("Sara") || name.includes("Hassan");
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
          <span className={styles.infoValue}>+20 110 5555001</span>
        </div>

        <div className={styles.infoRow}>
          <span className={styles.infoLabel}>Nationality</span>
          <div className={styles.infoValue}>
            <span className={styles.nationalityBadge}>
              <img src={`https://hatscripts.github.io/circle-flags/flags/${isEgyptian ? 'eg' : 'us'}.svg`} alt={isEgyptian ? "Egyptian" : "American"} className={styles.avatar} style={{ width: 16, height: 16 }} />
              {isEgyptian ? "Egyptian" : "American"}
            </span>
          </div>
        </div>

        <div className={styles.infoRow}>
          <span className={styles.infoLabel}>Special Requests</span>
          <span className={styles.infoValue} style={{ maxWidth: '400px', lineHeight: '1.4' }}>
            Please arrange airport pickup if available. I'm traveling with heavy luggage, so assistance would really help.
          </span>
        </div>
      </div>
    </div>
  );
}

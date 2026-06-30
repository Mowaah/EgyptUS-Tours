import styles from "./ViewTransportation.module.scss";

interface TransferDetailsProps {
  transportation: any;
}

export default function TransferDetails({ transportation }: TransferDetailsProps) {
  return (
    <div className={styles.card}>
      <div className={styles.cardTitle}>
        <div className={styles.titleLeft}>
          <div className={styles.titleIcon}>
            <div className={styles.transferIcon} aria-hidden />
          </div>
          Transfer Details
        </div>
      </div>

      <div className={styles.infoList}>
        <div className={styles.infoRow}>
          <span className={styles.infoLabel}>Pickup Point</span>
          <span className={styles.infoValue}>{transportation.route?.split(" -> ")[0] || "Luxor International Airport"}</span>
        </div>

        <div className={styles.infoRow}>
          <span className={styles.infoLabel}>Date & Time</span>
          <span className={styles.infoValue}>{transportation.dateTime || "Mar 22, 2026 - 10:30 AM"}</span>
        </div>

        <div className={styles.infoRow}>
          <span className={styles.infoLabel}>Trip Type</span>
          <span className={styles.infoValue}>{transportation.tripType}</span>
        </div>

        <div className={styles.infoRow}>
          <span className={styles.infoLabel}>Drop-off</span>
          <span className={styles.infoValue}>{transportation.route?.split(" -> ")[1] || "Hotel Ibis Luxor"}</span>
        </div>

        <div className={styles.infoRow}>
          <span className={styles.infoLabel}>Passengers / Bags</span>
          <div className={styles.infoValue} style={{ display: 'flex', gap: '12px' }}>
            <span className={styles.nationalityBadge}>
              2 passengers
            </span>
            <span className={styles.nationalityBadge}>
              1 Bags
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

import styles from "./ViewTransportation.module.scss";

interface TransferDetailsProps {
  transfer: any;
}

function formatDateString(dateStr: string) {
  if (!dateStr) return "-";
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-US", { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
  } catch {
    return dateStr;
  }
}

export default function TransferDetails({ transfer }: TransferDetailsProps) {
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
          <span className={styles.infoLabel}>Pickup Location</span>
          <span className={styles.infoValue}>{transfer?.pickup_location || "-"}</span>
        </div>

        <div className={styles.infoRow}>
          <span className={styles.infoLabel}>Drop-off location</span>
          <span className={styles.infoValue}>{transfer?.dropoff_location || "-"}</span>
        </div>

        <div className={styles.infoRow}>
          <span className={styles.infoLabel}>Date & Time</span>
          <span className={styles.infoValue}>
            {formatDateString(transfer?.pickup_date)} · {transfer?.pickup_time || "-"}
          </span>
        </div>

        <div className={styles.infoRow}>
          <span className={styles.infoLabel}>Trip Type</span>
          <span className={styles.infoValue}>{transfer?.trip_type ? transfer.trip_type.replace(/_/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase()) : "One Way"}</span>
        </div>

        <div className={styles.infoRow}>
          <span className={styles.infoLabel}>Passengers / Bags</span>
          <div className={styles.infoValue} style={{ display: 'flex', gap: '12px' }}>
            <span className={styles.nationalityBadge}>
              {transfer?.passengers || 0} passengers
            </span>
            <span className={styles.nationalityBadge}>
              {transfer?.luggage || 0} Bags
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

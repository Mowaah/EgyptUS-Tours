import { Trip } from "@/types";
import styles from "./TripExclusions.module.scss";

interface TripExclusionsProps {
  trip: Trip;
}

export default function TripExclusions({ trip }: TripExclusionsProps) {
  if (!trip.excluded?.length) return null;
  return (
    <section id="excluded" className={styles.section}>
      <h2 className={styles.heading}>What's Not Included In Your Plan</h2>
      <ul className={styles.list}>
        {trip.excluded.map((item, i) => (
          <li key={i} className={styles.item}>
            <span className={styles.icon}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" fill="#FF6600" opacity="0.12" />
                <path d="M15 9l-6 6M9 9l6 6" stroke="#FF6600" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

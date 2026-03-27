import { Trip } from "@/types";
import styles from "./TripInclusions.module.scss";

interface TripInclusionsProps {
  trip: Trip;
}

export default function TripInclusions({ trip }: TripInclusionsProps) {
  if (!trip.included?.length) return null;
  return (
    <section id="included" className={styles.section}>
      <h2 className={styles.heading}>What's Included In Your Plan</h2>
      <ul className={styles.list}>
        {trip.included.map((item, i) => (
          <li key={i} className={styles.item}>
            <span className={styles.icon}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" fill="#2971E6" opacity="0.15" />
                <path d="M8 12l3 3 5-5" stroke="#2971E6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

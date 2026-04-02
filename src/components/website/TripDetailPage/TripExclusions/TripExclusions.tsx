import Image from "next/image";
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
            <div className={styles.icon}>
              <Image src="/images/close-red.svg" alt="" width={16} height={16} />
            </div>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

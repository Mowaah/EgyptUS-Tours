import Image from "next/image";
import { Trip } from "@/types";
import { useTranslation } from "@/hooks/useTranslation";
import styles from "./TripInclusions.module.scss";

interface TripInclusionsProps {
  trip: Trip;
}

export default function TripInclusions({ trip }: TripInclusionsProps) {
  const { t } = useTranslation("trips");
  if (!trip.included?.length) return null;
  return (
    <section id="included" className={styles.section}>
      <h2 className={styles.heading}>{t("inclusions.heading", "What's Included In Your Plan")}</h2>
      <ul className={styles.list}>
        {trip.included.map((item, i) => (
          <li key={i} className={styles.item}>
            <div className={styles.icon}>
              <Image src="/images/check-blue.svg" alt="" width={16} height={16} />
            </div>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

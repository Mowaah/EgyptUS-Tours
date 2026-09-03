import Image from "next/image";
import Link from "next/link";
import { Trip } from "@/types";
import Button from "@/components/shared/Button/Button";
import { useTranslation } from "@/hooks/useTranslation";
import styles from "./TripOverview.module.scss";

interface TripOverviewProps {
  trip: Trip;
}

export default function TripOverview({ trip }: TripOverviewProps) {
  const ov = trip.overview;
  const { t } = useTranslation("trips");

  return (
    <section id="overview" className={styles.section}>
      <h2 className={styles.heading}>{t("overview.heading", "Overview")}</h2>

      {ov?.description && (
        <>
          <h3 className={styles.label}>{t("overview.description", "Description")}</h3>
          <p className={styles.text}>{ov.description}</p>
        </>
      )}

      {ov?.culturalValue && (
        <>
          <h3 className={styles.label}>{t("overview.culturalValue", "Cultural Value")}</h3>
          <p className={styles.text}>{ov.culturalValue}</p>
        </>
      )}

      {ov?.whoIsItFor && (
        <>
          <h3 className={styles.label}>{t("overview.whoIsItFor", "Who is this trip for?")}</h3>
          <p className={styles.text}>{ov.whoIsItFor}</p>
        </>
      )}
    </section>
  );
}

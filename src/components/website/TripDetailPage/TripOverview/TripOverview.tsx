import Image from "next/image";
import Link from "next/link";
import { Trip } from "@/types";
import Button from "@/components/shared/Button/Button";
import styles from "./TripOverview.module.scss";

interface TripOverviewProps {
  trip: Trip;
}

export default function TripOverview({ trip }: TripOverviewProps) {
  const ov = trip.overview;

  return (
    <section id="overview" className={styles.section}>
      <h2 className={styles.heading}>Overview</h2>

      {ov?.description && (
        <>
          <h3 className={styles.label}>Description</h3>
          <p className={styles.text}>{ov.description}</p>
        </>
      )}

      {ov?.culturalValue && (
        <>
          <h3 className={styles.label}>Cultural Value</h3>
          <p className={styles.text}>{ov.culturalValue}</p>
        </>
      )}

      {ov?.whoIsItFor && (
        <>
          <h3 className={styles.label}>Who is this trip for?</h3>
          <p className={styles.text}>{ov.whoIsItFor}</p>
        </>
      )}
    </section>
  );
}

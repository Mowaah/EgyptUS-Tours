import React from "react";
import Image from "next/image";
import { FeatureCard } from "@/components/shared";
import styles from "./EventsFeatures.module.scss";

const FEATURES = [
  {
    title: "Meetings",
    description: "Executive boardrooms and strategic gatherings",
    color: "#2563EB",
    iconSrc: "/images/mice/meetings.svg",
  },
  {
    title: "Incentives",
    description: "Luxury reward trips and curated team experiences",
    color: "#EF4444",
    iconSrc: "/images/mice/incentives.svg",
  },
  {
    title: "Conferences",
    description: "Large-scale conferences with full technical support",
    color: "#10B981",
    iconSrc: "/images/mice/conferences.svg",
  },
  {
    title: "Exhibitions",
    description: "Professional exhibition spaces and event management",
    color: "#8B5CF6",
    iconSrc: "/images/mice/exhibitions.svg",
  },
];

export default function EventsFeatures() {
  return (
    <section id="features" className={styles.section}>
      <div className={styles.header}>
        <h2 className={styles.title}>What We Offer</h2>
        <p className={styles.subtitle}>
          High-level meetings, curated incentives, and world-class exhibitions tailored
          <br />
          for leading organizations.
        </p>
      </div>

      <div className={styles.features}>
        {FEATURES.map((feature) => (
          <FeatureCard
            key={feature.title}
            icon={
              <Image src={feature.iconSrc} alt="" width={28} height={28} />
            }
            title={feature.title}
            description={feature.description}
            color={feature.color}
          />
        ))}
      </div>
    </section>
  );
}

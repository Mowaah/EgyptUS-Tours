import React from "react";
import Image from "next/image";
import { FeatureCard } from "@/components/shared";
import styles from "./EventsFeatures.module.scss";

const FEATURES = [
  {
    title: "Meetings",
    description: "Executive boardrooms and strategic gatherings",
    cardBg: "#F8FCFF",
    borderColor: "#EAF1FD",
    iconBg: "#EAF6FF",
    iconSrc: "/images/mice/meetings.svg",
  },
  {
    title: "Incentives",
    description: "Luxury reward trips and curated team experiences",
    cardBg: "rgba(255, 240, 230, 0.22)",
    borderColor: "#FFF1E8",
    iconBg: "#FFF0E6",
    iconSrc: "/images/mice/incentives.svg",
  },
  {
    title: "Conferences",
    description: "Large-scale conferences with full technical support",
    cardBg: "rgba(240, 253, 244, 0.28)",
    borderColor: "#EDFBF3",
    iconBg: "#F0FDF4",
    iconSrc: "/images/mice/conferences.svg",
  },
  {
    title: "Exhibitions",
    description: "Professional exhibition spaces and event management",
    cardBg: "rgba(223, 234, 251, 0.17)",
    borderColor: "#EAF1FD",
    iconBg: "#DFEAFB",
    iconSrc: "/images/mice/exhibitions.svg",
  },
];

export default function EventsFeatures() {
  return (
    <section id="features" className={styles.section}>
      <div className={styles.header}>
        <h2 className={styles.title}>What We Offer</h2>
        <p className={styles.subtitle}>
          High-level meetings, curated incentives, and world-class exhibitions tailored for leading organizations.
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
            cardBg={feature.cardBg}
            borderColor={feature.borderColor}
            iconBg={feature.iconBg}
          />
        ))}
      </div>
    </section>
  );
}

"use client";

import React from "react";
import Image from "next/image";
import { FeatureCard } from "@/components/shared";
import { useTranslation } from "@/hooks/useTranslation";
import styles from "./EventsFeatures.module.scss";

export default function EventsFeatures() {
  const { t } = useTranslation("events");

  const features = [
    {
      title: t("features.card1Title", "Executive Meetings"),
      description: t("features.card1Desc", "Thoughtfully planned meetings in exceptional Egyptian settings."),
      cardBg: "#F8FCFF",
      borderColor: "#EAF1FD",
      iconBg: "#EAF6FF",
      iconSrc: "/images/mice/meetings.svg",
    },
    {
      title: t("features.card2Title", "Incentive Experiences"),
      description: t("features.card2Desc", "Reward your team with experience that go beyond the ordinary"),
      cardBg: "rgba(255, 240, 230, 0.22)",
      borderColor: "#FFF1E8",
      iconBg: "#FFF0E6",
      iconSrc: "/images/mice/incentives.svg",
    },
    {
      title: t("features.card3Title", "Corporate Events"),
      description: t("features.card3Desc", "From intimate gatherings to large-scale events, managed start to end"),
      cardBg: "rgba(240, 253, 244, 0.28)",
      borderColor: "#EDFBF3",
      iconBg: "#F0FDF4",
      iconSrc: "/images/mice/conferences.svg",
    },
    {
      title: t("features.card4Title", "Corporate Travel"),
      description: t("features.card4Desc", "Hotels, transportation, flights, tours, and much more"),
      cardBg: "rgba(223, 234, 251, 0.17)",
      borderColor: "#EAF1FD",
      iconBg: "#DFEAFB",
      iconSrc: "/images/mice/exhibitions.svg",
    },
  ];

  return (
    <section id="features" className={styles.section}>
      <div className={styles.header}>
        <h2 className={styles.title}>{t("features.title", "What We Offer")}</h2>
        <p className={styles.subtitle}>
          {t("features.subtitle", "High-level meetings, curated incentives, and world-class exhibitions tailored for leading organizations.")}
        </p>
      </div>

      <div className={styles.features}>
        {features.map((feature) => (
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

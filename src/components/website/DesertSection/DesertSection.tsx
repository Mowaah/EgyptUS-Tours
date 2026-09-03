"use client";

import { SectionHeader, DestinationCard } from "@/components/shared";
import { useTranslation } from "@/hooks/useTranslation";
import styles from "./DesertSection.module.scss";

export default function DesertSection() {
  const { t } = useTranslation("home");

  const deserts = [
    {
      title: t("desert.westernTitle", "Western Desert"),
      description: t("desert.westernDesc", "Experience the thrill of the Egyptian desert with camel rides and sandboarding adventures."),
      image: "/images/desert/western.png",
      categoryParam: "Western Desert",
    },
    {
      title: t("desert.sinaiTitle", "Sinai Desert"),
      description: t("desert.sinaiDesc", "Experience the thrill of the Egyptian desert with camel rides and sandboarding adventures."),
      image: "/images/desert/sinai.png",
      categoryParam: "Sinai Desert",
    },
    {
      title: t("desert.oasisTitle", "Oasis Desert"),
      description: t("desert.oasisDesc", "Experience the thrill of the Egyptian desert with camel rides and sandboarding adventures."),
      image: "/images/desert/oasis.jpg",
      categoryParam: "Oasis Desert",
    },
    {
      title: t("desert.safariTitle", "Safari Trips"),
      description: t("desert.safariDesc", "Experience the thrill of the Egyptian desert with camel rides and sandboarding adventures."),
      image: "/images/desert/safari.jpg",
      categoryParam: "Safari Trips",
    },
  ];

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <SectionHeader
          label={t("desert.label", "Desert")}
          heading={t("desert.heading", "Beyond the Pyramids, Into the Desert")}
          description={t("desert.description", "From authentic desert encounters to refined retreats, discover hidden gems where ancient traditions, breathtaking landscapes, and modern comfort come together.")}
          descriptionMaxWidth="750px"
        />

        <div className={styles.cardsWrapper}>
          <div className={styles.cards}>
            {deserts.map((desert) => (
              <DestinationCard
                key={desert.categoryParam}
                title={desert.title}
                description={desert.description}
                image={desert.image}
                href={`/egypttours?tripType=desert&category=${encodeURIComponent(desert.categoryParam)}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

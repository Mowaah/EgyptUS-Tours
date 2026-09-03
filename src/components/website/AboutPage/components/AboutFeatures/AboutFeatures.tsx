"use client";

import { SectionHeader } from "@/components/shared";
import Image from "next/image";
import { useTranslation } from "@/hooks/useTranslation";
import styles from "./AboutFeatures.module.scss";

export default function AboutFeatures() {
  const { t } = useTranslation("about");

  const features = [
    {
      title: t("features.card1Title", "Local Expertise, International Standards"),
      description: t("features.card1Desc", "Local knowledge with international standards to create seamless, memorable experiences."),
      iconSrc: "/images/whytrustus/blue-earth.svg",
    },
    {
      title: t("features.card2Title", "Experience You Can Trust"),
      description: t("features.card2Desc", "Since 2000, delivering quality experiences with dedication, care, and attention to detail."),
      iconSrc: "/images/whytrustus/star.svg",
    },
    {
      title: t("features.card3Title", "Dedicated Support"),
      description: t("features.card3Desc", "With you from planning to the final moments, ensuring everything runs smoothly."),
      iconSrc: "/images/whytrustus/shield-security.svg",
    },
    {
      title: t("features.card4Title", "Quality Over Promises"),
      description: t("features.card4Desc", "We focus on quality, safety, transparency, and follow-up—not empty promises."),
      iconSrc: "/images/whytrustus/award.svg",
    },
  ];

  return (
    <section className={styles.section}>
      {/* Decorative dotted line */}
      <div className={styles.decoration}>
        <Image src="/images/dotted-line6.svg" alt="" width={215} height={215} className={styles.decorationImg} />
      </div>

      <div className={styles.container}>
        <SectionHeader
          label={t("features.label", "Why Trust US ?")}
          heading={t("features.heading", "30+ Years of Experience in Egypt & Beyond")}
          description={t("features.description", "Local expertise, trusted service, and seamless experiences from start to finish")}
          descriptionMaxWidth="640px"
          align="center"
        />

        <div className={styles.featuresGrid}>
          {features.map((feature, idx) => (
            <div key={idx} className={styles.customFeatureCard}>
              <div className={styles.iconBox}>
                <Image src={feature.iconSrc} alt="" width={28} height={28} />
              </div>
              <div className={styles.featureTextContent}>
                <h3 className={styles.featureTitle}>{feature.title}</h3>
                <p className={styles.featureDesc}>{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

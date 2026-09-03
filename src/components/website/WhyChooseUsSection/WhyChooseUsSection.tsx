"use client";

import { useMemo } from "react";
import { Button, SectionHeader } from "@/components/shared";
import { useTranslation } from "@/hooks/useTranslation";
import Image from "next/image";
import styles from "./WhyChooseUsSection.module.scss";

export default function WhyChooseUsSection() {
  const { t } = useTranslation("home");

  const features = useMemo(() => [
    {
      title: t("whyChooseUs.card1Title", "Deep Egypt Expertise"),
      description: t("whyChooseUs.card1Desc", "Years of experience creating meaningful Egyptian experiences."),
      color: "#10B981", // $success
      icon: <Image src="/images/whychooseus/location.svg" alt="" width={24} height={24} />,
    },
    {
      title: t("whyChooseUs.card2Title", "100% Customized Journeys"),
      description: t("whyChooseUs.card2Desc", "Trips tailored to your interests, style, and schedule."),
      color: "#FF6600", // $secondary
      icon: <Image src="/images/whychooseus/airplane.svg" alt="" width={24} height={24} />,
    },
    {
      title: t("whyChooseUs.card3Title", "Seamless Support"),
      description: t("whyChooseUs.card3Desc", "Support from your first inquiry to your return home."),
      color: "#FF6600", // $secondary
      icon: <Image src="/images/whychooseus/headphone.svg" alt="" width={24} height={24} />,
    },
    {
      title: t("whyChooseUs.card4Title", "Professional Local Teams"),
      description: t("whyChooseUs.card4Desc", "Expert local teams bringing Egypt to life."),
      color: "#1F55AD",
      bgColor: "#EAF6FF",
      icon: <Image src="/images/whychooseus/team.svg" alt="" width={24} height={24} />,
    },
    {
      title: t("whyChooseUs.card5Title", "Quality You Can Trust"),
      description: t("whyChooseUs.card5Desc", "1,000+ travelers served with quality and care."),
      color: "#19448A",
      bgColor: "#DFEAFB",
      border: "1px solid #FFFFFF",
      icon: <Image src="/images/whychooseus/quality.svg" alt="" width={24} height={24} />,
    },
  ], [t]);

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.grid}>
          <div className={styles.header}>
            <SectionHeader
              label={t("whyChooseUs.label", "Why Choose Us")}
              heading={t("whyChooseUs.heading", "Why Choose Us")}
              description={t("whyChooseUs.description", "We're more than a tour operator. We're your trusted partner for experiencing Egypt seamlessly, personally, and with confidence.")}
              align="left"
              descriptionMaxWidth="360px"
              showLabel={false}
            />
            <Button
              variant="outline"
              href="/about"
              icon={
                <Image src="/images/arrows/arrow-right-blue.svg" alt="" width={16} height={16} />
              }
            >
              {t("whyChooseUs.aboutUs", "About Us")}
            </Button>
          </div>

          {features.map((f) => (
            <div
              key={f.title}
              className={styles.card}
              style={{
                backgroundColor: f.bgColor || `${f.color}15`,
                border: f.border,
              }}
            >
              <div
                className={styles.iconBox}
                style={{ color: f.color }}
              >
                {f.icon}
              </div>
              <h3 className={styles.cardTitle} style={{ color: f.color }}>
                {f.title}
              </h3>
              <p className={styles.cardDesc}>{f.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

"use client";

import { Button } from "@/components/shared";
import { useTranslation } from "@/hooks/useTranslation";
import Image from "next/image";
import styles from "./DesertBannerSection.module.scss";

export default function DesertBannerSection() {
  const { t } = useTranslation("home");

  return (
    <section className={styles.section}>
      <Image
        src="/images/sora.png"
        alt="Desert landscape"
        fill
        priority
        className={styles.bg}
        sizes="(max-width: 768px) 100vw, 1920px"
      />
      <div className={styles.content}>
        <h2 className={styles.heading}>
          {t("desertBanner.headingPart1", "Experience the Thrill of")} <br />
          {t("desertBanner.headingPart2", "Desert Adventures")}
        </h2>
        <p className={styles.description}>
          {t("desertBanner.description", "Join exciting desert trips and explore the dunes with ease")}
        </p>
        <Button
          variant="secondary"
          href="/egypttours?tripType=desert"
          className={styles.ctaButton}
          icon={
            <Image src="/images/arrows/arrow-right.svg" alt="" width={16} height={16} />
          }
        >
          {t("desertBanner.exploreMore", "Explore more")}
        </Button>
      </div>
    </section>
  );
}

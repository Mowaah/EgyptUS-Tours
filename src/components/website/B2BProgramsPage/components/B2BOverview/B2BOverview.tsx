"use client";

import { useTranslation } from "@/hooks/useTranslation";
import styles from "./B2BOverview.module.scss";

export default function B2BOverview() {
  const { t } = useTranslation("b2b");

  return (
    <section id="overview" className={styles.section}>
      <div className={styles.content}>
        <h2 className={styles.title}>{t("overview.title", "Overview")}</h2>
        <div className={styles.descriptionWrap}>
          <p className={styles.description}>
            {t("overview.p1", "Our B2B division partners with international travel agencies, tour operators, travel advisors, and tourism companies to create and deliver seamless Egypt tour packages for their clients.")}
          </p>
          <p className={styles.description}>
            {t("overview.p2", "We provide tailored B2B Egypt travel packages, including accommodation, domestic flights, transportation, professional guides, sightseeing, Nile cruises, and curated experiences across Egypt.")}
          </p>
        </div>
      </div>
    </section>
  );
}

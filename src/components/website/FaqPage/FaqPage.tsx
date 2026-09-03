"use client";

import FaqSection from "@/components/website/FaqSection/FaqSection";
import Image from "next/image";
import { useTranslation } from "@/hooks/useTranslation";
import { FaqData } from "@/services/legalHelpService";
import styles from "./FaqPage.module.scss";

interface Props {
  initialFaqs?: FaqData[];
}

export default function FaqPage({ initialFaqs }: Props) {
  const { t } = useTranslation("faq");

  return (
    <div className={styles.page}>
      <header className={styles.headerSection}>
        <div className={styles.decorationWrapper}>
          <Image
            src="/images/dotted-line3.svg"
            alt=""
            width={340}
            height={247}
            className={styles.decoration}
            aria-hidden="true"
          />
        </div>
        <div className={styles.headerInner}>
          <h1 className={styles.title}>{t("pageTitle", "Frequently Asked Questions")}</h1>
          <p className={styles.subtitle}>
            {t("pageSubtitle", "Find quick answers to common questions about our trips, bookings, and services.")}
          </p>
        </div>
      </header>

      <div className={styles.contentSection}>
        <div className={styles.contentInner}>
          <FaqSection items={initialFaqs && initialFaqs.length > 0 ? initialFaqs : undefined} hideHeader noPadding />
        </div>
      </div>
    </div>
  );
}

"use client";

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useTranslation } from '@/hooks/useTranslation';
import styles from './B2BCTA.module.scss';

export default function B2BCTA() {
  const { t } = useTranslation("b2b");

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.content}>
          <h2 className={styles.title}>
            {t("cta.titlePart1", "Let's Create an Experience Your")}<br /> {t("cta.titlePart2", "Team Will")}{" "}
            <span className={styles.highlight}>{t("cta.titleHighlight", "Remember")}</span>
          </h2>
          <p className={styles.subtitle}>{t("cta.subtitle", "And an event your leadership will be proud of")}</p>
        </div>

        <Link href="/b2b-programs/request-proposal" className={styles.ctaButton}>
          {t("cta.button", "Request a Proposal")}
          <Image src="/images/arrows/arrow-right.svg" alt="" width={24} height={24} style={{ filter: "brightness(0) invert(1)" }} />
        </Link>
      </div>

      {/* Decorative background image */}
      <div className={styles.decoration}>
        <Image
          src="/images/dotted-line5.svg"
          alt=""
          width={250}
          height={200}
          className={styles.decorationImg}
        />
      </div>
    </section>
  );
}

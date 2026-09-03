"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import CountUp from "react-countup";
import { useTranslation } from "@/hooks/useTranslation";
import styles from "./B2BStats.module.scss";

export default function B2BStats() {
  const { t } = useTranslation("b2b");
  const ref = useRef<HTMLDivElement>(null);
  const [started, setStarted] = useState(false);

  const stats = [
    { end: 1000, prefix: "+", suffix: "", separator: ",", label: t("whyUs.travelersServed", "Travelers Served") },
    { end: 26,  prefix: "+", suffix: "",  label: t("whyUs.experience", "Experience in Egypt Tourism") },
    { end: 100, prefix: "", suffix: "%",  label: t("whyUs.personalized", "Personalized Experiences") },
  ];

  const badgesRow1 = [
    t("whyUs.badgeGoals", "Goals to Experience"),
    t("whyUs.badgeCustom", "Custom Egypt Tour Packages"),
    t("whyUs.badgeGroup", "Group Travel Programs"),
    t("whyUs.badgeLuxury", "Luxury Egypt Experience"),
  ];

  const badgesRow2 = [
    t("whyUs.badgeMulti", "Multi-Destination Programs"),
    t("whyUs.badgeFit", "FIT & Tailor-Made Travel"),
    t("whyUs.badgeCruise", "Nile Cruise Packages"),
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStarted(true);
          observer.disconnect();
        }
      },
      { threshold: 0.4, rootMargin: "0px 0px -60px 0px" }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section className={styles.section}>
      {/* Dotted airplane decoration — top right */}
      <div className={styles.decoration} aria-hidden="true">
        <Image src="/images/dotted-line3.svg" alt="" width={355} height={266} />
      </div>

      <div className={styles.header}>
        <h2 className={styles.title}>{t("whyUs.title", "Why Us")}</h2>
        <p className={styles.subtitle}>
          {t("whyUs.subtitle", "We Don't Just Organize Events. We Take Ownership of the Experience")}
        </p>
      </div>

      <div className={styles.statsWrapper}>
        <div className={styles.statsGrid} ref={ref}>
          {stats.map((stat, idx) => (
            <div key={idx} className={styles.statItem}>
              <span className={styles.value}>
                {started ? (
                  <CountUp
                    start={0}
                    end={stat.end}
                    prefix={stat.prefix}
                    suffix={stat.suffix}
                    separator={stat.separator || ""}
                    duration={2}
                  />
                ) : (
                  `${stat.prefix}0${stat.suffix}`
                )}
              </span>
              <span className={styles.label}>{stat.label}</span>
            </div>
          ))}
        </div>

        <div className={styles.badgesCard}>
          <div className={styles.badgesRow}>
            {badgesRow1.map((text, idx) => (
              <div key={idx} className={styles.badge}>
                <div className={styles.iconWrap}>
                  <Image src="/images/star-blue.svg" alt="" width={17} height={16} />
                </div>
                <span className={styles.badgeText}>{text}</span>
              </div>
            ))}
          </div>
          <div className={styles.badgesRow}>
            {badgesRow2.map((text, idx) => (
              <div key={idx} className={styles.badge}>
                <div className={styles.iconWrap}>
                  <Image src="/images/star-blue.svg" alt="" width={17} height={16} />
                </div>
                <span className={styles.badgeText}>{text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

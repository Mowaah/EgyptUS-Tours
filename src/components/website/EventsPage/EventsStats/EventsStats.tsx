"use client";

import { useEffect, useRef, useState } from "react";
import CountUp from "react-countup";
import { useTranslation } from "@/hooks/useTranslation";
import styles from "./EventsStats.module.scss";

export default function EventsStats() {
  const { t } = useTranslation("events");
  const ref = useRef<HTMLDivElement>(null);
  const [started, setStarted] = useState(false);

  const stats = [
    { end: 120, prefix: "",  suffix: "+",  label: t("stats.corporateEvents", "Corporate Events") },
    { end: 97,  prefix: "",  suffix: "%",  label: t("stats.clientSatisfaction", "Client Satisfaction") },
    { end: 15,  prefix: "+", suffix: "",   label: t("stats.countriesCovered", "Countries Covered") },
    { end: 10,  prefix: "+", suffix: "K",  label: t("stats.attendeesManaged", "Attendees Managed") },
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
      <div className={styles.container}>
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

        <h4 className={styles.trustTitle}>{t("stats.trustedBy", "TRUSTED BY LEADING ORGANIZATIONS")}</h4>
      </div>
    </section>
  );
}

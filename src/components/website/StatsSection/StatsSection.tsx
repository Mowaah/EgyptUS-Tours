"use client";

import { useEffect, useRef, useState, useMemo } from "react";
import CountUp from "react-countup";
import { useTranslation } from "@/hooks/useTranslation";
import styles from "./StatsSection.module.scss";

export default function StatsSection() {
  const { t } = useTranslation("home");
  const ref = useRef<HTMLDivElement>(null);
  const [started, setStarted] = useState(false);

  const stats = useMemo(() => [
    {
      end: 25,
      suffix: "+ Years",
      description: t("statsSection.stat1Desc", "Creating memorable travel experiences in Egypt since 2000, backed by decades of experience in the tourism industry."),
    },
    {
      end: 1000,
      suffix: "+",
      separator: ",",
      description: t("statsSection.stat2Desc", "Travelers have trusted us to experience Egypt with personalized journeys, professional support, and dedicated service."),
    },
    {
      end: 100,
      suffix: "%",
      description: t("statsSection.stat3Desc", "Personalized experiences designed around your interests, travel style, and the way you want to discover Egypt."),
    },
  ], [t]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStarted(true);
          observer.disconnect();
        }
      },
      { threshold: 0.5, rootMargin: "0px 0px -80px 0px" }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section className={styles.section} ref={ref}>
      <div className={styles.container}>
        {stats.map((stat, i) => (
          <div key={i} className={styles.stat}>
            <span className={styles.value}>
              {started ? (
                <CountUp
                  end={stat.end}
                  suffix={stat.suffix}
                  separator={stat.separator || ""}
                  duration={2}
                />
              ) : (
                `0${stat.suffix}`
              )}
            </span>
            <p className={styles.description}>{stat.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

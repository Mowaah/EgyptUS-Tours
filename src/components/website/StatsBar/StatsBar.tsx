"use client";

import { useEffect, useRef, useState } from "react";
import CountUp from "react-countup";
import { useTranslation } from "@/hooks/useTranslation";
import styles from "./StatsBar.module.scss";

export default function StatsBar() {
  const { t } = useTranslation("home");
  const ref = useRef<HTMLDivElement>(null);
  const [started, setStarted] = useState(false);

  const stats = [
    { end: 10, suffix: "M+", label: t("statsBar.totalCustomers", "Total Customers") },
    { end: 9, suffix: "+", label: t("statsBar.yearsExperience", "Years Of Experience"), formattingFn: (n: number) => `0${n}+` },
    { end: 12, suffix: "K+", label: t("statsBar.totalDestinations", "Total Destinations") },
    { end: 4.9, suffix: "", label: t("statsBar.averageRating", "Average Rating"), decimals: 1 },
  ];

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
    <div className={styles.wrapper} ref={ref}>
      <div className={styles.stats}>
        {stats.map((stat) => (
          <div key={stat.label} className={styles.stat}>
            <span className={styles.value}>
              {started ? (
                <CountUp
                  end={stat.end}
                  suffix={stat.suffix}
                  decimals={stat.decimals ?? 0}
                  formattingFn={stat.formattingFn}
                  duration={2}
                />
              ) : (
                stat.formattingFn ? stat.formattingFn(0) : `0${stat.suffix ?? ""}`
              )}
            </span>
            <span className={styles.label}>{stat.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

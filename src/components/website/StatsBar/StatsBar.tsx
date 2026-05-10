"use client";

import { useEffect, useRef, useState } from "react";
import CountUp from "react-countup";
import styles from "./StatsBar.module.scss";

const STATS = [
  { end: 10, suffix: "M+", label: "Total Customers" },
  { end: 9, suffix: "+", label: "Years Of Experience", formattingFn: (n: number) => `0${n}+` },
  { end: 12, suffix: "K+", label: "Total Destinations" },
  { end: 4.9, suffix: "", label: "Average Rating", decimals: 1 },
];

export default function StatsBar() {
  const ref = useRef<HTMLDivElement>(null);
  const [started, setStarted] = useState(false);

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
        {STATS.map((stat) => (
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

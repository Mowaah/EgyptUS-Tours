"use client";

import { useEffect, useRef, useState } from "react";
import CountUp from "react-countup";
import styles from "./EventsStats.module.scss";

const STATS = [
  { end: 120, prefix: "",  suffix: "+",  label: "Corporate Events" },
  { end: 97,  prefix: "",  suffix: "%",  label: "Client Satisfaction" },
  { end: 15,  prefix: "+", suffix: "",   label: "Countries Covered" },
  { end: 10,  prefix: "+", suffix: "K",  label: "Attendees Managed" },
];

export default function EventsStats() {
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
      { threshold: 0.4, rootMargin: "0px 0px -60px 0px" }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.statsGrid} ref={ref}>
          {STATS.map((stat, idx) => (
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

        <h4 className={styles.trustTitle}>TRUSTED BY LEADING ORGANIZATIONS</h4>
      </div>
    </section>
  );
}

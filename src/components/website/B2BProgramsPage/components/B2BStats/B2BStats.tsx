"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import CountUp from "react-countup";
import styles from "./B2BStats.module.scss";

const STATS = [
  { end: 1000, prefix: "+", suffix: "", separator: ",", label: "Travelers Served" },
  { end: 26,  prefix: "+", suffix: "",  label: "Experience in Egypt Tourism" },
  { end: 100, prefix: "", suffix: "%",  label: "Personalized Experiences" },
];

const BADGES_ROW1 = [
  "Goals to Experience",
  "Custom Egypt Tour Packages",
  "Group Travel Programs",
  "Luxury Egypt Experience",
];

const BADGES_ROW2 = [
  "Multi-Destination Programs",
  "FIT & Tailor-Made Travel",
  "Nile Cruise Packages",
];

export default function B2BStats() {
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
      {/* Dotted airplane decoration — top right */}
      <div className={styles.decoration} aria-hidden="true">
        <Image src="/images/dotted-line3.svg" alt="" width={355} height={266} />
      </div>

      <div className={styles.header}>
        <h2 className={styles.title}>Why Us</h2>
        <p className={styles.subtitle}>
          We Don&apos;t Just Organize Events. We Take Ownership of the Experience
        </p>
      </div>

      <div className={styles.statsWrapper}>
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
            {BADGES_ROW1.map((text, idx) => (
              <div key={idx} className={styles.badge}>
                <div className={styles.iconWrap}>
                  <Image src="/images/star-blue.svg" alt="" width={17} height={16} />
                </div>
                <span className={styles.badgeText}>{text}</span>
              </div>
            ))}
          </div>
          <div className={styles.badgesRow}>
            {BADGES_ROW2.map((text, idx) => (
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

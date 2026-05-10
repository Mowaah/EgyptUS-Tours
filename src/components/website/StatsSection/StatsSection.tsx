"use client";

import { useEffect, useRef, useState } from "react";
import CountUp from "react-countup";
import styles from "./StatsSection.module.scss";

const STATS = [
  {
    end: 73,
    suffix: "K+",
    description:
      "Join the millions who trust us for their travel plans. Our platform has successfully handled over 1 million bookings.",
  },
  {
    end: 99,
    suffix: "%",
    description:
      "Our customers love us! With a 96% satisfaction rate, we pride ourselves on providing exceptional service.",
  },
  {
    end: 1200,
    suffix: "",
    description:
      "Explore the world with us! We offer travel packages to over 200 destinations, giving you a wide range of options!",
  },
];

export default function StatsSection() {
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
    <section className={styles.section} ref={ref}>
      <div className={styles.container}>
        {STATS.map((stat, i) => (
          <div key={i} className={styles.stat}>
            <span className={styles.value}>
              {started ? (
                <CountUp end={stat.end} suffix={stat.suffix} duration={2} />
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

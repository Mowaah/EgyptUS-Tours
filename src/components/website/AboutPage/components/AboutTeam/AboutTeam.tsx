"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import CountUp from "react-countup";
import styles from "./AboutTeam.module.scss";

const STATS = [
  {
    end: 100,
    suffix: "%",
    desc: "Personalized Experiences",
  },
  {
    end: 1000,
    suffix: "+",
    separator: ",",
    desc: "Travelers Served",
  },
  {
    end: 30,
    suffix: "+Years",
    desc: "Experience in Egypt Tourism",
  },
];

export default function AboutTeam() {
  const statsRef = useRef<HTMLDivElement>(null);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStarted(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    if (statsRef.current) observer.observe(statsRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section className={styles.section}>
      <div className={styles.decoration}>
        <Image
          src="/images/dotted-line8.svg"
          alt=""
          width={222}
          height={364}
          className={styles.decorationImg}
        />
      </div>

      <div className={styles.container}>
        <div className={styles.grid}>
          {/* Founder Photo */}
          <div className={styles.imagesWrapper}>
            <div className={styles.singleImageWrap}>
              <Image
                src="/images/team/founder.png"
                alt="Mohamed Abbas - Founder"
                fill
                className={styles.image}
              />
            </div>
          </div>

          {/* Text side */}
          <div className={styles.content}>
            <div className={styles.textSection}>
              <div className={styles.textGroup}>
                <span className={styles.label}>The Founder</span>
                <h2 className={styles.heading}>Meet the Founder Behind the Experience</h2>
                <h3 className={styles.founderName}>Mohamed Abbas</h3>
              </div>

              <div className={styles.paragraphs}>
                <p>
                  With more than <strong>30 years of experience in Egypt&apos;s tourism industry</strong>, Mr. Mohamed Abbas brings extensive knowledge of Egypt&apos;s destinations, history, and travel operations.
                </p>
                <p>
                  As a <strong>Tourism Manager, Egyptologist, and former tour guide</strong>, he combines professional expertise with firsthand experience in creating and managing memorable journeys across Egypt. His deep understanding of the destination and commitment to service have helped shape Egypt Us Tours into a trusted partner for travelers and international tourism professionals.
                </p>
                <p>
                  His philosophy is simple: <strong>great travel starts with local expertise, careful planning, and genuine hospitality.</strong>
                </p>
              </div>
            </div>

            <div className={styles.statsRow} ref={statsRef}>
              {STATS.map((stat, i) => (
                <div key={i} className={styles.statItem}>
                  <span className={styles.statValue}>
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
                  <span className={styles.statDesc}>{stat.desc}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

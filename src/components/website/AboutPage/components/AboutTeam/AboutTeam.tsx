"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import CountUp from "react-countup";
import { useTranslation } from "@/hooks/useTranslation";
import styles from "./AboutTeam.module.scss";

export default function AboutTeam() {
  const { t } = useTranslation("about");
  const statsRef = useRef<HTMLDivElement>(null);
  const [started, setStarted] = useState(false);

  const stats = [
    {
      end: 100,
      suffix: "%",
      desc: t("team.statPersonalized", "Personalized Experiences"),
    },
    {
      end: 1000,
      suffix: "+",
      separator: ",",
      desc: t("team.statTravelers", "Travelers Served"),
    },
    {
      end: 30,
      suffix: "+Years",
      desc: t("team.statExperience", "Experience in Egypt Tourism"),
    },
  ];

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
                <span className={styles.label}>{t("team.label", "The Founder")}</span>
                <h2 className={styles.heading}>{t("team.heading", "Meet the Founder Behind the Experience")}</h2>
                <h3 className={styles.founderName}>{t("team.founderName", "Mohamed Abbas")}</h3>
              </div>

              <div className={styles.paragraphs}>
                <p>
                  {t("team.p1", "With more than 30 years of experience in Egypt's tourism industry, Mr. Mohamed Abbas brings extensive knowledge of Egypt's destinations, history, and travel operations.")}
                </p>
                <p>
                  {t("team.p2", "As a Tourism Manager, Egyptologist, and former tour guide, he combines professional expertise with firsthand experience in creating and managing memorable journeys across Egypt. His deep understanding of the destination and commitment to service have helped shape Egypt Us Tours into a trusted partner for travelers and international tourism professionals.")}
                </p>
                <p>
                  {t("team.p3", "His philosophy is simple: great travel starts with local expertise, careful planning, and genuine hospitality.")}
                </p>
              </div>
            </div>

            <div className={styles.statsRow} ref={statsRef}>
              {stats.map((stat, i) => (
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

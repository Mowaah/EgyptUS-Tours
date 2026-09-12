"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useTranslation } from "@/hooks/useTranslation";
import styles from "./UpcomingTripBanner.module.scss";

export interface UpcomingTrip {
  title: string;
  dates: string;
  duration: string;
  type: string;
  targetDate: Date;
  href?: string;
}

interface CountdownTime {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

function useCountdown(targetDate: Date): CountdownTime {
  const [timeLeft, setTimeLeft] = useState<CountdownTime>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const target = targetDate.getTime();
      const difference = target - now;

      if (difference > 0) {
        return {
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        };
      }
      return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    };

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    setTimeLeft(calculateTimeLeft());

    return () => clearInterval(timer);
  }, [targetDate]);

  return timeLeft;
}

export interface UpcomingTripBannerProps {
  trip: UpcomingTrip;
  className?: string;
}

export default function UpcomingTripBanner({ trip, className = "" }: UpcomingTripBannerProps) {
  const { t } = useTranslation("common");
  const countdown = useCountdown(trip.targetDate);

  const bannerContent = (
    <div className={`${styles.premiumBanner} ${trip.href ? styles.clickable : ""} ${className}`}>
      {/* Background decorations */}
      <div className={styles.bannerDecorations}>
        <div className={styles.grayPlane}>
          <Image
            src="/images/profile/gray-plane.svg"
            alt=""
            width={100}
            height={100}
            aria-hidden="true"
          />
        </div>
        <div className={styles.grayDottedLine}>
          <Image
            src="/images/profile/gray-dotted-line.svg"
            alt=""
            width={200}
            height={100}
            aria-hidden="true"
          />
        </div>
      </div>

      {/* Gradient overlay */}
      <div className={styles.gradientOverlay} />

      <div className={styles.bannerContent}>
        {/* Left side - Trip info */}
        <div className={styles.tripInfo}>
          <div className={styles.upcomingBadge}>
            <span className={styles.dot} />
            <span>{t("profile.upcomingTrip.badge", "UPCOMING TRIP")}</span>
          </div>
          <h2 className={styles.tripTitle}>{trip.title}</h2>
          <div className={styles.tripMeta}>
            <div className={styles.metaRow}>
              <span className={styles.metaItem}>✦ {trip.dates}</span>
              {trip.duration && <span className={styles.metaItem}>✦ {trip.duration}</span>}
            </div>
            {trip.type && <span className={styles.metaItem}>✦ {trip.type}</span>}
          </div>
        </div>

        {/* Right side - Countdown */}
        <div className={styles.countdown}>
          <div className={styles.countdownItem}>
            <div className={styles.countdownValue}>{String(countdown.days).padStart(2, "0")}</div>
            <div className={styles.countdownLabel}>{t("units.days", "Days")}</div>
          </div>
          <span className={styles.separator}>:</span>
          <div className={styles.countdownItem}>
            <div className={styles.countdownValue}>{String(countdown.hours).padStart(2, "0")}</div>
            <div className={styles.countdownLabel}>{t("units.hours", "Hours")}</div>
          </div>
          <span className={styles.separator}>:</span>
          <div className={styles.countdownItem}>
            <div className={styles.countdownValue}>{String(countdown.minutes).padStart(2, "0")}</div>
            <div className={styles.countdownLabel}>{t("units.mins", "Mins")}</div>
          </div>
          <span className={styles.separator}>:</span>
          <div className={styles.countdownItem}>
            <div className={styles.countdownValue}>{String(countdown.seconds).padStart(2, "0")}</div>
            <div className={styles.countdownLabel}>{t("units.secs", "Secs")}</div>
          </div>
        </div>
      </div>
    </div>
  );

  if (trip.href) {
    return (
      <Link href={trip.href} className={styles.linkWrapper}>
        {bannerContent}
      </Link>
    );
  }

  return bannerContent;
}

"use client";

import { useState } from "react";
import Image from "next/image";
import { Trip } from "@/types";
import GlassCard from "@/components/shared/GlassCard/GlassCard";
import styles from "./TripGallery.module.scss";

interface TripGalleryProps {
  trip: Trip;
}

export default function TripGallery({ trip }: TripGalleryProps) {
  const images = trip.images ?? [trip.image];
  const [activeIndex, setActiveIndex] = useState(0);

  const prev = () => setActiveIndex((i) => (i - 1 + images.length) % images.length);
  const next = () => setActiveIndex((i) => (i + 1) % images.length);

  const thumbs = images.slice(1, 5);

  return (
    <div className={styles.gallery}>
      {/* Main image */}
      <div className={styles.main}>
        <Image
          src={images[activeIndex]}
          alt={trip.title}
          fill
          sizes="(max-width: 1024px) 100vw, 75vw"
          className={styles.mainImg}
          priority
        />
        <GlassCard className={styles.counter}>
          {activeIndex + 1} / {images.length}
        </GlassCard>
        <button className={`${styles.arrow} ${styles.arrowLeft}`} onClick={prev} aria-label="Previous">
          <Image src="/images/arrows/pagination-arrow.svg" alt="Previous" width={16} height={16} />
        </button>
        <button className={`${styles.arrow} ${styles.arrowRight}`} onClick={next} aria-label="Next">
          <Image src="/images/arrows/pagination-arrow.svg" alt="Next" width={16} height={16} style={{ transform: "rotate(180deg)" }} />
        </button>
      </div>

      {/* Thumbnails */}
      <div className={styles.thumbs}>
        {thumbs.map((src, i) => (
          <button
            key={i}
            className={`${styles.thumb} ${activeIndex === i + 1 ? styles.thumbActive : ""}`}
            onClick={() => setActiveIndex(i + 1)}
          >
            <Image src={src} alt={`Photo ${i + 2}`} fill sizes="120px" className={styles.thumbImg} />
          </button>
        ))}
      </div>
    </div>
  );
}

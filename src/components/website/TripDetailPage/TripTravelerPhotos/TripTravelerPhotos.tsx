"use client";

import { useState, useRef, UIEvent } from "react";
import Image from "next/image";
import { Trip } from "@/types";
import { useTranslation } from "@/hooks/useTranslation";
import styles from "./TripTravelerPhotos.module.scss";

interface TripTravelerPhotosProps {
  trip: Trip;
}

export default function TripTravelerPhotos({ trip }: TripTravelerPhotosProps) {
  const { t } = useTranslation("trips");
  const photos = trip.travelerPhotos ?? [];
  const viewportRef = useRef<HTMLDivElement>(null);
  const [activeDot, setActiveDot] = useState(0);

  if (!photos.length) return null;

  const dotsCount = Math.min(3, photos.length);

  // Sync active dot with native scroll position
  const handleScroll = (e: UIEvent<HTMLDivElement>) => {
    const target = e.currentTarget;
    const maxScroll = target.scrollWidth - target.clientWidth;
    if (maxScroll <= 0) {
      setActiveDot(0);
      return;
    }
    
    const percentage = target.scrollLeft / maxScroll;
    // Map percentage to one of the 3 dots (index 0, 1, or 2)
    const activeIdx = Math.min(2, Math.round(percentage * 2));
    setActiveDot(activeIdx);
  };

  // Scroll to correct position when dot is clicked
  const handleDotClick = (index: number) => {
    const target = viewportRef.current;
    if (!target) return;

    const maxScroll = target.scrollWidth - target.clientWidth;
    const targetScrollLeft = (index / 2) * maxScroll;

    target.scrollTo({
      left: targetScrollLeft,
      behavior: "smooth"
    });
  };

  return (
    <section id="traveler-photos" className={styles.section}>
      <h2 className={styles.heading}>{t("travelerPhotos.heading", "Taken by Travelers")}</h2>
      
      <div className={styles.carouselWrapper}>
        <div 
          ref={viewportRef}
          className={styles.carouselViewport}
          onScroll={handleScroll}
        >
          <div className={styles.carouselTrack}>
            {photos.map((src, i) => (
              <div key={i} className={styles.photo}>
                <Image 
                  src={src} 
                  alt={`Traveler photo ${i + 1}`} 
                  fill 
                  sizes="(max-width: 768px) 100vw, 300px" 
                  className={styles.img} 
                  priority={i < 3}
                />
              </div>
            ))}
          </div>
        </div>

        {/* 3 Pagination Dots */}
        <div className={styles.pagination}>
          {[...Array(dotsCount)].map((_, i) => (
            <button
              key={i}
              className={`${styles.dot} ${activeDot === i ? styles.dotActive : ""}`}
              onClick={() => handleDotClick(i)}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

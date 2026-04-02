"use client";

import { useState } from "react";
import Image from "next/image";
import { Trip } from "@/types";
import styles from "./TripTravelerPhotos.module.scss";

interface TripTravelerPhotosProps {
  trip: Trip;
}

export default function TripTravelerPhotos({ trip }: TripTravelerPhotosProps) {
  const photos = trip.travelerPhotos ?? [];
  const [page, setPage] = useState(0);
  const totalPages = photos.length;
  // Keep 3 visible at once
  const visible = photos.slice(page, Math.min(page + 3, photos.length));

  if (!photos.length) return null;

  return (
    <section id="traveler-photos" className={styles.section}>
      <h2 className={styles.heading}>Taken by Travelers</h2>
      <div className={styles.container}>
        <div className={styles.grid}>
          {visible.map((src, i) => (
            <div key={i} className={styles.photo}>
              <Image src={src} alt={`Traveler photo ${i + 1}`} fill sizes="400px" className={styles.img} />
            </div>
          ))}
        </div>
        {totalPages > 1 && (
          <div className={styles.dots}>
            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={i}
                className={`${styles.dot} ${page === i ? styles.dotActive : ""}`}
                onClick={() => setPage(i)}
                aria-label={`Page ${i + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

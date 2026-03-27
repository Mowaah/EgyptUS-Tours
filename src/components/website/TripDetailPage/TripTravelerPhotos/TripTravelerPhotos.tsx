"use client";

import { useState } from "react";
import Image from "next/image";
import { Trip } from "@/types";
import styles from "./TripTravelerPhotos.module.scss";

interface TripTravelerPhotosProps {
  trip: Trip;
}

const PHOTOS_PER_PAGE = 3;

export default function TripTravelerPhotos({ trip }: TripTravelerPhotosProps) {
  const photos = trip.travelerPhotos ?? [];
  const [page, setPage] = useState(0);
  const totalPages = Math.ceil(photos.length / PHOTOS_PER_PAGE);
  const visible = photos.slice(page * PHOTOS_PER_PAGE, page * PHOTOS_PER_PAGE + PHOTOS_PER_PAGE);

  if (!photos.length) return null;

  return (
    <section id="traveler-photos" className={styles.section}>
      <h2 className={styles.heading}>Taken by Travelers</h2>
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
    </section>
  );
}

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

  if (!photos.length) return null;

  return (
    <section id="traveler-photos" className={styles.section}>
      <h2 className={styles.heading}>Taken by Travelers</h2>
      <div className={styles.container}>
        <div className={styles.grid}>
          {photos.map((src, i) => (
            <div key={i} className={styles.photo}>
              <Image src={src} alt={`Traveler photo ${i + 1}`} fill sizes="(max-width: 768px) 100vw, 400px" className={styles.img} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

"use client";

import React from "react";
import Image from "next/image";
import styles from "./page.module.scss";

interface ItineraryDay {
  dayNumber: number;
  title: string;
  subtitle: string;
  description: string;
  highlights: string[];
  imageName: string;
  imageSize: string;
}

function DayCard({ day }: { day: ItineraryDay }) {
  return (
    <div className={styles.dayCard}>
      <div className={styles.dayHeader}>
        <div className={styles.dayIcon}>
          <Image src="/images/dashboard/catalog/trips/day.svg" alt="" width={20} height={20} />
        </div>
        <h3>Day {day.dayNumber}</h3>
      </div>

      <div className={styles.formContainer}>
        <div className={styles.fieldGroup}>
          <label className={styles.label}>Day Title</label>
          <div className={styles.input}>
            {day.title}
          </div>
        </div>

        <div className={styles.fieldGroup}>
          <label className={styles.label}>Short Subtitle</label>
          <div className={styles.input}>
            {day.subtitle}
          </div>
        </div>

        <div className={styles.fieldGroup}>
          <label className={styles.label}>Day Description</label>
          <div className={styles.textarea}>
            {day.description}
          </div>
        </div>

        <div className={styles.fieldGroup}>
          <label className={styles.label}>Highlights</label>
          <div className={styles.highlightsGroup}>
            {day.highlights.map((highlight, index) => (
              <div key={index} className={styles.highlightInput}>
                {highlight}
              </div>
            ))}
          </div>
        </div>

        <div className={styles.fieldGroup}>
          <label className={styles.label}>Image ( 663 x 528 )</label>
          <div className={styles.fileUpload}>
            <Image src="/images/dashboard/file/png.svg" alt="" width={40} height={40} className={styles.fileIcon} />
            <div className={styles.fileInfo}>
              <p className={styles.fileName}>{day.imageName}</p>
              <p className={styles.fileSize}>{day.imageSize} of {day.imageSize}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function TripItineraryPage() {
  // Mock data representing what the backend API will return
  const itineraryDays: ItineraryDay[] = [
    {
      dayNumber: 1,
      title: "Valley of the Kings & Hatshepsut",
      subtitle: "Pharaohs & Royal Tombs",
      description: "Morning tour of the Valley of the Kings, explore the tombs...",
      highlights: ["Arrival in Luxor", "Arrival in Luxor"],
      imageName: "Description of the problem.png",
      imageSize: "200 KB",
    },
    {
      dayNumber: 2,
      title: "Valley of the Kings & Hatshepsut",
      subtitle: "Pharaohs & Royal Tombs",
      description: "Morning tour of the Valley of the Kings, explore the tombs...",
      highlights: ["Arrival in Luxor", "Arrival in Luxor"],
      imageName: "Description of the problem.png",
      imageSize: "200 KB",
    },
  ];

  return (
    <div className={styles.container}>
      <div className={styles.pageHeader}>
        <div className={styles.headerIcon}>
          <Image src="/images/dashboard/catalog/trips/itinerary.svg" alt="" width={24} height={24} />
        </div>
        <h2>Day-by-Day Itinerary</h2>
      </div>

      <div className={styles.daysGrid}>
        {itineraryDays.map((day) => (
          <DayCard key={day.dayNumber} day={day} />
        ))}
      </div>
    </div>
  );
}

"use client";

import Image from "next/image";
import styles from "./page.module.scss";
import { useTripDetailContext } from "../layout";

interface ItineraryDay {
  dayNumber: number;
  title: string;
  subtitle: string;
  description: string;
  highlights: string[];
  imageName: string;
  imageSize: string;
}

interface ApiItineraryDay {
  id?: number | string;
  day_number: number;
  title?: string;
  subtitle?: string;
  description?: string;
  highlights?: string[];
  image_url?: string | null;
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
          <div className={styles.input}>{day.title}</div>
        </div>

        <div className={styles.fieldGroup}>
          <label className={styles.label}>Short Subtitle</label>
          <div className={styles.input}>{day.subtitle}</div>
        </div>

        <div className={styles.fieldGroup}>
          <label className={styles.label}>Day Description</label>
          <div className={styles.textarea}>{day.description}</div>
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
              <p className={styles.fileSize}>{day.imageSize}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function TripItineraryPage() {
  const { trip, loading } = useTripDetailContext();

  if (loading || !trip) {
    return <div style={{ padding: "24px" }}>Loading...</div>;
  }

  const itineraryDays: ApiItineraryDay[] = trip.itinerary_days || [];

  return (
    <div className={styles.container}>
      <div className={styles.pageHeader}>
        <div className={styles.headerIcon}>
          <Image src="/images/dashboard/catalog/trips/itinerary.svg" alt="" width={24} height={24} />
        </div>
        <h2>Day-by-Day Itinerary</h2>
      </div>

      {itineraryDays.length === 0 ? (
        <p style={{ color: "#9ca3af", fontSize: "14px", padding: "24px 0" }}>No itinerary days have been added yet.</p>
      ) : (
        <div className={styles.daysGrid}>
          {itineraryDays.map((day) => (
            <DayCard
              key={day.id || day.day_number}
              day={{
                dayNumber: day.day_number,
                title: day.title || "",
                subtitle: day.subtitle || "",
                description: day.description || "",
                highlights: day.highlights || [],
                imageName: day.image_url ? day.image_url.split("/").pop() || "image.jpg" : "No image",
                imageSize: day.image_url ? "Uploaded image" : "No image uploaded",
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}

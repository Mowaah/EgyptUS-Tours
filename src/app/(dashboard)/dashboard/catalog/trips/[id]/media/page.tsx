"use client";

import React from "react";
import Image from "next/image";
import styles from "./page.module.scss";
import { useTripDetailContext } from "../layout";

interface MediaItemProps {
  title: string;
  imageSrc: string;
  imgTitleLabel: string;
  imgTitleValue: string;
  imgAltLabel: string;
  imgAltValue: string;
}

interface TripMediaItem {
  id?: number | string;
  kind?: string;
  image_url?: string;
  caption?: string;
  translations?: {
    en?: {
      alt?: string;
      title?: string;
      caption?: string;
    };
  };
}

function MediaCard({
  title,
  imageSrc,
  imgTitleLabel,
  imgTitleValue,
  imgAltLabel,
  imgAltValue,
}: MediaItemProps) {
  return (
    <div className={styles.mediaCard}>
      <div className={styles.cardHeader}>
        <div className={styles.headerIcon}>
          <Image src="/images/dashboard/fields/document-upload.svg" alt="" width={20} height={20} />
        </div>
        <h3>{title}</h3>
      </div>

      <div className={styles.attachmentSection}>
        <div className={styles.imageWrapper}>
          {imageSrc ? (
            <Image 
              src={imageSrc} 
              alt={imgTitleValue || "Trip Image"} 
              width={698} 
              height={352} 
              className={styles.tripImage}
              priority
              unoptimized
            />
          ) : (
            <div style={{ width: 698, height: 352, display: "flex", alignItems: "center", justifyContent: "center", background: "#f3f4f6", borderRadius: "8px", color: "#9ca3af" }}>
              No Image Uploaded
            </div>
          )}
        </div>
      </div>

      <div className={styles.infoArea}>
        <div className={styles.fieldsRow}>
          <div className={styles.fieldGroup}>
            <span className={styles.fieldLabel}>{imgTitleLabel}</span>
            <div className={styles.fieldValue}>
              {imgTitleValue || "N/A"}
            </div>
          </div>

          <div className={styles.fieldGroup}>
            <span className={styles.fieldLabel}>{imgAltLabel}</span>
            <div className={styles.fieldValue}>
              {imgAltValue || "N/A"}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function TripMediaPage() {
  const { trip, loading } = useTripDetailContext();

  if (loading || !trip) {
    return <div style={{ padding: "24px" }}>Loading...</div>;
  }

  const mediaItems: TripMediaItem[] = trip.media_items || [];
  const heroImageUrl = trip.hero_image_url;

  return (
    <div className={styles.container}>
      <div className={styles.pageHeader}>
        <div className={styles.headerIcon}>
          <Image src="/images/dashboard/fields/document-upload.svg" alt="" width={24} height={24} />
        </div>
        <h2>Media & Gallery</h2>
      </div>

      <div className={styles.mediaGrid}>
        {heroImageUrl && (
        <MediaCard
            title="Hero / Banner Image"
            imageSrc={heroImageUrl}
            imgTitleLabel="Caption / Title"
            imgTitleValue={trip.title}
            imgAltLabel="Image Type"
            imgAltValue="Hero Banner"
          />
        )}

        {mediaItems.map((item, idx: number) => {
          const kindLabel = item.kind === "hero" ? "Hero Image" : item.kind === "traveler_photo" ? "Traveler Photo" : `Gallery Photo ${idx + 1}`;
          const translated = item.translations?.en || {};
          return (
            <MediaCard
              key={item.id || idx}
              title={kindLabel}
              imageSrc={item.image_url || ""}
              imgTitleLabel="Image Title"
              imgTitleValue={translated.title || item.caption || "No title"}
              imgAltLabel="Image Alt"
              imgAltValue={translated.alt || item.caption || item.kind || "gallery"}
            />
          );
        })}

        {!heroImageUrl && mediaItems.length === 0 && (
          <p style={{ color: "#9ca3af", fontSize: "14px", padding: "24px 0" }}>No media items or hero images have been uploaded for this trip yet.</p>
        )}
      </div>
    </div>
  );
}

"use client";

import React from "react";
import Image from "next/image";
import { useHotelDetailContext } from "../layout";
import styles from "./page.module.scss";

interface MediaItemProps {
  title: string;
  imageSrc: string;
  attachmentInfo: string;
  imgTitleLabel: string;
  imgTitleValue: string;
  imgAltLabel: string;
  imgAltValue: string;
}

function MediaCard({
  title,
  imageSrc,
  attachmentInfo,
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
        <span className={styles.attachmentLabel}>{attachmentInfo}</span>
        <div className={styles.imageWrapper}>
          <Image 
            src={imageSrc} 
            alt={imgTitleValue || title} 
            width={698} 
            height={352} 
            className={styles.tripImage}
            unoptimized={imageSrc.startsWith("http") || imageSrc.startsWith("data:")}
            priority
          />
        </div>
      </div>

      <div className={styles.infoArea}>
        <div className={styles.fieldsRow}>
          <div className={styles.fieldGroup}>
            <span className={styles.fieldLabel}>{imgTitleLabel}</span>
            <div className={styles.fieldValue}>
              {imgTitleValue || "-"}
            </div>
          </div>

          <div className={styles.fieldGroup}>
            <span className={styles.fieldLabel}>{imgAltLabel}</span>
            <div className={styles.fieldValue}>
              {imgAltValue || "-"}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function HotelMediaPage() {
  const { hotel, loading } = useHotelDetailContext();

  if (loading) {
    return <div className={styles.container}>Loading media...</div>;
  }

  const rawMediaItems: any[] = Array.isArray(hotel?.media_items) ? hotel.media_items : [];

  const heroMedia = rawMediaItems.find((m) => m?.kind === "hero") || (hotel?.hero_image_url ? { image_url: hotel?.hero_image_url, kind: "hero" } : null);
  const galleryMedia = rawMediaItems.filter((m) => m?.kind === "gallery");

  const mediaList = [heroMedia, ...galleryMedia].filter(Boolean);

  const mediaCards = mediaList.map((item, index) => {
    const isHero = index === 0;
    const mediaTranslations = item?.translations?.en || {};
    const title = isHero ? "Upload Thumbnail" : index === 1 ? "Upload Image" : `Photo Gallery ${index}`;
    const attachmentInfo = isHero ? "Attachment (303 x 202)" : "Attachment (1100 x 552)";
    const imageSrc = item?.image_url || item?.image || item?.file || "/images/dashboard/catalog/hotels/roomtype.jpg";
    const imgTitleValue = mediaTranslations.title || item?.caption || "";
    const imgAltValue = mediaTranslations.alt || "";

    return {
      title,
      imageSrc,
      attachmentInfo,
      imgTitleLabel: "Image Title",
      imgTitleValue,
      imgAltLabel: "Image Alt",
      imgAltValue,
    };
  });

  return (
    <div className={styles.container}>
      <div className={styles.pageHeader}>
        <div className={styles.headerIcon}>
          <Image src="/images/dashboard/catalog/trips/media.svg" alt="" width={24} height={24} />
        </div>
        <h2>Hotel Media</h2>
      </div>

      {mediaCards.length === 0 ? (
        <div style={{ padding: "40px 0", textAlign: "center", color: "#6b7280" }}>
          No media items uploaded for this hotel yet.
        </div>
      ) : (
        <div className={styles.mediaGrid}>
          {mediaCards.map((item, index) => (
            <MediaCard key={index} {...item} />
          ))}
        </div>
      )}
    </div>
  );
}

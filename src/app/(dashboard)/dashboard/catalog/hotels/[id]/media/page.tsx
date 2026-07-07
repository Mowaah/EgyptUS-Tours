"use client";

import React from "react";
import Image from "next/image";
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
            alt={imgTitleValue} 
            width={698} 
            height={352} 
            className={styles.tripImage}
            priority
          />
        </div>
      </div>

      <div className={styles.infoArea}>
        <div className={styles.fieldsRow}>
          <div className={styles.fieldGroup}>
            <span className={styles.fieldLabel}>{imgTitleLabel}</span>
            <div className={styles.fieldValue}>
              {imgTitleValue}
            </div>
          </div>

          <div className={styles.fieldGroup}>
            <span className={styles.fieldLabel}>{imgAltLabel}</span>
            <div className={styles.fieldValue}>
              {imgAltValue}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function HotelMediaPage() {
  const mediaItems = [
    {
      title: "Upload Thumbnail",
      imageSrc: "/images/b2b/b2b.jpg",
      attachmentInfo: "Attachment (303 x 202)",
      imgTitleLabel: "Thumbnail Title",
      imgTitleValue: "Thumbnail Title...",
      imgAltLabel: "Thumbnail Alt",
      imgAltValue: "Comma-separated tags (e.g. egypt, travel, cairo)",
    },
    {
      title: "Upload Thumbnail",
      imageSrc: "/images/b2b/b2b2.jpg",
      attachmentInfo: "Attachment (303 x 202)",
      imgTitleLabel: "Image Title",
      imgTitleValue: "Thumbnail Title...",
      imgAltLabel: "Thumbnail Alt",
      imgAltValue: "Comma-separated tags (e.g. egypt, travel, cairo)",
    },
    {
      title: "Photo Gallery 2",
      imageSrc: "/images/b2b/b2b3.jpg",
      attachmentInfo: "Attachment (303 x 202)",
      imgTitleLabel: "Image Title",
      imgTitleValue: "Thumbnail Title...",
      imgAltLabel: "Thumbnail Alt",
      imgAltValue: "Comma-separated tags (e.g. egypt, travel, cairo)",
    },
    {
      title: "Photo Gallery 3",
      imageSrc: "/images/corporate/corporate1.jpg",
      attachmentInfo: "Attachment (303 x 202)",
      imgTitleLabel: "Image Title",
      imgTitleValue: "Thumbnail Title...",
      imgAltLabel: "Thumbnail Alt",
      imgAltValue: "Comma-separated tags (e.g. egypt, travel, cairo)",
    },
    {
      title: "Photo Gallery 4",
      imageSrc: "/images/corporate/corporate2.jpg",
      attachmentInfo: "Attachment (303 x 202)",
      imgTitleLabel: "Image Title",
      imgTitleValue: "Thumbnail Title...",
      imgAltLabel: "Thumbnail Alt",
      imgAltValue: "Comma-separated tags (e.g. egypt, travel, cairo)",
    },
    {
      title: "Photo Gallery 5",
      imageSrc: "/images/corporate/corporate3.jpg",
      attachmentInfo: "Attachment (303 x 202)",
      imgTitleLabel: "Image Title",
      imgTitleValue: "Thumbnail Title...",
      imgAltLabel: "Thumbnail Alt",
      imgAltValue: "Comma-separated tags (e.g. egypt, travel, cairo)",
    },
  ];

  return (
    <div className={styles.container}>
      <div className={styles.pageHeader}>
        <div className={styles.headerIcon}>
          <Image src="/images/dashboard/catalog/trips/media.svg" alt="" width={24} height={24} />
        </div>
        <h2>Hotel Media</h2>
      </div>

      <div className={styles.mediaGrid}>
        {mediaItems.map((item, index) => (
          <MediaCard key={index} {...item} />
        ))}
      </div>
    </div>
  );
}

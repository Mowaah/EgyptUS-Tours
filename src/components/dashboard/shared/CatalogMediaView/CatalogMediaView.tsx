import React from "react";
import Image from "next/image";
import styles from "./CatalogMediaView.module.scss";

export interface MediaCardItem {
  id?: string | number;
  title: string;
  imageSrc: string;
  attachmentInfo?: string;
  imgTitleLabel?: string;
  imgTitleValue: string;
  imgAltLabel?: string;
  imgAltValue: string;
}

export interface CatalogMediaViewProps {
  pageTitle: string;
  headerIconSrc?: string;
  mediaItems: MediaCardItem[];
  emptyMessage?: string;
}

function MediaCard({
  title,
  imageSrc,
  attachmentInfo,
  imgTitleLabel = "Image Title",
  imgTitleValue,
  imgAltLabel = "Image Alt",
  imgAltValue,
}: MediaCardItem) {
  return (
    <div className={styles.mediaCard}>
      <div className={styles.cardHeader}>
        <div className={styles.headerIcon}>
          <Image src="/images/dashboard/fields/document-upload.svg" alt="" width={20} height={20} />
        </div>
        <h3>{title}</h3>
      </div>

      <div className={styles.attachmentSection}>
        {attachmentInfo && <span className={styles.attachmentLabel}>{attachmentInfo}</span>}
        <div className={styles.imageWrapper}>
          {imageSrc ? (
            <Image 
              src={imageSrc} 
              alt={imgTitleValue || "Media Image"} 
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

export function CatalogMediaView({
  pageTitle,
  headerIconSrc = "/images/dashboard/fields/document-upload.svg",
  mediaItems,
  emptyMessage = "No media uploaded yet."
}: CatalogMediaViewProps) {
  return (
    <div className={styles.container}>
      <div className={styles.pageHeader}>
        <div className={styles.headerIcon}>
          <Image src={headerIconSrc} alt="" width={24} height={24} />
        </div>
        <h2>{pageTitle}</h2>
      </div>

      {mediaItems.length === 0 ? (
        <div style={{ padding: "40px 0", textAlign: "center", color: "#6b7280" }}>
          {emptyMessage}
        </div>
      ) : (
        <div className={styles.mediaGrid}>
          {mediaItems.map((item, index) => (
            <MediaCard key={item.id || index} {...item} />
          ))}
        </div>
      )}
    </div>
  );
}

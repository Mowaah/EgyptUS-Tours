"use client";

import Image from "next/image";
import styles from "./page.module.scss";
import { LoadingSpinner } from "@/components/shared";
import { useTripDetailContext } from "../layout";

function normalizeKeywords(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value.map(String).map((keyword) => keyword.trim()).filter(Boolean);
  }
  if (typeof value === "string") {
    return value.split(",").map((keyword) => keyword.trim()).filter(Boolean);
  }
  return [];
}

export default function TripSeoPage() {
  const { trip, loading } = useTripDetailContext();

  if (loading || !trip) {
    return <LoadingSpinner label="Loading SEO settings..." />;
  }

  const seo = trip.seo || trip.translations?.en || {};
  const metaTitle = seo.meta_title || "-";
  const metaDescription = seo.meta_description || "-";
  const keywords = normalizeKeywords(seo.meta_keywords);
  const slug = seo.slug || trip.slug || "-";

  return (
    <div>
      <div className={styles.cardSection}>
        <div className={styles.cardHeader}>
          <div className={styles.headerIcon}>
            <Image src="/images/dashboard/fields/seo-settings.svg" alt="" width={20} height={20} />
          </div>
          <h2 className={styles.cardTitle}>General SEO</h2>
        </div>

        <div className={styles.imageInfoList}>
          <div className={styles.imageInfoItem}>
            <span className={styles.imageInfoLabel}>Meta Title</span>
            <span className={styles.imageInfoValue}>{metaTitle}</span>
          </div>

          <div className={styles.imageInfoItem}>
            <span className={styles.imageInfoLabel}>Meta Description</span>
            <span className={styles.imageInfoValue}>{metaDescription}</span>
          </div>

          <div className={styles.imageInfoItem} style={{ flexDirection: "column", alignItems: "flex-start", gap: "1rem" }}>
            <span className={styles.imageInfoLabel}>Meta Keywords</span>
            {keywords.length > 0 ? (
              <div className={styles.metaKeywordsContainer}>
                {keywords.map((tag, idx) => (
                  <div key={`${tag}-${idx}`} className={styles.metaKeywordTag}>
                    <Image src="/images/dashboard/tag.svg" alt="tag" width={18} height={18} />
                    {tag}
                  </div>
                ))}
              </div>
            ) : (
              <span className={styles.imageInfoValue}>-</span>
            )}
          </div>

          <div className={styles.imageInfoItem}>
            <span className={styles.imageInfoLabel}>Slug</span>
            <span className={styles.imageInfoValue}>{slug}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

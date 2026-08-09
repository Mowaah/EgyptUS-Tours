"use client";

import Image from "next/image";
import styles from "./page.module.scss";
import { LoadingSpinner } from "@/components/shared";
import { useTripDetailContext } from "../layout";
import { getLangKey } from "@/components/dashboard/shared/i18n";

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
  const { trip, loading, activeLang } = useTripDetailContext();

  if (loading || !trip) {
    return <LoadingSpinner label="Loading SEO settings..." />;
  }

  const langKey = getLangKey(activeLang);
  const t = trip.translations?.[langKey] || {};
  const tEn = trip.translations?.en || {};

  const metaTitle = t.meta_title || tEn.meta_title || trip.meta_title || "-";
  const metaDescription = t.meta_description || tEn.meta_description || trip.meta_description || "-";
  const keywords = normalizeKeywords(t.meta_keywords || tEn.meta_keywords || trip.meta_keywords);
  const slug = t.slug || tEn.slug || trip.slug || "-";

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

"use client";

import Image from "next/image";
import { useHotelDetailContext } from "../layout";
import { getLangKey } from "@/components/dashboard/shared/i18n";
import styles from "./page.module.scss";

export default function HotelSeoPage() {
  const { hotel, loading, activeLang } = useHotelDetailContext();

  if (loading) {
    return <div className={styles.cardSection}>Loading SEO data...</div>;
  }

  const langKey = getLangKey(activeLang);
  const translations = hotel?.translations?.[langKey] || {};
  const enTranslations = hotel?.translations?.en || {};
  const metaTitle = translations.meta_title || enTranslations.meta_title || hotel?.meta_title || "-";
  const metaDescription = translations.meta_description || enTranslations.meta_description || hotel?.meta_description || "-";
  const rawKeywords = translations.meta_keywords || enTranslations.meta_keywords || hotel?.meta_keywords || [];
  const metaKeywords = Array.isArray(rawKeywords) ? rawKeywords.join(", ") : String(rawKeywords);
  const slug = translations.slug || enTranslations.slug || hotel?.slug || "-";

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
          
          <div className={styles.imageInfoItem} style={{ flexDirection: 'column', alignItems: 'flex-start', gap: '1rem' }}>
            <span className={styles.imageInfoLabel}>Meta Keywords</span>
            {metaKeywords && metaKeywords !== "-" ? (
              <div className={styles.metaKeywordsContainer}>
                {metaKeywords.split(',').map(tag => tag.trim()).filter(Boolean).map((tag, idx) => (
                  <div key={idx} className={styles.metaKeywordTag}>
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

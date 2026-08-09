"use client";

import Image from "next/image";
import { useVehicleDetailContext } from "../layout";
import { getLangKey } from "@/components/dashboard/shared/i18n";
import styles from "./page.module.scss";

export default function TransportationSeoPage() {
  const { vehicle, loading, activeLang } = useVehicleDetailContext();

  if (loading) return <div>Loading SEO...</div>;
  if (!vehicle) return <div>Vehicle not found.</div>;

  const langKey = getLangKey(activeLang);
  const t = vehicle.translations?.[langKey] || vehicle.translations?.en || {};
  const metaTitle = t.meta_title || "-";
  const metaDescription = t.meta_description || "-";
  const metaKeywords = Array.isArray(t.meta_keywords) ? t.meta_keywords : [];
  const slug = t.slug || "-";

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
            {metaKeywords.length > 0 ? (
              <div className={styles.metaKeywordsContainer}>
                {metaKeywords.map((tag: string, idx: number) => (
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

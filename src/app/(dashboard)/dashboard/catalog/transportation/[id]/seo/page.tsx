"use client";

import Image from "next/image";
import styles from "./page.module.scss";

const SEO_DATA = {
  metaTitle: "Top 10 Things to Do in Cairo | Egypt Tourism Blog",
  metaDescription: "Discover the best experiences Cairo has to offer, from ancient pyramids to vibrant bazaars.",
  metaKeywords: "Cairo Pyramids Tour, Nile Cruise 5 Days, Nile Cruise 5 Days, Nile Cruise 5 Days, Nile Cruise 5 Days, Nile Cruise 5 Days, Nile Cruise 5 Days, Nile Cruise 5 Days, Cairo Pyramids Tour",
  slug: "top-10-things-to-do-in-cairo"
};

export default function TransportationSeoPage() {
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
            <span className={styles.imageInfoValue}>{SEO_DATA.metaTitle}</span>
          </div>
          
          <div className={styles.imageInfoItem}>
            <span className={styles.imageInfoLabel}>Meta Description</span>
            <span className={styles.imageInfoValue}>{SEO_DATA.metaDescription}</span>
          </div>
          
          <div className={styles.imageInfoItem} style={{ flexDirection: 'column', alignItems: 'flex-start', gap: '1rem' }}>
            <span className={styles.imageInfoLabel}>Meta Keywords</span>
            {SEO_DATA.metaKeywords ? (
              <div className={styles.metaKeywordsContainer}>
                {SEO_DATA.metaKeywords.split(',').map(tag => tag.trim()).filter(Boolean).map((tag, idx) => (
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
            <span className={styles.imageInfoValue}>{SEO_DATA.slug}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

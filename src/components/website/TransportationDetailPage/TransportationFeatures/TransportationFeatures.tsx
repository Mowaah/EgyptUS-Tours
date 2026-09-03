import React from 'react';
import Image from 'next/image';
import { useTranslation } from '@/hooks/useTranslation';
import styles from './TransportationFeatures.module.scss';

interface TransportationFeaturesProps {
  features: string[];
}

export default function TransportationFeatures({ features }: TransportationFeaturesProps) {
  const { t } = useTranslation('transportation');
  if (!features || features.length === 0) return null;

  return (
    <section id="features" className={styles.section}>
      <h2 className={styles.title}>{t('features.heading', 'Features & Amenities')}</h2>
      <div className={styles.grid}>
        {features.map((feature, idx) => (
          <div key={idx} className={styles.featureItem}>
            <div className={styles.iconBox}>
               <Image src="/images/check-blue.svg" alt="" width={20} height={20} />
            </div>
            <div className={styles.content}>
               <h3 className={styles.featureTitle} style={{ textTransform: 'capitalize' }}>{feature}</h3>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

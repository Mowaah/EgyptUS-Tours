import React from 'react';
import Image from 'next/image';
import { useTranslation } from '@/hooks/useTranslation';
import styles from './TransportationOverview.module.scss';

interface TransportationOverviewProps {
  description: string;
  luggage?: string;
  luggageCapacity?: number;
  passengers: number;
}

export default function TransportationOverview({
  description,
  luggage,
  luggageCapacity,
  passengers,
}: TransportationOverviewProps) {
  const { t } = useTranslation('transportation');

  let luggageText = luggage || t('overview.standard', 'Standard');
  if (luggageCapacity !== undefined && luggageCapacity !== null && luggageCapacity > 0) {
    luggageText = luggageCapacity === 1
      ? t('overview.suitcaseSingular', '{count} large suitcase').replace('{count}', String(luggageCapacity))
      : t('overview.suitcasePlural', '{count} large suitcases').replace('{count}', String(luggageCapacity));
  }

  const passengerText = passengers === 1
    ? t('overview.passengerSingular', '{count} Passenger').replace('{count}', String(passengers))
    : t('overview.passengerPlural', '{count} Passengers').replace('{count}', String(passengers));

  return (
    <section id="overview" className={styles.section}>
      <h2 className={styles.title}>{t('overview.heading', 'Overview')}</h2>
      
      <div className={styles.descriptionWrap}>
        <p className={styles.description}>
          {description || t('overview.noOverview', 'No overview available.')}
        </p>
      </div>

      <div className={styles.stats}>
        <div className={styles.statItem}>
          <div className={`${styles.iconWrap} ${styles.blue}`}>
            <Image src="/images/large-bag.svg" alt="" width={24} height={24} />
          </div>
          <p className={styles.statValue}>{luggageText}</p>
          <p className={styles.statLabel}>{t('overview.spaciousTrunk', 'Spacious trunk area')}</p>
        </div>

        <div className={styles.statItem}>
          <div className={`${styles.iconWrap} ${styles.orange}`}>
            <Image src="/images/profile2-orange.svg" alt="" width={24} height={24} />
          </div>
          <p className={styles.statValue}>{passengerText}</p>
          <p className={styles.statLabel}>{t('overview.comfortableSeating', 'Comfortable seating')}</p>
        </div>
      </div>
    </section>
  );
}

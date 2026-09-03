import React from 'react';
import Image from 'next/image';
import { useTranslation } from '@/hooks/useTranslation';
import styles from './TransportationOverview.module.scss';

interface TransportationOverviewProps {
  description: string;
  luggage?: string;
  luggageCapacity?: number;
  passengers: number;
  durationHoursMin?: number;
  durationHoursMax?: number;
}

export default function TransportationOverview({
  description,
  luggage,
  luggageCapacity,
  passengers,
  durationHoursMin,
  durationHoursMax
}: TransportationOverviewProps) {
  const { t } = useTranslation('transportation');

  let durationText: string | null = null;
  if (durationHoursMin !== undefined && durationHoursMin !== null) {
    if (durationHoursMin === 24 || durationHoursMax === 24) {
      durationText = t('overview.fullDay', 'Full Day');
    } else if (durationHoursMax && durationHoursMax !== durationHoursMin) {
      durationText = t('overview.hoursRange', '{min}-{max} hours')
        .replace('{min}', String(durationHoursMin))
        .replace('{max}', String(durationHoursMax));
    } else {
      durationText = durationHoursMin === 1
        ? t('overview.oneHour', '1 hour')
        : t('overview.hours', '{count} hours').replace('{count}', String(durationHoursMin));
    }
  } else if (durationHoursMax !== undefined && durationHoursMax !== null) {
    if (durationHoursMax === 24) {
      durationText = t('overview.fullDay', 'Full Day');
    } else {
      durationText = durationHoursMax === 1
        ? t('overview.oneHour', '1 hour')
        : t('overview.hours', '{count} hours').replace('{count}', String(durationHoursMax));
    }
  }

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

        {durationText && (
          <div className={styles.statItem}>
            <div className={`${styles.iconWrap} ${styles.blue}`}>
              <Image src="/images/clock2-blue.svg" alt="" width={24} height={24} />
            </div>
            <p className={styles.statValue}>{durationText}</p>
            <p className={styles.statLabel}>{t('overview.estimatedDuration', 'Estimated duration')}</p>
          </div>
        )}
      </div>
    </section>
  );
}

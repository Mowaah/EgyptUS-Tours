import React from 'react';
import Image from 'next/image';
import styles from './TransportationFeatures.module.scss';

const FEATURES = [
  { id: 1, title: 'Free WiFi', desc: 'High-speed internet throughout', icon: '/images/wifi.svg' },
  { id: 2, title: 'Complimentary Refreshments', desc: 'Bottled water and light snacks', icon: '/images/refreshments.svg' },
  { id: 3, title: 'Climate Control', desc: 'Individual temperature controls', icon: '/images/ac.svg' },
  { id: 4, title: 'Leather Seats', desc: 'Premium Nappa leather upholstery', icon: '/images/seat.svg' },
  { id: 5, title: 'Premium Audio', desc: 'Burmester surround sound system', icon: '/images/audio.svg' },
  { id: 6, title: 'Device Charging', desc: 'USB-C and wireless charging', icon: '/images/power.svg' },
];

export default function TransportationFeatures() {
  return (
    <section id="features" className={styles.section}>
      <h2 className={styles.title}>Features & Amenities</h2>
      <div className={styles.grid}>
        {FEATURES.map((feature) => (
          <div key={feature.id} className={styles.featureItem}>
            <div className={styles.iconBox}>
               <Image src="/images/check-blue.svg" alt="" width={20} height={20} />
            </div>
            <div className={styles.content}>
               <h3 className={styles.featureTitle}>{feature.title}</h3>
               <p className={styles.featureDesc}>{feature.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

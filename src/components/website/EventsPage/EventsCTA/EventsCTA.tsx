import React from 'react';
import Image from 'next/image';
import styles from './EventsCTA.module.scss';

export default function EventsCTA() {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.content}>
          <h2 className={styles.title}>Ready to Plan Your Corporate Event in Egypt?</h2>
          <p className={styles.subtitle}>
            Our expert MICE team will create a customized proposal tailored to your
            organization's specific requirements and objectives.
          </p>
        </div>

        <button className={styles.ctaButton}>
          Request Proposal
          <Image src="/images/arrows/arrow-right.svg" alt="" width={24} height={24} />
        </button>
      </div>

      {/* Decorative background image */}
      <div className={styles.decoration}>
        <Image
          src="/images/dotted-line5.svg"
          alt=""
          width={250}
          height={200}
          className={styles.decorationImg}
        />
      </div>
    </section>
  );
}

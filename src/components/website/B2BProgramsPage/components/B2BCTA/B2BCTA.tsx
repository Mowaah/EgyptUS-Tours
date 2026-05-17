import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import styles from './B2BCTA.module.scss';

export default function B2BCTA() {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.content}>
          <h2 className={styles.title}>
            Let's Build a Corporate Experience Your Team Will{' '}
            <span className={styles.highlight}>Remember</span>
          </h2>
          <p className={styles.subtitle}>And your leadership will appreciate.</p>
        </div>

        <Link href="/b2b-programs/request-proposal" className={styles.ctaButton}>
          Request a Proposal
          <Image src="/images/arrows/arrow-right.svg" alt="" width={24} height={24} style={{ filter: "brightness(0) invert(1)" }} />
        </Link>
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

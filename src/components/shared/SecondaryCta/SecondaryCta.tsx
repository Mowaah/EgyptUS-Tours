import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import styles from './SecondaryCta.module.scss';

export interface SecondaryCtaProps {
  heading?: React.ReactNode;
  description?: string;
  buttonText?: string;
  buttonHref?: string;
  buttonIcon?: React.ReactNode;
  titleClassName?: string;
}

export default function SecondaryCta({
  heading = "Ready to Plan Your Corporate Event in Egypt?",
  description = "Our expert MICE team will create a customized proposal tailored to your organization's specific requirements and objectives.",
  buttonText = "Request Proposal",
  buttonHref = "/events/request-proposal",
  buttonIcon = <Image src="/images/arrows/arrow-right.svg" alt="" width={24} height={24} />,
  titleClassName = "",
}: SecondaryCtaProps) {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.content}>
          <h2 className={`${styles.title} ${titleClassName}`.trim()}>{heading}</h2>
          <p className={styles.subtitle}>{description}</p>
        </div>

        <Link href={buttonHref} className={styles.ctaButton}>
          {buttonText}
          {buttonIcon}
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

import FaqSection from "@/components/website/FaqSection/FaqSection";
import Image from "next/image";
import styles from "./FaqPage.module.scss";
import { FaqData } from "@/services/legalHelpService";

interface Props {
  initialFaqs?: FaqData[];
}

export default function FaqPage({ initialFaqs }: Props) {
  return (
    <div className={styles.page}>
      <header className={styles.headerSection}>
        <div className={styles.decorationWrapper}>
          <Image
            src="/images/dotted-line3.svg"
            alt=""
            width={340}
            height={247}
            className={styles.decoration}
            aria-hidden="true"
          />
        </div>
        <div className={styles.headerInner}>
          <h1 className={styles.title}>Frequently Asked Questions</h1>
          <p className={styles.subtitle}>
            Find quick answers to common questions about our trips, bookings, and services.
          </p>
        </div>
      </header>

      <div className={styles.contentSection}>
        <div className={styles.contentInner}>
          <FaqSection items={initialFaqs && initialFaqs.length > 0 ? initialFaqs : undefined} hideHeader noPadding />
        </div>
      </div>
    </div>
  );
}

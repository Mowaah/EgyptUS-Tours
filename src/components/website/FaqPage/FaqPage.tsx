import FaqSection from "@/components/website/FaqSection/FaqSection";
import Image from "next/image";
import styles from "./FaqPage.module.scss";

export default function FaqPage() {
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
            Find quick answers to common questions about loans, eligibility, and the application process.
          </p>
        </div>
      </header>

      <div className={styles.contentSection}>
        <div className={styles.contentInner}>
          <FaqSection hideHeader noPadding />
        </div>
      </div>
    </div>
  );
}

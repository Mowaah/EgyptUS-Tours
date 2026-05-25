import { Button } from "@/components/shared";
import Image from "next/image";
import styles from "./DesertBannerSection.module.scss";

export default function DesertBannerSection() {
  return (
    <section className={styles.section}>
      <Image
        src="/images/sora.png"
        alt="Desert landscape"
        fill
        priority
        className={styles.bg}
        sizes="(max-width: 768px) 100vw, 1920px"
      />
      <div className={styles.content}>
        <h2 className={styles.heading}>
          Experience the Thrill of <br />Desert Adventures
        </h2>
        <p className={styles.description}>
          Join exciting desert trips and explore the dunes with ease
        </p>
        <Button
          variant="secondary"
          href="/desert"
          className={styles.ctaButton}
          icon={
            <Image src="/images/arrows/arrow-right.svg" alt="" width={16} height={16} />
          }
        >
          Explore more
        </Button>
      </div>
    </section>
  );
}

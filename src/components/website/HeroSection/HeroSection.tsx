import Image from "next/image";
import Button from "@/components/shared/Button/Button";
import SearchBar from "../SearchBar/SearchBar";
import styles from "./HeroSection.module.scss";

export default function HeroSection() {
  return (
    <section className={styles.hero}>
      <div className={styles.background}>
        <div className={styles.overlay} />
      </div>

      <div className={styles.container}>
        <div className={styles.content}>
          <h1 className={styles.heading}>Experience</h1>
          <p className={styles.subheading}>
            History, culture, and adventure
            <br />
            all in one trip
          </p>
          <Button
            variant="primary"
            size="md"
            href="/booking"
            icon={
              <Image
                src="/images/arrows/arrow-right.svg"
                alt=""
                width={24}
                height={24}
                style={{ marginTop: "4px" }}
              />
            }
          >
            Plan your trip
          </Button>
        </div>

        <SearchBar />
      </div>
    </section>
  );
}

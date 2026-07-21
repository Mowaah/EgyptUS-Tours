import Image from "next/image";
import Button from "@/components/shared/Button/Button";
import SearchBar from "../SearchBar/SearchBar";
import { getAllDestinations } from "@/services/destinationsService";
import styles from "./HeroSection.module.scss";

export default async function HeroSection() {
  const backendDestinations = await getAllDestinations();
  const destinations = backendDestinations.map(d => ({
    label: d.name,
    value: d.name,
  }));

  return (
    <section className={styles.hero}>
      <div className={styles.background}>
        <Image
          src="/images/home/hero-bg.png"
          alt=""
          fill
          priority
          quality={100}
          style={{ objectFit: "cover", objectPosition: "center" }}
        />
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

        <div className={styles.searchBarWrapper}>
          <SearchBar destinations={destinations} />
        </div>
      </div>
    </section>
  );
}

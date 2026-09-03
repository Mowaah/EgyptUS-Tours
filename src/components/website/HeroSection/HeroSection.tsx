import Image from "next/image";
import Button from "@/components/shared/Button/Button";
import SearchBar from "../SearchBar/SearchBar";
import { getAllDestinations } from "@/services/destinationsService";
import { cookies } from "next/headers";
import { getTranslation } from "@/i18n";
import { SupportedLanguage } from "@/i18n/types";
import styles from "./HeroSection.module.scss";

export default async function HeroSection() {
  const cookieStore = await cookies();
  const lang = (cookieStore.get("egyptus_lang")?.value || "en") as SupportedLanguage;

  const destinationsData = await getAllDestinations();
  const destinations = destinationsData
    .filter((d) => {
      const name = d.name.trim().toLowerCase();
      const slug = (d.slug || "").trim().toLowerCase();
      return slug !== "egypt" && !name.includes("egypt");
    })
    .map(d => ({
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
          style={{ objectFit: "cover", objectPosition: "center" }}
        />
      </div>

      <div className={styles.container}>
        <div className={styles.content}>
          <h1 className={styles.heading}>{getTranslation(lang, "home", "hero.heading") || "Experience"}</h1>
          <p className={styles.subheading}>
            {getTranslation(lang, "home", "hero.subheadingPart1") || "History, culture, and luxury"}
            <br />
            {getTranslation(lang, "home", "hero.subheadingPart2") || "all in one trip"}
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
            {getTranslation(lang, "home", "hero.planYourTrip") || "Plan your trip"}
          </Button>
        </div>

        <div className={styles.searchBarWrapper}>
          <SearchBar destinations={destinations} />
        </div>
      </div>
    </section>
  );
}

import Image from "next/image";
import { Button, BlurText } from "@/components/shared";
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
    .map((d) => ({
      label: d.translations?.[lang]?.name || d.name,
      value: d.name,
      translations: d.translations,
    }));

  const headingText = getTranslation(lang, "home", "hero.heading") || "Experience";
  const subheadingPart1 = getTranslation(lang, "home", "hero.subheadingPart1") || "History, culture, and luxury";
  const subheadingPart2 = getTranslation(lang, "home", "hero.subheadingPart2") || "all in one trip";

  return (
    <section className={styles.hero}>
      <div className={styles.background}>
        <Image
          src="/images/home/hero-bg.webp"
          alt="Egypt US Tours - History, culture, and luxury all in one trip"
          fill
          priority
          sizes="(max-width: 640px) 100vw, (max-width: 1200px) 100vw, 1920px"
          quality={70}
          style={{ objectFit: "cover", objectPosition: "center" }}
        />
      </div>

      <div className={styles.container}>
        <div className={styles.content}>
          <h1 className={styles.heading}>
            <BlurText
              text={headingText}
              baseDelay={0.05}
              stagger={0.03}
              blur={8}
              distance={14}
              duration={0.5}
            />
          </h1>
          <p className={styles.subheading}>
            <BlurText
              text={subheadingPart1}
              baseDelay={0.32}
              stagger={0.012}
              blur={6}
              distance={8}
              duration={0.45}
            />
            <br />
            <BlurText
              text={subheadingPart2}
              baseDelay={0.6}
              stagger={0.012}
              blur={6}
              distance={8}
              duration={0.45}
            />
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

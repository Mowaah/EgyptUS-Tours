"use client";

import { useRef, useState, useEffect } from "react";
import { Button, SectionHeader, TripCard, PaginationArrows } from "@/components/shared";
import { useTranslation } from "@/hooks/useTranslation";
import { Trip } from "@/types";
import Image from "next/image";
import styles from "./MultiCountrySection.module.scss";

interface MultiCountrySectionProps {
  initialTrips?: Trip[];
}

export default function MultiCountrySection({ initialTrips = [] }: MultiCountrySectionProps) {
  const { t } = useTranslation("home");
  const sliderRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = () => {
    if (sliderRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = sliderRef.current;
      setCanScrollLeft(scrollLeft > 5);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 5);
    }
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener("resize", checkScroll);
    return () => window.removeEventListener("resize", checkScroll);
  }, [initialTrips]);

  const scrollLeft = () => {
    if (sliderRef.current) {
      const card = sliderRef.current.firstElementChild as HTMLElement;
      const step = card ? card.offsetWidth + 24 : 360;
      sliderRef.current.scrollBy({ left: -step, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (sliderRef.current) {
      const card = sliderRef.current.firstElementChild as HTMLElement;
      const step = card ? card.offsetWidth + 24 : 360;
      sliderRef.current.scrollBy({ left: step, behavior: "smooth" });
    }
  };

  return (
    <section className={styles.section}>
      {/* Decorated arrow stuck to the left of the screen */}
      <div className={styles.decoration} aria-hidden="true">
        <Image
          src="/images/trips2.svg"
          alt=""
          width={22}
          height={22}
          className={styles.planeIcon}
        />
        <Image
          src="/images/dotted-line.svg"
          alt=""
          width={293}
          height={354}
          className={styles.dottedLine}
        />
      </div>

      <div className={styles.container}>
        <div className={styles.layout}>
          {/* Left Column: Heading */}
          <div className={styles.leftCol}>
            <SectionHeader
              label={t("multiCountry.label", "Multi country Tours")}
              heading={
                <>
                  {t("multiCountry.headingPart1", "One")} <br className={styles.desktopBreak} />
                  {t("multiCountry.headingPart2", "Journey.")} <br className={styles.desktopBreak} />
                  {t("multiCountry.headingPart3", "Multiple")} <br className={styles.desktopBreak} />
                  {t("multiCountry.headingPart4", "Cultures")}
                </>
              }
              align="left"
              headingClassName={styles.largeHeading}
            />
          </div>

          {/* Right Column: Subtitle + Action row (Button & Arrows) + Cards slider */}
          <div className={styles.rightCol}>
            <div className={styles.headerRight}>
              <p className={styles.description}>
                {t("multiCountry.description", "Why choose one destination when your journey can take you across cultures, landscapes, and stories? Our multi-destination tours bring carefully selected experiences together, making every stop part of one seamless, unforgettable adventure.")}
              </p>
              <div className={styles.actionRow}>
                <Button
                  variant="outline"
                  size="lg"
                  href="/egypttours"
                  icon={
                    <Image
                      src="/images/arrows/arrow-right-blue.svg"
                      alt=""
                      width={16}
                      height={16}
                      style={{ marginTop: "4px" }}
                    />
                  }
                >
                  {t("multiCountry.exploreTours", "Explore Tours")}
                </Button>

                <div className={styles.arrows}>
                  <PaginationArrows
                    layout="inline"
                    onPrev={scrollLeft}
                    onNext={scrollRight}
                    prevDisabled={!canScrollLeft}
                    nextDisabled={!canScrollRight}
                  />
                </div>
              </div>
            </div>

            <div className={styles.grid} ref={sliderRef} onScroll={checkScroll}>
              {initialTrips.map((trip) => (
                <TripCard key={trip.id} trip={trip} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

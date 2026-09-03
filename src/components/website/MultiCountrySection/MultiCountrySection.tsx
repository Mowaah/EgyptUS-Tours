"use client";

import { Button, SectionHeader, TripCard } from "@/components/shared";
import { useTranslation } from "@/hooks/useTranslation";
import { Trip } from "@/types";
import Image from "next/image";
import styles from "./MultiCountrySection.module.scss";

interface MultiCountrySectionProps {
  initialTrips?: Trip[];
}

export default function MultiCountrySection({ initialTrips = [] }: MultiCountrySectionProps) {
  const { t } = useTranslation("home");

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.top}>
          <div className={styles.left}>
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

          <div className={styles.right}>
            <p className={styles.description}>
              {t("multiCountry.description", "Why choose one destination when your journey can take you across cultures, landscapes, and stories? Our multi-destination tours bring carefully selected experiences together, making every stop part of one seamless, unforgettable adventure.")}
            </p>
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
          </div>

        </div>

        <div className={styles.bottom}>
          <div className={styles.decoration}>
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

          <div className={styles.grid}>
            {initialTrips.map((trip) => (
              <TripCard key={trip.id} trip={trip} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

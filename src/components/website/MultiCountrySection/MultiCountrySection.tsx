import { Button, SectionHeader, TripCard } from "@/components/shared";
import { Trip } from "@/types";
import Image from "next/image";
import styles from "./MultiCountrySection.module.scss";



interface MultiCountrySectionProps {
  initialTrips?: Trip[];
}

export default function MultiCountrySection({ initialTrips = [] }: MultiCountrySectionProps) {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.top}>
          <div className={styles.left}>
            <SectionHeader
              label="Multi country Tours"
              heading={
                <>
                  Bridge <br className={styles.desktopBreak} />
                  Cultures In A <br className={styles.desktopBreak} />
                  Single <br className={styles.desktopBreak} />
                  Journey
                </>
              }
              align="left"
              headingClassName={styles.largeHeading}
            />
          </div>

          <div className={styles.right}>
            <p className={styles.description}>
              Discover the world&apos;s most captivating wonders through thoughtfully woven multi-destination tours. We combine local expertise with international standards to connect you deeply with the people, history, and unique beauty of each location on your map
            </p>
            <Button
              variant="outline"
              size="lg"
              href="/trips"
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
              Explore Tours
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

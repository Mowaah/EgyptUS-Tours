import { Button, SectionHeader, TripCard } from "@/components/shared";
import { Trip } from "@/types";
import Image from "next/image";
import styles from "./MultiCountrySection.module.scss";

const DEMO_TRIPS: Trip[] = [
  {
    id: "mc-1",
    title: "8-Day Road From Petra to Cairo",
    description:
      "Lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum",
    image: "/images/home/hero-bg.png",
    location: "Saudi Arabia & Egypt",
    price: 1245,
    currency: "$",
    priceLabel: "From",
    duration: { days: 8, nights: 7 },
    countries: 2,
  },
  {
    id: "mc-2",
    title: "Best Tour of Egypt and Turkey",
    description:
      "Lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum",
    image: "/images/turkey.png",
    location: "Egypt & Turkey",
    price: 3690,
    currency: "$",
    priceLabel: "From",
    duration: { days: 14, nights: 13 },
    countries: 2,
  },
  {
    id: "mc-3",
    title: "Best Tour of Egypt and Turkey",
    description:
      "Lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum",
    image: "/images/home/hero-bg.jpg",
    location: "Saudi Arabia & Egypt",
    price: 3690,
    currency: "$",
    priceLabel: "From",
    duration: { days: 14, nights: 13 },
    countries: 2,
  },
];

export default function MultiCountrySection() {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.top}>
          <div className={styles.left}>
            <SectionHeader
              label="Multi country Tours"
              heading="Bridge Cultures In A Single Journey"
              align="left"
              headingClassName={styles.largeHeading}
              headingMaxWidth="350px"
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
            {DEMO_TRIPS.map((trip) => (
              <TripCard key={trip.id} trip={trip} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

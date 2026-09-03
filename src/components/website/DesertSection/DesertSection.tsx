import { SectionHeader, DestinationCard } from "@/components/shared";
import styles from "./DesertSection.module.scss";

const DESERTS = [
  {
    title: "Western Desert",
    description:
      "Experience the thrill of the Egyptian desert with camel rides and sandboarding adventures.",
    image: "/images/desert/western.png",
  },
  {
    title: "Sinai Desert",
    description:
      "Experience the thrill of the Egyptian desert with camel rides and sandboarding adventures.",
    image: "/images/desert/sinai.png",
  },
  {
    title: "Oasis Desert",
    description:
      "Experience the thrill of the Egyptian desert with camel rides and sandboarding adventures.",
    image: "/images/desert/oasis.jpg",
  },
  {
    title: "Safari Trips",
    description:
      "Experience the thrill of the Egyptian desert with camel rides and sandboarding adventures.",
    image: "/images/desert/safari.jpg",
  },
];

export default function DesertSection() {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <SectionHeader
          label="Desert"
          heading="Beyond the Pyramids, Into the Desert"
          description="From authentic desert encounters to refined retreats, discover hidden gems where ancient traditions, breathtaking landscapes, and modern comfort come together."
          descriptionMaxWidth="750px"
        />

        <div className={styles.cardsWrapper}>
          <div className={styles.cards}>
            {DESERTS.map((desert) => (
              <DestinationCard
                key={desert.title}
                title={desert.title}
                description={desert.description}
                image={desert.image}
                href={`/egypttours?tripType=desert&category=${encodeURIComponent(desert.title)}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

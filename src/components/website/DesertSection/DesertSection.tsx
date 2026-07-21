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
          heading="Reveal Egypt's Desert"
          description="Journey into the heart of the Egyptian wilderness with unmatched elegance. From nomadic festivals to luxury desert retreats, we provide the ultimate VIP passage to Egypt's most hidden gems"
          descriptionMaxWidth="830px"
        />

        <div className={styles.cardsWrapper}>
          <div className={styles.cards}>
            {DESERTS.map((desert) => (
              <DestinationCard
                key={desert.title}
                title={desert.title}
                description={desert.description}
                image={desert.image}
                href={`/trips?tripType=desert&category=${encodeURIComponent(desert.title)}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

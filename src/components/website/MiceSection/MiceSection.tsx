import { SectionHeader, FeatureCard, Button, PaginationArrows } from "@/components/shared";
import Image from "next/image";
import styles from "./MiceSection.module.scss";

const FEATURES = [
  {
    title: "Meetings",
    description: "Executive boardrooms and strategic gatherings",
    color: "#2563EB",
    iconSrc: "/images/mice/meetings.svg",
  },
  {
    title: "Incentives",
    description: "Luxury reward trips and curated team experiences",
    color: "#EF4444",
    iconSrc: "/images/mice/incentives.svg",
  },
  {
    title: "Conferences",
    description: "Large-scale conferences with full technical support",
    color: "#10B981",
    iconSrc: "/images/mice/conferences.svg",
  },
  {
    title: "Exhibitions",
    description: "Professional exhibition spaces and event management",
    color: "#8B5CF6",
    iconSrc: "/images/mice/exhibitions.svg",
  },
];

const GALLERY_IMAGES = [
  "/images/corporate/corporate1.jpg",
  "/images/corporate/corporate2.jpg",
  "/images/corporate/corporate3.jpg",
  "/images/corporate/corporate4.jpg",
  "/images/corporate/corporate5.jpg",
];

export default function MiceSection() {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <SectionHeader
          label="MICE & Corporate Events"
          heading="Host World-Class Business Events in Egypt"
          description="High-level meetings, curated incentives, and world-class exhibitions tailored for leading organizations."
        />

        <div className={styles.features}>
          {FEATURES.map((feature) => (
            <FeatureCard
              key={feature.title}
              icon={
                <Image
                  src={feature.iconSrc}
                  alt=""
                  width={24}
                  height={24}
                />
              }
              title={feature.title}
              description={feature.description}
              color={feature.color}
            />
          ))}
        </div>

        <div className={styles.gallery}>
          <PaginationArrows>
            <div className={styles.galleryGrid}>
              {GALLERY_IMAGES.map((img, i) => (
                <div key={i} className={styles.galleryItem}>
                  <Image
                    src={img}
                    alt={`Corporate event ${i + 1}`}
                    fill
                    sizes="(max-width: 768px) 100vw, 400px"
                    className={styles.galleryImage}
                  />
                </div>
              ))}
            </div>
          </PaginationArrows>
        </div>

        <div className={styles.viewAll}>
          <Button
            variant="outline"
            href="/mice"
            icon={
              <Image
                src="/images/arrow-right-blue.svg"
                alt=""
                width={16}
                height={16}
                style={{ marginTop: "2px" }}
              />
            }
          >
            View Details
          </Button>
        </div>
      </div>
    </section>
  );
}

import { Button, SectionHeader } from "@/components/shared";
import Image from "next/image";
import styles from "./WhyChooseUsSection.module.scss";

const FEATURES = [
  {
    title: "Local Experts",
    description: "Born and raised Egyptians who know every hidden gem",
    color: "#10B981",
    icon: <Image src="/images/whychooseus/location.svg" alt="" width={24} height={24} />,
  },
  {
    title: "Flexible Custom Trips",
    description: "Design your dream journey with our personalized planning",
    color: "#FF6600",
    icon: <Image src="/images/whychooseus/airplane.svg" alt="" width={24} height={24} />,
  },
  {
    title: "24/7 Support",
    description: "Round-the-clock assistance wherever your adventure takes you",
    color: "#FF6600",
    icon: <Image src="/images/whychooseus/headphone.svg" alt="" width={24} height={24} />,
  },
  {
    title: "Multi-language Guides",
    description: "Expert guides fluent in 15+ languages, ensuring smooth communication.",
    color: "#2563EB",
    icon: <Image src="/images/whychooseus/language-circle.svg" alt="" width={24} height={24} />,
  },
  {
    title: "Trusted by Thousands",
    description: "4.9/5 rating from 10,000+ happy travelers",
    color: "#19448A",
    icon: <Image src="/images/whychooseus/star.svg" alt="" width={24} height={24} />,
  },
];

export default function WhyChooseUsSection() {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.grid}>
          <div className={styles.header}>
            <SectionHeader
              label="Why Choose Us"
              heading="Why Choose Us"
              description="We're not just tour operators we're your gateway to authentic Egyptian experiences"
              align="left"
              descriptionMaxWidth="300px"
              showLabel={false}
            />
            <Button
              variant="outline"
              href="/about"
              icon={
                <Image src="/images/arrow-right-blue.svg" alt="" width={16} height={16} />
              }
            >
              About Us
            </Button>
          </div>

          {FEATURES.map((f) => (
            <div
              key={f.title}
              className={styles.card}
              style={{
                backgroundColor: `${f.color}15`,
              }}
            >
              <div
                className={styles.iconBox}
                style={{ color: f.color }}
              >
                {f.icon}
              </div>
              <h3 className={styles.cardTitle} style={{ color: f.color }}>
                {f.title}
              </h3>
              <p className={styles.cardDesc}>{f.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

import { SectionHeader } from "@/components/shared";
import Image from "next/image";
import styles from "./AboutFeatures.module.scss";

const FEATURES = [
  {
    title: "Local Expertise, International Standards",
    description: "Local knowledge with international standards to create seamless, memorable experiences.",
    iconSrc: "/images/whytrustus/blue-earth.svg",
  },
  {
    title: "Experience You Can Trust",
    description: "Since 2000, delivering quality experiences with dedication, care, and attention to detail.",
    iconSrc: "/images/whytrustus/star.svg",
  },
  {
    title: "Dedicated Support",
    description: "With you from planning to the final moments, ensuring everything runs smoothly.",
    iconSrc: "/images/whytrustus/shield-security.svg",
  },
  {
    title: "Quality Over Promises",
    description: "We focus on quality, safety, transparency, and follow-up—not empty promises.",
    iconSrc: "/images/whytrustus/award.svg",
  },
];

export default function AboutFeatures() {
  return (
    <section className={styles.section}>
      {/* Decorative dotted line */}
      <div className={styles.decoration}>
        <Image src="/images/dotted-line6.svg" alt="" width={215} height={215} className={styles.decorationImg} />
      </div>

      <div className={styles.container}>
        <SectionHeader
          label="Why Trust US ?"
          heading="30+ Years of Experience in Egypt & Beyond"
          description="Local expertise, trusted service, and seamless experiences from start to finish"
          descriptionMaxWidth="640px"
          align="center"
        />

        <div className={styles.featuresGrid}>
          {FEATURES.map((feature, idx) => (
            <div key={idx} className={styles.customFeatureCard}>
              <div className={styles.iconBox}>
                <Image src={feature.iconSrc} alt="" width={28} height={28} />
              </div>
              <div className={styles.featureTextContent}>
                <h3 className={styles.featureTitle}>{feature.title}</h3>
                <p className={styles.featureDesc}>{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

import { SectionHeader } from "@/components/shared";
import Image from "next/image";
import styles from "./AboutFeatures.module.scss";

const FEATURES = [
  {
    title: "Local Expertise, Global Standards",
    description: "We combine deep Egyptian knowledge with international best practices to deliver world-class experiences",
    iconSrc: "/images/whytrustus/blue-earth.svg",
  },
  {
    title: "Proven Track Record",
    description: "500+ successful events for Fortune 500 companies, government agencies, and leading organizations",
    iconSrc: "/images/whytrustus/blue-check.svg",
  },
  {
    title: "24/7 Dedicated Support",
    description: "Our team is available around the clock to ensure your event runs smoothly from start to finish",
    iconSrc: "/images/whytrustus/blue-check.svg",
  },
  {
    title: "Continuous Innovation",
    description: "We stay ahead of industry trends to offer cutting-edge solutions and unforgettable experiences",
    iconSrc: "/images/whytrustus/chart-arrow.svg",
  },
];

const BADGES = [
  {
    title: "Licensed & Certified",
    desc: "compliant with Egyptian tourism regulations",
    iconSrc: "/images/whytrustus/green-check.svg",
    color: "#00C950",
    bg: "#F9FFFB"
  },
  {
    title: "Award-Winning",
    desc: "Recognized for excellence in service",
    iconSrc: "/images/whytrustus/award.svg",
    color: "#FF6600",
    bg: "#FFFBF8"
  },
  {
    title: "Secure & Insured",
    desc: "Comprehensive insurance coverage",
    iconSrc: "/images/whytrustus/shield-security.svg",
    color: "#2971E6",
    bg: "#FAFCFF"
  },
  {
    title: "Expert Team",
    desc: "Multilingual professionals at your service",
    iconSrc: "/images/whytrustus/green-profile.svg",
    color: "#00C950",
    bg: "linear-gradient(0deg, rgba(223, 255, 230, 0.2), rgba(223, 255, 230, 0.2)), #FFFFFF"
  }
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
          heading="Built on Trust, Proven by Results"
          description="We've earned the confidence of leading organizations worldwide through consistent excellence, transparency, and dedication to our clients' success."
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

        <div className={styles.badgesGrid}>
          {BADGES.map((badge, idx) => (
            <div key={idx} className={styles.badgeCard} style={{ background: badge.bg }}>
              <div className={styles.badgeIcon} style={{ color: badge.color }}>
                <Image src={badge.iconSrc} alt="" width={32} height={32} />
              </div>
              <h4 className={styles.badgeTitle}>{badge.title}</h4>
              <span className={styles.badgeDesc}>{badge.desc}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

"use client";

import { PageHeader, SecondaryCta } from "@/components/shared";
import AboutStory from "./components/AboutStory/AboutStory";
import AboutFeatures from "./components/AboutFeatures/AboutFeatures";
import AboutTeam from "./components/AboutTeam/AboutTeam";
import ContactSection from "@/components/website/ContactSection/ContactSection";
import Image from "next/image";
import styles from "./AboutPage.module.scss";

export default function AboutPage() {
  return (
    <div className={styles.page}>
      <PageHeader
        breadcrumbs={[
          { label: "About Us", isCurrent: true },
        ]}
        title="Where Corporate Vision Becomes Experience"
        subtitle="We transform strategic objectives into seamless travel and event solutions tailored for modern organizations."
        decorationSrc="/images/dotted-line3.svg"
      />

      <AboutStory />
      <AboutFeatures />
      <AboutTeam />

      <div className={styles.contactWrapper}>
        <ContactSection />
      </div>

      <SecondaryCta
        heading={<>Ready to Start Your <span style={{ color: "#FF6600" }}>Egyptian</span> Journey?</>}
        description="Let us create an unforgettable experience tailored to your dreams and goals."
        buttonText="Explore Destinations"
        buttonHref="/destinations"
        buttonIcon={<Image src="/images/search.svg" alt="" width={24} height={24} style={{ transform: "scaleX(-1)", filter: "brightness(0) invert(1)" }} />}
        titleClassName={styles.customCtaTitle}
      />
    </div>
  );
}

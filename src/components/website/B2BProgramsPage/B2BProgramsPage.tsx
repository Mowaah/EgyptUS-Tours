"use client";

import { PageHeader, DetailGallery } from "@/components/shared";
import B2BOverview from "./components/B2BOverview/B2BOverview";
import B2BFeatures from "./components/B2BFeatures/B2BFeatures";
import B2BProcess from "./components/B2BProcess/B2BProcess";
import B2BStats from "./components/B2BStats/B2BStats";
import B2BTestimonials from "./components/B2BTestimonials/B2BTestimonials";
import B2BCaseStudy from "./components/B2BCaseStudy/B2BCaseStudy";
import B2BCTA from "./components/B2BCTA/B2BCTA";
import styles from "./B2BProgramsPage.module.scss";

// Reusing MOCK_IMAGES or replacing with actual B2B images
const MOCK_IMAGES = [
  "/images/b2bpage/b2b1.jpg",
  "/images/b2bpage/b2b2.jpg",
  "/images/b2bpage/b2b3.jpg",
  "/images/b2bpage/b2b4.jpg",
  "/images/b2bpage/b2b5.jpg",
];

export default function B2BProgramsPage() {
  return (
    <div className={styles.page}>
      <PageHeader
        className={styles.pageHeader}
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "B2B Programs", isCurrent: true },
        ]}
        title="Corporate Travel & Event Experiences Designed for Results"
        subtitle="From executive retreats to large-scale company events — we handle everything with precision."
        decorationSrc="/images/dotted-line3.svg"
        titleMaxWidth="950px"
        subtitleMaxWidth="900px"
      />

      <div className={styles.heroSection}>
        <div className={styles.galleryWrap}>
          <DetailGallery images={MOCK_IMAGES} title="Corporate Travel Experiences" />
        </div>
      </div>

      <div className={styles.container}>
        <B2BOverview />
        <B2BFeatures />
        <B2BProcess />
      </div>
      <B2BStats />
      <div className={styles.container}>
        <B2BTestimonials />
        <B2BCaseStudy />
      </div>
      <B2BCTA />
    </div>
  );
}

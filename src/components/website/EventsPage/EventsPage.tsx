"use client";

import { PageHeader, DetailGallery, DetailTabNav } from "@/components/shared";
import EventsOverview from "./EventsOverview/EventsOverview";
import EventsFeatures from "./EventsFeatures/EventsFeatures";
import EventsProcess from "./EventsProcess/EventsProcess";
import EventsStats from "./EventsStats/EventsStats";
import EventsFeatured from "./EventsFeatured/EventsFeatured";
import EventsSuccessStories from "./EventsSuccessStories/EventsSuccessStories";
import EventsCTA from "./EventsCTA/EventsCTA";
import styles from "./EventsPage.module.scss";

const TABS = [
  { id: "overview", label: "Overview" },
  { id: "features", label: "Features" },
  { id: "accessibility", label: "Accessibility" },
];

const MOCK_IMAGES = [
  "/images/events4.jpg",
  "/images/events2.jpg",
  "/images/events3.jpg",
  "/images/events1.png",
  "/images/events5.jpg",
];

export default function EventsPage() {
  return (
    <div className={styles.page}>
      <PageHeader
        className={styles.pageHeader}
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "MICE & Corporate Events", isCurrent: true },
        ]}
        title="Professional Corporate Events & MICE Solutions in Egypt"
        subtitle="From executive meetings to large-scale conferences and incentive retreats — we handle everything."
        decorationSrc="/images/dotted-line3.svg"
        titleMaxWidth="900px"
        subtitleMaxWidth="900px"
      />

      <div className={styles.heroSection}>
        <div className={styles.galleryWrap}>
          <DetailGallery images={MOCK_IMAGES} title="Corporate Events in Egypt" />
        </div>
      </div>

      <DetailTabNav tabs={TABS} />

      <div className={styles.container}>
        <EventsOverview />
        <EventsFeatures />
        <EventsProcess />
        <EventsStats />
        <EventsFeatured />
        <EventsSuccessStories />
      </div>
      <EventsCTA />
    </div>
  );
}

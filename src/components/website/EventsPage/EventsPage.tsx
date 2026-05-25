"use client";

import { PageHeader, DetailGallery } from "@/components/shared";
import EventsOverview from "./EventsOverview/EventsOverview";
import EventsBookingWidget from "./EventsBookingWidget/EventsBookingWidget";
import EventsFeatures from "./EventsFeatures/EventsFeatures";
import EventsProcess from "./EventsProcess/EventsProcess";
import EventsStats from "./EventsStats/EventsStats";
import EventsFeatured from "./EventsFeatured/EventsFeatured";
import EventsSuccessStories from "./EventsSuccessStories/EventsSuccessStories";
import EventsCTA from "./EventsCTA/EventsCTA";
import styles from "./EventsPage.module.scss";

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

      <div className={styles.container}>
        <div className={styles.withSidebar}>
          <div className={styles.mainContent}>
            <EventsOverview />
          </div>
          <div className={styles.bookingSidebar}>
            <EventsBookingWidget />
          </div>
        </div>
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

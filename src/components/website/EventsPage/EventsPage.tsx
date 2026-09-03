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
import { useTranslation } from "@/hooks/useTranslation";
import styles from "./EventsPage.module.scss";

const GALLERY_IMAGES = [
  "/images/events1.png",
  "/images/events2.png",
  "/images/events3.png",
  "/images/events4.png",
  "/images/events5.png",
];
import type { TestimonialData } from "@/services/testimonialsService";

interface EventsPageProps {
  testimonials?: TestimonialData[];
}

export default function EventsPage({ testimonials }: EventsPageProps) {
  const { t } = useTranslation("events");

  return (
    <div className={styles.page}>
      <PageHeader
        className={styles.pageHeader}
        breadcrumbs={[
          { label: t("header.breadcrumb", "MICE & Corporate Events"), isCurrent: true },
        ]}
        title={t("header.title", "Professional Corporate Events & MICE Solutions in Egypt")}
        subtitle={t("header.subtitle", "From executive meetings to large-scale conferences and incentive retreats — we handle everything.")}
        decorationSrc="/images/dotted-line3.svg"
        titleMaxWidth="900px"
        subtitleMaxWidth="900px"
      />

      <div className={styles.heroSection}>
        <div className={styles.galleryWrap}>
          <DetailGallery images={GALLERY_IMAGES} title={t("header.galleryTitle", "Corporate Events in Egypt")} />
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
        <EventsSuccessStories testimonials={testimonials} />
      </div>
      <EventsCTA />
    </div>
  );
}

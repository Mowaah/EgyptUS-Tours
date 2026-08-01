"use client";

import { useState } from "react";
import { Trip } from "@/types";
import { COUNTRIES } from "@/data/countries";
import { PageHeader, DetailGallery, DetailHeroBar, DetailTabNav } from "@/components/shared";
import Image from "next/image";
import Link from "next/link";
import Button from "@/components/shared/Button/Button";
import TripOverview from "./TripOverview/TripOverview";
import TripInclusions from "./TripInclusions/TripInclusions";
import TripExclusions from "./TripExclusions/TripExclusions";
import TripBookingWidget from "./TripBookingWidget/TripBookingWidget";
import TripTravelerPhotos from "./TripTravelerPhotos/TripTravelerPhotos";
import TripAvailability from "./TripAvailability/TripAvailability";
import TripItinerary from "./TripItinerary/TripItinerary";
import TripPricing from "./TripPricing/TripPricing";
import TripImportantLinks from "./TripImportantLinks/TripImportantLinks";
import TripVIPExperiences from "./TripVIPExperiences/TripVIPExperiences";
import TripAccommodations from "./TripAccommodations/TripAccommodations";
import TripReviews from "./TripReviews/TripReviews";
import TripMoreTrips from "./TripMoreTrips/TripMoreTrips";
import styles from "./TripDetailPage.module.scss";

import { TestimonialData } from "@/services/testimonialsService";
import { useFavorite } from "@/hooks/useFavorite";

interface TripDetailPageProps {
  trip: Trip;
  testimonials?: TestimonialData[];
}

const TRIP_TABS = [
  { id: "overview", label: "Overview" },
  { id: "included", label: "What's Included" },
  { id: "excluded", label: "What's Not Included" },
  { id: "traveler-photos", label: "Taken by Travelers" },
  { id: "prices-accommodation", label: "Prices & Accommodation" },
  { id: "luxury-accommodations", label: "Luxury Accommodations" },
  { id: "dates-availability", label: "Dates & Availability" },
  { id: "itinerary", label: "Day-by-Day Itinerary" },
  { id: "traveler-reviews", label: "Traveler Reviews" },
  { id: "more-trips", label: "More Inspiring Trips" },
];

export default function TripDetailPage({ trip, testimonials = [] }: TripDetailPageProps) {
  const { isFavorite, isLoading, toggle } = useFavorite({
    slug: trip.id,
    kind: "trip",
    initialFavorite: trip.isFavorite ?? false,
  });

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: trip.title,
          url: window.location.href,
        });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        alert("Link copied to clipboard!");
      }
    } catch (error) {
      console.error("Error sharing:", error);
    }
  };

  return (
    <div className={styles.page}>
      <PageHeader
        className={styles.pageHeader}
        breadcrumbs={[
          { label: "Trips", href: "/trips" },
          { label: "Trip Details", isCurrent: true },
        ]}
        backButton={{ text: "Back to Trips", href: "/trips" }}
        showMobileActions={true}
        isFavorite={isFavorite}
        onFavoriteToggle={toggle}
      />

      {/* ── Gallery & Hero Bar ── */}
      <div className={styles.heroSection}>
        <div className={styles.galleryWrap}>
          <DetailGallery
            images={trip.images || [trip.image]}
            title={trip.title}
            rating={trip.rating ?? 0}
            reviewCount={trip.reviewCount ?? 0}
            description={trip.description}
          />

          <div className={styles.heroOverlay}>
            <DetailHeroBar
              title={trip.title}
              description={trip.description}
              rating={trip.rating ?? 0}
              reviewCount={trip.reviewCount ?? 0}
              isFavorite={isFavorite}
              onFavoriteToggle={toggle}
              location={trip.location || "Luxor & Aswan"}
              duration={`${trip.duration.days} days / ${trip.duration.nights} nights`}
              mobileBrochureButton={
                <Button
                  variant="primary"
                  size="lg"
                  icon={<Image src="/images/brochure.svg" alt="" width={18} height={18} style={{ filter: 'brightness(0) invert(1)' }} />}
                  iconPosition="left"
                >
                  Get the Brochure
                </Button>
              }
            >
              <Button
                variant="outline"
                size="sm"
                className={styles.actionBtn}
                icon={<Image src="/images/brochure.svg" alt="" width={18} height={18} />}
                iconPosition="left"
              >
                Get the Brochure
              </Button>

              <Button
                variant="primary"
                size="sm"
                className={styles.actionBtn}
                icon={<Image src="/images/share.svg" alt="" width={18} height={18} />}
                iconPosition="left"
                onClick={handleShare}
              >
                Share
              </Button>
            </DetailHeroBar>
          </div>
        </div>
      </div>

      {/* ── Sticky Tab Navigation ── */}
      <DetailTabNav tabs={TRIP_TABS} staticNavbarOnDesktop />

      {/* ── Main content sections ── */}
      <div className={styles.container}>
        <div className={styles.withSidebar}>
          {/* ── Main content column ── */}
          <div className={styles.mainContent}>
            <TripOverview trip={trip} />
            <TripInclusions trip={trip} />
            <TripExclusions trip={trip} />
            <TripTravelerPhotos trip={trip} />
          </div>

          {/* ── Sticky booking sidebar ── */}
          <div className={styles.bookingSidebar}>
            <TripBookingWidget trip={trip} />
          </div>
        </div>
      </div>

      {/* ── Full-width pricing section (Swapped here) ── */}
      <TripPricing trip={trip} />

      {/* ── Accommodations (Swapped here) ── */}
      <div className={styles.container}>
        <TripAccommodations trip={trip} />
      </div>

      {/* Dates & Availability Swapped here */}
      <div className={styles.container}>
        <TripAvailability trip={trip} />
      </div>

      <div className={styles.container}>
        {/* Day-by-Day Itinerary */}
        <TripItinerary trip={trip} />
      </div>

      {/* ── Important Links ── */}
      <div className={styles.container}>
        <TripImportantLinks trip={trip} />
      </div>

      {/* ── VIP Experiences (hidden) ──
      <div className={styles.container}>
        <TripVIPExperiences trip={trip} />
      </div>
      */}

      {/* ── Traveler Reviews ── */}
      <div className={styles.container}>
        <TripReviews reviews={testimonials.map(t => {
          const countryEntry = COUNTRIES.find(c => c.code.toUpperCase() === (t.country || '').toUpperCase());
          return {
            name: t.customer_name,
            location: countryEntry?.name || t.country || 'Unknown',
            countryCode: (t.country || '').toLowerCase(),
            rating: t.rating || 5,
            quote: `"${t.description}"`,
            videoUrl: t.video_url || '',
            image: '',
          };
        })} />
      </div>

      {/* ── More Inspiring Trips ── */}
      <div className={styles.container}>
        <TripMoreTrips relatedTrips={trip.relatedTrips} />
      </div>
    </div>
  );
}

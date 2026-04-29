"use client";

import { useState } from "react";
import { Trip } from "@/types";
import { PageHeader, DetailGallery, DetailHeroBar, DetailTabNav } from "@/components/shared";
import Image from "next/image";
import Button from "@/components/shared/Button/Button";
import TripOverview from "./TripOverview/TripOverview";
import TripInclusions from "./TripInclusions/TripInclusions";
import TripExclusions from "./TripExclusions/TripExclusions";
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

interface TripDetailPageProps {
  trip: Trip;
}

const TRIP_TABS = [
  { id: "overview", label: "Overview" },
  { id: "included", label: "What's Included" },
  { id: "excluded", label: "What's Not Included" },
  { id: "traveler-photos", label: "Taken by Travelers" },
  { id: "prices-accommodation", label: "Prices & Accommodation" },
  { id: "itinerary", label: "Day-by-Day Itinerary" },
  { id: "pricing", label: "Pricing" },
  { id: "vip-experiences", label: "VIP Experiences" },
  { id: "reviews", label: "Traveler Reviews" },
  { id: "more-adventures", label: "More Inspiring Adventures" },
];

export default function TripDetailPage({ trip }: TripDetailPageProps) {
  const [isFavorite, setIsFavorite] = useState(trip.isFavorite ?? false);
  const toggleFavorite = () => setIsFavorite((prev) => !prev);

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
        onFavoriteToggle={toggleFavorite}
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
              onFavoriteToggle={toggleFavorite}
              location={trip.location || "Luxor & Aswan"}
              duration={`${trip.duration.days} days / ${trip.duration.nights} nights`}
              mobileBrochureButton={
                <Button
                  variant="primary"
                  size="lg"
                  icon={<Image src="/images/brochure.svg" alt="" width={18} height={18} style={{filter: 'brightness(0) invert(1)'}} />}
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
              >
                Share
              </Button>
            </DetailHeroBar>
          </div>
        </div>
      </div>

      {/* ── Sticky Tab Navigation ── */}
      <DetailTabNav tabs={TRIP_TABS} />

      {/* ── Main content sections ── */}
      <div className={styles.container}>
        {/* Overview + booking sidebar */}
        <TripOverview trip={trip} />

        {/* What's Included */}
        <TripInclusions trip={trip} />

        {/* What's Not Included */}
        <TripExclusions trip={trip} />

        {/* Taken by Travelers */}
        <TripTravelerPhotos trip={trip} />
      </div>

      {/* ── Full-width pricing section (Swapped here) ── */}
      <div className={styles.container}>
        <TripPricing trip={trip} />
      </div>

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

      {/* ── VIP Experiences ── */}
      <div className={styles.container}>
        <TripVIPExperiences trip={trip} />
      </div>

      {/* ── Traveler Reviews ── */}
      <div className={styles.container}>
        <TripReviews />
      </div>

      {/* ── More Inspiring Trips ── */}
      <div className={styles.container}>
        <TripMoreTrips />
      </div>
    </div>
  );
}

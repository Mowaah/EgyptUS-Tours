import { Trip } from "@/types";
import { PageHeader } from "@/components/shared";
import TripGallery from "./TripGallery/TripGallery";
import TripHeroBar from "./TripHeroBar/TripHeroBar";
import TripTabNav from "./TripTabNav/TripTabNav";
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

export default function TripDetailPage({ trip }: TripDetailPageProps) {
  return (
    <div className={styles.page}>
      {/* ── Page Header: breadcrumb + back button ── */}
      <PageHeader
        breadcrumbs={[
          { label: "Trips", href: "/trips" },
          { label: "Trip Details", isCurrent: true },
        ]}
        backButton={{ text: "Back To Trips", href: "/trips" }}
      />

      {/* ── Gallery & Hero Bar ── */}
      <div className={styles.heroSection}>
        <div className={styles.galleryWrap}>
          <TripGallery trip={trip} />

          <div className={styles.heroOverlay}>
            <TripHeroBar trip={trip} />
          </div>
        </div>
      </div>

      {/* ── Sticky Tab Navigation ── */}
      <TripTabNav />

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

import { Vehicle } from "@/components/shared/VehicleCard/VehicleCard";
import { PageHeader, DetailGallery, DetailHeroBar, DetailTabNav } from "@/components/shared";
import Image from "next/image";
import Button from "@/components/shared/Button/Button";
import TransportationOverview from "./TransportationOverview/TransportationOverview";
import TransportationFeatures from "./TransportationFeatures/TransportationFeatures";
import { ReviewSection, Review } from "@/components/shared";
import BookingWidget from "./BookingWidget/BookingWidget";
import styles from "./TransportationDetailPage.module.scss";

// Extending Vehicle type or using a specialized one for details
interface TransportationDetailPageProps {
  vehicleId: string;
}

const TABS = [
  { id: "overview", label: "Overview" },
  { id: "features", label: "Features & Amenities" },
  { id: "reviews", label: "Traveler Reviews" },
];

const MOCK_REVIEWS: Review[] = [
  { title: "Unforgettable Journey", body: "An absolute pleasure to travel in such comfort. The driver was professional and the car was immaculate.", author: "Sarah Jenkins", date: "January 10, 2025", rating: 5 },
  { title: "Perfect Service", body: "The location, comfort, and hospitality were outstanding. Waking up to the Nile view was simply magical.", author: "Anna & Marco", date: "January 28, 2025", rating: 5 },
  { title: "Luxury Experience", body: "Elegant rooms, attentive staff, and a peaceful ambiance made our stay absolutely memorable.", author: "Michael Thompson", date: "January 07, 2025", rating: 5 },
];

export default function TransportationDetailPage({ vehicleId }: TransportationDetailPageProps) {
  // Mock vehicle data for now
  const vehicle = {
    id: vehicleId,
    title: "Premium Sedan - Mercedes S-Class",
    description: "Luxury Sedan • 2024",
    rating: 4.5,
    reviews: 324,
    images: [
      "/images/car1.jpg",
      "/images/car2.jpg",
      "/images/car3.jpg",
      "/images/car4.jpg",
      "/images/car3.jpg",
    ],
    price: "$1299"
  };

  return (
    <div className={styles.page}>
      <PageHeader
        className={styles.pageHeader}
        breadcrumbs={[
          { label: "Transportation", href: "/transportation" },
          { label: "Details", isCurrent: true },
        ]}
        backButton={{ text: "Transportation", href: "/transportation" }}
      />

      {/* ── Gallery & Hero Bar ── */}
      <div className={styles.heroSection}>
        <div className={styles.galleryWrap}>
          <DetailGallery images={vehicle.images} title={vehicle.title} />

          <div className={styles.heroOverlay}>
            <DetailHeroBar
              title={vehicle.title}
              description={vehicle.description}
              rating={vehicle.rating}
              reviewCount={vehicle.reviews}
              isFavorite={false}
            >
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
      <DetailTabNav tabs={TABS} />

      {/* ── Content Sections ── */}
      <div className={styles.container}>
        <div className={styles.layout}>
          <div className={styles.mainContent}>
            <TransportationOverview />
            <TransportationFeatures />
          </div>

          <aside className={styles.sidebar}>
            <BookingWidget vehicleId={vehicleId} />
          </aside>
        </div>
      </div>

      <div className={styles.container}>
        <ReviewSection reviews={MOCK_REVIEWS} title="Travelers' Reviews" />
      </div>
    </div>
  );
}

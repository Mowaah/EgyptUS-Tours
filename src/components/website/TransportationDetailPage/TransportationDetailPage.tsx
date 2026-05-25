import { PageHeader, DetailGallery, DetailHeroBar, DetailTabNav } from "@/components/shared";
import Image from "next/image";
import Button from "@/components/shared/Button/Button";
import TransportationOverview from "./TransportationOverview/TransportationOverview";
import TransportationFeatures from "./TransportationFeatures/TransportationFeatures";
import TransportationReviews from "./TransportationReviews/TransportationReviews";
import BookingWidget from "./BookingWidget/BookingWidget";
import styles from "./TransportationDetailPage.module.scss";

interface TransportationDetailPageProps {
  vehicleId: string;
}

const TABS = [
  { id: "overview", label: "Overview" },
  { id: "features", label: "Features & Amenities" },
  { id: "reviews", label: "Traveler Reviews" },
];

export default function TransportationDetailPage({ vehicleId }: TransportationDetailPageProps) {
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
    price: "$1299",
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
        showMobileActions={true}
      />

      <div className={styles.heroSection}>
        <div className={styles.galleryWrap}>
          <DetailGallery
            images={vehicle.images}
            title={vehicle.title}
            rating={vehicle.rating}
            reviewCount={vehicle.reviews}
            description={vehicle.description}
          />

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

      <DetailTabNav tabs={TABS} />

      <div className={styles.container}>
        <div className={styles.withSidebar}>
          <div className={styles.mainContent}>
            <TransportationOverview />
            <TransportationFeatures />
          </div>

          <div className={styles.bookingSidebar}>
            <BookingWidget vehicleId={vehicleId} totalPrice={vehicle.price} />
          </div>
        </div>
      </div>

      <div className={styles.container}>
        <TransportationReviews />
      </div>
    </div>
  );
}

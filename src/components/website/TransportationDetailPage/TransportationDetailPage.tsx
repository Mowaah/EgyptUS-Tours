"use client";

import { PageHeader, DetailGallery, DetailHeroBar, DetailTabNav } from "@/components/shared";
import Image from "next/image";
import Button from "@/components/shared/Button/Button";
import TransportationOverview from "./TransportationOverview/TransportationOverview";
import TransportationFeatures from "./TransportationFeatures/TransportationFeatures";
import TransportationReviews from "./TransportationReviews/TransportationReviews";
import BookingWidget from "./BookingWidget/BookingWidget";
import styles from "./TransportationDetailPage.module.scss";

import { VehicleDetail } from "@/types/api";

interface TransportationDetailPageProps {
  vehicleDetail: VehicleDetail;
}

const TABS = [
  { id: "overview", label: "Overview" },
  { id: "features", label: "Features & Amenities" },
  { id: "reviews", label: "Traveler Reviews" },
];

export default function TransportationDetailPage({ vehicleDetail }: TransportationDetailPageProps) {
  const vehicle = {
    id: vehicleDetail.slug,
    title: vehicleDetail.title || vehicleDetail.name,
    description: vehicleDetail.description,
    rating: parseFloat(vehicleDetail.rating_avg) || 0,
    reviews: vehicleDetail.review_count,
    images: vehicleDetail.gallery && vehicleDetail.gallery.length > 0
      ? vehicleDetail.gallery.map(g => g.image)
      : [vehicleDetail.image || "/images/sedan.png"],
    price: vehicleDetail.price_amount,
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: vehicle.title,
          text: vehicle.description,
          url: window.location.href,
        });
      } catch (err) {
        console.log("Error sharing:", err);
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("Link copied to clipboard!");
    }
  };


  return (
    <div className={styles.page}>
      <PageHeader
        className={styles.pageHeader}
        breadcrumbs={[
          { label: "Transportation", href: "/transportation" },
          { label: vehicle.title, isCurrent: true },
        ]}
        title={vehicle.title}
        subtitle="Experience seamless travel across Egypt in our premium, modern fleet with professional drivers."
        decorationSrc="/images/dotted-line3.svg"
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
              showFavorite={false}
            >
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

      <DetailTabNav tabs={TABS} />

      <div className={styles.container}>
        <div className={styles.withSidebar}>
          <div className={styles.mainContent}>
            <TransportationOverview
              description={vehicle.description}
              luggage={vehicleDetail.luggage}
              passengers={vehicleDetail.passengers}
              durationHoursMin={vehicleDetail.duration_hours_min}
              durationHoursMax={vehicleDetail.duration_hours_max}
            />
            <TransportationFeatures features={vehicleDetail.features || []} />
          </div>

          <div className={styles.bookingSidebar}>
            <BookingWidget vehicleId={vehicle.id} totalPrice={vehicle.price} />
          </div>
        </div>
      </div>

      <div className={styles.container}>
        <TransportationReviews reviews={vehicleDetail.vehicle_reviews || []} />
      </div>
    </div>
  );
}

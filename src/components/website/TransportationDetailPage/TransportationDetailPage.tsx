"use client";

import { useState } from "react";
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
  backendVehicle: VehicleDetail;
}

const TABS = [
  { id: "overview", label: "Overview" },
  { id: "features", label: "Features & Amenities" },
  { id: "reviews", label: "Traveler Reviews" },
];

export default function TransportationDetailPage({ backendVehicle }: TransportationDetailPageProps) {
  const [isFavorite, setIsFavorite] = useState(false);
  const toggleFavorite = () => setIsFavorite((prev) => !prev);

  const vehicle = {
    id: backendVehicle.slug,
    title: backendVehicle.title || backendVehicle.name,
    description: backendVehicle.description,
    rating: parseFloat(backendVehicle.rating_avg) || 0,
    reviews: backendVehicle.review_count,
    images: backendVehicle.gallery && backendVehicle.gallery.length > 0
      ? backendVehicle.gallery.map(g => g.image)
      : [backendVehicle.image || "/images/sedan.png"],
    price: backendVehicle.price_amount,
  };

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: vehicle.title,
          url: window.location.href,
        });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        alert('Link copied to clipboard!');
      }
    } catch (error) {
      console.error('Error sharing:', error);
    }
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
              luggage={backendVehicle.luggage}
              passengers={backendVehicle.passengers}
              durationHoursMin={backendVehicle.duration_hours_min}
              durationHoursMax={backendVehicle.duration_hours_max}
            />
            <TransportationFeatures features={backendVehicle.features || []} />
          </div>

          <div className={styles.bookingSidebar}>
            <BookingWidget vehicleId={vehicle.id} totalPrice={vehicle.price} />
          </div>
        </div>
      </div>

      <div className={styles.container}>
        <TransportationReviews reviews={backendVehicle.vehicle_reviews || []} />
      </div>
    </div>
  );
}

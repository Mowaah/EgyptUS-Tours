"use client";

import { PageHeader, DetailGallery, DetailHeroBar, DetailTabNav } from "@/components/shared";
import Image from "next/image";
import Button from "@/components/shared/Button/Button";
import TransportationOverview from "./TransportationOverview/TransportationOverview";
import TransportationFeatures from "./TransportationFeatures/TransportationFeatures";
import TransportationReviews from "./TransportationReviews/TransportationReviews";
import BookingWidget from "./BookingWidget/BookingWidget";
import { useTranslation } from "@/hooks/useTranslation";
import styles from "./TransportationDetailPage.module.scss";

import { VehicleDetail } from "@/types/api";

interface TransportationDetailPageProps {
  vehicleDetail: VehicleDetail;
}



export default function TransportationDetailPage({ vehicleDetail }: TransportationDetailPageProps) {
  const { t } = useTranslation("transportation");

  const TABS = [
    { id: "overview", label: t("tabs.overview", "Overview") },
    { id: "features", label: t("tabs.features", "Features & Amenities") },
    { id: "reviews", label: t("tabs.reviews", "Traveler Reviews") },
  ];

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
      alert(t("linkCopied", "Link copied to clipboard!"));
    }
  };


  return (
    <div className={styles.page}>
      <PageHeader
        className={styles.pageHeader}
        breadcrumbs={[
          { label: t("breadcrumb", "Transportation"), href: "/transportation" },
          { label: t("vehicleDetails", "Transportation Details"), isCurrent: true },
        ]}
        backButton={{ text: t("backToTransportation", "Back To Transportation"), href: "/transportation" }}
        showMobileActions={true}
      />

      <div className={styles.heroSection}>
        <div className={styles.galleryWrap}>
          <DetailGallery
            images={vehicle.images}
            title={vehicle.title}
            rating={vehicle.rating}
            description={vehicle.description}
          />

          <div className={styles.heroOverlay}>
            <DetailHeroBar
              title={vehicle.title}
              description={vehicle.description}
              rating={vehicle.rating}
              reviewCount={0}
              showReviews={false}
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
                {t("share", "Share")}
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
              luggageCapacity={vehicleDetail.luggage_capacity}
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

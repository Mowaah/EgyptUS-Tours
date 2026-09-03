"use client";

import { useState } from "react";
import { Hotel } from "@/types";
import { PageHeader, DetailGallery, DetailHeroBar, DetailTabNav } from "@/components/shared";
import Image from "next/image";
import Button from "@/components/shared/Button/Button";
import HotelOverview from "./HotelOverview/HotelOverview";
import HotelLocation from "./HotelLocation/HotelLocation";
import HotelRoomTypes from "./HotelRoomTypes/HotelRoomTypes";
import SimilarHotels from "./SimilarHotels/SimilarHotels";
import HotelBookingWidget from "./HotelBookingWidget/HotelBookingWidget";
import HotelReviews from "./HotelReviews/HotelReviews";
import { useFavorite } from "@/hooks/useFavorite";
import { useTranslation } from "@/hooks/useTranslation";
import styles from "./HotelDetailPage.module.scss";

interface HotelDetailPageProps {
  hotel: Hotel;
  similarHotels?: Hotel[];
}



export default function HotelDetailPage({ hotel, similarHotels }: HotelDetailPageProps) {
  const { isFavorite, isLoading, toggle } = useFavorite({
    slug: hotel.id,
    kind: "hotel",
    initialFavorite: hotel.isFavorite ?? false,
  });
  const { t } = useTranslation("hotels");

  const HOTEL_TABS = [
    { id: "overview", label: t("tabs.overview", "Overview") },
    { id: "hotel-facilities", label: t("tabs.facilities", "Hotel Facilities") },
    { id: "location", label: t("tabs.location", "Location") },
    { id: "room-types", label: t("tabs.roomTypes", "Room Types") },
    { id: "reviews", label: t("tabs.reviews", "Traveler Reviews") },
    { id: "similar-hotels", label: t("tabs.similar", "Similar Hotels") },
  ];

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: hotel.name,
          url: window.location.href,
        });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        alert(t("linkCopied", "Link copied to clipboard!"));
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
          { label: t("breadcrumb", "Hotels"), href: "/hotels" },
          { label: t("hotelDetails", "Hotel Details"), isCurrent: true },
        ]}
        backButton={{ text: t("backToHotels", "Back To Hotels"), href: "/hotels" }}
        showMobileActions={true}
        isFavorite={isFavorite}
        onFavoriteToggle={toggle}
      />

      <div className={styles.heroSection}>
        <div className={styles.galleryWrap}>
          <DetailGallery
            images={hotel.images ?? [hotel.image]}
            title={hotel.name}
            rating={hotel.stars ?? hotel.rating ?? 0}
            reviewCount={hotel.reviews ?? 0}
            description={hotel.description}
          />

          <div className={styles.heroOverlay}>
            <DetailHeroBar
              title={hotel.name}
              description={hotel.subtitle || hotel.description}
              rating={hotel.stars ?? hotel.rating ?? 0}
              reviewCount={hotel.reviews ?? 0}
              showReviews={false}
              isFavorite={isFavorite}
              onFavoriteToggle={toggle}
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

      <DetailTabNav tabs={HOTEL_TABS} />

      <div className={styles.container}>
        <div className={styles.withSidebar}>
          <div className={styles.mainContent}>
            <HotelOverview hotel={hotel} />
            <div className={styles.locationSection}>
              <HotelLocation hotel={hotel} />
            </div>
          </div>

          <div className={styles.bookingSidebar}>
            <HotelBookingWidget hotel={hotel} />
          </div>
        </div>
      </div>

      <div className={styles.container}>
        <HotelRoomTypes hotel={hotel} />
      </div>

      <div className={styles.container}>
        <HotelReviews hotel={hotel} />
      </div>

      {similarHotels && similarHotels.length > 0 && (
        <div className={styles.container}>
          <SimilarHotels similarHotels={similarHotels} />
        </div>
      )}
    </div>
  );
}

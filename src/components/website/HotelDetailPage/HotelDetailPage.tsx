"use client";

import { useState } from "react";
import { Hotel } from "@/types";
import { PageHeader, DetailGallery, DetailHeroBar, DetailTabNav, ReviewSection } from "@/components/shared";
import Image from "next/image";
import Button from "@/components/shared/Button/Button";
import HotelOverview from "./HotelOverview/HotelOverview";
import HotelRoomTypes from "./HotelRoomTypes/HotelRoomTypes";
import SimilarHotels from "./SimilarHotels/SimilarHotels";
import styles from "./HotelDetailPage.module.scss";

interface HotelDetailPageProps {
  hotel: Hotel;
}

const HOTEL_TABS = [
  { id: "overview", label: "Overview" },
  { id: "hotel-facilities", label: "Hotel Facilities" },
  { id: "location", label: "Location" },
  { id: "room-types", label: "Room Types" },
  { id: "reviews", label: "Reviews" },
  { id: "similar-hotels", label: "Similar Hotels" },
];

export default function HotelDetailPage({ hotel }: HotelDetailPageProps) {
  const [isFavorite, setIsFavorite] = useState(hotel.isFavorite ?? false);
  const toggleFavorite = () => setIsFavorite((prev) => !prev);

  return (
    <div className={styles.page}>
      <PageHeader
        className={styles.pageHeader}
        breadcrumbs={[
          { label: "Hotels", href: "/hotels" },
          { label: "Hotel Details", isCurrent: true },
        ]}
        backButton={{ text: "Back To Hotels", href: "/hotels" }}
        showMobileActions={true}
        isFavorite={isFavorite}
        onFavoriteToggle={toggleFavorite}
      />

      {/* ── Gallery & Hero Bar ── */}
      <div className={styles.heroSection}>
        <div className={styles.galleryWrap}>
          <DetailGallery 
            images={hotel.images ?? [hotel.image]} 
            title={hotel.name}
            rating={hotel.rating ?? 0}
            reviewCount={hotel.reviews ?? 0}
            description={hotel.description}
          />

          <div className={styles.heroOverlay}>
            <DetailHeroBar
              title={hotel.name}
              description={hotel.description}
              rating={hotel.rating ?? 0}
              reviewCount={hotel.reviews ?? 0}
              isFavorite={isFavorite}
              onFavoriteToggle={toggleFavorite}
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
      <DetailTabNav tabs={HOTEL_TABS} />

      {/* ── Content Sections ── */}
      <div className={styles.container}>
        <HotelOverview hotel={hotel} />
      </div>

      <div className={styles.container}>
        <HotelRoomTypes hotel={hotel} />
      </div>


      <div className={styles.container}>
        <ReviewSection reviews={hotel.hotelReviews?.map(r => ({ ...r, body: r.body })) || []} />
      </div>

      <div className={styles.container}>
        <SimilarHotels hotel={hotel} />
      </div>
    </div>
  );
}


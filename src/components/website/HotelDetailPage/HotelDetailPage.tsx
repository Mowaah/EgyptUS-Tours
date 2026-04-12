import { Hotel } from "@/types";
import { PageHeader, DetailGallery, DetailHeroBar, DetailTabNav } from "@/components/shared";
import Image from "next/image";
import Button from "@/components/shared/Button/Button";
import HotelOverview from "./HotelOverview/HotelOverview";
import HotelRoomTypes from "./HotelRoomTypes/HotelRoomTypes";
import RelatedTrips from "./RelatedTrips/RelatedTrips";
import HotelReviews from "./HotelReviews/HotelReviews";
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
  { id: "related-trips", label: "Related Trips" },
  { id: "reviews", label: "Reviews" },
  { id: "similar-hotels", label: "Similar Hotels" },
];

export default function HotelDetailPage({ hotel }: HotelDetailPageProps) {
  return (
    <div className={styles.page}>
      <PageHeader
        className={styles.pageHeader}
        breadcrumbs={[
          { label: "Hotels", href: "/hotels" },
          { label: "Hotel Details", isCurrent: true },
        ]}
        backButton={{ text: "Back To Hotels", href: "/hotels" }}
      />

      {/* ── Gallery & Hero Bar ── */}
      <div className={styles.heroSection}>
        <div className={styles.galleryWrap}>
          <DetailGallery images={hotel.images ?? [hotel.image]} title={hotel.name} />

          <div className={styles.heroOverlay}>
            <DetailHeroBar
              title={hotel.name}
              description={hotel.description}
              rating={hotel.rating}
              reviewCount={hotel.reviews}
              isFavorite={hotel.isFavorite}
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
        <RelatedTrips hotel={hotel} />
      </div>

      <div className={styles.container}>
        <HotelReviews hotel={hotel} />
      </div>

      <div className={styles.container}>
        <SimilarHotels hotel={hotel} />
      </div>
    </div>
  );
}


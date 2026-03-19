"use client";

import {
  SectionHeader,
  HotelCard,
  CategoryTabs,
  Button,
  SortButton,
  PaginationArrows,
} from "@/components/shared";
import { Hotel } from "@/types";
import styles from "./HotelsSection.module.scss";
import Image from "next/image";

const LOCATION_TABS = [
  "Giza",
  "Cairo",
  "Luxor",
  "Aswan",
  "Sharm El Sheikh",
  "Alexandria",
  "Hurghada",
  "South Sinai",
  "New Valley",
  "Ismailia",
  "Port Said",
];

const DEMO_HOTELS: Hotel[] = Array.from({ length: 4 }, (_, i) => ({
  id: `hotel-${i + 1}`,
  name: "Pyramids View Luxury Hotel",
  location: "Giza",
  image: "/images/pyramids.jpg",
  stars: 5,
  rating: 4.2,
  rooms: 245,
  pricePerNight: 180,
  reviews: 1847,
}));

export default function HotelsSection() {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <SectionHeader
          label="Hotels"
          heading="Find the perfect hotel for your trip"
          description="We make hotel booking easy. Discover top-rated hotels, compare features and prices, and book a stay tailored to your travel style."
          descriptionMaxWidth="500px"
        />

        <div className={styles.tabsRow}>
          <CategoryTabs tabs={LOCATION_TABS} />
        </div>

        <div className={styles.toolbar}>
          <SortButton
            options={[
              { value: "recommended", label: "Recommended" },
              { value: "price-low", label: "Price: Low to High" },
              { value: "price-high", label: "Price: High to Low" },
              { value: "rating", label: "Rating" },
            ]}
            defaultValue="recommended"
          />
          <div className={styles.arrows}>
            <PaginationArrows
              layout="inline"
              size={30}
              iconWidth={15}
              iconHeight={15}
            />
          </div>
        </div>

        <div className={styles.grid}>
          {DEMO_HOTELS.map((hotel) => (
            <HotelCard key={hotel.id} hotel={hotel} />
          ))}
        </div>

        <div className={styles.viewAll}>
          <Button
            variant="outline"
            href="/hotels"
            icon={
              <Image
                src="/images/arrow-right-blue.svg"
                alt=""
                width={16}
                height={16}
                style={{ marginTop: "2px" }}
              />
            }
          >
            View Details
          </Button>
        </div>
      </div>
    </section>
  );
}

"use client";

import { useState } from "react";
import {
  SectionHeader,
  TripCard,
  CategoryTabs,
  SortButton,
  PaginationArrows,
} from "@/components/shared";
import { Trip } from "@/types";
import Image from "next/image";
import styles from "./TripsSection.module.scss";

const TRIP_CATEGORIES = [
  "Classic Tours",
  "Christmas Tours",
  "Nile Cruises",
  "Luxury Tours",
  "Honeymoon Tours",
  "Luxury Nile Cruises",
  "GEM Tours",
  "Egypt Shore Excursions",
];

const DEMO_TRIPS: Trip[] = Array.from({ length: 3 }, (_, i) => ({
  id: `trip-${i + 1}`,
  title: "Luxury 5 days Luxor and Aswan Nile Cruise",
  description:
    "Lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum",
  image: "/images/home/hero-bg.jpg",
  location: "Luxor & Aswan",
  price: 2000,
  currency: "$",
  duration: { days: 8, nights: 7 },
  isFavorite: false,
}));

const DURATION_OPTIONS = ["1-3 days", "4-7 days", "8-14 days", "15+ days"];
const SPECIAL_OFFERS = [
  "Any",
  "Christmas & New Year Offers",
  "Easter Offers",
  "Easter Offers",
];

export default function TripsSection() {
  const [expanded, setExpanded] = useState<{
    duration: boolean;
    offers: boolean;
    price: boolean;
    priceRange: { min: number; max: number };
  }>({
    duration: true,
    offers: true,
    price: true,
    priceRange: { min: 1, max: 12000 }
  });

  const [trips, setTrips] = useState<Trip[]>(DEMO_TRIPS);

  const handleFavoriteToggle = (id: string) => {
    setTrips((prev) =>
      prev.map((trip) =>
        trip.id === id ? { ...trip, isFavorite: !trip.isFavorite } : trip
      )
    );
  };

  const toggleFilter = (key: keyof typeof expanded) => {
    setExpanded((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <SectionHeader
          label="Trips"
          heading="Choose The Right Trip For Your Adventure"
          description="We make trip planning easy. Discover handpicked journeys, compare destinations, and book trips crafted around your travel style."
          descriptionMaxWidth="680px"
        />

        <div className={styles.toolbar}>
          <span className={styles.count}>Found 60 Tours</span>
          <SortButton
            options={[
              { value: "recommended", label: "Recommended" },
              { value: "price-low", label: "Price: Low to High" },
              { value: "price-high", label: "Price: High to Low" },
            ]}
            defaultValue="recommended"
          />
        </div>

        <CategoryTabs tabs={TRIP_CATEGORIES} />

        <div className={styles.layout}>
          <aside className={styles.sidebar}>
            <div className={`${styles.filterGroup} ${expanded.duration ? styles.filterGroupExpanded : ""}`}>
              <div
                className={styles.filterHeader}
                onClick={() => toggleFilter("duration")}
              >
                <h4>Duration</h4>
                <Image
                  src="/images/arrow-down2.svg"
                  alt="Toggle duration filter"
                  width={15}
                  height={8}
                  className={`${styles.chevron} ${expanded.duration ? styles.expanded : ""}`}
                />
              </div>
              {expanded.duration && (
                <div className={styles.filterOptions}>
                  {DURATION_OPTIONS.map((opt) => (
                    <label key={opt} className={styles.checkbox}>
                      <input type="checkbox" />
                      <span>{opt}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>

            <div className={`${styles.filterGroup} ${expanded.offers ? styles.filterGroupExpanded : ""}`}>
              <div
                className={styles.filterHeader}
                onClick={() => toggleFilter("offers")}
              >
                <h4>Special Offers</h4>
                <Image
                  src="/images/arrow-down2.svg"
                  alt="Toggle special offers filter"
                  width={15}
                  height={8}
                  className={`${styles.chevron} ${expanded.offers ? styles.expanded : ""}`}
                />
              </div>
              {expanded.offers && (
                <div className={styles.filterOptions}>
                  {SPECIAL_OFFERS.map((opt, i) => (
                    <label key={`${opt}-${i}`} className={styles.radio}>
                      <input
                        type="radio"
                        name="offers"
                        defaultChecked={i === 0}
                      />
                      <span>{opt}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>

            <div className={`${styles.filterGroup} ${expanded.price ? styles.filterGroupExpanded : ""}`}>
              <div
                className={styles.filterHeader}
                onClick={() => toggleFilter("price")}
              >
                <h4>Price Range</h4>
                <Image
                  src="/images/arrow-down2.svg"
                  alt="Toggle price range filter"
                  width={15}
                  height={8}
                  className={`${styles.chevron} ${expanded.price ? styles.expanded : ""}`}
                />
              </div>
              {expanded.price && (
                <div className={styles.priceRange}>
                  <div className={styles.rangeContainer}>
                    <div className={styles.rangeTrack} />
                    <div 
                      className={styles.rangeTrackFill} 
                      style={{ 
                        left: `${((expanded.priceRange?.min || 1) / 12000) * 100}%`,
                        width: `${(((expanded.priceRange?.max || 12000) - (expanded.priceRange?.min || 1)) / 12000) * 100}%`
                      }}
                    />
                    <input
                      type="range"
                      min="1"
                      max="12000"
                      value={expanded.priceRange?.min || 1}
                      onChange={(e) => {
                        const val = Math.min(Number(e.target.value), (expanded.priceRange?.max || 12000) - 500);
                        setExpanded(prev => ({
                          ...prev,
                          priceRange: { ...(prev.priceRange || { min: 1, max: 12000 }), min: val }
                        }));
                      }}
                      className={styles.rangeInput}
                    />
                    <input
                      type="range"
                      min="1"
                      max="12000"
                      value={expanded.priceRange?.max || 12000}
                      onChange={(e) => {
                        const val = Math.max(Number(e.target.value), (expanded.priceRange?.min || 1) + 500);
                        setExpanded(prev => ({
                          ...prev,
                          priceRange: { ...(prev.priceRange || { min: 1, max: 12000 }), max: val }
                        }));
                      }}
                      className={styles.rangeInput}
                    />
                  </div>
                  <span className={styles.rangeLabel}>
                    ${expanded.priceRange?.min || 1} - ${expanded.priceRange?.max || 12000}
                  </span>
                </div>
              )}
            </div>
          </aside>

          <div className={styles.main}>
            <div className={styles.grid}>
              {trips.map((trip) => (
                <TripCard
                  key={trip.id}
                  trip={trip}
                  onFavoriteToggle={handleFavoriteToggle}
                />
              ))}
            </div>

            <div className={styles.pagination}>
              <PaginationArrows
                layout="inline"
                size={30}
                iconWidth={15}
                iconHeight={15}
              >
                <div className={styles.pages}>
                  {[1, 2, 3, "...", 13, 14, 15].map((page, i) => (
                    <button
                      key={i}
                      className={`${styles.pageBtn} ${page === 1 ? styles.active : ""} ${page === "..." ? styles.dots : ""}`}
                      disabled={page === "..."}
                    >
                      {page}
                    </button>
                  ))}
                </div>
              </PaginationArrows>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

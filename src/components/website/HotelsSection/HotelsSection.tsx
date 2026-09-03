"use client";

import {
  SectionHeader,
  HotelCard,
  CategoryTabs,
  Button,
  SortButton,
  PaginationArrows,
  EmptyState,
} from "@/components/shared";
import { Hotel } from "@/types";
import styles from "./HotelsSection.module.scss";
import Image from "next/image";

import { useState, useRef, useMemo } from "react";

export default function HotelsSection({ initialHotels = [] }: { initialHotels?: Hotel[] }) {
  const [hotels, setHotels] = useState<Hotel[]>(initialHotels);
  const [activeTab, setActiveTab] = useState(0);
  const [sortOption, setSortOption] = useState("recommended");
  const sliderRef = useRef<HTMLDivElement>(null);

  const dynamicTabs = useMemo(() => {
    const locations = Array.from(new Set(hotels.map((h) => h.location).filter(Boolean)));
    return ["All", ...locations.sort()];
  }, [hotels]);

  const activeLocation = dynamicTabs[activeTab];

  let filteredHotels = [...hotels];

  if (activeLocation && activeLocation !== "All") {
    filteredHotels = filteredHotels.filter(
      (h) => h.location && h.location.toLowerCase().includes(activeLocation.toLowerCase())
    );
  }

  if (sortOption === "price-low") {
    filteredHotels.sort((a, b) => a.pricePerNight - b.pricePerNight);
  } else if (sortOption === "price-high") {
    filteredHotels.sort((a, b) => b.pricePerNight - a.pricePerNight);
  } else if (sortOption === "rating") {
    filteredHotels.sort((a, b) => b.rating - a.rating);
  } else {
    // Recommended
    filteredHotels.sort((a, b) => b.reviews - a.reviews);
  }

  const handleFavoriteToggle = (id: string) => {
    setHotels((prev) =>
      prev.map((hotel) =>
        hotel.id === id ? { ...hotel, isFavorite: !hotel.isFavorite } : hotel
      )
    );
  };

  const scrollLeft = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({ left: -400, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({ left: 400, behavior: "smooth" });
    }
  };

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <SectionHeader
          label="Hotels"
          heading="Find Your Perfect Stay in Egypt"
          description="Make your stay part of the experience. Discover carefully selected hotels across Egypt, from luxury escapes to comfortable stays, and find the right place for the way you travel."
          descriptionMaxWidth="740px"
        />

        <div className={styles.tabsRow}>
          <CategoryTabs 
            tabs={dynamicTabs} 
            active={activeTab}
            onTabChange={(_, idx) => setActiveTab(idx)}
          />
        </div>

        <div className={styles.toolbar}>
          <SortButton
            options={[
              { value: "recommended", label: "Recommended" },
              { value: "price-low", label: "Price: Low to High" },
              { value: "price-high", label: "Price: High to Low" },
              { value: "rating", label: "Rating" },
            ]}
            defaultValue={sortOption}
            onChange={setSortOption}
          />
          <div className={styles.arrows}>
            <PaginationArrows
              layout="inline"
              size={30}
              iconWidth={15}
              iconHeight={15}
              onPrev={scrollLeft}
              onNext={scrollRight}
            />
          </div>
        </div>

        <div className={styles.slider} ref={sliderRef}>
          {filteredHotels.length > 0 ? (
            filteredHotels.map((hotel) => (
              <div key={hotel.id} className={styles.slide}>
                <HotelCard hotel={hotel} onFavoriteToggle={handleFavoriteToggle} />
              </div>
            ))
          ) : (
            <div style={{ width: "100%", padding: "20px 0" }}>
              <EmptyState 
                title="No Hotels Found" 
                description={`We couldn't find any hotels in ${activeLocation}. Try another location.`} 
                buttonText="Clear Filter"
                onButtonClick={() => setActiveTab(0)}
              />
            </div>
          )}
        </div>

        <div className={styles.viewAll}>
          <Button
            variant="outline"
            href="/hotels"
            icon={
              <Image
                src="/images/arrows/arrow-right-blue.svg"
                alt=""
                width={16}
                height={16}
                style={{ marginTop: "2px" }}
              />
            }
          >
            Explore More Hotels
          </Button>
        </div>
      </div>
    </section>
  );
}

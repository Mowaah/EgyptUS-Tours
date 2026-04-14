"use client";

import React, { useState } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import {
  PageHeader,
  CategoryTabs,
  SearchInput,
  PaginationArrows,
  EmptyState,
  VehicleCard,
  Vehicle,
} from "@/components/shared";
import SortButton from "@/components/shared/SortButton/SortButton";
import FaqSection from "@/components/website/FaqSection/FaqSection";
import styles from "./TransportationPage.module.scss";

const MOCK_VEHICLES: Vehicle[] = [
  ...Array(10).fill(null).map((_, i) => ({
    id: `v-${i}`,
    title: "Premium Sedan",
    description: "Perfect for business trips and airport transfers. Our premium sedans offer comfort and style.",
    image: "/images/sedan.png",
    passengers: 3,
    luggage: 2,
    durationHours: "7-8",
    features: ["WIFI", "Water Bottles", "Air Conditioning"],
    rating: 4.9,
    reviews: 248,
    price: "$180",
  })),
];

// If original image isn't available, we fallback to a known one like pyramids or missing.
// The user provided screenshots with a black SUV. We'll assume public/images/car.png exists or will be replaced.

const CATEGORIES = ["All Vehicles", "Sedan", "SUV & Luxury", "Van & Hiace", "Bus"];
const SORT_OPTIONS = [
  { value: "recommended", label: "Recommended" },
  { value: "price_asc", label: "Price: Low to High" },
  { value: "price_desc", label: "Price: High to Low" },
];

const TRANSPORT_FAQS = [
  {
    question: "How is the transportation price calculated?",
    answer: "The price is calculated based on the selected vehicle type, travel distance, date, and time. You'll see the final price instantly before confirming your booking — with no hidden fees."
  },
  {
    question: "Can I modify or cancel my booking after confirmation?",
    answer: "Yes, you can request modifications or cancellations before your scheduled trip time. Our support team is available to assist you and guide you through any applicable policies."
  },
  {
    question: "What vehicle options are available for groups?",
    answer: "We offer multiple options including Sedan, Hiace, Bus, and Luxury Cars. Whether you're traveling solo or with a large group, you can choose the vehicle that best fits your needs."
  },
  {
    question: "Are your drivers licensed and professionally trained?",
    answer: "Absolutely. All our drivers are licensed, experienced, and professionally trained to ensure a safe, comfortable, and reliable journey."
  }
];

const FEATURES = [
  {
    icon: "/images/secure.svg",
    title: "Fully Insured",
    desc: "All vehicles are comprehensively insured for your safety"
  },
  {
    icon: "/images/profile2.svg",
    title: "Expert Drivers",
    desc: "Professional chauffeurs with local knowledge"
  },
  {
    icon: "/images/clock-blue.svg",
    title: "24/7 Service",
    desc: "Available round the clock for your convenience"
  },
  {
    icon: "/images/star-yellow2.svg",
    title: "Top Rated",
    desc: "4.9+ average rating from satisfied customers"
  }
];

export default function TransportationPage() {
  const searchParams = useSearchParams();
  const searchVehicle = searchParams.get("vehicle");
  const searchDate = searchParams.get("date");
  const isSearchResults = !!(searchVehicle || searchDate);

  const [activeTab, setActiveTab] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState("recommended");

  // Fake filtering logic for demonstration
  const filteredVehicles = MOCK_VEHICLES.filter(v => {
    // Search match
    if (searchQuery && !v.title.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    if (isSearchResults) {
        // Mock filtering logic based on URL search query
        return true; 
    }
    // Tab match
    const tabItem = CATEGORIES[activeTab];
    if (tabItem !== "All Vehicles") {
      if (tabItem === "Bus" || tabItem === "Van & Hiace") return false;
    }
    return true;
  });

  const getVehicleName = (id: string | null) => {
    if (id === "sedan") return "Sedan";
    if (id === "hiace") return "Hiace";
    if (id === "bus") return "Bus";
    if (id === "luxury") return "Luxury Cars";
    return "Sedan";
  };

  return (
    <div className={styles.page}>
      <PageHeader
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Transportation", isCurrent: true }
        ]}
        title={isSearchResults ? "Search Results" : "Travel in Comfort"}
        subtitle="Choose the perfect vehicle for every journey — from city rides to luxury transfers."
        decorationSrc="/images/dotted-line3.svg"
      />
      <div className={styles.container}>
        
        {isSearchResults && (
          <div className={styles.searchSummaryBox}>
            <div className={styles.summaryItem}>
              <Image src="/images/calendar-orange.svg" alt="" width={20} height={20} />
              <div className={styles.summaryText}>
                <span className={styles.summaryLabel}>Date</span>
                <span className={styles.summaryValue}>{searchDate || "Fri, 29 Aug 2026"}</span>
              </div>
            </div>
            <div className={styles.summaryItem}>
              <Image src="/images/car-orange.svg" alt="" width={20} height={20} />
              <div className={styles.summaryText}>
                <span className={styles.summaryLabel}>Vehicle</span>
                <span className={styles.summaryValue}>{getVehicleName(searchVehicle)}</span>
              </div>
            </div>
          </div>
        )}

        <div className={styles.filterBar}>
          {isSearchResults ? (
            <div className={styles.toolbarTitle}>
              <h2 className={styles.availableVehicles}>Available Vehicles</h2>
              <span className={styles.vehiclesCount}>{filteredVehicles.length} vehicles found for your route</span>
            </div>
          ) : (
             <h2 className={styles.resultsCount}>
              {filteredVehicles.length} Vehicles Founded
            </h2>
          )}
          
          <div className={styles.controlsWrap}>
            <div className={styles.sortWrap}>
              <span className={styles.sortLabel}>Sort by:</span>
              <SortButton
                options={SORT_OPTIONS}
                defaultValue={sortOption}
                onChange={setSortOption}
              />
            </div>
            <SearchInput
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search vehicles, transport option..."
            />
          </div>
        </div>

        {!isSearchResults && (
          <div className={styles.tabsRow}>
            <CategoryTabs
              tabs={CATEGORIES}
              active={activeTab}
              onTabChange={(_, index) => setActiveTab(index)}
              wrap
            />
          </div>
        )}

        <div style={{ marginTop: 32 }}>
          {filteredVehicles.length > 0 ? (
            <>
              <div className={isSearchResults ? styles.vehicleList : styles.vehicleGrid}>
                {filteredVehicles.map(vehicle => (
                  <VehicleCard key={vehicle.id} vehicle={vehicle} view={isSearchResults ? "list" : "grid"} />
                ))}
              </div>

              <div className={styles.pagination}>
                <PaginationArrows layout="inline" size={30} iconWidth={15} iconHeight={15}>
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
            </>
          ) : (
            <EmptyState
              title="No Vehicles Found"
              description="We couldn't find any vehicles matching your search or category filter. Try adjusting your selections."
              buttonText="See All Vehicles"
              onButtonClick={() => {
                setActiveTab(0);
                setSearchQuery("");
              }}
            />
          )}
        </div>

        <div className={styles.featuresWrap}>
          <div className={styles.featuresGrid}>
            {FEATURES.map((feat, idx) => (
              <div key={idx} className={styles.featureItem}>
                <div className={styles.featureIconWrap} style={{ background: idx === 0 ? "#EBF3FE" : idx === 1 ? "#FEF1E8" : idx === 2 ? "#EBF3FE" : "#FEF1E8" }}>
                  <Image src={feat.icon} alt={feat.title} width={32} height={32} />
                </div>
                <h4 className={styles.featureTitle}>{feat.title}</h4>
                <p className={styles.featureDesc}>{feat.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <FaqSection items={TRANSPORT_FAQS} />
      </div>
    </div>
  );
}

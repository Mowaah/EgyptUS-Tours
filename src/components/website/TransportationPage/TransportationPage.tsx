"use client";

import React, { useState } from "react";
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
  { id: "recommended", label: "Recommended" },
  { id: "price_asc", label: "Price: Low to High" },
  { id: "price_desc", label: "Price: High to Low" },
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
    icon: "/images/clock2.svg",
    title: "24/7 Service",
    desc: "Available round the clock for your convenience"
  },
  {
    icon: "/images/star-yellow.svg",
    title: "Top Rated",
    desc: "4.9+ average rating from satisfied customers"
  }
];

export default function TransportationPage() {
  const [activeTab, setActiveTab] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState("recommended");

  // Fake filtering logic for demonstration
  const filteredVehicles = MOCK_VEHICLES.filter(v => {
    // Search match
    if (searchQuery && !v.title.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    // Tab match
    const tabItem = CATEGORIES[activeTab];
    if (tabItem !== "All Vehicles") {
      // strict match or partial mapping logic. For now, empty or mock if not Sedan.
      // Since all mocks are "Premium Sedan", if tab is "Bus", it'll be empty.
      if (tabItem === "Bus" || tabItem === "Van & Hiace") return false;
    }
    return true;
  });

  return (
    <div className={styles.page}>
      <PageHeader
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Transportation", isCurrent: true }
        ]}
        title="Travel in Comfort"
        subtitle="Choose the perfect vehicle for every journey — from city rides to luxury transfers."
        decorationSrc="/images/dotted-line3.svg"
      />
      <div className={styles.container}>
        <div className={styles.filterBar}>
          <h2 className={styles.resultsCount}>
            <span className={styles.countNumber}>{filteredVehicles.length}</span> Vehicles Founded
          </h2>
          <div className={styles.controlsWrap}>
            <SortButton
              options={SORT_OPTIONS}
              defaultValue={sortOption}
              onChange={setSortOption}
            />
            <SearchInput
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Search vehicles, transport option..."
            />
          </div>
        </div>

        <div className={styles.tabsRow}>
          <CategoryTabs
            tabs={CATEGORIES}
            active={activeTab}
            onTabChange={(_, index) => setActiveTab(index)}
            wrap
          />
        </div>

        <div style={{ marginTop: 32 }}>
          {filteredVehicles.length > 0 ? (
            <>
              <div className={styles.vehicleGrid}>
                {filteredVehicles.map(vehicle => (
                  <VehicleCard key={vehicle.id} vehicle={vehicle} />
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

"use client";

import React, { useState, useLayoutEffect } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import {
  PageHeader,
  CategoryTabs,
  SearchInput,
  Pagination,
  EmptyState,
  VehicleCard,
  Vehicle,
} from "@/components/shared";
import SortButton from "@/components/shared/SortButton/SortButton";
import FaqSection from "@/components/website/FaqSection/FaqSection";
import styles from "./TransportationPage.module.scss";

interface TransportationPageProps {
  vehicles: Vehicle[];
}

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

export default function TransportationPage({ vehicles }: TransportationPageProps) {
  const searchParams = useSearchParams();
  const searchVehicle = searchParams.get("vehicle");
  const searchDate = searchParams.get("date");
  const isSearchResults = !!(searchVehicle || searchDate);

  const [activeTab, setActiveTab] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState("recommended");
  const [isLg, setIsLg] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const PAGE_SIZE = 6;

  useLayoutEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const apply = () => setIsLg(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  // Fake filtering logic for demonstration
  const filteredVehicles = vehicles.filter(v => {
    if (searchQuery && !v.title.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    if (isSearchResults) {
      const sVehicle = (searchVehicle || "").toLowerCase();
      if (sVehicle && sVehicle !== "all vehicles") {
        if (v.id !== searchVehicle && v.title.toLowerCase() !== sVehicle) {
          return false;
        }
      }
      return true;
    }
    // Tab match
    const tabItem = CATEGORIES[activeTab];
    if (tabItem !== "All Vehicles") {
      const vType = (v.title || "").toLowerCase();
      if (tabItem === "Sedan" && !vType.includes("sedan")) return false;
      if (tabItem === "SUV & Luxury" && !vType.includes("suv") && !vType.includes("luxury")) return false;
      if (tabItem === "Van & Hiace" && !vType.includes("van") && !vType.includes("hiace")) return false;
      if (tabItem === "Bus" && !vType.includes("bus") && !vType.includes("coach")) return false;
    }
    return true;
  });

  // Sorting Logic
  filteredVehicles.sort((a, b) => {
    if (sortOption === "price_asc") {
      const priceA = parseFloat(a.price.replace(/[^0-9.-]+/g, "")) || 0;
      const priceB = parseFloat(b.price.replace(/[^0-9.-]+/g, "")) || 0;
      return priceA - priceB;
    }
    if (sortOption === "price_desc") {
      const priceA = parseFloat(a.price.replace(/[^0-9.-]+/g, "")) || 0;
      const priceB = parseFloat(b.price.replace(/[^0-9.-]+/g, "")) || 0;
      return priceB - priceA;
    }
    if (sortOption === "recommended") {
      return b.rating - a.rating;
    }
    return 0;
  });

  const totalPages = Math.max(1, Math.ceil(filteredVehicles.length / PAGE_SIZE));
  const paginatedVehicles = filteredVehicles.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  // Reset to first page when filtering
  React.useEffect(() => {
    setCurrentPage(1);
  }, [activeTab, searchQuery, isSearchResults]);

  const getVehicleName = (id: string | null) => {
    if (!id || id === "all vehicles") return "All Vehicles";
    const found = vehicles.find(v => v.id === id);
    if (found) return found.title;
    // Capitalize first letter as fallback
    return id.charAt(0).toUpperCase() + id.slice(1);
  };

  return (
    <div className={styles.page}>
      <PageHeader
        breadcrumbs={[
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
                <span className={styles.summaryValue}>{searchDate || "Any Date"}</span>
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

        <div className={styles.toolbar}>
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

          <div className={styles.toolbarRight}>
            {isLg && (
              <div className={styles.sortWrap}>
                <SortButton
                  options={SORT_OPTIONS}
                  defaultValue={sortOption}
                  onChange={setSortOption}
                />
              </div>
            )}
            <SearchInput
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search vehicles, transport option..."
              variant="toolbar"
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

        {!isLg && (
          <div className={styles.filterSortRow}>
            <div className={styles.filterSortRowSort}>
              <SortButton
                options={SORT_OPTIONS}
                defaultValue={sortOption}
                onChange={setSortOption}
                showLabel={false}
              />
            </div>
          </div>
        )}

        <div className={styles.listingBlock}>
          {paginatedVehicles.length > 0 ? (
            <>
              <div className={isSearchResults ? styles.vehicleList : styles.vehicleGrid}>
                {paginatedVehicles.map(vehicle => (
                  <VehicleCard key={vehicle.id} vehicle={vehicle} view={isSearchResults ? "list" : "grid"} />
                ))}
              </div>

              {totalPages > 1 && (
                <div className={styles.pagination}>
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                  />
                </div>
              )}
            </>
          ) : (
            <EmptyState
              title="No Vehicles Found"
              description="We couldn't find any vehicles matching your search or category filter. Try adjusting your selections."
              buttonText="View Available Cars"
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

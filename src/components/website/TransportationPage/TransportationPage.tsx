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
import { useTranslation } from "@/hooks/useTranslation";
import styles from "./TransportationPage.module.scss";

import { FaqData } from "@/services/legalHelpService";

interface TransportationPageProps {
  vehicles: Vehicle[];
  faqs?: FaqData[];
}

// If original image isn't available, we fallback to a known one like pyramids or missing.
// The user provided screenshots with a black SUV. We'll assume public/images/car.png exists or will be replaced.

const SORT_OPTIONS = [
  { value: "recommended", label: "Recommended" },
  { value: "price_asc", label: "Price: Low to High" },
  { value: "price_desc", label: "Price: High to Low" },
];

const FEATURE_KEYS = [
  { icon: "/images/secure.svg", titleKey: "features.fullyInsured", descKey: "features.fullyInsuredDesc" },
  { icon: "/images/profile2.svg", titleKey: "features.expertDrivers", descKey: "features.expertDriversDesc" },
  { icon: "/images/clock-blue.svg", titleKey: "features.service247", descKey: "features.service247Desc" },
  { icon: "/images/star-yellow2.svg", titleKey: "features.topRated", descKey: "features.topRatedDesc" },
];

export default function TransportationPage({ vehicles, faqs }: TransportationPageProps) {
  const searchParams = useSearchParams();
  const { t } = useTranslation("transportation");
  const searchVehicle = searchParams.get("vehicle");
  const searchDate = searchParams.get("date");
  const isSearchResults = !!(searchVehicle || searchDate);

  const sortOptions = [
    { value: "recommended", label: t("sort.recommended", "Recommended") },
    { value: "price_asc", label: t("sort.priceLow", "Price: Low to High") },
    { value: "price_desc", label: t("sort.priceHigh", "Price: High to Low") },
  ];

  const [activeTab, setActiveTab] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState("recommended");
  const [isLg, setIsLg] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const PAGE_SIZE = 6;

  // Dynamically generate categories from the available vehicles
  const dynamicCategories = ["All Vehicles", ...Array.from(new Set(vehicles.map(v => v.type).filter(Boolean) as string[]))];

  useLayoutEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const apply = () => setIsLg(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  const filteredVehicles = vehicles.filter(v => {
    // 1. Filter by search query (toolbar text search)
    if (searchQuery && !v.title.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }

    // 2. Filter by search results (URL parameters)
    if (isSearchResults && searchVehicle && searchVehicle.toLowerCase() !== "all vehicles") {
      const sVehicle = searchVehicle.toLowerCase();
      // Try to match the exact slug/ID first
      if (v.id === searchVehicle) {
        return true;
      }
      // If it doesn't match ID, check if it matches the vehicle type (from Hero search)
      if (v.type && v.type.toLowerCase() === sVehicle) {
        return true;
      }
      // Otherwise filter it out
      return false;
    }

    // 3. Filter by Tabs (if not doing a specific URL search for a vehicle)
    const tabItem = dynamicCategories[activeTab];
    if (tabItem && tabItem !== "All Vehicles") {
      if (v.type !== tabItem) {
        return false;
      }
    }
    
    return true;
  });

  // Sorting Logic
  filteredVehicles.sort((a, b) => {
    if (sortOption === "price_asc") {
      const priceA = parseFloat(a.price.toString().replace(/[^0-9.-]+/g, "")) || 0;
      const priceB = parseFloat(b.price.toString().replace(/[^0-9.-]+/g, "")) || 0;
      return priceA - priceB;
    }
    if (sortOption === "price_desc") {
      const priceA = parseFloat(a.price.toString().replace(/[^0-9.-]+/g, "")) || 0;
      const priceB = parseFloat(b.price.toString().replace(/[^0-9.-]+/g, "")) || 0;
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
  }, [activeTab, searchQuery, isSearchResults, searchVehicle]);

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
          { label: t("breadcrumb", "Transportation"), isCurrent: true }
        ]}
        title={isSearchResults ? t("searchResults", "Search Results") : t("pageTitle", "Travel in Comfort")}
        subtitle={t("pageSubtitle", "Choose the perfect vehicle for every journey — from city rides to luxury transfers.")}
        decorationSrc="/images/dotted-line3.svg"
      />
      <div className={styles.container}>

        {isSearchResults && (
          <div className={styles.searchSummaryBox}>
            <div className={styles.summaryItem}>
              <Image src="/images/calendar-orange.svg" alt="" width={20} height={20} />
              <div className={styles.summaryText}>
                <span className={styles.summaryLabel}>{t("searchSummary.date", "Date")}</span>
                <span className={styles.summaryValue}>{searchDate || t("searchSummary.anyDate", "Any Date")}</span>
              </div>
            </div>
            <div className={styles.summaryItem}>
              <Image src="/images/car-orange.svg" alt="" width={20} height={20} />
              <div className={styles.summaryText}>
                <span className={styles.summaryLabel}>{t("searchSummary.vehicle", "Vehicle")}</span>
                <span className={styles.summaryValue}>{getVehicleName(searchVehicle)}</span>
              </div>
            </div>
          </div>
        )}

        <div className={styles.toolbar}>
          {isSearchResults ? (
            <div className={styles.toolbarTitle}>
              <h2 className={styles.availableVehicles}>{t("toolbar.availableVehicles", "Available Vehicles")}</h2>
              <span className={styles.vehiclesCount}>
                {t("toolbar.vehiclesFoundForRoute", "{count} vehicles found for your route").replace("{count}", String(filteredVehicles.length))}
              </span>
            </div>
          ) : (
            <h2 className={styles.resultsCount}>
              {t("toolbar.vehiclesFound", "{count} Vehicles Found").replace("{count}", String(filteredVehicles.length))}
            </h2>
          )}

          <div className={styles.toolbarRight}>
            {isLg && (
              <div className={styles.sortWrap}>
                <SortButton
                  options={sortOptions}
                  defaultValue={sortOption}
                  onChange={setSortOption}
                />
              </div>
            )}
            <SearchInput
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t("toolbar.searchPlaceholder", "Search vehicles...")}
              variant="toolbar"
            />
          </div>
        </div>

        {!isSearchResults && (
          <div className={styles.tabsRow}>
            <CategoryTabs
              tabs={dynamicCategories}
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
                options={sortOptions}
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
            {FEATURE_KEYS.map((feat, idx) => (
              <div key={idx} className={styles.featureItem}>
                <div className={styles.featureIconWrap} style={{ background: idx === 0 ? "#EBF3FE" : idx === 1 ? "#FEF1E8" : idx === 2 ? "#EBF3FE" : "#FEF1E8" }}>
                  <Image src={feat.icon} alt="" width={32} height={32} />
                </div>
                <h4 className={styles.featureTitle}>{t(feat.titleKey as Parameters<typeof t>[0], feat.titleKey)}</h4>
                <p className={styles.featureDesc}>{t(feat.descKey as Parameters<typeof t>[0], feat.descKey)}</p>
              </div>
            ))}
          </div>
        </div>

        <FaqSection items={faqs} />
      </div>
    </div>
  );
}

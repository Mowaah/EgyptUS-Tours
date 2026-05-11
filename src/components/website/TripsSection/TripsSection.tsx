"use client";

import { useState, useEffect, useLayoutEffect, useMemo } from "react";
import Image from "next/image";
import {
  Button,
  SectionHeader,
  TripCard,
  CategoryTabs,
  SortButton,
  Pagination,
  EmptyState,
  PageHeader,
  SearchInput,
  FilterGroup,
  RadioFilterList,
  PriceRangeFilter,
} from "@/components/shared";
import { useScrollLock } from "@/hooks/useScrollLock";
import { Trip } from "@/types";
import styles from "./TripsSection.module.scss";

// Categories shown only on the dedicated /trips page
const PAGE_CATEGORIES = [
  "Classic Tours",
  "Christmas Tours",
  "Nile Cruises",
  "Dahabilyas",
  "Luxury Tours",
  "Honeymoon Tours",
  "Christmas Cruises",
  "Desert Tours",
  "Luxury Nile Cruises",
  "GEM Tours",
  "Egypt Excursions",
  "Egypt Shore Excursions",
];

// Condensed set used on the homepage
const HOME_CATEGORIES = [
  "Classic Tours",
  "Christmas Tours",
  "Nile Cruises",
  "Luxury Tours",
  "Honeymoon Tours",
  "Luxury Nile Cruises",
  "GEM Tours",
  "Egypt Shore Excursions",
];

const DEMO_TRIPS: Trip[] = Array.from({ length: 6 }, (_, i) => ({
  id: `trip-${i + 1}`,
  title: "Luxury 5 days Luxor and Aswan Nile Cruise",
  description:
    "lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum",
  image: "/images/home/hero-bg.png",
  location: "Luxor & Aswan",
  price: 2000,
  currency: "$",
  duration: { days: 8, nights: 7 },
  isFavorite: false,
}));

const DURATION_OPTIONS = ["Any", "Less than 10 days", "10-15 Days", "15-20 Days", "More than 20 days"];
const SPECIAL_OFFERS = [
  "Any",
  "Christmas & New Year Offers",
  "Easter Offers",
  "Easter Offers",
];

const SORT_OPTIONS = [
  { value: "recommended", label: "Recommended" },
  { value: "price-low", label: "Price: Low to High" },
  { value: "price-high", label: "Price: High to Low" },
];

export interface SearchParams {
  date?: string;
  destination?: string;
  budget?: string;
  tripType?: string;
}

interface TripsSectionProps {
  /** "home" (default) renders the condensed homepage version with SectionHeader.
   *  "page" renders the full /trips page version with page heading + search bar. */
  variant?: "home" | "page";
  /** When provided (redirected from SearchBar) renders Search Results mode */
  searchParams?: SearchParams;
}

interface FilterPill {
  icon: string;
  label: string;
  value: string;
}

export default function TripsSection({ variant = "home", searchParams }: TripsSectionProps) {
  const isPage = variant === "page";
  const isSearchResults = isPage && !!searchParams;

  const [expanded, setExpanded] = useState<{
    duration: boolean;
    offers: boolean;
    price: boolean;
    priceRange: { min: number; max: number };
  }>({
    duration: true,
    offers: true,
    price: true,
    priceRange: { min: 1, max: 12000 },
  });

  const [durationFilter, setDurationFilter] = useState(DURATION_OPTIONS[0]);
  const [offersFilter, setOffersFilter] = useState(SPECIAL_OFFERS[0]);

  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const totalPages = 15;
  const [trips, setTrips] = useState<Trip[]>(DEMO_TRIPS);

  const activeFilterCount = useMemo(() => {
    let n = 0;
    if (durationFilter !== DURATION_OPTIONS[0]) n += 1;
    if (offersFilter !== SPECIAL_OFFERS[0]) n += 1;
    if (expanded.priceRange.min !== 1 || expanded.priceRange.max !== 12000) n += 1;
    return n;
  }, [durationFilter, offersFilter, expanded.priceRange.min, expanded.priceRange.max]);

  const [isLg, setIsLg] = useState(false);

  useLayoutEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const apply = () => {
      setIsLg(mq.matches);
      if (mq.matches) setFiltersOpen(false);
    };
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  useScrollLock(filtersOpen);

  useEffect(() => {
    if (!filtersOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setFiltersOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [filtersOpen]);

  const filteredTrips = trips.filter(
    (trip) =>
      trip.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      trip.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleFavoriteToggle = (id: string) => {
    setTrips((prev) =>
      prev.map((trip) =>
        trip.id === id ? { ...trip, isFavorite: !trip.isFavorite } : trip
      )
    );
  };

  const handleResetSearch = () => {
    setSearchQuery("");
  };

  const toggleFilter = (key: "duration" | "offers" | "price") => {
    setExpanded((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  // Build filter pills from searchParams
  const filterPills: FilterPill[] = [];
  if (searchParams?.date)
    filterPills.push({ icon: "calendar", label: "Date", value: searchParams.date });
  if (searchParams?.destination)
    filterPills.push({ icon: "location", label: "Destination", value: searchParams.destination });
  if (searchParams?.budget)
    filterPills.push({ icon: "budget", label: "Budget", value: searchParams.budget });
  if (searchParams?.tripType)
    filterPills.push({ icon: "trip-type", label: "Trip Type", value: searchParams.tripType });

  return (
    <section className={styles.section}>

      {/* ── Header ── */}
      {isPage ? (
        isSearchResults ? (
          <PageHeader
            breadcrumbs={[{ label: "Trips", isCurrent: true }]}
            title="Search Results"
            subtitle="We make trip planning easy. Discover handpicked journeys, compare destinations, and book trips crafted around your travel style."
            decorationSrc="/images/dotted-line4.svg"
            subtitleMaxWidth="550px"
          />
        ) : (
          <PageHeader
            breadcrumbs={[{ label: "Trips", isCurrent: true }]}
            title={
              <>
                Choose The Right Trip For Your Adventure In{" "}
                <span className={styles.highlight}>EGYPT</span>
              </>
            }
            subtitle="We make trip planning easy. Discover handpicked journeys, compare destinations, and book trips crafted around your travel style."
            decorationSrc="/images/dotted-line4.svg"
            subtitleMaxWidth="550px"
            titleMaxWidth="800px"
          />
        )
      ) : (
        <div className={styles.container}>
          <SectionHeader
            label="Trips"
            heading="Choose The Right Trip For Your Adventure"
            description="We make trip planning easy. Discover handpicked journeys, compare destinations, and book trips crafted around your travel style."
            descriptionMaxWidth="600px"
          />
        </div>
      )}

      {/* ── Search filter summary bar ── */}
      {isSearchResults && filterPills.length > 0 && (
        <div className={styles.filterSummaryBar}>
          <div className={styles.container}>
            <div className={styles.filterSummaryCard}>
              {filterPills.map((pill) => (
                <div key={pill.label} className={styles.filterSummaryPill}>
                  <Image
                    src={`/images/search/${pill.icon}.svg`}
                    alt=""
                    width={20}
                    height={20}
                    className={styles.filterSummaryIcon}
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).style.display = "none";
                    }}
                  />
                  <div className={styles.filterSummaryText}>
                    <span className={styles.filterSummaryLabel}>{pill.label}</span>
                    <span className={styles.filterSummaryValue}>{pill.value}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}


      <div className={styles.container} data-no-animate>
        {/* ── Toolbar ── */}
        <div className={styles.toolbar}>
          <div>
            {isPage && (
              <h2 className={styles.availableTripsTitle}>Available Trips</h2>
            )}
            <span className={styles.countSearch}>
              {isPage
                ? `${filteredTrips.length} Trips found for your route`
                : `Found ${filteredTrips.length} Tours`}
            </span>
          </div>

          {isPage ? (
            <div className={styles.toolbarRight}>
              {isLg && <SortButton options={SORT_OPTIONS} defaultValue="recommended" />}
              <SearchInput
                placeholder="Search trips, destinations, or keywords…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                variant="toolbar"
              />
            </div>
          ) : (
            isLg && (
              <div className={styles.toolbarSortHome}>
                <SortButton options={SORT_OPTIONS} defaultValue="recommended" />
              </div>
            )
          )}
        </div>

        <CategoryTabs tabs={isPage ? PAGE_CATEGORIES : HOME_CATEGORIES} wrap={isPage} />

        {filtersOpen && (
          <button
            type="button"
            className={styles.filterBackdrop}
            aria-label="Close filters"
            onClick={() => setFiltersOpen(false)}
          />
        )}

        {!isLg && (
          <div className={styles.filterSortRow}>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className={styles.filtersOpenBtn}
              onClick={() => setFiltersOpen(true)}
              icon={
                <span className={styles.filtersIcon} aria-hidden>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 6h2M9 6h12M3 12h2M6 12h12M3 18h2M9 18h12" />
                    <circle cx="7" cy="6" r="1.5" fill="currentColor" stroke="none" />
                    <circle cx="17" cy="12" r="1.5" fill="currentColor" stroke="none" />
                    <circle cx="7" cy="18" r="1.5" fill="currentColor" stroke="none" />
                  </svg>
                </span>
              }
              iconPosition="left"
            >
              <span className={styles.filtersBtnLabel}>
                Filters
                {activeFilterCount > 0 && (
                  <span className={styles.filterBadge} aria-label={`${activeFilterCount} active filters`}>
                    {activeFilterCount}
                  </span>
                )}
              </span>
            </Button>
            <div className={styles.filterSortRowSort}>
              <SortButton options={SORT_OPTIONS} defaultValue="recommended" showLabel={false} />
            </div>
          </div>
        )}

        <div className={styles.layout}>
          {/* ── Sidebar (desktop) / off-canvas panel (mobile) ── */}
          <aside
            className={`${styles.sidebar} ${filtersOpen ? styles.sidebarOpen : ""}`}
            id="trips-filters-panel"
            role={isLg ? undefined : "dialog"}
            aria-modal={!isLg && filtersOpen}
            aria-label="Trip filters"
            aria-hidden={!isLg && !filtersOpen ? true : undefined}
          >
            <div className={styles.sidebarMobileHeader}>
              <h2 className={styles.sidebarMobileTitle}>Filters</h2>
              <button
                type="button"
                className={styles.sidebarCloseBtn}
                onClick={() => setFiltersOpen(false)}
                aria-label="Close filters"
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M6 6l12 12M18 6L6 18" />
                </svg>
              </button>
            </div>

            {/* Duration */}
            <FilterGroup
              title="Duration"
              isExpanded={expanded.duration}
              onToggle={() => toggleFilter("duration")}
            >
              <RadioFilterList
                options={DURATION_OPTIONS}
                name="duration"
                selectedValue={durationFilter}
                onChange={setDurationFilter}
              />
            </FilterGroup>

            {/* Special Offers */}
            <FilterGroup
              title="Special Offers"
              isExpanded={expanded.offers}
              onToggle={() => toggleFilter("offers")}
            >
              <RadioFilterList
                options={SPECIAL_OFFERS}
                name="offers"
                selectedValue={offersFilter}
                onChange={setOffersFilter}
              />
            </FilterGroup>

            {/* Price Range */}
            <FilterGroup
              title="Price Range"
              isExpanded={expanded.price}
              onToggle={() => toggleFilter("price")}
            >
              <PriceRangeFilter
                min={1}
                max={12000}
                valueMin={expanded.priceRange.min}
                valueMax={expanded.priceRange.max}
                onChange={(min, max) => setExpanded((prev) => ({
                  ...prev,
                  priceRange: { min, max }
                }))}
              />
            </FilterGroup>

            <div className={styles.sidebarMobileFooter}>
              <Button
                type="button"
                variant="primary"
                size="md"
                fullWidth
                onClick={() => setFiltersOpen(false)}
              >
                Show results
              </Button>
            </div>
          </aside>

          {/* ── Trip grid ── */}
          <div className={styles.main}>
            {filteredTrips.length > 0 ? (
              <>
                <div className={styles.grid}>
                  {filteredTrips.map((trip, index) => (
                    <TripCard
                      key={trip.id}
                      trip={trip}
                      onFavoriteToggle={handleFavoriteToggle}
                      discountLabel={index === 0 ? (
                        <>Limited Time – <strong>15% Off</strong></>
                      ) : undefined}
                    />
                  ))}
                </div>

                <div className={styles.pagination}>
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                  />
                </div>
              </>
            ) : (
              <EmptyState onButtonClick={handleResetSearch} />
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

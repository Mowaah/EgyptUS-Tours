"use client";

import { useState } from "react";
import Image from "next/image";
import {
  CheckboxIndicator,
  SectionHeader,
  TripCard,
  CategoryTabs,
  SortButton,
  PaginationArrows,
  EmptyState,
  PageHeader,
  SearchInput,
} from "@/components/shared";
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
  image: "/images/home/hero-bg.jpg",
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
  const [trips, setTrips] = useState<Trip[]>(DEMO_TRIPS);

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


      <div className={styles.container}>
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
              <SortButton
                options={[
                  { value: "recommended", label: "Recommended" },
                  { value: "price-low", label: "Price: Low to High" },
                  { value: "price-high", label: "Price: High to Low" },
                ]}
                defaultValue="recommended"
              />
              <SearchInput
                placeholder="Search vehicles, transport option..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          ) : (
            <SortButton
              options={[
                { value: "recommended", label: "Recommended" },
                { value: "price-low", label: "Price: Low to High" },
                { value: "price-high", label: "Price: High to Low" },
              ]}
              defaultValue="recommended"
            />
          )}
        </div>

        <CategoryTabs tabs={isPage ? PAGE_CATEGORIES : HOME_CATEGORIES} wrap={isPage} />

        <div className={styles.layout}>
          {/* ── Sidebar ── */}
          <aside className={styles.sidebar}>
            {/* Duration */}
            <div className={`${styles.filterGroup} ${expanded.duration ? styles.filterGroupExpanded : ""}`}>
              <div className={styles.filterHeader} onClick={() => toggleFilter("duration")}>
                <h4>Duration</h4>
                <Image
                  src="/images/arrows/arrow-down2.svg"
                  alt="Toggle duration filter"
                  width={15}
                  height={8}
                  className={`${styles.chevron} ${expanded.duration ? styles.expanded : ""}`}
                />
              </div>
              {expanded.duration && (
                <div className={styles.filterOptions}>
                  {DURATION_OPTIONS.map((opt) => (
                    <label key={opt} className={styles.radio}>
                      <input
                        type="radio"
                        name="duration"
                        className={styles.radioInputHidden}
                        checked={durationFilter === opt}
                        onChange={() => setDurationFilter(opt)}
                      />
                      <CheckboxIndicator
                        variant="radio"
                        size="md"
                        emphasis="filter"
                        selected={durationFilter === opt}
                        aria-hidden
                      />
                      <span>{opt}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>

            {/* Special Offers */}
            <div className={`${styles.filterGroup} ${expanded.offers ? styles.filterGroupExpanded : ""}`}>
              <div className={styles.filterHeader} onClick={() => toggleFilter("offers")}>
                <h4>Special Offers</h4>
                <Image
                  src="/images/arrows/arrow-down2.svg"
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
                        className={styles.radioInputHidden}
                        checked={offersFilter === opt}
                        onChange={() => setOffersFilter(opt)}
                      />
                      <CheckboxIndicator
                        variant="radio"
                        size="md"
                        emphasis="filter"
                        selected={offersFilter === opt}
                        aria-hidden
                      />
                      <span>{opt}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>

            {/* Price Range */}
            <div className={`${styles.filterGroup} ${expanded.price ? styles.filterGroupExpanded : ""}`}>
              <div className={styles.filterHeader} onClick={() => toggleFilter("price")}>
                <h4>Price Range</h4>
                <Image
                  src="/images/arrows/arrow-down2.svg"
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
                        left: `${((expanded.priceRange.min) / 12000) * 100}%`,
                        width: `${((expanded.priceRange.max - expanded.priceRange.min) / 12000) * 100}%`,
                      }}
                    />
                    <input
                      type="range"
                      min="1"
                      max="12000"
                      value={expanded.priceRange.min}
                      onChange={(e) => {
                        const val = Math.min(Number(e.target.value), expanded.priceRange.max - 500);
                        setExpanded((prev) => ({
                          ...prev,
                          priceRange: { ...prev.priceRange, min: val },
                        }));
                      }}
                      className={styles.rangeInput}
                    />
                    <input
                      type="range"
                      min="1"
                      max="12000"
                      value={expanded.priceRange.max}
                      onChange={(e) => {
                        const val = Math.max(Number(e.target.value), expanded.priceRange.min + 500);
                        setExpanded((prev) => ({
                          ...prev,
                          priceRange: { ...prev.priceRange, max: val },
                        }));
                      }}
                      className={styles.rangeInput}
                    />
                  </div>
                  <span className={styles.rangeLabel}>
                    ${expanded.priceRange.min} - ${expanded.priceRange.max}
                  </span>
                </div>
              )}
            </div>
          </aside>

          {/* ── Trip grid ── */}
          <div className={styles.main}>
            {filteredTrips.length > 0 ? (
              <>
                <div className={styles.grid}>
                  {filteredTrips.map((trip) => (
                    <TripCard
                      key={trip.id}
                      trip={trip}
                      onFavoriteToggle={handleFavoriteToggle}
                    />
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
              <EmptyState onButtonClick={handleResetSearch} />
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

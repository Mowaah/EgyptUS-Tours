"use client";

import { useState, useEffect, useLayoutEffect, useMemo } from "react";
import { useSearchParams } from "next/navigation";
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
import { useTranslation } from "@/hooks/useTranslation";
import { Trip } from "@/types";
import styles from "./TripsSection.module.scss";

// Internal filter values — language-independent keys used for filtering logic
const DURATION_VALUES = ["any", "lessThan10", "10to15", "15to20", "moreThan20"] as const;
const OFFERS_VALUES = ["any", "christmas", "easter"] as const;

export interface SearchParams {
  date?: string;
  destination?: string;
  budget?: string;
  tripType?: string;
  category?: string;
}

interface TripsSectionProps {
  /** "home" (default) renders the condensed homepage version with SectionHeader.
   *  "page" renders the full /trips page version with page heading + search bar. */
  variant?: "home" | "page";
  /** When provided (redirected from SearchBar) renders Search Results mode */
  searchParams?: SearchParams;
  initialTrips?: Trip[];
}

interface FilterPill {
  icon: string;
  label: string;
  value: string;
}

export default function TripsSection({ variant = "home", searchParams, initialTrips = [] }: TripsSectionProps) {
  const { t: tHome } = useTranslation("home");
  const { t } = useTranslation("trips");
  const isPage = variant === "page";
  const isSearchResults = isPage && !!searchParams;

  const sortOptions = useMemo(() => [
    { value: "recommended", label: t("sort.recommended", "Recommended") },
    { value: "price-low", label: t("sort.priceLow", "Price: Low to High") },
    { value: "price-high", label: t("sort.priceHigh", "Price: High to Low") },
  ], [t]);

  const durationOptions = useMemo(() => DURATION_VALUES.map((v) => ({
    label: t(`duration.${v}`, v),
    value: v,
  })), [t]);

  const offersOptions = useMemo(() => OFFERS_VALUES.map((v) => ({
    label: t(`offers.${v}`, v),
    value: v,
  })), [t]);

  const [expanded, setExpanded] = useState<{
    duration: boolean;
    offers: boolean;
    price: boolean;
    priceRange: { min: number; max: number };
  }>({
    duration: true,
    offers: true,
    price: true,
    priceRange: { min: 0, max: 100000 },
  });

  // Filter state uses internal value keys (language-independent)
  const [durationFilter, setDurationFilter] = useState<string>("any");
  const [offersFilter, setOffersFilter] = useState<string>("any");

  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [sortBy, setSortBy] = useState("recommended");
  const DESERT_CATEGORIES = ["Western Desert", "Sinai Desert", "Oasis Desert", "Safari Trips"];
  const PAGE_SIZE = 6;
  const [trips, setTrips] = useState<Trip[]>(initialTrips);

  const dynamicCategories = useMemo(() => {
    const cats = new Set<string>();
    trips.forEach((trip) => {
      trip.tags?.forEach((tag) => cats.add(tag));
    });
    
    if (searchParams?.tripType?.toLowerCase() === "desert") {
      return ["Western Desert", "Sinai Desert", "Oasis Desert", "Safari Trips"];
    }
    
    return ["All Trips", ...Array.from(cats)];
  }, [trips, searchParams?.tripType]);

  // Read category directly from URL so it reacts instantly to client-side navigation
  const urlSearchParams = useSearchParams();
  const urlCategory = urlSearchParams.get("category");
  const categoryFromUrl = useMemo(() => {
    if (!urlCategory) return 0;
    const catLower = urlCategory.toLowerCase().trim();
    const idx = dynamicCategories.findIndex(
      (c) => c.toLowerCase().trim() === catLower || c.toLowerCase().replace(/\s+/g, "-") === catLower
    );
    if (idx >= 0) return idx;
    const desertIdx = DESERT_CATEGORIES.findIndex(
      (c) => c.toLowerCase().trim() === catLower || c.toLowerCase().replace(/\s+/g, "-") === catLower
    );
    return desertIdx >= 0 ? desertIdx : 0;
  }, [urlCategory, dynamicCategories]);

  const [activeCategoryIndex, setActiveCategoryIndex] = useState(categoryFromUrl);

  // Sync whenever the URL's category param changes (e.g. navigating between categories in navbar)
  useEffect(() => {
    setActiveCategoryIndex(categoryFromUrl);
  }, [categoryFromUrl]);

  const maxPriceLimit = useMemo(() => {
    const src = trips.length > 0 ? trips : initialTrips;
    if (src.length === 0) return 50000;
    const max = Math.max(...src.map((t) => t.price || 0));
    return Math.max(Math.ceil(max / 1000) * 1000, 12000);
  }, [trips, initialTrips]);

  useEffect(() => {
    setTrips(initialTrips);
  }, [initialTrips]);

  useEffect(() => {
    setExpanded((prev) => {
      if (prev.priceRange.max < maxPriceLimit || prev.priceRange.max === 12000) {
        return {
          ...prev,
          priceRange: { min: prev.priceRange.min, max: maxPriceLimit },
        };
      }
      return prev;
    });
  }, [maxPriceLimit]);

  const activeFilterCount = useMemo(() => {
    let n = 0;
    if (durationFilter !== "any") n += 1;
    if (offersFilter !== "any") n += 1;
    if (expanded.priceRange.min !== 0 || expanded.priceRange.max < maxPriceLimit) n += 1;
    return n;
  }, [durationFilter, offersFilter, expanded.priceRange.min, expanded.priceRange.max, maxPriceLimit]);

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

  // 1. Filter by Search Query
  let processedTrips = trips.filter(
    (trip) =>
      trip.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      trip.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // 2. Filter by Price
  processedTrips = processedTrips.filter(
    (trip) => trip.price >= expanded.priceRange.min && trip.price <= expanded.priceRange.max
  );

  // 3. Filter by Duration
  if (durationFilter !== "any") {
    processedTrips = processedTrips.filter((trip) => {
      const days = trip.duration.days;
      if (durationFilter === "lessThan10") return days < 10;
      if (durationFilter === "10to15") return days >= 10 && days <= 15;
      if (durationFilter === "15to20") return days >= 15 && days <= 20;
      if (durationFilter === "moreThan20") return days > 20;
      return true;
    });
  }

  // 4. Sort
  processedTrips = [...processedTrips].sort((a, b) => {
    if (sortBy === "price-low") return a.price - b.price;
    if (sortBy === "price-high") return b.price - a.price;
    return 0; // recommended stays same for now
  });

  // 5. Filter by Category Tab
  const selectedCategory = dynamicCategories[activeCategoryIndex];
  if (selectedCategory && selectedCategory !== "All Trips") {
    processedTrips = processedTrips.filter((trip) => {
      if (selectedCategory === "Safari Trips") {
        return trip.tags?.some(tag => tag.toLowerCase().includes("safari"));
      }
      return trip.tags?.some(tag => tag.toLowerCase() === selectedCategory.toLowerCase());
    });
  }

  const totalPages = Math.max(1, Math.ceil(processedTrips.length / PAGE_SIZE));
  
  // 6. Paginate
  const paginatedTrips = processedTrips.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
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
    filterPills.push({ icon: "calendar", label: t("filterPills.date", "Date"), value: searchParams.date });
  if (searchParams?.budget)
    filterPills.push({ icon: "budget", label: t("filterPills.budget", "Budget"), value: searchParams.budget });
  if (searchParams?.tripType && searchParams.tripType.toLowerCase() !== "desert")
    filterPills.push({ icon: "trip-type", label: t("filterPills.tripType", "Trip Type"), value: searchParams.tripType });

  return (
    <section className={styles.section}>

      {/* ── Header ── */}
      {isPage ? (
        <PageHeader
          breadcrumbs={[{ label: t("breadcrumb", "Egypt Tours"), isCurrent: true }]}
          title={
            searchParams?.tripType?.toLowerCase() === "desert" ? (
              <>
                {t("desertTitle", "Find Your Perfect Desert Escape in Egypt")}
              </>
            ) : (
              <>
                {t("pageTitle", "Choose The Right Trip For Your Adventure In")}{" "}
                <span className={styles.highlight}>
                  {searchParams?.destination ? searchParams.destination.toUpperCase() : t("egypt", "EGYPT")}
                </span>
              </>
            )
          }
          subtitle={
            searchParams?.tripType?.toLowerCase() === "desert"
              ? t("desertSubtitle", "Browse our curated collection of desert adventures, including the White Desert, Sinai, Egypt's oases, and unforgettable safari experiences.")
              : t("pageSubtitle", "We make trip planning easy. Discover handpicked journeys, compare destinations, and book trips crafted around your travel style.")
          }
          decorationSrc="/images/dotted-line4.svg"
          subtitleMaxWidth="550px"
          titleMaxWidth="800px"
        />
      ) : (
        <div className={styles.container}>
          <SectionHeader
            label={tHome("trips.label", "Egypt Tours")}
            heading={tHome("trips.heading", "Choose The Right Trip For You in Egypt & Beyond")}
            description={tHome("trips.description", "Discover personalized trips and unforgettable experiences, designed around the way you want to enjoy your next vacation.")}
            descriptionMaxWidth="680px"
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
              <h2 className={styles.availableTripsTitle}>{t("availableTrips", "Available Trips")}</h2>
            )}
            <span className={styles.countSearch}>
              {isPage
                ? t("tripsFound", "{count} trips found").replace("{count}", String(processedTrips.length))
                : t("tripsFound", "{count} trips found").replace("{count}", String(processedTrips.length))}
            </span>
          </div>

          {isPage ? (
            <div className={styles.toolbarRight}>
              {isLg && (
                <SortButton 
                  options={sortOptions} 
                  defaultValue="recommended" 
                  onChange={(val) => setSortBy(val)} 
                />
              )}
              <SearchInput
                placeholder={t("searchPlaceholder", "Search trips, destinations, or keywords…")}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                variant="toolbar"
              />
            </div>
          ) : (
            isLg && (
              <div className={styles.toolbarSortHome}>
                <SortButton 
                  options={sortOptions} 
                  defaultValue="recommended" 
                  onChange={(val) => setSortBy(val)} 
                />
              </div>
            )
          )}
        </div>

        <CategoryTabs 
          tabs={dynamicCategories} 
          wrap={isPage} 
          active={activeCategoryIndex}
          onTabChange={(_, index) => {
            setActiveCategoryIndex(index);
            setCurrentPage(1); // Reset pagination on category change
          }}
        />

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
            <button
              type="button"
              className={`${styles.filtersOpenBtn} ${activeFilterCount > 0 ? styles.filtersOpenBtnActive : ""}`}
              onClick={() => setFiltersOpen(true)}
            >
              <span className={styles.filtersIcon} aria-hidden>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 6h2M9 6h12M3 12h2M6 12h12M3 18h2M9 18h12" />
                  <circle cx="7" cy="6" r="1.5" fill="currentColor" stroke="none" />
                  <circle cx="17" cy="12" r="1.5" fill="currentColor" stroke="none" />
                  <circle cx="7" cy="18" r="1.5" fill="currentColor" stroke="none" />
                </svg>
              </span>
              <span className={styles.filtersBtnLabel}>
                {t("filters", "Filters")}
                {activeFilterCount > 0 && (
                  <span className={styles.filterBadge} aria-label={`${activeFilterCount} active filters`}>
                    {activeFilterCount}
                  </span>
                )}
              </span>
            </button>
            <div className={styles.filterSortRowSort}>
              <SortButton 
                options={sortOptions} 
                defaultValue="recommended" 
                showLabel={false} 
                onChange={(val) => setSortBy(val)} 
              />
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
              <h2 className={styles.sidebarMobileTitle}>{t("filters", "Filters")}</h2>
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
              title={t("filterGroups.duration", "Duration")}
              isExpanded={expanded.duration}
              onToggle={() => toggleFilter("duration")}
            >
              <RadioFilterList
                options={durationOptions}
                name="duration"
                selectedValue={durationFilter}
                onChange={setDurationFilter}
              />
            </FilterGroup>

            {/* Special Offers */}
            <FilterGroup
              title={t("filterGroups.specialOffers", "Special Offers")}
              isExpanded={expanded.offers}
              onToggle={() => toggleFilter("offers")}
            >
              <RadioFilterList
                options={offersOptions}
                name="offers"
                selectedValue={offersFilter}
                onChange={setOffersFilter}
              />
            </FilterGroup>

            {/* Price Range */}
            <FilterGroup
              title={t("filterGroups.priceRange", "Price Range")}
              isExpanded={expanded.price}
              onToggle={() => toggleFilter("price")}
            >
              <PriceRangeFilter
                min={0}
                max={maxPriceLimit}
                valueMin={expanded.priceRange.min}
                valueMax={Math.min(expanded.priceRange.max, maxPriceLimit)}
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
                {t("showResults", "Show results")}
              </Button>
            </div>
          </aside>

          {/* ── Trip grid ── */}
          <div className={styles.main}>
            {paginatedTrips.length > 0 ? (
              <>
                <div className={styles.grid}>
                  {paginatedTrips.map((trip, index) => (
                    <TripCard
                      key={trip.id}
                      trip={trip}
                      onFavoriteToggle={handleFavoriteToggle}
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

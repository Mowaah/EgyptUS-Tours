"use client";

import { useState, useEffect, useLayoutEffect, useMemo } from "react";
import {
  Button,
  CheckboxIndicator,
  HotelCard,
  CategoryTabs,
  SortButton,
  Pagination,
  EmptyState,
  PageHeader,
  StarRating,
  SearchInput,
  FilterGroup,
  PriceRangeFilter,
} from "@/components/shared";
import { useScrollLock } from "@/hooks/useScrollLock";
import { useCurrency } from "@/contexts/CurrencyContext";
import { Hotel } from "@/types";
import { HotelList } from "@/types/api";
import styles from "./HotelsPageSection.module.scss";

// ── Data ────────────────────────────────────────────────────────
const RATING_OPTIONS = [
  { label: "Any", value: "any" },
  { label: "5.0", value: "5" },
  { label: "4.0", value: "4" },
  { label: "3.0", value: "3" },
  { label: "2.0", value: "2" },
  { label: "1.0", value: "1" },
];

const SORT_OPTIONS = [
  { value: "recommended", label: "Recommended" },
  { value: "price-low", label: "Price: Low to High" },
  { value: "price-high", label: "Price: High to Low" },
  { value: "rating", label: "Rating" },
];

const ITEMS_PER_PAGE = 6;

// ── Component ───────────────────────────────────────────────────
interface HotelsPageSectionProps {
  initialHotels?: HotelList[];
}

export default function HotelsPageSection({ initialHotels = [] }: HotelsPageSectionProps) {
  const { formatCurrency } = useCurrency();

  const mappedHotels: Hotel[] = useMemo(() => initialHotels.map((h) => ({
    id: h.slug,
    name: h.name,
    location: h.location_text || "",
    image: h.hero_image || "/images/pyramids.jpg",
    stars: h.stars,
    rating: parseFloat(h.rating_avg) || 0,
    rooms: h.rooms,
    pricePerNight: parseFloat(h.price_per_night_egp || h.price_per_night) || 0,
    reviews: h.review_count,
    isFavorite: h.is_favorite,
  })), [initialHotels]);

  const maxHotelPriceLimit = useMemo(() => {
    if (mappedHotels.length === 0) return 50000;
    const max = Math.max(...mappedHotels.map((h) => h.pricePerNight || 0));
    return Math.max(Math.ceil(max / 1000) * 1000, 12000);
  }, [mappedHotels]);

  const dynamicTabs = useMemo(() => {
    const locations = Array.from(new Set(mappedHotels.map((h) => h.location).filter(Boolean)));
    return ["All Locations", ...locations.sort()];
  }, [mappedHotels]);

  const [hotels, setHotels] = useState<Hotel[]>(mappedHotels);
  const [ratingFilter, setRatingFilter] = useState("any");
  const [priceRange, setPriceRange] = useState({ min: 0, max: maxHotelPriceLimit });
  const [priceExpanded, setPriceExpanded] = useState(true);
  const [ratingExpanded, setRatingExpanded] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("All Locations");
  const [sortOption, setSortOption] = useState("recommended");
  const [currentPage, setCurrentPage] = useState(1);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [isLg, setIsLg] = useState(false);

  const handleFavoriteToggle = (id: string) => {
    setHotels((prev) =>
      prev.map((hotel) =>
        hotel.id === id ? { ...hotel, isFavorite: !hotel.isFavorite } : hotel
      )
    );
  };

  const activeFilterCount = useMemo(() => {
    let n = 0;
    if (ratingFilter !== "any") n += 1;
    if (priceRange.min !== 0 || priceRange.max < maxHotelPriceLimit) n += 1;
    return n;
  }, [ratingFilter, priceRange.min, priceRange.max, maxHotelPriceLimit]);

  // useLayoutEffect: align JS with CSS before paint.
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

  // Apply Filters
  const filteredHotels = hotels.filter((h) => {
    const matchesSearch =
      h.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      h.location.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesLocation =
      selectedLocation === "All Locations" ||
      h.location.toLowerCase().includes(selectedLocation.toLowerCase());

    const matchesRating =
      ratingFilter === "any" || h.rating >= parseFloat(ratingFilter);

    const matchesPrice =
      h.pricePerNight >= priceRange.min && h.pricePerNight <= priceRange.max;

    return matchesSearch && matchesLocation && matchesRating && matchesPrice;
  });

  // Apply Sorting
  const sortedHotels = [...filteredHotels].sort((a, b) => {
    if (sortOption === "price-low") return a.pricePerNight - b.pricePerNight;
    if (sortOption === "price-high") return b.pricePerNight - a.pricePerNight;
    if (sortOption === "rating") return b.rating - a.rating;
    return 0;
  });

  const totalPages = Math.max(1, Math.ceil(sortedHotels.length / ITEMS_PER_PAGE));

  const paginatedHotels = sortedHotels.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleResetSearch = () => {
    setSearchQuery("");
    setRatingFilter("any");
    setPriceRange({ min: 1, max: maxHotelPriceLimit });
    setSelectedLocation("All Locations");
    setSortOption("recommended");
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  return (
    <section className={styles.section}>
      <PageHeader
        breadcrumbs={[{ label: "Hotels", isCurrent: true }]}
        title="Find the perfect hotel for your trip"
        subtitle="We make hotel booking easy. Discover top-rated hotels, compare features and prices, and book a stay tailored to your travel style."
        decorationSrc="/images/dotted-line3.svg"
        subtitleMaxWidth="550px"
      />

      <div className={styles.container}>
        <div className={styles.toolbar}>
          <div>
            <h2 className={styles.availableHotelsTitle}>Available Hotels</h2>
            <span className={styles.countSearch}>
              {filteredHotels.length} hotel{filteredHotels.length === 1 ? "" : "s"} found
            </span>
          </div>

          <div className={styles.toolbarRight}>
            {isLg && <SortButton options={SORT_OPTIONS} defaultValue="recommended" onChange={setSortOption} />}
            <SearchInput
              placeholder="Search hotels, cities, or countries…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              variant="toolbar"
            />
          </div>
        </div>

        <CategoryTabs
          tabs={dynamicTabs}
          wrap
          onTabChange={(tab) => {
            setSelectedLocation(tab);
            setCurrentPage(1);
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
                Filters
                {activeFilterCount > 0 && (
                  <span className={styles.filterBadge} aria-label={`${activeFilterCount} active filters`}>
                    {activeFilterCount}
                  </span>
                )}
              </span>
            </button>
            <div className={styles.filterSortRowSort}>
              <SortButton options={SORT_OPTIONS} defaultValue="recommended" showLabel={false} onChange={setSortOption} />
            </div>
          </div>
        )}

        <div className={styles.layout}>
          <aside
            className={`${styles.sidebar} ${filtersOpen ? styles.sidebarOpen : ""}`}
            id="hotels-filters-panel"
            role={isLg ? undefined : "dialog"}
            aria-modal={!isLg && filtersOpen}
            aria-label="Hotel filters"
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

            <FilterGroup
              title="Rating"
              isExpanded={ratingExpanded}
              onToggle={() => setRatingExpanded((v) => !v)}
            >
              <div className={styles.filterOptions}>
                {RATING_OPTIONS.map((opt) => (
                  <label key={opt.value} className={styles.radio}>
                    <input
                      type="radio"
                      name="rating"
                      className={styles.radioInputHidden}
                      checked={ratingFilter === opt.value}
                      onChange={() => setRatingFilter(opt.value)}
                    />
                    <CheckboxIndicator
                      variant="radio"
                      size="md"
                      emphasis="filter"
                      selected={ratingFilter === opt.value}
                      aria-hidden
                    />
                    {opt.value === "any" ? (
                      <span>Any</span>
                    ) : (
                      <span className={styles.ratingOptionRow}>
                        <StarRating filled={Number(opt.value)} showValue={false} size={14} />
                        <span className={styles.ratingNum}>{opt.label}</span>
                      </span>
                    )}
                  </label>
                ))}
              </div>
            </FilterGroup>

            <FilterGroup
              title="Price Range"
              isExpanded={priceExpanded}
              onToggle={() => setPriceExpanded((v) => !v)}
            >
              <PriceRangeFilter
                min={0}
                max={maxHotelPriceLimit}
                valueMin={priceRange.min}
                valueMax={Math.min(priceRange.max, maxHotelPriceLimit)}
                onChange={(min, max) => setPriceRange({ min, max })}
                formatValue={formatCurrency}
              />
            </FilterGroup>

            <div className={styles.sidebarMobileFooter}>
              <Button type="button" variant="primary" size="md" fullWidth onClick={() => setFiltersOpen(false)}>
                Show results
              </Button>
            </div>
          </aside>

          <div className={styles.main}>
            {filteredHotels.length > 0 ? (
              <>
                <div className={styles.gridView}>
                  {paginatedHotels.map((hotel) => (
                    <HotelCard key={hotel.id} hotel={hotel} view="grid" onFavoriteToggle={handleFavoriteToggle} />
                  ))}
                </div>

                <div className={styles.pagination}>
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                  />
                </div>
              </>
            ) : (
              <EmptyState
                title="Hotel Not Available"
                description="Sorry, this hotel is currently unavailable. Please explore other hotels or try different dates."
                buttonText="View Other Hotels"
                onButtonClick={handleResetSearch}
              />
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

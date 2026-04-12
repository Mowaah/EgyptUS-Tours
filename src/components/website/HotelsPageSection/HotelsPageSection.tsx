"use client";

import { useState } from "react";
import Image from "next/image";
import {
  CheckboxIndicator,
  HotelCard,
  CategoryTabs,
  SortButton,
  PaginationArrows,
  EmptyState,
  PageHeader,
  StarRating,
  SearchInput,
  FilterGroup,
  PriceRangeFilter,
} from "@/components/shared";
import { Hotel } from "@/types";
import styles from "./HotelsPageSection.module.scss";

// ── Data ────────────────────────────────────────────────────────
const LOCATION_TABS_ROW1 = [
  "Giza",
  "Cairo",
  "Luxor",
  "Aswan",
  "Sharm El Sheikh",
  "Alexandria",
  "Hurghada",
  "South Sinai",
];

const LOCATION_TABS_ROW2 = [
  "New Valley",
  "Ismailia",
  "Cairo",
  "Luxor",
  "Aswan",
  "Sharm El Sheikh",
  "Alexandria",
  "Hurghada",
  "South Sinai",
];

const ALL_TABS = [...LOCATION_TABS_ROW1, ...LOCATION_TABS_ROW2];

const RATING_OPTIONS = [
  { label: "Any", value: "any" },
  { label: "5.0", value: "5" },
  { label: "4.0", value: "4" },
  { label: "3.0", value: "3" },
  { label: "2.0", value: "2" },
  { label: "1.0", value: "1" },
];

const DEMO_HOTELS: Hotel[] = Array.from({ length: 8 }, (_, i) => ({
  id: `hotel-${i + 1}`,
  name: "Pyramids View Luxury Hotel",
  location: "Giza",
  image: "/images/pyramids.jpg",
  stars: 5,
  rating: 4.2,
  rooms: 245,
  pricePerNight: 180,
  reviews: 1847,
}));

const ITEMS_PER_PAGE = 6;
const TOTAL_PAGES = 15;

// ── Component ───────────────────────────────────────────────────
export default function HotelsPageSection() {
  const [view, setView] = useState<"list" | "grid">("list");
  const [ratingFilter, setRatingFilter] = useState("any");
  const [priceRange, setPriceRange] = useState({ min: 1, max: 12000 });
  const [priceExpanded, setPriceExpanded] = useState(true);
  const [ratingExpanded, setRatingExpanded] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const filteredHotels = DEMO_HOTELS.filter(
    (h) =>
      h.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      h.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const paginatedHotels = filteredHotels.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleResetSearch = () => setSearchQuery("");

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= TOTAL_PAGES) setCurrentPage(page);
  };

  // Build visible page numbers: 1 2 3 … 13 14 15
  const pageNumbers: (number | "...")[] = [1, 2, 3, "...", TOTAL_PAGES - 2, TOTAL_PAGES - 1, TOTAL_PAGES];

  return (
    <section className={styles.section}>
      {/* ── Page Header ── */}
      <PageHeader
        breadcrumbs={[{ label: "Hotels", isCurrent: true }]}
        title="Find the perfect hotel for your trip"
        subtitle="We make hotel booking easy. Discover top-rated hotels, compare features and prices, and book a stay tailored to your travel style."
        decorationSrc="/images/dotted-line3.svg"
        subtitleMaxWidth="550px"
      />

      <div className={styles.container}>
        {/* ── Toolbar ── */}
        <div className={styles.toolbar}>
          <span className={styles.countSearch}>
            Found {filteredHotels.length} Tours
          </span>

          <div className={styles.toolbarRight}>
            <SortButton
              options={[
                { value: "recommended", label: "Recommended" },
                { value: "price-low", label: "Price: Low to High" },
                { value: "price-high", label: "Price: High to Low" },
                { value: "rating", label: "Rating" },
              ]}
              defaultValue="recommended"
            />
            <SearchInput
              placeholder="Search hotels, cities, or countries..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* ── Category Tabs – two rows ── */}
        <CategoryTabs tabs={ALL_TABS} wrap />

        {/* ── Layout: sidebar + main ── */}
        <div className={styles.layout}>
          {/* Sidebar */}
          <aside className={styles.sidebar}>
            {/* Rating */}
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

            {/* Price Range */}
            <FilterGroup
              title="Price Range"
              isExpanded={priceExpanded}
              onToggle={() => setPriceExpanded((v) => !v)}
            >
              <PriceRangeFilter
                min={1}
                max={12000}
                valueMin={priceRange.min}
                valueMax={priceRange.max}
                onChange={(min, max) => setPriceRange({ min, max })}
              />
            </FilterGroup>
          </aside>

          {/* ── Main content ── */}
          <div className={styles.main}>
            {/* View toggle */}
            <div className={styles.viewToggle}>
              <button
                className={`${styles.viewBtn} ${view === "list" ? styles.viewActive : ""}`}
                onClick={() => setView("list")}
                aria-label="List view"
              >
                <Image src="/images/list-view.svg" alt="" width={15} height={15} />
                List
              </button>
              <button
                className={`${styles.viewBtn} ${view === "grid" ? styles.viewActive : ""}`}
                onClick={() => setView("grid")}
                aria-label="Grid view"
              >
                <Image src="/images/grid-view.svg" alt="" width={16} height={16} />
                Grid
              </button>
            </div>

            {filteredHotels.length > 0 ? (
              <>
                <div
                  className={
                    view === "grid" ? styles.gridView : styles.listView
                  }
                >
                  {paginatedHotels.map((hotel) => (
                    <HotelCard key={hotel.id} hotel={hotel} view={view} showRouteBtn />
                  ))}
                </div>

                {/* Pagination */}
                <div className={styles.pagination}>
                  <PaginationArrows
                    layout="inline"
                    size={30}
                    iconWidth={15}
                    iconHeight={15}
                    onPrev={() => handlePageChange(currentPage - 1)}
                    onNext={() => handlePageChange(currentPage + 1)}
                    prevDisabled={currentPage === 1}
                    nextDisabled={currentPage === TOTAL_PAGES}
                  >
                    <div className={styles.pages}>
                      {pageNumbers.map((page, i) => (
                        <button
                          key={i}
                          className={`${styles.pageBtn} ${page === currentPage ? styles.active : ""} ${page === "..." ? styles.dots : ""}`}
                          disabled={page === "..."}
                          onClick={() =>
                            typeof page === "number" && handlePageChange(page)
                          }
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



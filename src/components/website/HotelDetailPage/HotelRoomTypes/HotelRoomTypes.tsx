"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import { Hotel, HotelRoom } from "@/types";
import { FilterGroup, RadioFilterList, PriceRangeFilter, EmptyState, FilterSidebar } from "@/components/shared";
import { useCurrency } from "@/contexts/CurrencyContext";
import { useTranslation } from "@/hooks/useTranslation";
import styles from "./HotelRoomTypes.module.scss";

interface HotelRoomTypesProps {
  hotel: Hotel;
}

const TYPE_CONFIG = [
  { value: "All", labelKey: "roomTypes.types.all" },
  { value: "Single", labelKey: "roomTypes.types.single" },
  { value: "Double Room", labelKey: "roomTypes.types.double" },
  { value: "Triple Room", labelKey: "roomTypes.types.triple" },
] as const;

const VIEW_CONFIG = [
  { value: "All", labelKey: "roomTypes.views.all" },
  { value: "Sea View", labelKey: "roomTypes.views.sea" },
  { value: "Pool View", labelKey: "roomTypes.views.pool" },
  { value: "Garden View", labelKey: "roomTypes.views.garden" },
] as const;

export default function HotelRoomTypes({ hotel }: HotelRoomTypesProps) {
  const { formatCurrency } = useCurrency();
  const { t } = useTranslation("hotels");

  const rooms = useMemo(() => hotel.hotelRooms ?? [], [hotel.hotelRooms]);

  // Normalize every room price to USD (the unit the slider is displayed in):
  // prefer the explicit USD price, else convert the EGP figure using the same
  // implied rate the site uses for the slider label (EGP = USD * 50).
  const getRoomUsdPrice = (room: HotelRoom): number => {
    const usd = room.prices?.usd;
    if (usd != null && Number.isFinite(Number(usd))) return Number(usd);
    if (room.pricePerNightEgp != null && Number.isFinite(room.pricePerNightEgp) && room.pricePerNightEgp > 0) {
      return room.pricePerNightEgp / 50;
    }
    if (room.pricePerNight > 0) return room.pricePerNight;
    return 0;
  };

  // Derive the price slider bounds from the actual backend room prices
  const priceBounds = useMemo(() => {
    if (rooms.length === 0) return { min: 1, max: 12000 };
    const prices = rooms.map(getRoomUsdPrice).filter(p => p > 0);
    if (prices.length === 0) return { min: 1, max: 12000 };
    const min = Math.max(Math.floor(Math.min(...prices)), 1);
    const max = Math.max(Math.ceil(Math.max(...prices) / 1000) * 1000, min + 1000);
    return { min, max };
  }, [rooms]);

  const [roomCategory, setRoomCategory] = useState("All");
  const [roomType, setRoomType] = useState("All");
  const [roomView, setRoomView] = useState("All");
  const [priceRange, setPriceRange] = useState({ min: priceBounds.min, max: priceBounds.max });

  const [expanded, setExpanded] = useState({
    category: true,
    type: true,
    view: true,
    price: true,
  });

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (roomCategory !== "All") count++;
    if (roomType !== "All") count++;
    if (roomView !== "All") count++;
    if (priceRange.min !== priceBounds.min || priceRange.max !== priceBounds.max) count++;
    return count;
  }, [roomCategory, roomType, roomView, priceRange, priceBounds]);

  const handleReset = () => {
    setRoomCategory("All");
    setRoomType("All");
    setRoomView("All");
    setPriceRange({ min: priceBounds.min, max: priceBounds.max });
  };

  // Price filter only applies once the user changes it from the untouched default
  const isPriceFilterActive =
    priceRange.min !== priceBounds.min || priceRange.max !== priceBounds.max;

  // Filtering logic
  const filteredRooms = rooms.filter(room => {
    const matchesCategory = roomCategory === "All" || room.category === roomCategory;
    const matchesType = roomType === "All" || room.type === roomType;
    const matchesView = roomView === "All" || room.view === roomView;
    const usdPrice = getRoomUsdPrice(room);
    const matchesPrice =
      !isPriceFilterActive || (usdPrice >= priceRange.min && usdPrice <= priceRange.max);
    return matchesCategory && matchesType && matchesView && matchesPrice;
  });

  const toggleExpand = (key: keyof typeof expanded) => {
    setExpanded(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const categoryOptions = useMemo(() => {
    const categories = Array.from(new Set(rooms.map(r => r.category).filter(Boolean)));
    return [
      { label: t("roomTypes.all", "All"), value: "All" },
      ...categories.map(c => ({ label: c as string, value: c as string })),
    ];
  }, [rooms, t]);

  const typeOptions = useMemo(() => {
    return TYPE_CONFIG.map(c => ({
      label: t(c.labelKey as Parameters<typeof t>[0], c.value),
      value: c.value,
    }));
  }, [t]);

  const viewOptions = useMemo(() => {
    return VIEW_CONFIG.map(c => ({
      label: t(c.labelKey as Parameters<typeof t>[0], c.value),
      value: c.value,
    }));
  }, [t]);

  return (
    <section id="room-types" className={styles.section}>
      <div className={styles.header}>
        <h2 className={styles.heading}>{t("roomTypes.heading", "Room Types")}</h2>
        <p className={styles.subtitle}>
          {t("roomTypes.subtitle", "Explore the different room options designed to suit every traveler’s needs, from cozy singles to spacious family suites.")}
        </p>
      </div>

      <div className={styles.layout}>
        {/* ── Sidebar Filters ── */}
        <FilterSidebar
          activeCount={activeFilterCount}
          totalResults={filteredRooms.length}
          resultsLabel="rooms"
          onReset={handleReset}
          id="hotel-rooms-sidebar"
        >
          {/* Room Category */}
          <FilterGroup
            title={t("roomTypes.filterCategory", "Room Category")}
            isExpanded={expanded.category}
            onToggle={() => toggleExpand("category")}
          >
            <RadioFilterList
              options={categoryOptions}
              name="roomCategory"
              selectedValue={roomCategory}
              onChange={setRoomCategory}
            />
          </FilterGroup>

          {/* Type of Room */}
          <FilterGroup
            title={t("roomTypes.filterType", "Type Of Room")}
            isExpanded={expanded.type}
            onToggle={() => toggleExpand("type")}
          >
            <RadioFilterList
              options={typeOptions}
              name="roomType"
              selectedValue={roomType}
              onChange={setRoomType}
            />
          </FilterGroup>

          {/* Room View */}
          <FilterGroup
            title={t("roomTypes.filterView", "Room View")}
            isExpanded={expanded.view}
            onToggle={() => toggleExpand("view")}
          >
            <RadioFilterList
              options={viewOptions}
              name="roomView"
              selectedValue={roomView}
              onChange={setRoomView}
            />
          </FilterGroup>

          {/* Price Range */}
          <FilterGroup
            title={t("roomTypes.filterPrice", "Price Range")}
            isExpanded={expanded.price}
            onToggle={() => toggleExpand("price")}
          >
            <PriceRangeFilter
              min={priceBounds.min}
              max={priceBounds.max}
              valueMin={priceRange.min}
              valueMax={Math.min(priceRange.max, priceBounds.max)}
              onChange={(newMin, newMax) => setPriceRange({ min: newMin, max: newMax })}
              formatValue={(val) => formatCurrency({ usd: val, eur: val, egp: val * 50 })}
            />
          </FilterGroup>
        </FilterSidebar>

        {/* ── Rooms List ── */}
        <div className={styles.roomsList}>
          {rooms.length === 0 ? (
            <div style={{ paddingTop: "40px", paddingBottom: "40px" }}>
              <EmptyState
                title={t("roomTypes.noRoomsTitle", "No Available Rooms")}
                description={t("roomTypes.noRoomsAvailableDesc", "There are no rooms available for this hotel right now. Check back soon for new room options.")}
              />
            </div>
          ) : filteredRooms.length > 0 ? (
            filteredRooms.map(room => (
              <RoomCard key={room.id} room={room} />
            ))
          ) : (
            <div style={{ paddingTop: "40px", paddingBottom: "40px" }}>
              <EmptyState 
                title={t("roomTypes.noRoomsFound", "No rooms found")}
                description={t("roomTypes.noRoomsDesc", "Try adjusting your filters to find available rooms.")}
                onButtonClick={handleReset}
                buttonText={t("roomTypes.resetAll", "Reset all filters")}
              />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function RoomCard({ room }: { room: HotelRoom }) {
  const { formatCurrency } = useCurrency();
  const { t } = useTranslation("hotels");
  const [currentImgIndex, setCurrentImgIndex] = useState(0);

  const images = useMemo(() => {
    const list = (room.images || []).filter(Boolean);
    return list.length > 0 ? list : ["/images/dashboard/catalog/hotels/roomtype.png"];
  }, [room.images]);

  const handleNext = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImgIndex((prev) => (prev + 1) % images.length);
  };

  const handlePrev = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImgIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const currentImage = images[currentImgIndex % images.length];
  const title = [room.category, room.type, room.view].filter(Boolean).join(" - ") || room.name || "Hotel Room";
  const features = room.features || [];

  return (
    <div className={styles.roomCard}>
      {/* ── Image ── */}
      <div className={styles.roomGallery}>
        <Image
          src={currentImage}
          alt={title}
          fill
          className={styles.roomImg}
          unoptimized={currentImage.startsWith("http") || currentImage.startsWith("data:")}
        />

        {/* Discount badge */}
        {room.discountPercent ? (
          <div className={styles.discountBadge}>{room.discountPercent}% {t("roomTypes.off", "off")}</div>
        ) : null}

        {/* Navigation arrows */}
        {images.length > 1 && (
          <div className={styles.galleryArrows}>
            <button
              type="button"
              className={`${styles.galleryArrow} ${styles.prevArrow}`}
              onClick={handlePrev}
              aria-label="Previous image"
            >
              <Image src="/images/arrows/arrow-right-white.svg" alt="" width={24} height={24} />
            </button>
            <button
              type="button"
              className={styles.galleryArrow}
              onClick={handleNext}
              aria-label="Next image"
            >
              <Image src="/images/arrows/arrow-right-white.svg" alt="" width={24} height={24} />
            </button>
          </div>
        )}
      </div>

      {/* ── Info ── */}
      <div className={styles.roomInfo}>
        {/* Title + desc */}
        <div className={styles.roomHead}>
          <h3 className={styles.roomName}>{title}</h3>
          <p className={styles.roomDesc}>{room.description}</p>
        </div>

        {/* Features */}
        {features.length > 0 && (
          <div className={styles.roomDetails}>
            <h4 className={styles.detailsLabel}>{t("roomTypes.details", "Details")}</h4>
            <div className={styles.featurePills}>
              {features.map((feat) => (
                <span key={feat} className={styles.featurePill}>{feat}</span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ── Price ── */}
      <div className={styles.roomPrice}>
        <div className={styles.priceInfo}>
          <span className={styles.priceLabel}>{t("roomTypes.startFrom", "Start From")}</span>
          <div className={styles.priceValue}>
            <span className={styles.amount}>{formatCurrency(room.prices || room.pricePerNight)}</span>
            <span className={styles.per}>{t("roomTypes.perNight", "Per Night")}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

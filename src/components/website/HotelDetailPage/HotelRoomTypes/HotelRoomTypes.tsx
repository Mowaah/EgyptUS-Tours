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
  const [roomCategory, setRoomCategory] = useState("All");
  const [roomType, setRoomType] = useState("All");
  const [roomView, setRoomView] = useState("All");
  const [priceRange, setPriceRange] = useState({ min: 1, max: 12000 });

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
    if (priceRange.min !== 1 || priceRange.max !== 12000) count++;
    return count;
  }, [roomCategory, roomType, roomView, priceRange]);

  const handleReset = () => {
    setRoomCategory("All");
    setRoomType("All");
    setRoomView("All");
    setPriceRange({ min: 1, max: 12000 });
  };

  const rooms = hotel.hotelRooms ?? [];

  // Filtering logic
  const filteredRooms = rooms.filter(room => {
    const matchesCategory = roomCategory === "All" || room.category === roomCategory;
    const matchesType = roomType === "All" || room.type === roomType;
    const matchesView = roomView === "All" || room.view === roomView;
    const matchesPrice = room.pricePerNight >= priceRange.min && room.pricePerNight <= priceRange.max;
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
              min={1}
              max={12000}
              valueMin={priceRange.min}
              valueMax={priceRange.max}
              onChange={(newMin, newMax) => setPriceRange({ min: newMin, max: newMax })}
              formatValue={formatCurrency}
            />
          </FilterGroup>
        </FilterSidebar>

        {/* ── Rooms List ── */}
        <div className={styles.roomsList}>
          {filteredRooms.length > 0 ? (
            filteredRooms.map(room => (
              <RoomCard key={room.id} room={room} />
            ))
          ) : (
            <EmptyState 
              title={t("roomTypes.noRoomsFound", "No rooms found")}
              description={t("roomTypes.noRoomsDesc", "Try adjusting your filters to find available rooms.")}
              onButtonClick={handleReset}
              buttonText={t("roomTypes.resetAll", "Reset all filters")}
            />
          )}
        </div>
      </div>
    </section>
  );
}

function RoomCard({ room }: { room: HotelRoom }) {
  const { formatCurrency } = useCurrency();
  const { t } = useTranslation("hotels");

  return (
    <div className={styles.roomCard}>
      {/* ── Image ── */}
      <div className={styles.roomGallery}>
        <Image src={room.images?.[0] || "/images/dashboard/catalog/hotels/roomtype.jpg"} alt={room.name} fill className={styles.roomImg} />

        {/* Gradient overlay */}
        <div className={styles.roomGradient} />

        {/* Discount badge */}
        {room.discountPercent && (
          <div className={styles.discountBadge}>{room.discountPercent}% {t("roomTypes.off", "off")}</div>
        )}

        {/* Navigation arrows */}
        <div className={styles.galleryArrows}>
          <button className={styles.galleryArrow}>
            <Image src="/images/arrows/arrow-right-white.svg" alt="Previous" width={24} height={24} style={{ transform: "rotate(180deg)" }} />
          </button>
          <button className={styles.galleryArrow}>
            <Image src="/images/arrows/arrow-right-white.svg" alt="Next" width={24} height={24} style={{ transform: "rotate(0deg)" }} />
          </button>
        </div>
      </div>

      {/* ── Info ── */}
      <div className={styles.roomInfo}>
        {/* Title + desc */}
        <div className={styles.roomHead}>
          <h3 className={styles.roomName}>{room.name}</h3>
          <p className={styles.roomDesc}>{room.description}</p>
        </div>

        {/* Features */}
        <div className={styles.roomDetails}>
          <h4 className={styles.detailsLabel}>{t("roomTypes.details", "Details")}</h4>
          <div className={styles.featurePills}>
            {room.features.map(feat => (
              <span key={feat} className={styles.featurePill}>{feat}</span>
            ))}
          </div>
        </div>
      </div>

      {/* ── Price ── */}
      <div className={styles.roomPrice}>
        <div className={styles.priceInfo}>
          <span className={styles.priceLabel}>{t("roomTypes.startFrom", "Start From")}</span>
          <div className={styles.priceValue}>
            <span className={styles.amount}>{formatCurrency(room.pricePerNight)}</span>
            <span className={styles.per}>{t("roomTypes.perNight", "Per Night")}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

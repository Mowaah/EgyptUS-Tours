"use client";

import { useState, useMemo, useEffect, useLayoutEffect } from "react";
import Image from "next/image";
import { Hotel, HotelRoom } from "@/types";
import { FilterGroup, RadioFilterList, PriceRangeFilter, EmptyState, Button, FilterSidebar } from "@/components/shared";
import styles from "./HotelRoomTypes.module.scss";

interface HotelRoomTypesProps {
  hotel: Hotel;
}

const TYPE_OPTIONS = ["All", "Single", "Double Room", "Superior Room", "Deluxe Room"];
const VIEW_OPTIONS = ["Sea View", "Partial Sea View", "Nile View", "Pool View", "City View", "Garden View", "Lagoon View"];

export default function HotelRoomTypes({ hotel }: HotelRoomTypesProps) {
  const [roomType, setRoomType] = useState("All");
  const [roomView, setRoomView] = useState("Sea View");
  const [priceRange, setPriceRange] = useState({ min: 1, max: 12000 });

  const [expanded, setExpanded] = useState({
    type: true,
    view: true,
    price: true,
  });

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (roomType !== "All") count++;
    if (roomView !== "Sea View") count++;
    if (priceRange.min !== 1 || priceRange.max !== 12000) count++;
    return count;
  }, [roomType, roomView, priceRange]);

  const handleReset = () => {
    setRoomType("All");
    setRoomView("Sea View");
    setPriceRange({ min: 1, max: 12000 });
  };

  const rooms = hotel.hotelRooms ?? [];

  // Filtering logic
  const filteredRooms = rooms.filter(room => {
    const matchesType = roomType === "All" || room.type === roomType;
    const matchesView = roomView === "" || room.view === roomView;
    const matchesPrice = room.pricePerNight >= priceRange.min && room.pricePerNight <= priceRange.max;
    return matchesType && matchesView && matchesPrice;
  });

  const toggleExpand = (key: keyof typeof expanded) => {
    setExpanded(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <section id="room-types" className={styles.section}>
      <div className={styles.header}>
        <h2 className={styles.heading}>Room Types</h2>
        <p className={styles.subtitle}>
          Explore the different room options designed to suit every traveler’s needs, from cozy singles to spacious family suites.
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
          {/* Type of Room */}
          <FilterGroup
            title="Type Of Room"
            isExpanded={expanded.type}
            onToggle={() => toggleExpand("type")}
          >
            <RadioFilterList
              options={TYPE_OPTIONS}
              name="roomType"
              selectedValue={roomType}
              onChange={setRoomType}
            />
          </FilterGroup>

          {/* Room View */}
          <FilterGroup
            title="Room View"
            isExpanded={expanded.view}
            onToggle={() => toggleExpand("view")}
          >
            <RadioFilterList
              options={VIEW_OPTIONS}
              name="roomView"
              selectedValue={roomView}
              onChange={setRoomView}
            />
          </FilterGroup>

          {/* Price Range */}
          <FilterGroup
            title="Price Range"
            isExpanded={expanded.price}
            onToggle={() => toggleExpand("price")}
          >
            <PriceRangeFilter
              min={1}
              max={12000}
              valueMin={priceRange.min}
              valueMax={priceRange.max}
              onChange={(newMin, newMax) => setPriceRange({ min: newMin, max: newMax })}
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
              title="No rooms found"
              description="Try adjusting your filters to find available rooms."
              onButtonClick={handleReset}
              buttonText="Reset all filters"
            />
          )}
        </div>
      </div>
    </section>
  );
}

function RoomCard({ room }: { room: HotelRoom }) {
  return (
    <div className={styles.roomCard}>
      {/* ── Image ── */}
      <div className={styles.roomGallery}>
        <Image src={room.images[0]} alt={room.name} fill className={styles.roomImg} />

        {/* Gradient overlay */}
        <div className={styles.roomGradient} />

        {/* Discount badge */}
        {room.discountPercent && (
          <div className={styles.discountBadge}>{room.discountPercent}% off</div>
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
          <h4 className={styles.detailsLabel}>Details</h4>
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
          <span className={styles.priceLabel}>Start From</span>
          <div className={styles.priceValue}>
            <span className={styles.amount}>${room.pricePerNight?.toLocaleString()}</span>
            <span className={styles.per}>Per Night</span>
          </div>
        </div>
      </div>
    </div>
  );
}

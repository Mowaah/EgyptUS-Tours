"use client";

import { useState } from "react";
import Image from "next/image";
import { Hotel, HotelRoom } from "@/types";
import { FilterGroup, RadioFilterList, PriceRangeFilter } from "@/components/shared";
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

  const rooms = hotel.hotelRooms ?? [];

  // Filtering logic
  const filteredRooms = rooms.filter(room => {
    const matchesType = roomType === "All" || room.type === roomType;
    const matchesView = roomView === "" || room.view === roomView; // For simplicity, just one view for now
    return matchesType && matchesView;
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
        <aside className={styles.sidebar}>
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
        </aside>

        {/* ── Rooms List ── */}
        <div className={styles.roomsList}>
          {filteredRooms.map(room => (
            <RoomCard key={room.id} room={room} />
          ))}
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
        <span className={styles.priceLabel}>Price</span>
        <div className={styles.priceValue}>
          <span className={styles.amount}>${room.pricePerNight}</span>
          <span className={styles.per}>/per night</span>
        </div>
      </div>
    </div>
  );
}

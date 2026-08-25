"use client";

import { useState } from "react";
import Image from "next/image";
import { TablePanelFilterBar } from "@/components/dashboard/TablePanel";
import { useHotelDetailContext } from "../layout";
import styles from "./page.module.scss";

const filterOptions = {
  type: ["All", "Single", "Double Room", "Superior Room", "Deluxe Room"],
  category: ["All", "Standard", "Premium", "Suite"],
  view: ["All", "Sea View", "Partial Sea View", "Nile View", "Pool View", "City View"],
  price: ["All", "Under £1,000", "£1,000 - 2,000", "Over £2,000"],
};

export default function HotelRoomsPage() {
  const { hotel, loading } = useHotelDetailContext();

  const defaultFilters = {
    type: "All",
    category: "All",
    view: "All",
    price: "All",
  };

  const [filters, setFilters] = useState(defaultFilters);
  const [appliedFilters, setAppliedFilters] = useState(defaultFilters);

  if (loading) {
    return <div className={styles.roomsLayout}>Loading rooms...</div>;
  }

  const rawRooms: any[] = Array.isArray(hotel?.rooms) ? hotel.rooms : [];

  const rooms = rawRooms.map((room) => {
    const category = room.category_label || room.category || "";
    const type = room.type_label || room.type || "";
    const view = room.view_label || room.view || "";
    const title = [category, type, view].filter(Boolean).join(" - ") || "Hotel Room";
    const description = room.description || "Comfortable guest room with modern amenities.";
    const facilities: string[] = Array.isArray(room.features) ? room.features : Array.isArray(room.facilities) ? room.facilities : [];
    const price = room.price_per_night_egp ? String(room.price_per_night_egp) : room.price_per_night ? String(room.price_per_night) : room.pricePerNight ? String(room.pricePerNight) : "0";
    const images: string[] = Array.isArray(room.images)
      ? room.images.map((img: any) => img.image_url || img.image || img.file || img).filter(Boolean)
      : Array.isArray(room.photos)
      ? room.photos.map((img: any) => img.image_url || img.image || img.file || img).filter(Boolean)
      : [];

    return {
      id: room.id || Math.random(),
      title,
      description,
      facilities,
      price,
      images: images.length > 0 ? images : ["/images/dashboard/catalog/hotels/roomtype.jpg"],
      rawCategory: category,
      rawType: type,
      rawView: view,
    };
  });

  const filteredRooms = rooms.filter((room) => {
    if (appliedFilters.type !== "All" && !room.rawType.toLowerCase().includes(appliedFilters.type.toLowerCase())) {
      return false;
    }
    if (appliedFilters.category !== "All" && !room.rawCategory.toLowerCase().includes(appliedFilters.category.toLowerCase())) {
      return false;
    }
    if (appliedFilters.view !== "All" && !room.rawView.toLowerCase().includes(appliedFilters.view.toLowerCase())) {
      return false;
    }
    const numPrice = parseFloat(room.price);
    if (appliedFilters.price === "Under £1,000" && numPrice >= 1000) return false;
    if (appliedFilters.price === "£1,000 - 2,000" && (numPrice < 1000 || numPrice > 2000)) return false;
    if (appliedFilters.price === "Over £2,000" && numPrice <= 2000) return false;

    return true;
  });

  const resetFilters = () => {
    setFilters(defaultFilters);
    setAppliedFilters(defaultFilters);
  };

  const applyFilters = () => {
    setAppliedFilters(filters);
  };

  const filterFields = (
    [
      ["type", "Type", filterOptions.type],
      ["category", "Category", filterOptions.category],
      ["view", "View", filterOptions.view],
      ["price", "Price", filterOptions.price],
    ] as const
  ).map(([id, label, options]) => ({
    id,
    label,
    value: filters[id as keyof typeof filters],
    options,
    onChange: (value: string) => setFilters((current) => ({ ...current, [id]: value })),
  }));

  return (
    <div className={styles.roomsLayout}>
      <div className={styles.titleRow}>
        <div className={styles.iconWrap}>
          <Image src="/images/dashboard/catalog/hotels/basic.svg" alt="" width={20} height={20} />
        </div>
        <h2>Room & Pricing</h2>
      </div>

      <TablePanelFilterBar 
        fields={filterFields} 
        onClean={resetFilters} 
        onApply={applyFilters} 
      />

      {filteredRooms.length === 0 ? (
        <div style={{ padding: "40px 0", textAlign: "center", color: "#6b7280" }}>
          No rooms available matching the selected filters.
        </div>
      ) : (
        <div className={styles.roomsGrid}>
          {filteredRooms.map((room) => (
            <RoomCard key={room.id} room={room} />
          ))}
        </div>
      )}
    </div>
  );
}

function RoomCard({ room }: { room: any }) {
  const [currentImgIndex, setCurrentImgIndex] = useState(0);
  const images: string[] = room.images;

  const handleNext = () => {
    setCurrentImgIndex((prev) => (prev + 1) % images.length);
  };

  const handlePrev = () => {
    setCurrentImgIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className={styles.roomCard}>
      <div className={styles.roomImageWrap}>
        <Image
          src={images[currentImgIndex]}
          alt={room.title}
          fill
          className={styles.roomImg}
          unoptimized={images[currentImgIndex]?.startsWith("http") || images[currentImgIndex]?.startsWith("data:")}
        />
        
        {images.length > 1 && (
          <div className={styles.navArrows}>
            <button className={styles.arrowBtn} onClick={handlePrev} title="Previous image">
              <Image src="/images/arrows/arrow-right-white.svg" alt="Previous" width={24} height={24} style={{ transform: "rotate(180deg)" }} />
            </button>
            <button className={styles.arrowBtn} onClick={handleNext} title="Next image">
              <Image src="/images/arrows/arrow-right-white.svg" alt="Next" width={24} height={24} />
            </button>
          </div>
        )}
      </div>

      <div className={styles.roomInfo}>
        <div className={styles.header}>
          <h3>{room.title}</h3>
          <p>{room.description}</p>
        </div>

        {room.facilities.length > 0 && (
          <div className={styles.facilities}>
            <h4>Room Facilities</h4>
            <div className={styles.tags}>
              {room.facilities.map((fac: string, idx: number) => (
                <span key={idx} className={styles.tag}>{fac}</span>
              ))}
            </div>
          </div>
        )}

        <div className={styles.price}>
          <span className={styles.amount}>£{room.price}</span>
          <span className={styles.perNight}>/per night</span>
        </div>
      </div>
    </div>
  );
}

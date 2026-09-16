"use client";

import { useState } from "react";
import Image from "next/image";
import { DASHBOARD_CURRENCY, formatPrice } from "@/constants/currency";
import { TablePanelFilterBar } from "@/components/dashboard/TablePanel";
import { getLangKey } from "@/components/dashboard/shared/i18n";
import DashboardEmptyState from "@/components/dashboard/DashboardEmptyState/DashboardEmptyState";
import DashboardFilterEmptyState from "@/components/dashboard/DashboardEmptyState/DashboardFilterEmptyState";
import DashboardSearchEmptyState from "@/components/dashboard/DashboardEmptyState/DashboardSearchEmptyState";
import { useHotelDetailContext } from "../layout";
import styles from "./page.module.scss";

const filterOptions = {
  type: ["All", "Single", "Double Room", "Triple Room"],
  category: ["All", "Standard", "Deluxe", "Premium", "Suite"],
  view: ["All", "Sea View", "Pool View", "Garden View", "City View"],
  price: [
    "All",
    `Under ${DASHBOARD_CURRENCY.symbol}1,000`,
    `${DASHBOARD_CURRENCY.symbol}1,000 - ${DASHBOARD_CURRENCY.symbol}2,000`,
    `Over ${DASHBOARD_CURRENCY.symbol}2,000`,
  ],
};

export default function HotelRoomsPage() {
  const { hotel, loading, activeLang } = useHotelDetailContext();

  const defaultFilters = {
    type: "All",
    category: "All",
    view: "All",
    price: "All",
  };

  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState(defaultFilters);
  const [appliedFilters, setAppliedFilters] = useState(defaultFilters);

  if (loading) {
    return <div className={styles.roomsLayout}>Loading rooms...</div>;
  }

  const rawRooms: any[] = Array.isArray(hotel?.rooms) ? hotel.rooms : [];

  const langKey = getLangKey(activeLang);

  const rooms = rawRooms.map((room) => {
    const translations = room.translations?.[langKey] || {};
    const enTranslations = room.translations?.en || {};
    
    const category = room.category_label || room.category || "";
    const type = room.type_label || room.type || "";
    const view = room.view_label || room.view || "";
    const title = [category, type, view].filter(Boolean).join(" - ") || "Hotel Room";
    
    const description = translations.description || enTranslations.description || room.description || "Comfortable guest room with modern amenities.";
    const facilities: string[] = Array.isArray(room.features) ? room.features : Array.isArray(room.facilities) ? room.facilities : [];
    const price = room.price_per_night ? String(room.price_per_night) : room.pricePerNight ? String(room.pricePerNight) : room.price_per_night_egp ? String(room.price_per_night_egp) : "0";
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
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const matchSearch =
        room.title.toLowerCase().includes(q) ||
        room.description.toLowerCase().includes(q) ||
        room.rawCategory.toLowerCase().includes(q) ||
        room.rawType.toLowerCase().includes(q) ||
        room.rawView.toLowerCase().includes(q) ||
        room.facilities.some((f: string) => f.toLowerCase().includes(q));
      if (!matchSearch) return false;
    }
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
    if (appliedFilters.price.startsWith("Under") && numPrice >= 1000) return false;
    if (appliedFilters.price.includes("1,000 -") && (numPrice < 1000 || numPrice > 2000)) return false;
    if (appliedFilters.price.startsWith("Over") && numPrice <= 2000) return false;

    return true;
  });

  const resetFilters = () => {
    setFilters(defaultFilters);
    setAppliedFilters(defaultFilters);
    setSearchQuery("");
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
        <div className={styles.titleLeft}>
          <div className={styles.iconWrap}>
            <Image src="/images/dashboard/catalog/hotels/basic.svg" alt="" width={20} height={20} />
          </div>
          <h2>Room & Pricing</h2>
        </div>
        <div className={styles.searchBox}>
          <Image src="/images/dashboard/navbar/search.svg" alt="" width={20} height={20} aria-hidden />
          <input
            type="search"
            placeholder="Search rooms..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <TablePanelFilterBar 
        fields={filterFields} 
        onClean={resetFilters} 
        onApply={applyFilters} 
      />

      {filteredRooms.length === 0 ? (
        searchQuery.trim() ? (
          <DashboardSearchEmptyState onClearSearch={() => setSearchQuery("")} />
        ) : Object.values(appliedFilters).some((v) => v !== "All") ? (
          <DashboardFilterEmptyState
            onClearFilters={resetFilters}
            title="No Results Found"
            subtitle="No rooms match the selected filters."
          />
        ) : (
          <DashboardEmptyState
            title="No Rooms Found"
            subtitle="Hotel rooms will appear here once they are added."
            imageSrc="/images/dashboard/empty.png"
          />
        )
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
          <span className={styles.amount}>{formatPrice(room.price)}</span>
          <span className={styles.perNight}>/per night</span>
        </div>
      </div>
    </div>
  );
}

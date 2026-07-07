"use client";

import { useState } from "react";
import Image from "next/image";
import { TablePanelFilterBar } from "@/components/dashboard/TablePanel";
import styles from "./page.module.scss";

const MOCK_ROOMS = [
  {
    id: 1,
    name: "Deluxe Double Room - Sea View",
    subtitle: "Elegant twin room offering modern amenities and relaxing vibes.",
    facilities: [
      "Daily VIP Treatment",
      '49" Smart TV',
      "Daily Access to the Spa",
      "Evening Turndown Service",
      "Coffee and Tea Service"
    ],
    price: 180,
    image: "/images/dashboard/catalog/hotels/room-1.jpg"
  },
  {
    id: 2,
    name: "Deluxe Double Room - Sea View",
    subtitle: "Elegant twin room offering modern amenities and relaxing vibes.",
    facilities: [
      "Daily VIP Treatment",
      '49" Smart TV',
      "Daily Access to the Spa",
      "Evening Turndown Service",
      "Coffee and Tea Service"
    ],
    price: 180,
    image: "/images/dashboard/catalog/hotels/room-2.jpg"
  },
  {
    id: 3,
    name: "Deluxe Double Room - Sea View",
    subtitle: "Elegant twin room offering modern amenities and relaxing vibes.",
    facilities: [
      "Daily VIP Treatment",
      '49" Smart TV',
      "Daily Access to the Spa",
      "Evening Turndown Service",
      "Coffee and Tea Service"
    ],
    price: 180,
    image: "/images/dashboard/catalog/hotels/room-3.jpg"
  },
  {
    id: 4,
    name: "Deluxe Double Room - Sea View",
    subtitle: "Elegant twin room offering modern amenities and relaxing vibes.",
    facilities: [
      "Daily VIP Treatment",
      '49" Smart TV',
      "Daily Access to the Spa",
      "Evening Turndown Service",
      "Coffee and Tea Service"
    ],
    price: 180,
    image: "/images/dashboard/catalog/hotels/room-4.jpg"
  }
];

const filterOptions = {
  type: ["All", "Single", "Double Room", "Superior Room", "Deluxe Room"],
  category: ["All", "Standard", "Premium", "Suite"],
  view: ["All", "Sea View", "Partial Sea View", "Nile View", "Pool View", "City View"],
  price: ["All", "Under $100", "$100 - $200", "Over $200"],
};

export default function HotelRoomsPage() {
  const defaultFilters = {
    type: "All",
    category: "All",
    view: "All",
    price: "All",
  };

  const [filters, setFilters] = useState(defaultFilters);
  const [appliedFilters, setAppliedFilters] = useState(defaultFilters);

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

      {/* TablePanel Filter Bar matching the exact design used in the table panel */}
      <TablePanelFilterBar 
        fields={filterFields} 
        onClean={resetFilters} 
        onApply={applyFilters} 
      />

      <div className={styles.roomsGrid}>
        {MOCK_ROOMS.map((room) => (
          <div key={room.id} className={styles.roomCard}>
            <div className={styles.roomImageWrap}>
              {/* Fallback to a placeholder image since we don't have the specific room images */}
              <Image src="/images/dashboard/catalog/hotels/roomtype.jpg" alt={room.name} fill className={styles.roomImg} />
              
              <div className={styles.navArrows}>
                <button className={styles.arrowBtn}>
                  <Image src="/images/arrows/arrow-right-white.svg" alt="Previous" width={24} height={24} style={{ transform: "rotate(180deg)" }} />
                </button>
                <button className={styles.arrowBtn}>
                  <Image src="/images/arrows/arrow-right-white.svg" alt="Next" width={24} height={24} />
                </button>
              </div>
            </div>

            <div className={styles.roomInfo}>
              <div className={styles.header}>
                <h3>{room.name}</h3>
                <p>{room.subtitle}</p>
              </div>

              <div className={styles.facilities}>
                <h4>Room Facilities</h4>
                <div className={styles.tags}>
                  {room.facilities.map((fac, idx) => (
                    <span key={idx} className={styles.tag}>{fac}</span>
                  ))}
                </div>
              </div>

              <div className={styles.price}>
                <span className={styles.amount}>${room.price}</span>
                <span className={styles.perNight}>/per night</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

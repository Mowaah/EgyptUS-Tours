"use client";

import { useState } from "react";
import Image from "next/image";
import styles from "./SearchBar.module.scss";
import { GlassCard } from "@/components/shared";

const FILTERS = [
  { label: "Date", icon: "calendar" },
  { label: "Destination", icon: "location" },
  { label: "Budget", icon: "budget" },
  { label: "Trip Type", icon: "tripType" },
];

export default function SearchBar() {
  const [activeTab, setActiveTab] = useState("trips");

  return (
    <div className={styles.wrapper}>
      <div className={styles.tabs}>
        {activeTab === "trips" ? (
          <button
            className={`${styles.tab} ${styles.active}`}
            onClick={() => setActiveTab("trips")}
          >
            <Image src="/images/search/trips.svg" alt="" width={18} height={18} />
            <span>trips</span>
          </button>
        ) : (
          <GlassCard
            as="button"
            className={styles.tab}
            onClick={() => setActiveTab("trips")}
          >
            <Image src="/images/search/trips.svg" alt="" width={18} height={18} />
            <span>trips</span>
          </GlassCard>
        )}

        {activeTab === "hotels" ? (
          <button
            className={`${styles.tab} ${styles.active}`}
            onClick={() => setActiveTab("hotels")}
          >
            <Image src="/images/search/hotels.svg" alt="" width={18} height={18} />
            <span>Hotels</span>
          </button>
        ) : (
          <GlassCard
            as="button"
            className={styles.tab}
            onClick={() => setActiveTab("hotels")}
          >
            <Image src="/images/search/hotels.svg" alt="" width={18} height={18} />
            <span>Hotels</span>
          </GlassCard>
        )}
      </div>

      <GlassCard className={styles.searchBar}>
        {FILTERS.map((filter, i) => (
          <div key={filter.label} className={styles.filterWrapper}>
            <button className={styles.filter}>
              <span className={styles.icon}>
                <Image
                  src={`/images/search/${filter.icon === "tripType" ? "trip-type" : filter.icon}.svg`}
                  alt=""
                  width={18}
                  height={18}
                />
              </span>
              <span className={styles.label}>{filter.label}</span>
              <Image
                src="/images/arrows/arrow-down2-white.svg"
                alt=""
                width={12}
                height={12}
                className={styles.chevron}
              />
            </button>
            {i < FILTERS.length - 1 && <div className={styles.separator} />}
          </div>
        ))}

        <button className={styles.searchBtn}>
          <Image src="/images/search/search.svg" alt="" width={18} height={18} />
          Search
        </button>
      </GlassCard>
    </div>
  );
}

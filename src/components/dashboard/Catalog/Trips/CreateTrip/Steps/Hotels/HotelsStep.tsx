import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { IncludedHotelCard } from "@/components/shared";
import TablePanel from "@/components/dashboard/TablePanel/TablePanel";
import { FilterSelect } from "@/components/dashboard/TablePanel/FilterSelect";
import styles from "./HotelsStep.module.scss";

const HOTELS_DATA = [
  {
    name: "Steigenberger Nile Palace Luxor",
    location: "Luxor, Egypt",
    description: "Elegant 5-star hotel on the Nile with stunning temple views, outdoor pool, and rooftop terrace.",
    image: "/images/hotels/hotel1.jpg", 
    rating: 4.8,
    reviewCount: 2847,
    amenities: ["Free WIFI", "Pool", "Restaurant", "Spa"],
  },
  {
    name: "Steigenberger Nile Palace Luxor",
    location: "Luxor, Egypt",
    description: "Elegant 5-star hotel on the Nile with stunning temple views, outdoor pool, and rooftop terrace.",
    image: "/images/hotels/hotel3.jpg",
    rating: 4.8,
    reviewCount: 2847,
    amenities: ["Free WIFI", "Pool", "Restaurant", "Spa"],
  },
  {
    name: "Steigenberger Nile Palace Luxor",
    location: "Luxor, Egypt",
    description: "Elegant 5-star hotel on the Nile with stunning temple views, outdoor pool, and rooftop terrace.",
    image: "/images/hotels/hotel5.jpg",
    rating: 4.8,
    reviewCount: 2847,
    amenities: ["Free WIFI", "Pool", "Restaurant", "Spa"],
  },
  {
    name: "Steigenberger Nile Palace Luxor",
    location: "Luxor, Egypt",
    description: "Elegant 5-star hotel on the Nile with stunning temple views, outdoor pool, and rooftop terrace.",
    image: "/images/hotels/hotel2.jpg",
    rating: 4.8,
    reviewCount: 2847,
    amenities: ["Free WIFI", "Pool", "Restaurant", "Spa"],
  }
];

export function HotelsStep() {
  const [searchQuery, setSearchQuery] = useState("");
  const [location, setLocation] = useState("All");

  const searchBar = (
    <label className={styles.searchBox}>
      <Image
        src="/images/dashboard/navbar/search.svg"
        alt=""
        width={24}
        height={24}
        className={styles.searchIcon}
        aria-hidden
      />
      <span className={styles.srOnly}>Search Hotels, Destination</span>
      <input 
        type="search" 
        placeholder="Search Hotels, Destination" 
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
    </label>
  );

  const filterToolbar = (
    <div className={styles.filtersRow}>
      <div className={styles.filterGroup}>
        <FilterSelect
          id="hotels-location"
          label="Location"
          value={location}
          options={["All", "Luxor, Egypt", "Aswan, Egypt", "Cairo, Egypt"]}
          onChange={setLocation}
        />
      </div>
      
      <div className={styles.actionsGroup}>
        <button type="button" className={styles.cleanBtn}>Clean</button>
        <button type="button" className={styles.applyBtn}>Apply</button>
      </div>
    </div>
  );

  const [selectedHotels, setSelectedHotels] = useState<number[]>([]);

  const toggleHotel = (index: number) => {
    if (selectedHotels.includes(index)) {
      setSelectedHotels(selectedHotels.filter((i) => i !== index));
    } else {
      setSelectedHotels([...selectedHotels, index]);
    }
  };

  return (
    <TablePanel
      ariaLabel="Hotels Selection"
      title="Hotels"
      iconSrc="/images/dashboard/catalog/trips/hotels.svg"
      headerActions={searchBar}
      toolbar={filterToolbar}
      className={styles.hotelsPanel}
    >
      <div className={styles.grid}>
        {HOTELS_DATA.map((hotel, i) => (
          <IncludedHotelCard 
            key={i} 
            hotel={hotel as any} 
            selected={selectedHotels.includes(i)}
            onClick={() => toggleHotel(i)}
          />
        ))}
      </div>
    </TablePanel>
  );
}

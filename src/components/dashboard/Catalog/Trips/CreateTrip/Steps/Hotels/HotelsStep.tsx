import React, { useState, useRef, useEffect } from "react";
import { useFormContext, Controller } from "react-hook-form";
import { CreateTripValues } from "../../CreateTripSchema";
import Image from "next/image";
import { IncludedHotelCard } from "@/components/shared";
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

  const { control } = useFormContext<CreateTripValues>();

  return (
    <div className={styles.hotelsPanel}>
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <div className={styles.headerIcon}>
            <Image src="/images/dashboard/catalog/trips/hotels.svg" alt="Hotels" width={20} height={20} />
          </div>
          <h2 className={styles.title}>Hotels</h2>
        </div>
        {searchBar}
      </div>

      <div className={styles.content}>
        <div className={styles.filtersSection}>
          {filterToolbar}
        </div>

        <Controller
          name="hotels"
          control={control}
          defaultValue={[]}
          render={({ field }) => {
            const selectedHotels = field.value || [];
            
            const toggleHotel = (index: number) => {
              const idStr = index.toString();
              if (selectedHotels.includes(idStr)) {
                field.onChange(selectedHotels.filter((i) => i !== idStr));
              } else {
                field.onChange([...selectedHotels, idStr]);
              }
            };

            return (
              <div className={styles.tableSection}>
                <div className={styles.grid}>
                  {HOTELS_DATA.map((hotel, index) => (
                    <IncludedHotelCard 
                      key={index}
                      hotel={hotel as any} 
                      selected={selectedHotels.includes(index.toString())}
                      onClick={() => toggleHotel(index)}
                    />
                  ))}
                </div>
              </div>
            );
          }}
        />
      </div>
    </div>
  );
}

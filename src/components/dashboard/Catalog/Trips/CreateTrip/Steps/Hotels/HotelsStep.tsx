import React, { useState, useEffect } from "react";
import { useFormContext, Controller } from "react-hook-form";
import { CreateTripValues } from "../../CreateTripSchema";
import Image from "next/image";
import { IncludedHotelCard } from "@/components/shared";
import { FilterSelect } from "@/components/dashboard/TablePanel/FilterSelect";
import { getCatalogHotels } from "@/services/admin/adminCatalogTripsService";
import styles from "./HotelsStep.module.scss";

type HotelOption = {
  id: string;
  name: string;
  location: string;
  description: string;
  image: string;
  rating: number;
  reviewCount: number;
  amenities: string[];
};

type HotelRecord = {
  id?: string | number;
  name?: string;
  title?: string;
  description?: string;
  hero_image_url?: string;
  hero_image?: string;
  image?: string;
  location?: { name?: string };
  location_name?: string;
  city?: string;
  rating?: string | number;
  average_rating?: string | number;
  review_count?: string | number;
  reviews_count?: string | number;
  amenities?: string[];
  facilities?: string[];
  translations?: {
    en?: {
      name?: string;
      title?: string;
      description?: string;
    };
  };
  translation?: {
    name?: string;
    title?: string;
    description?: string;
  };
};

function unpackList(payload: unknown): HotelRecord[] {
  const value = payload as { results?: unknown; data?: unknown };
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(value.results)) return value.results as HotelRecord[];
  if (Array.isArray(value.data)) return value.data as HotelRecord[];
  const nested = value.data as { results?: unknown } | undefined;
  if (Array.isArray(nested?.results)) return nested.results as HotelRecord[];
  return [];
}

function mapHotelOption(hotel: HotelRecord): HotelOption {
  const translation = hotel.translations?.en || hotel.translation || {};

  return {
    id: String(hotel.id),
    name: hotel.name || translation.name || translation.title || "Untitled hotel",
    location: hotel.location?.name || hotel.location_name || hotel.city || "Egypt",
    description: hotel.description || translation.description || "",
    image: hotel.hero_image_url || hotel.hero_image || hotel.image || "/images/hotels/hotel1.jpg",
    rating: Number(hotel.rating || hotel.average_rating || 0),
    reviewCount: Number(hotel.review_count || hotel.reviews_count || 0),
    amenities: hotel.amenities || hotel.facilities || [],
  };
}

export function HotelsStep() {
  const [searchQuery, setSearchQuery] = useState("");
  const [location, setLocation] = useState("All");
  const [hotels, setHotels] = useState<HotelOption[]>([]);

  useEffect(() => {
    let ignore = false;

    getCatalogHotels({ page_size: 100 })
      .then((payload) => {
        if (!ignore) setHotels(unpackList(payload).map(mapHotelOption));
      })
      .catch(() => {
        if (!ignore) setHotels([]);
      });

    return () => {
      ignore = true;
    };
  }, []);

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

  const containerRef = React.useRef<HTMLDivElement>(null);
  const { control, formState: { errors } } = useFormContext<CreateTripValues>();
  const rawHotelError = errors.hotels as { root?: { message?: string }; message?: string } | undefined;
  const hotelErrorMessage = rawHotelError?.root?.message || rawHotelError?.message;

  React.useEffect(() => {
    if (hotelErrorMessage && containerRef.current) {
      containerRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [hotelErrorMessage]);

  return (
    <div className={styles.hotelsPanel} ref={containerRef}>
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
          render={({ field }) => {
            const selectedHotels: string[] = (field.value || []).map((id: unknown) => String(id));
            
            const filteredHotels = hotels.filter((hotel) => {
              const matchesSearch = !searchQuery.trim() || `${hotel.name} ${hotel.location}`.toLowerCase().includes(searchQuery.toLowerCase());
              const matchesLocation = location === "All" || hotel.location === location;
              return matchesSearch && matchesLocation;
            });

            const toggleHotel = (id: string) => {
              const idStr = String(id);
              if (selectedHotels.includes(idStr)) {
                field.onChange(selectedHotels.filter((i) => i !== idStr));
              } else {
                field.onChange([...selectedHotels, idStr]);
              }
            };

            return (
              <div className={styles.tableSection}>
                <div className={styles.grid}>
                  {filteredHotels.map((hotel) => (
                    <IncludedHotelCard 
                      key={hotel.id}
                      hotel={hotel} 
                      selected={selectedHotels.includes(hotel.id)}
                      onClick={() => toggleHotel(hotel.id)}
                    />
                  ))}
                </div>
                {hotelErrorMessage && (
                  <div className={styles.errorText} role="alert">
                    <Image src="/images/information-fill.svg" alt="" width={16} height={16} aria-hidden="true" />
                    <span>{hotelErrorMessage}</span>
                  </div>
                )}
              </div>
            );
          }}
        />
      </div>
    </div>
  );
}

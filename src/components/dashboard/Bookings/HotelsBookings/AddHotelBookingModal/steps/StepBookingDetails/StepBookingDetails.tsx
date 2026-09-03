import React, { useMemo, useEffect } from "react";
import Image from "next/image";
import useSWR from "swr";
import { SelectDropdown } from "@/components/shared";
import type { SelectOption } from "@/components/shared";
import RoomSelector, { RoomGroup } from "@/components/dashboard/shared/RoomSelector/RoomSelector";
import { getCatalogHotels, getCatalogHotelDetail, getCatalogHotelLocations } from "@/services/admin/adminCatalogHotelsService";
import { AddHotelBookingData } from "../../AddHotelBookingModal";
import styles from "./StepBookingDetails.module.scss";

interface StepBookingDetailsProps {
  formData: AddHotelBookingData;
  onChange: (patch: Partial<AddHotelBookingData>) => void;
  errors?: Record<string, string>;
}

export default function StepBookingDetails({ formData, onChange, errors = {} }: StepBookingDetailsProps) {
  // 1. Fetch available catalog hotels and locations
  const { data: hotelsResponse, isLoading: isHotelsLoading } = useSWR(
    "/catalog/hotels/booking-modal",
    () => getCatalogHotels({ publish_status: "published" })
  );

  const { data: locationsResponse } = useSWR(
    "/catalog/hotel-locations/booking-modal",
    () => getCatalogHotelLocations()
  );

  const hotelsList: any[] = useMemo(() => {
    const raw = hotelsResponse?.data?.results || hotelsResponse?.results || hotelsResponse || [];
    return Array.isArray(raw) ? raw : [];
  }, [hotelsResponse]);

  const locationsList: any[] = useMemo(() => {
    const raw = locationsResponse?.data?.results || locationsResponse?.results || locationsResponse || [];
    return Array.isArray(raw) ? raw : [];
  }, [locationsResponse]);

  // 2. Filter hotels by location if location selected
  const filteredHotels = useMemo(() => {
    if (!formData.hotelLocation) return hotelsList;
    return hotelsList.filter((h: any) => {
      const locId = h.location?.id?.toString() || h.location_id?.toString() || h.location_text || "";
      const locName = h.location?.name || h.location_text || "";
      return String(locId) === String(formData.hotelLocation) || locName === formData.hotelLocation;
    });
  }, [hotelsList, formData.hotelLocation]);

  // Options for Dropdowns
  const locationOptions: SelectOption[] = useMemo(() => {
    const opts: SelectOption[] = [{ label: "All Locations", value: "" }];
    locationsList.forEach((loc: any) => {
      opts.push({
        label: loc.name || loc.title || `Location ${loc.id}`,
        value: loc.id ? loc.id.toString() : loc.name,
      });
    });
    return opts;
  }, [locationsList]);

  const hotelOptions: SelectOption[] = useMemo(() => {
    return filteredHotels.map((h: any) => ({
      label: h.name || h.title || `Hotel #${h.id}`,
      value: h.id.toString(),
    }));
  }, [filteredHotels]);

  // Auto-select first hotel if none selected and list loaded
  useEffect(() => {
    if (!formData.specificHotel && hotelOptions.length > 0) {
      onChange({ specificHotel: hotelOptions[0].value });
    }
  }, [hotelOptions, formData.specificHotel, onChange]);

  // 3. Fetch details of selected hotel
  const selectedHotelId = formData.specificHotel;
  const { data: hotelDetailResponse, isLoading: isDetailLoading } = useSWR(
    selectedHotelId ? `/catalog/hotels/${selectedHotelId}/detail` : null,
    () => getCatalogHotelDetail(selectedHotelId)
  );

  const hotelDetail = hotelDetailResponse?.data || hotelDetailResponse;
  
  // Notice: catalog detail payload returns rooms in .rooms, public endpoint returns .hotel_rooms
  const rawRooms: any[] = useMemo(() => {
    const list = hotelDetail?.rooms || hotelDetail?.hotel_rooms || hotelDetail?.hotelRooms || [];
    return Array.isArray(list) ? list : [];
  }, [hotelDetail]);

  // 4. Map rooms into RoomGroup[] for RoomSelector
  const roomGroups: RoomGroup[] = useMemo(() => {
    if (!rawRooms || rawRooms.length === 0) return [];

    // Group rooms by category and type
    const groups: Record<string, any[]> = {};
    for (const room of rawRooms) {
      const cat = (room.category_label || room.category || "").trim().replace(/\s*[Rr]oom\s*/i, "");
      const typ = (room.type_label || room.type || "").trim();
      const groupKey = cat ? `${cat} ${typ}`.trim() : (typ || room.name || `Room ${room.id}`).trim();
      
      if (!groups[groupKey]) groups[groupKey] = [];
      groups[groupKey].push(room);
    }

    return Object.entries(groups).map(([typeKey, rooms]) => {
      let baseRoom = rooms[0];
      if (rooms.length > 1) {
        baseRoom = rooms.reduce((prev: any, curr: any) => {
          const prevPrice = parseFloat(prev.price_per_night_egp || prev.price_per_night || prev.pricePerNight || "0");
          const currPrice = parseFloat(curr.price_per_night_egp || curr.price_per_night || curr.pricePerNight || "0");
          return prevPrice < currPrice ? prev : curr;
        });
      }

      const basePrice = parseFloat(baseRoom.price_per_night_egp || baseRoom.price_per_night || baseRoom.pricePerNight || "0");

      const options = rooms.map((r: any) => {
        const isBase = r.id === baseRoom.id;
        const rPrice = parseFloat(r.price_per_night_egp || r.price_per_night || r.pricePerNight || "0");
        const diff = rPrice - basePrice;
        const viewName = r.view_label || r.view || "Standard View";
        return {
          label: viewName,
          value: r.id.toString(),
          price: isBase ? "Included" : (diff > 0 ? `+£${diff.toLocaleString()}` : `-£${Math.abs(diff).toLocaleString()}`),
          isFree: isBase,
        };
      });

      const typeLabel = typeKey || "Room";
      const formattedType = typeLabel.toLowerCase().endsWith("room")
        ? typeLabel
        : `${typeLabel} Room`;
        
      const finalTitle = formattedType.split(' ')
        .map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
        .join(' ');

      const viewLabel = baseRoom.view_label || baseRoom.view || "Standard View";

      let capacity = 2;
      const lowerType = typeKey.toLowerCase();
      if (lowerType.includes("single")) capacity = 1;
      else if (lowerType.includes("double") || lowerType.includes("twin")) capacity = 2;
      else if (lowerType.includes("triple")) capacity = 3;
      else if (lowerType.includes("quad")) capacity = 4;

      return {
        key: typeKey.toLowerCase(),
        title: finalTitle,
        subtitle: `${capacity} person${capacity > 1 ? "s" : ""}`,
        displayPrice: `£${Math.round(basePrice).toLocaleString()}`,
        priceUnit: "/ night",
        options,
        defaultOptionValue: baseRoom.id.toString(),
      };
    });
  }, [rawRooms]);

  // Handlers
  const handleCountChange = (type: string, newCount: number, defaultOptionValue: string) => {
    const currentList = formData.roomCustomizations?.[type] || [];
    let newList = [...currentList];
    if (newCount > currentList.length) {
      for (let i = currentList.length; i < newCount; i++) {
        newList.push(defaultOptionValue);
      }
    } else {
      newList = newList.slice(0, newCount);
    }
    onChange({ 
      rooms: { ...(formData.rooms || {}), [type]: newCount },
      roomCustomizations: { ...(formData.roomCustomizations || {}), [type]: newList }
    });
  };

  const handleCustomizationChange = (type: string, index: number, roomId: string) => {
    const currentList = formData.roomCustomizations?.[type] || [];
    const newList = [...currentList];
    newList[index] = roomId;
    onChange({ roomCustomizations: { ...(formData.roomCustomizations || {}), [type]: newList } });
  };

  const flatCounts: Record<string, number> = {};
  const flatCustomizations: Record<string, string> = {};
  for (const [type, list] of Object.entries(formData.roomCustomizations || {})) {
    flatCounts[type] = list.length;
    list.forEach((val, i) => { flatCustomizations[`${type}-${i}`] = val; });
  }

  return (
    <div className={styles.container}>
      {/* Hotel & Location Selection Row */}
      <div className={styles.row}>
        {locationsList.length > 0 && (
          <div className={styles.col}>
            <label className={styles.sectionTitle}>Hotel Location (Optional Filter)</label>
            <SelectDropdown
              id="hotel-location-select"
              options={locationOptions}
              value={formData.hotelLocation || ""}
              onChange={(val) => {
                onChange({ hotelLocation: val, specificHotel: "" });
              }}
              triggerClassName={styles.fieldTrigger}
            />
          </div>
        )}

        <div className={styles.col}>
          <label className={styles.sectionTitle}>Select Hotel <span style={{ color: "#E02D3C" }}>*</span></label>
          <SelectDropdown
            id="specific-hotel-select"
            options={hotelOptions.length > 0 ? hotelOptions : [{ label: isHotelsLoading ? "Loading hotels..." : "No hotels available", value: "", disabled: true }]}
            value={formData.specificHotel || ""}
            onChange={(val) => {
              onChange({ 
                specificHotel: val, 
                rooms: {}, 
                roomCustomizations: {} 
              });
            }}
            triggerClassName={styles.fieldTrigger}
            error={!!errors.specificHotel}
          />
          {errors.specificHotel && (
            <div style={{ color: "#C11515", fontSize: "0.75rem", display: "flex", alignItems: "center", gap: "4px", marginTop: "4px" }}>
              <Image src="/images/information-fill.svg" alt="" width={14} height={14} />
              <span>{errors.specificHotel}</span>
            </div>
          )}
        </div>
      </div>

      {/* Room Configuration */}
      {isDetailLoading ? (
        <div style={{ padding: "2rem", textAlign: "center", color: "#666" }}>
          Loading hotel rooms...
        </div>
      ) : roomGroups.length > 0 ? (
        <RoomSelector
          rooms={roomGroups}
          counts={flatCounts}
          customizations={flatCustomizations}
          onCountChange={handleCountChange}
          onCustomizationChange={handleCustomizationChange}
          error={errors.rooms}
        />
      ) : selectedHotelId ? (
        <div style={{ padding: "2rem", textAlign: "center", color: "#666" }}>
          No rooms configured for this hotel yet.
        </div>
      ) : (
        <div style={{ padding: "2rem", textAlign: "center", color: "#666" }}>
          Please select a hotel above to configure room options.
        </div>
      )}
    </div>
  );
}

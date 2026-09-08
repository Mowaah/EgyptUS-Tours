import React, { useMemo, useEffect } from "react";
import Image from "next/image";
import useSWR from "swr";
import { SelectDropdown } from "@/components/shared";
import type { SelectOption } from "@/components/shared";
import RoomSelector, { RoomGroup } from "@/components/dashboard/shared/RoomSelector/RoomSelector";
import { getCatalogHotels, getCatalogHotelDetail, getCatalogHotelLocations } from "@/services/admin/adminCatalogHotelsService";
import { DASHBOARD_CURRENCY, formatPrice } from "@/constants/currency";
import { normalizeRoomType } from "@/utils/bookingPricing";
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

  const getRoomPriceVal = (r: any) => {
    const usd = parseFloat(r.price_per_night || r.pricePerNight || "0");
    if (usd > 0) return usd;
    const egp = parseFloat(r.price_per_night_egp || "0");
    if (egp > 0) return egp / 50;
    return 0;
  };

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
          const prevPrice = getRoomPriceVal(prev);
          const currPrice = getRoomPriceVal(curr);
          return prevPrice < currPrice ? prev : curr;
        });
      }

      const basePrice = getRoomPriceVal(baseRoom);

      const options = rooms.map((r: any) => {
        const isBase = r.id === baseRoom.id;
        const rPrice = getRoomPriceVal(r);
        const diff = rPrice - basePrice;
        const viewName = r.view_label || r.view || "Standard View";
        return {
          label: viewName,
          value: r.id.toString(),
          price: isBase ? "Included" : (diff > 0 ? `+${formatPrice(diff)}` : `-${formatPrice(Math.abs(diff))}`),
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
        displayPrice: formatPrice(basePrice),
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

  const childRoomOptions: SelectOption[] = useMemo(() => {
    const opts: SelectOption[] = [];
    const customizations = formData.roomCustomizations || {};

    const seen = new Set<string>();
    for (const [typeKey, roomIds] of Object.entries(customizations)) {
      for (const idStr of roomIds) {
        const room = rawRooms.find((r: any) => String(r.id) === String(idStr));
        const viewName = room?.view_label || room?.view || "Standard View";
        const cat = (room?.category_label || room?.category || "").trim();
        const typ = (room?.type_label || room?.type || typeKey).trim();
        const baseName = cat ? `${cat} ${typ}`.trim() : typ;
        const formattedTitle = baseName.toLowerCase().endsWith("room") ? baseName : `${baseName} Room`;
        const finalTitle = formattedTitle
          .split(" ")
          .map((w: string) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
          .join(" ");

        const normalizedType = normalizeRoomType(room?.type_label || room?.name || typeKey);
        const value = `${normalizedType}:${viewName}`;
        const label = `${finalTitle} - ${viewName}`;

        if (!seen.has(value)) {
          seen.add(value);
          opts.push({ label, value });
        }
      }
    }

    if (opts.length === 0) {
      opts.push({ label: "Double Room - Standard View", value: "double:Standard View" });
    }
    return opts;
  }, [formData.roomCustomizations, rawRooms]);

  useEffect(() => {
    if (!formData.children || formData.children <= 0) return;
    if (childRoomOptions.length === 0) return;

    const validValues = childRoomOptions.map((o) => o.value);
    const currentPricing = formData.childRoomPricing || [];
    let changed = false;
    const nextPricing = Array.from({ length: formData.children }).map((_, i) => {
      const current = currentPricing[i];
      if (current && validValues.includes(current)) {
        return current;
      }
      const matchByType = current && childRoomOptions.find((o) => normalizeRoomType(o.value) === normalizeRoomType(current));
      if (matchByType) {
        changed = true;
        return matchByType.value;
      }
      changed = true;
      return validValues[0];
    });

    if (changed || nextPricing.length !== currentPricing.length) {
      onChange({ childRoomPricing: nextPricing });
    }
  }, [childRoomOptions, formData.children, onChange]);

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
        <>
          <RoomSelector
            rooms={roomGroups}
            counts={flatCounts}
            customizations={flatCustomizations}
            onCountChange={handleCountChange}
            onCustomizationChange={handleCustomizationChange}
            error={errors.rooms}
          />

          {formData.children > 0 && (
            <div className={styles.childPricingSection}>
              <hr className={styles.divider} aria-hidden="true" />
              <h3 className={styles.sectionTitle}>
                Child Room Pricing <span className={styles.requiredStar}>*</span>
              </h3>
              <div className={styles.childPricingGrid}>
                {Array.from({ length: formData.children }).map((_, i) => {
                  const childAge = formData.childrenAges?.[i] != null && formData.childrenAges[i] > 0
                    ? formData.childrenAges[i]
                    : null;
                  const assignedRoom = formData.childRoomPricing?.[i] || childRoomOptions[0]?.value || "double:Standard View";
                  const labelText = childAge ? `Child ${i + 1} - (${childAge} years)` : `Child ${i + 1}`;
                  return (
                    <div key={`child-room-${i}`} className={styles.childPricingItem}>
                      <label className={styles.childPricingLabel}>{labelText}</label>
                      <SelectDropdown
                        id={`child-room-select-${i}`}
                        options={childRoomOptions}
                        value={assignedRoom}
                        onChange={(val) => {
                          const current = [...(formData.childRoomPricing || [])];
                          current[i] = val;
                          onChange({ childRoomPricing: current });
                        }}
                      />
                    </div>
                  );
                })}
              </div>
              {errors.childPricing && (
                <div className={styles.errorText}>
                  <Image src="/images/information-fill.svg" alt="" width={16} height={16} aria-hidden="true" />
                  <span>{errors.childPricing}</span>
                </div>
              )}
            </div>
          )}
        </>
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

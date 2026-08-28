import React, { useMemo, useEffect } from "react";
import Image from "next/image";
import useSWR from "swr";
import { SelectDropdown, CheckboxIndicator } from "@/components/shared";
import RoomSelector, { RoomGroup } from "@/components/dashboard/shared/RoomSelector/RoomSelector";
import { AddTripBookingData } from "../../AddTripBookingModal";
import { getAllTrips, getFullTripById } from "@/services/tripsService";
import { getFullHotelBySlug } from "@/services/hotelsService";
import styles from "./StepBookingDetails.module.scss";

interface StepBookingDetailsProps {
  formData: AddTripBookingData;
  onChange: (patch: Partial<AddTripBookingData>) => void;
  errors?: Record<string, string>;
  hasFixedAvailability?: boolean;
}

export default function StepBookingDetails({ formData, onChange, errors = {}, hasFixedAvailability }: StepBookingDetailsProps) {
  const { data: allTrips } = useSWR("/trips/all", () => getAllTrips());

  const selectedTripBasic = allTrips?.find(t => t.id.toString() === formData.tripId);

  const { data: tripDetail } = useSWR(
    selectedTripBasic?.slug ? `/trips/${selectedTripBasic.slug}/` : null,
    () => getFullTripById(selectedTripBasic!.slug)
  );

  const isFixedDates = hasFixedAvailability ?? Boolean(tripDetail?.availability && tripDetail.availability.length > 0);

  // Extract rooms directly from trip season pricing instead of hotel
  const roomGroups: RoomGroup[] = useMemo(() => {
    const baseSeason = tripDetail?.seasonPricing?.[0] || { single: 0, double: 0, triple: 0 };
    const addOns = tripDetail?.additionalRooms || {};
    
    const options = [
      { label: "Garden View", value: "garden", price: "Included", isFree: true },
    ];
    if (addOns.poolView) {
      options.push({ label: "Pool View", value: "pool", price: `+$${addOns.poolView}`, isFree: false });
    }
    if (addOns.seaView) {
      options.push({ label: "Sea View", value: "sea", price: `+$${addOns.seaView}`, isFree: false });
    }

    const groups: RoomGroup[] = [];
    if (baseSeason.single > 0) {
      groups.push({
        key: "single",
        title: "Single Room",
        subtitle: "1 person",
        displayPrice: `$${baseSeason.single}`,
        priceUnit: "/ night",
        defaultOptionValue: "garden",
        options,
      });
    }
    if (baseSeason.double > 0) {
      groups.push({
        key: "double",
        title: "Double Room",
        subtitle: "2 persons",
        displayPrice: `$${baseSeason.double}`,
        priceUnit: "/ night",
        defaultOptionValue: "garden",
        options,
      });
    }
    if (baseSeason.triple > 0) {
      groups.push({
        key: "triple",
        title: "Triple Room",
        subtitle: "3 persons",
        displayPrice: `$${baseSeason.triple}`,
        priceUnit: "/ night",
        defaultOptionValue: "garden",
        options,
      });
    }
    return groups;
  }, [tripDetail]);

  const DEPARTURE_MONTHS = useMemo(() => {
    if (!tripDetail?.availability) return [];
    const months = new Set<string>();
    tripDetail.availability.forEach(slot => {
      const parts = slot.dates.split(" - ");
      if (parts.length > 0) {
        const d = new Date(parts[0]);
        if (!isNaN(d.getTime())) {
          months.add(d.toLocaleDateString("en-US", { month: "long", year: "numeric" }));
        }
      }
    });
    return Array.from(months).map(m => ({ label: m, value: m }));
  }, [tripDetail]);

  useEffect(() => {
    if (isFixedDates && !formData.departureMonth && DEPARTURE_MONTHS.length > 0) {
      onChange({ departureMonth: DEPARTURE_MONTHS[0].value });
    }
  }, [formData.departureMonth, DEPARTURE_MONTHS, onChange, isFixedDates]);

  const availableSlots = useMemo(() => {
    if (!tripDetail?.availability || !formData.departureMonth) return [];
    return tripDetail.availability.filter(slot => {
      const parts = slot.dates.split(" - ");
      if (parts.length > 0) {
        const d = new Date(parts[0]);
        if (!isNaN(d.getTime())) {
          const m = d.toLocaleDateString("en-US", { month: "long", year: "numeric" });
          return m === formData.departureMonth;
        }
      }
      return false;
    });
  }, [tripDetail, formData.departureMonth]);

  const handleCountChange = (type: string, newCount: number, defaultOptionValue: string) => {
    const currentList = formData.roomCustomizations[type] || [];
    let newList = [...currentList];
    if (newCount > currentList.length) {
      for (let i = currentList.length; i < newCount; i++) {
        newList.push(defaultOptionValue);
      }
    } else {
      newList = newList.slice(0, newCount);
    }
    onChange({ 
      rooms: { ...formData.rooms, [type]: newCount },
      roomCustomizations: { ...formData.roomCustomizations, [type]: newList }
    });
  };

  const handleCustomizationChange = (type: string, index: number, roomId: string) => {
    const currentList = formData.roomCustomizations[type] || [];
    const newList = [...currentList];
    newList[index] = roomId;
    onChange({ roomCustomizations: { ...formData.roomCustomizations, [type]: newList } });
  };

  const flatCounts: Record<string, number> = {};
  const flatCustomizations: Record<string, string> = {};
  for (const [type, list] of Object.entries(formData.roomCustomizations || {})) {
    flatCounts[type] = list.length;
    list.forEach((val, i) => { flatCustomizations[`${type}-${i}`] = val; });
  }

  return (
    <div className={styles.container}>
      {tripDetail && roomGroups.length === 0 && (
        <p className={styles.emptyText}>No room pricing found for this trip.</p>
      )}

      {tripDetail && roomGroups.length > 0 && (
        <RoomSelector
          rooms={roomGroups}
          counts={flatCounts}
          customizations={flatCustomizations}
          onCountChange={handleCountChange}
          onCustomizationChange={(type, i, val) => handleCustomizationChange(type, i, val)}
          error={errors.rooms}
          loading={!tripDetail}
          loadingMessage="Loading trip rooms..."
          emptyMessage="No rooms found for this trip."
        />
      )}

      {isFixedDates && (
        <div className={styles.groupSection}>
          <div className={styles.fieldGroup}>
            <h3 className={styles.sectionTitle}>Select Month</h3>
            <div className={styles.monthSelectDropdownWrapper}>
              <SelectDropdown
                id="pti-group-departure-month"
                options={DEPARTURE_MONTHS.length > 0 ? DEPARTURE_MONTHS : ([{ label: "No slots available", value: "", disabled: true }] as any)}
                value={formData.departureMonth || (DEPARTURE_MONTHS[0]?.value || "")}
                onChange={(val) => onChange({ departureMonth: val, departureDateId: "", rooms: { single: 0, double: 0, triple: 0 }, roomCustomizations: {} })}
                triggerClassName={styles.fieldTrigger}
                renderValue={(val) => (
                  <span className={styles.monthValueWrapper}>
                    <Image src="/images/calendar3.svg" alt="" width={20} height={20} />
                    <span className={styles.monthValueText}>{val || "Select Month"}</span>
                  </span>
                )}
              />
            </div>
          </div>

          <div className={styles.fieldGroup}>
            <h3 className={styles.sectionTitle}>Choose Departure Date</h3>
            <div className={styles.departureGrid}>
              {(() => {
                const formatDateRange = (datesStr: string) => {
                  const parts = datesStr.split(" - ");
                  if (parts.length !== 2) return datesStr;
                  const d1 = new Date(parts[0]);
                  const d2 = new Date(parts[1]);
                  if (isNaN(d1.getTime()) || isNaN(d2.getTime())) return datesStr;
                  const m1 = d1.toLocaleString("default", { month: "short" });
                  const m2 = d2.toLocaleString("default", { month: "short" });
                  if (d1.getFullYear() !== d2.getFullYear()) {
                    return `${m1} ${d1.getDate()}, ${d1.getFullYear()} - ${m2} ${d2.getDate()}, ${d2.getFullYear()}`;
                  }
                  if (m1 === m2) {
                    return `${m1} ${d1.getDate()}-${d2.getDate()}, ${d1.getFullYear()}`;
                  }
                  return `${m1} ${d1.getDate()} - ${m2} ${d2.getDate()}, ${d1.getFullYear()}`;
                };
                
                return availableSlots.length > 0 ? availableSlots.map((slot: any) => {
                const isSelected = formData.departureDateId === slot.id?.toString();
                return (
                  <div
                    key={slot.id || slot.dates}
                    className={`${styles.departureCard} ${isSelected ? styles.departureSelected : ""}`}
                    onClick={() => {
                      const parts = (slot.dates || "").split(" - ");
                      const sStart = parts[0]?.trim() || "";
                      const sEnd = parts[1]?.trim() || "";
                      onChange({
                        departureDateId: slot.id?.toString() || slot.dates,
                        startDate: sStart,
                        endDate: sEnd,
                      });
                    }}
                  >
                    <div className={styles.departureInfo}>
                      <span className={styles.departureDate}>{formatDateRange(slot.dates)}</span>
                      <span className={styles.departureDuration}>{slot.duration}</span>
                    </div>
                    <CheckboxIndicator variant="square" size="md" selected={isSelected} aria-hidden />
                  </div>
                );
              }) : (
                <p className={styles.emptyText}>No departure dates available for this month.</p>
              );
              })()}
            </div>
            {errors.departureDateId && (
              <div className={styles.errorText}>
                <Image src="/images/information-fill.svg" alt="" width={16} height={16} aria-hidden="true" />
                <span>{errors.departureDateId}</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

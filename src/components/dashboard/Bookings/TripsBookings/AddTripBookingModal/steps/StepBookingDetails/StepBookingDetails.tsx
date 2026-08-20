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
}

export default function StepBookingDetails({ formData, onChange, errors = {} }: StepBookingDetailsProps) {
  const { data: allTrips } = useSWR("/trips/all", () => getAllTrips());

  const selectedTripBasic = allTrips?.find(t => t.id.toString() === formData.tripId);

  const { data: tripDetail } = useSWR(
    selectedTripBasic?.slug ? `/trips/${selectedTripBasic.slug}/` : null,
    () => getFullTripById(selectedTripBasic!.slug)
  );

  const tripHotelSlug = tripDetail?.hotels?.[0]?.slug;

  const { data: hotelDetail } = useSWR(
    tripHotelSlug ? `/hotels/${tripHotelSlug}/` : null,
    () => getFullHotelBySlug(tripHotelSlug as string)
  );

  // Group rooms by type from the HOTEL assigned to the trip
  const groupedRooms = useMemo(() => {
    if (!hotelDetail?.hotelRooms) return {};
    const groups: Record<string, typeof hotelDetail.hotelRooms> = {};
    for (const room of hotelDetail.hotelRooms) {
      if (!groups[room.type]) groups[room.type] = [];
      groups[room.type].push(room);
    }
    return groups;
  }, [hotelDetail]);

  // Normalize into RoomGroup[] for RoomSelector
  const roomGroups: RoomGroup[] = useMemo(() => {
    return Object.entries(groupedRooms).map(([type, rooms]) => {
      const roomList = rooms || [];
      let baseRoom = roomList.find(r => r.view.toLowerCase().includes("garden"));
      if (!baseRoom && roomList.length > 0) {
        baseRoom = roomList.reduce((prev, curr) => (prev.pricePerNight < curr.pricePerNight ? prev : curr));
      }
      const options = roomList.map(r => {
        const isBase = baseRoom ? r.id === baseRoom.id : false;
        const diff = baseRoom ? r.pricePerNight - baseRoom.pricePerNight : 0;
        return {
          label: r.view,
          value: r.id.toString(),
          price: isBase ? "Included" : (diff > 0 ? `+$${diff}` : `-$${Math.abs(diff)}`),
          isFree: isBase,
        };
      });

      return {
        key: type,
        title: `${type} - ${baseRoom!.view}`,
        subtitle: baseRoom!.name,
        displayPrice: `$${baseRoom!.pricePerNight}`,
        priceUnit: "/ night",
        options,
        defaultOptionValue: baseRoom!.id.toString(),
      };
    });
  }, [groupedRooms]);

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
    if (formData.tourType === "group" && !formData.departureMonth && DEPARTURE_MONTHS.length > 0) {
      onChange({ departureMonth: DEPARTURE_MONTHS[0].value });
    }
  }, [formData.departureMonth, DEPARTURE_MONTHS, onChange, formData.tourType]);

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
      {formData.tourType === "group" && (
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
              {availableSlots.length > 0 ? availableSlots.map((slot: any) => {
                const isSelected = formData.departureDateId === slot.id?.toString();
                return (
                  <div
                    key={slot.id || slot.dates}
                    className={`${styles.departureCard} ${isSelected ? styles.departureSelected : ""}`}
                    onClick={() => onChange({ departureDateId: slot.id?.toString() })}
                  >
                    <div className={styles.departureInfo}>
                      <span className={styles.departureDate}>{slot.dates}</span>
                      <span className={styles.departureDuration}>{slot.duration}</span>
                      <span className={styles.departureDuration}>{slot.spotsLeft} spots left</span>
                    </div>
                    <CheckboxIndicator variant="square" size="md" selected={isSelected} aria-hidden />
                  </div>
                );
              }) : (
                <p className={styles.emptyText}>No departure dates available for this month.</p>
              )}
            </div>
            {errors.departureDateId && <span className={styles.errorText}>{errors.departureDateId}</span>}
          </div>
        </div>
      )}

      {tripDetail && !tripHotelSlug && (
        <p className={styles.emptyText}>No hotel is assigned to this trip yet.</p>
      )}

      {tripHotelSlug && (
        <RoomSelector
          rooms={roomGroups}
          counts={flatCounts}
          customizations={flatCustomizations}
          onCountChange={handleCountChange}
          onCustomizationChange={(type, i, val) => handleCustomizationChange(type, i, val)}
          error={errors.rooms}
          loading={!hotelDetail}
          loadingMessage="Loading assigned hotel rooms..."
          emptyMessage="No rooms found for this assigned hotel."
        />
      )}
    </div>
  );
}

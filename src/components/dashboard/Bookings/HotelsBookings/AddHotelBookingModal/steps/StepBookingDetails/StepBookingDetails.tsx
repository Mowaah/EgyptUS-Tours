import React from "react";
import Image from "next/image";
import { CounterPill, SelectDropdown } from "@/components/shared";
import { AddHotelBookingData } from "../../AddHotelBookingModal";
import styles from "./StepBookingDetails.module.scss";

interface StepBookingDetailsProps {
  formData: AddHotelBookingData;
  onChange: (patch: Partial<AddHotelBookingData>) => void;
  errors?: Record<string, string>;
}

import useSWR from "swr";
import { getAllHotels, getFullHotelBySlug } from "@/services/hotelsService";

export default function StepBookingDetails({ formData, onChange, errors = {} }: StepBookingDetailsProps) {
  const { data: allHotels } = useSWR('/hotels/all', getAllHotels);

  const locations = Array.from(new Set(allHotels?.map(h => h.location_text) || [])).filter(Boolean);
  const locationOptions = [
    { label: "Select location", value: "", disabled: true },
    ...locations.map(loc => ({ label: loc, value: loc }))
  ];

  const filteredHotels = formData.hotelLocation 
    ? allHotels?.filter(h => h.location_text === formData.hotelLocation) || []
    : [];

  const hotelOptions = [
    { label: formData.hotelLocation ? "Select hotel" : "Select location first...", value: "", disabled: true },
    ...filteredHotels.map(h => ({ label: h.name, value: h.id.toString() }))
  ];

  const selectedHotel = allHotels?.find(h => h.id.toString() === formData.specificHotel);
  const slug = selectedHotel?.slug;

  const { data: hotelDetail } = useSWR(
    slug ? `/hotels/${slug}/` : null, 
    () => getFullHotelBySlug(slug as string)
  );

  const groupedRooms = React.useMemo(() => {
    if (!hotelDetail?.hotelRooms) return {};
    const groups: Record<string, typeof hotelDetail.hotelRooms> = {};
    for (const room of hotelDetail.hotelRooms) {
      if (!groups[room.type]) groups[room.type] = [];
      groups[room.type].push(room);
    }
    return groups;
  }, [hotelDetail]);

  const updateRoomCount = (type: string, val: number, defaultRoomId: string) => {
    const currentList = formData.roomCustomizations[type] || [];
    let newList = [...currentList];
    if (val > currentList.length) {
      const diff = val - currentList.length;
      for (let i = 0; i < diff; i++) {
        newList.push(defaultRoomId);
      }
    } else if (val < currentList.length) {
      newList = newList.slice(0, val);
    }
    onChange({ roomCustomizations: { ...formData.roomCustomizations, [type]: newList } });
  };

  const updateRoomCustomization = (type: string, index: number, roomId: string) => {
    const currentList = formData.roomCustomizations[type] || [];
    const newList = [...currentList];
    newList[index] = roomId;
    onChange({ roomCustomizations: { ...formData.roomCustomizations, [type]: newList } });
  };

  return (
    <div className={styles.container}>
      <div className={styles.row}>
        <div className={styles.col}>
          <div className={styles.fieldWrapper}>
            <label>Hotel Location</label>
            <SelectDropdown
              id="hotel-location"
              options={locationOptions}
              value={formData.hotelLocation}
              onChange={(val) => onChange({ hotelLocation: val, specificHotel: "" })}
              triggerClassName={`${styles.fieldTrigger} ${errors.hotelLocation ? styles.errorBorder : ""}`}
            />
            {errors.hotelLocation && <span className={styles.errorText}>{errors.hotelLocation}</span>}
          </div>
        </div>
        <div className={styles.col}>
          <div className={styles.fieldWrapper}>
            <label>Specific Hotel</label>
            <SelectDropdown
              id="specific-hotel"
              options={hotelOptions}
              value={formData.specificHotel}
              onChange={(val) => onChange({ specificHotel: val, roomCustomizations: {} })}
              triggerClassName={`${styles.fieldTrigger} ${errors.specificHotel ? styles.errorBorder : ""}`}
            />
            {errors.specificHotel && <span className={styles.errorText}>{errors.specificHotel}</span>}
          </div>
        </div>
      </div>

      <div className={styles.fieldGroup}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
          <h3 className={styles.sectionTitle} style={{ marginBottom: 0 }}>Type of Room</h3>
          {errors.rooms && (
            <div className={styles.errorText} style={{ color: "#C11515", fontSize: "0.75rem", display: "flex", alignItems: "center", gap: "4px" }}>
              <Image src="/images/information-fill.svg" alt="" width={16} height={16} />
              <span>{errors.rooms}</span>
            </div>
          )}
        </div>
        
        <div className={styles.roomList}>
          {!hotelDetail && formData.specificHotel && (
            <div className={styles.roomSubtitle} style={{ padding: '1rem' }}>Loading rooms...</div>
          )}
          {!formData.specificHotel && (
            <div className={styles.roomSubtitle} style={{ padding: '1rem' }}>Please select a hotel to view rooms.</div>
          )}
          
          {Object.entries(groupedRooms).map(([type, rooms]) => {
            // Find base room: prefer Garden View, else the cheapest
            let baseRoom = rooms.find(r => r.view.toLowerCase().includes("garden"));
            if (!baseRoom) {
              baseRoom = rooms.reduce((prev, curr) => prev.pricePerNight < curr.pricePerNight ? prev : curr);
            }
            
            const count = (formData.roomCustomizations[type] || []).length;
            
            return (
              <div key={type} className={styles.roomRowWrapper}>
                <div className={styles.roomInfoBox}>
                  <div className={styles.roomTexts}>
                    <span className={styles.roomTitle}>{type} - {baseRoom.view}</span>
                    <span className={styles.roomSubtitle}>{baseRoom.name}</span>
                  </div>
                  <div className={styles.priceContainer}>
                    <span className={styles.priceValue}>${baseRoom.pricePerNight}</span>
                    <span className={styles.roomSubtitle}>/ night</span>
                  </div>
                </div>
                <div className={styles.counterWrap}>
                  <CounterPill
                    value={count}
                    onIncrease={() => updateRoomCount(type, count + 1, baseRoom.id.toString())}
                    onDecrease={() => updateRoomCount(type, Math.max(0, count - 1), baseRoom.id.toString())}
                    pillOnly
                  />
                </div>
              </div>
            );
          })}
        </div>

        {(() => {
          let globalRoomIndex = 1;
          return Object.entries(groupedRooms).map(([type, rooms]) => {
            const selectedRoomIds = formData.roomCustomizations[type] || [];
            if (selectedRoomIds.length === 0) return null;
            
            let baseRoom = rooms.find(r => r.view.toLowerCase().includes("garden"));
            if (!baseRoom) {
              baseRoom = rooms.reduce((prev, curr) => prev.pricePerNight < curr.pricePerNight ? prev : curr);
            }

            const viewOptions = rooms.map(r => {
              const isBase = r.id === baseRoom.id;
              const diff = r.pricePerNight - baseRoom.pricePerNight;
              return {
                label: r.view,
                value: r.id.toString(),
                price: isBase ? "Included" : (diff > 0 ? `+$${diff}` : `-$${Math.abs(diff)}`),
                isFree: isBase
              };
            });

            return (
              <div key={`custom-${type}`} className={styles.customRoomsSection}>
                <h4 className={styles.subSectionTitle}>Customize {type}s ({selectedRoomIds.length} selected)</h4>
                <div className={styles.customRoomsGrid}>
                  {selectedRoomIds.map((selectedId, i) => {
                    const currentRoomNumber = globalRoomIndex++;
                    return (
                      <div key={`${type}-${i}`} className={styles.customRoomField}>
                        <label>Room {currentRoomNumber}</label>
                        <SelectDropdown
                          id={`${type}-room-${i}`}
                          options={viewOptions}
                          value={selectedId}
                          onChange={(val) => updateRoomCustomization(type, i, val)}
                          triggerClassName={styles.fieldTrigger}
                        />
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          });
        })()}
      </div>
    </div>
  );
}

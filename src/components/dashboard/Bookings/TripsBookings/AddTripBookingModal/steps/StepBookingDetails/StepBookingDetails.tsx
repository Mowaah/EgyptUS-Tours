import React, { useMemo, useEffect } from "react";
import Image from "next/image";
import { CounterPill, SelectDropdown, CheckboxIndicator } from "@/components/shared";
import { AddTripBookingData } from "../../AddTripBookingModal";

import styles from "./StepBookingDetails.module.scss";

interface StepBookingDetailsProps {
  formData: AddTripBookingData;
  onChange: (patch: Partial<AddTripBookingData>) => void;
}

const GROUP_DEPARTURE_DATES = [
  { id: "1", date: "March 15-19, 2026", duration: "5 Days / 4 Nights" },
  { id: "2", date: "March 15-19, 2026", duration: "5 Days / 4 Nights" },
  { id: "3", date: "March 15-19, 2026", duration: "5 Days / 4 Nights" },
  { id: "4", date: "March 15-19, 2026", duration: "5 Days / 4 Nights" },
  { id: "5", date: "March 15-19, 2026", duration: "5 Days / 4 Nights" },
  { id: "6", date: "March 15-19, 2026", duration: "5 Days / 4 Nights" },
];

const ROOM_VIEW_OPTIONS = [
  { label: "Garden View", value: "garden", price: "Free", isFree: true },
  { label: "Nile View", value: "nile", price: "+$ 456" },
  { label: "Sea View", value: "sea", price: "+$ 456" },
];

export default function StepBookingDetails({ formData, onChange }: StepBookingDetailsProps) {
  const DEPARTURE_MONTHS = useMemo(() => {
    const options = [];
    const currentDate = new Date();
    for (let i = 0; i < 24; i++) {
      const d = new Date(currentDate.getFullYear(), currentDate.getMonth() + i, 1);
      const label = d.toLocaleDateString("en-US", { month: "long", year: "numeric" });
      options.push({ label, value: label });
    }
    return options;
  }, []);

  useEffect(() => {
    if (!formData.departureMonth && DEPARTURE_MONTHS.length > 0) {
      onChange({ departureMonth: DEPARTURE_MONTHS[0].value });
    }
  }, [formData.departureMonth, DEPARTURE_MONTHS, onChange]);

  const handleRoomChange = (type: keyof typeof formData.rooms, isIncrease: boolean) => {
    const currentVal = formData.rooms[type];
    if (!isIncrease && currentVal === 0) return;
    const newVal = isIncrease ? currentVal + 1 : currentVal - 1;
    onChange({
      rooms: {
        ...formData.rooms,
        [type]: newVal,
      },
    });
  };

  return (
    <div className={styles.container}>
      {/* Type of Room Section */}
      <div className={styles.fieldGroup}>
        <h3 className={styles.sectionTitle}>Type of Room</h3>
        
        <div className={styles.roomList}>
          {[
            { id: "single", label: "Single Room - Garden View", price: "EGP 5,800", count: formData.rooms.single },
            { id: "double", label: "Double Room - Garden View", price: "EGP 4,100", count: formData.rooms.double },
            { id: "triple", label: "Triple Room - Garden View", price: "EGP 3,500", count: formData.rooms.triple }
          ].map((room) => (
            <div key={room.id} className={styles.roomRowWrapper}>
              <div className={styles.roomInfoBox}>
                <div className={styles.roomTexts}>
                  <span className={styles.roomTitle}>{room.label}</span>
                  <span className={styles.roomSubtitle}>1 person</span>
                </div>
                <div className={styles.priceContainer}>
                  <span className={styles.priceValue}>{room.price}</span>
                  <span className={styles.roomSubtitle}>/ person</span>
                </div>
              </div>
              <div className={styles.counterWrap}>
                <CounterPill
                  value={room.count}
                  onIncrease={() => handleRoomChange(room.id as any, true)}
                  onDecrease={() => handleRoomChange(room.id as any, false)}
                />
              </div>
            </div>
          ))}
        </div>

        {formData.rooms.single > 0 && (
          <div className={styles.customRoomsSection}>
            <h4 className={styles.subSectionTitle}>Customize Your Single Rooms ( {formData.rooms.single} selected )</h4>
            <div className={styles.customRoomsGrid}>
              {Array.from({ length: formData.rooms.single }).map((_, i) => (
                <div key={i} className={styles.customRoomField}>
                  <label>Room {i + 1}</label>
                  <SelectDropdown
                    id={`single-room-${i}`}
                    options={ROOM_VIEW_OPTIONS}
                    value="garden"
                    onChange={() => { }}
                    triggerClassName={styles.fieldTrigger}
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {formData.rooms.double > 0 && (
          <div className={styles.customRoomsSection}>
            <h4 className={styles.subSectionTitle}>Customize Your Double Rooms ( {formData.rooms.double} selected )</h4>
            <div className={styles.customRoomsGrid}>
              {Array.from({ length: formData.rooms.double }).map((_, i) => (
                <div key={i} className={styles.customRoomField}>
                  <label>Room {i + 1}</label>
                  <SelectDropdown
                    id={`double-room-${i}`}
                    options={ROOM_VIEW_OPTIONS}
                    value="garden"
                    onChange={() => { }}
                    triggerClassName={styles.fieldTrigger}
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {formData.rooms.triple > 0 && (
          <div className={styles.customRoomsSection}>
            <h4 className={styles.subSectionTitle}>Customize Your Triple Rooms ( {formData.rooms.triple} selected )</h4>
            <div className={styles.customRoomsGrid}>
              {Array.from({ length: formData.rooms.triple }).map((_, i) => (
                <div key={i} className={styles.customRoomField}>
                  <label>Room {i + 1}</label>
                  <SelectDropdown
                    id={`triple-room-${i}`}
                    options={ROOM_VIEW_OPTIONS}
                    value="garden"
                    onChange={() => { }}
                    triggerClassName={styles.fieldTrigger}
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Group Section */}
      <div className={styles.groupSection}>
        <div className={styles.fieldGroup}>
          <h3 className={styles.sectionTitle}>Select Month</h3>
          <div className={styles.monthSelectDropdownWrapper}>
            <SelectDropdown
              id="pti-group-departure-month"
              options={DEPARTURE_MONTHS}
              value={formData.departureMonth || DEPARTURE_MONTHS[0].value}
              onChange={(val) => onChange({ departureMonth: val })}
              triggerClassName={styles.fieldTrigger}
              renderValue={(val) => (
                <span className={styles.monthValueWrapper}>
                  <Image src="/images/calendar3.svg" alt="" width={20} height={20} />
                  <span className={styles.monthValueText}>{val}</span>
                </span>
              )}
            />
          </div>
        </div>

        <div className={styles.fieldGroup}>
          <h3 className={styles.sectionTitle}>Choose Departure Date</h3>
          <div className={styles.departureGrid}>
            {GROUP_DEPARTURE_DATES.map((dep) => {
              const isSelected = formData.departureDateId === dep.id;
              return (
                <div
                  key={dep.id}
                  className={`${styles.departureCard} ${isSelected ? styles.departureSelected : ''}`}
                  onClick={() => onChange({ departureDateId: dep.id })}
                >
                  <div className={styles.departureInfo}>
                    <span className={styles.departureDate}>{dep.date}</span>
                    <span className={styles.departureDuration}>{dep.duration}</span>
                  </div>
                  <CheckboxIndicator variant="square" size="md" selected={isSelected} aria-hidden />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

import { CounterPill, SelectDropdown } from "@/components/shared";
import DashboardField from "@/components/dashboard/shared/DashboardField/DashboardField";
import { AddHotelBookingData } from "../../AddHotelBookingModal";
import styles from "./StepBookingDetails.module.scss";

interface StepBookingDetailsProps {
  formData: AddHotelBookingData;
  onChange: (patch: Partial<AddHotelBookingData>) => void;
}

const CATEGORY_OPTIONS = [
  { label: "Select hotel category", value: "", disabled: true },
  { label: "Luxury", value: "luxury" },
  { label: "Boutique", value: "boutique" },
  { label: "Budget", value: "budget" },
];

const HOTEL_OPTIONS = [
  { label: "Select hotel category first...", value: "", disabled: true },
  { label: "Beach Nile Palace Hotel & Spa", value: "beach-nile-palace" },
  { label: "Four Seasons Hotel", value: "four-seasons" },
  { label: "Marriott Mena House", value: "marriott" },
];

const ROOM_VIEW_OPTIONS = [
  { label: "Garden View", value: "garden-view", price: "Included", isFree: true },
  { label: "Sea View", value: "sea-view", price: "+$ 50" },
  { label: "Pool View", value: "pool-view", price: "+$ 20" },
];

export default function StepBookingDetails({ formData, onChange }: StepBookingDetailsProps) {
  const updateRoomCount = (type: "single" | "double" | "triple", val: number) => {
    onChange({ rooms: { ...formData.rooms, [type]: val } });
  };

  const updateRoomCustomization = (type: string, index: number, value: string) => {
    const current = formData.roomCustomizations[type] || [];
    const updated = [...current];
    updated[index] = value;
    onChange({ roomCustomizations: { ...formData.roomCustomizations, [type]: updated } });
  };

  return (
    <div className={styles.container}>
      <div className={styles.row}>
        <div className={styles.col}>
          <DashboardField
            control="select"
            label="Hotel Category"
            options={CATEGORY_OPTIONS}
            value={formData.hotelCategory}
            onChange={(e: any) => onChange({ hotelCategory: e.target.value })}
          />
        </div>
        <div className={styles.col}>
          <DashboardField
            control="select"
            label="Specific Hotel"
            options={HOTEL_OPTIONS}
            value={formData.specificHotel}
            onChange={(e: any) => onChange({ specificHotel: e.target.value })}
            disabled={!formData.hotelCategory}
          />
        </div>
      </div>

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
                  onIncrease={() => updateRoomCount(room.id as "single"|"double"|"triple", room.count + 1)}
                  onDecrease={() => updateRoomCount(room.id as "single"|"double"|"triple", Math.max(0, room.count - 1))}
                  pillOnly
                />
              </div>
            </div>
          ))}
        </div>

        {formData.rooms.single > 0 && (
          <div className={styles.customRoomsSection}>
            <h4 className={styles.subSectionTitle}>Customize Single Rooms ({formData.rooms.single} selected)</h4>
            <div className={styles.customRoomsGrid}>
              {Array.from({ length: formData.rooms.single }).map((_, i) => (
                <div key={`single-${i}`} className={styles.customRoomField}>
                  <label>Room {i + 1}</label>
                  <SelectDropdown
                    id={`single-room-${i}`}
                    options={ROOM_VIEW_OPTIONS}
                    value={formData.roomCustomizations["single"]?.[i] || ROOM_VIEW_OPTIONS[0].value}
                    onChange={(val) => updateRoomCustomization("single", i, val)}
                    triggerClassName={styles.fieldTrigger}
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {formData.rooms.double > 0 && (
          <div className={styles.customRoomsSection}>
            <h4 className={styles.subSectionTitle}>Customize Double Rooms ({formData.rooms.double} selected)</h4>
            <div className={styles.customRoomsGrid}>
              {Array.from({ length: formData.rooms.double }).map((_, i) => (
                <div key={`double-${i}`} className={styles.customRoomField}>
                  <label>Room {i + 1}</label>
                  <SelectDropdown
                    id={`double-room-${i}`}
                    options={ROOM_VIEW_OPTIONS}
                    value={formData.roomCustomizations["double"]?.[i] || ROOM_VIEW_OPTIONS[0].value}
                    onChange={(val) => updateRoomCustomization("double", i, val)}
                    triggerClassName={styles.fieldTrigger}
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {formData.rooms.triple > 0 && (
          <div className={styles.customRoomsSection}>
            <h4 className={styles.subSectionTitle}>Customize Triple Rooms ({formData.rooms.triple} selected)</h4>
            <div className={styles.customRoomsGrid}>
              {Array.from({ length: formData.rooms.triple }).map((_, i) => (
                <div key={`triple-${i}`} className={styles.customRoomField}>
                  <label>Room {i + 1}</label>
                  <SelectDropdown
                    id={`triple-room-${i}`}
                    options={ROOM_VIEW_OPTIONS}
                    value={formData.roomCustomizations["triple"]?.[i] || ROOM_VIEW_OPTIONS[0].value}
                    onChange={(val) => updateRoomCustomization("triple", i, val)}
                    triggerClassName={styles.fieldTrigger}
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

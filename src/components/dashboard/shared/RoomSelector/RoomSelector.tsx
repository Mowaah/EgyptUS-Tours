"use client";

import { CounterPill, SelectDropdown } from "@/components/shared";
import Image from "next/image";
import styles from "./RoomSelector.module.scss";

export interface RoomOption {
  label: string;
  value: string;
  price?: string;
  isFree?: boolean;
}

export interface RoomGroup {
  /** Unique key used in form state (e.g. "single", "double", "deluxe") */
  key: string;
  /** Room type display name */
  title: string;
  /** Secondary info (e.g. "Garden View" or "2 seasons available") */
  subtitle: string;
  /** Price to show in the row */
  displayPrice: string;
  /** Unit label (e.g. "/ night" or "/ person") */
  priceUnit: string;
  /** Options for per-room customization (views for hotels, seasons for trips) */
  options: RoomOption[];
  /** Default option value when a room is added */
  defaultOptionValue: string;
}

interface RoomSelectorProps {
  rooms: RoomGroup[];
  counts: Record<string, number>;
  customizations: Record<string, string>;
  onCountChange: (key: string, newCount: number, defaultOptionValue: string) => void;
  onCustomizationChange: (key: string, index: number, value: string) => void;
  error?: string;
  loading?: boolean;
  loadingMessage?: string;
  emptyMessage?: string;
}

export default function RoomSelector({
  rooms,
  counts,
  customizations,
  onCountChange,
  onCustomizationChange,
  error,
  loading,
  loadingMessage = "Loading rooms...",
  emptyMessage = "No rooms available.",
}: RoomSelectorProps) {
  let globalRoomIndex = 1;

  return (
    <div className={styles.fieldGroup}>
      <div className={styles.titleRow}>
        <h3 className={styles.sectionTitle}>Type of Room</h3>
      </div>

      <div className={styles.roomList}>
        {loading && (
          <div className={styles.placeholder}>{loadingMessage}</div>
        )}
        {!loading && rooms.length === 0 && (
          <div className={styles.placeholder}>{emptyMessage}</div>
        )}
        {rooms.map((room) => {
          const count = counts[room.key] || 0;
          return (
            <div key={room.key} className={styles.roomRowWrapper}>
              <div className={styles.roomInfoBox}>
                <div className={styles.roomTexts}>
                  <span className={styles.roomTitle}>{room.title}</span>
                  <span className={styles.roomSubtitle}>{room.subtitle}</span>
                </div>
                <div className={styles.priceContainer}>
                  <span className={styles.priceValue}>{room.displayPrice}</span>
                  <span className={styles.roomSubtitle}>{room.priceUnit}</span>
                </div>
              </div>
              <div className={styles.counterWrap}>
                <CounterPill
                  value={count}
                  onIncrease={() => onCountChange(room.key, count + 1, room.defaultOptionValue)}
                  onDecrease={() => onCountChange(room.key, Math.max(0, count - 1), room.defaultOptionValue)}
                  pillOnly
                />
              </div>
            </div>
          );
        })}
      </div>

      {error && (
        <div className={styles.errorText}>
          <Image src="/images/information-fill.svg" alt="" width={16} height={16} aria-hidden="true" />
          <span>{error}</span>
        </div>
      )}

      {/* Per-room customization — only shown when there are options to pick from */}
      {rooms.map((room) => {
        const count = counts[room.key] || 0;
        if (count === 0 || room.options.length <= 1) return null;

        return (
          <div key={`custom-${room.key}`} className={styles.customRoomsSection}>
            <h4 className={styles.subSectionTitle}>
              Customize {room.title}s ({count} selected)
            </h4>
            <div className={styles.customRoomsGrid}>
              {Array.from({ length: count }).map((_, i) => {
                const currentRoomNumber = globalRoomIndex++;
                const customKey = `${room.key}-${i}`;
                return (
                  <div key={customKey} className={styles.customRoomField}>
                    <label>Room {currentRoomNumber}</label>
                    <SelectDropdown
                      id={`${room.key}-option-${i}`}
                      options={room.options}
                      value={customizations[customKey] || room.defaultOptionValue}
                      onChange={(val) => onCustomizationChange(room.key, i, val)}
                      triggerClassName={styles.fieldTrigger}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}

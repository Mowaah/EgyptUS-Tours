import React from "react";
import Image from "next/image";
import {
  BookingStepFooter,
  FormField,
  CustomDatePicker,
  SelectDropdown,
  CounterPill,
} from "@/components/shared";
import type { SelectOption } from "@/components/shared";
import { useCurrency } from "@/contexts/CurrencyContext";
import planPage from "../../../PlanYourTripPage/PlanYourTripPage.module.scss";
import travelerStyles from "../../../PlanYourTripPage/steps/TravelerInfo/StepTravelerInfo.module.scss";
import formStyles from "@/components/shared/FormField/FormField.module.scss";
import styles from "./StepRoomDates.module.scss";
import { BookingData } from "../../BookHotelPage";
import { Hotel, HotelRoom } from "@/types";

interface StepRoomDatesProps {
  formData: BookingData;
  onChange: (patch: Partial<BookingData>) => void;
  onContinue: () => void;
  hotel: Hotel;
}

export default function StepRoomDates({ formData, onChange, onContinue, hotel }: StepRoomDatesProps) {
  const [errors, setErrors] = React.useState<Record<string, string>>({});
  const { formatCurrency } = useCurrency();

  const groupedRooms = React.useMemo(() => {
    if (!hotel.hotelRooms) return {};
    const groups: Record<string, HotelRoom[]> = {};
    for (const room of hotel.hotelRooms) {
      const category = room.category ? room.category.trim().replace(/\s*[Rr]oom\s*/i, "") : "";
      const type = room.type ? room.type.trim() : "";
      const groupKey = category ? `${category} ${type}`.trim() : type;
      if (!groups[groupKey]) groups[groupKey] = [];
      groups[groupKey].push(room);
    }
    return groups;
  }, [hotel.hotelRooms]);

  const handleRoomChange = (roomType: string, increment: boolean, defaultRoomId?: string) => {
    const currentCount = formData.rooms[roomType] || 0;
    const newCount = Math.max(0, currentCount + (increment ? 1 : -1));
    const newRooms = { ...formData.rooms, [roomType]: newCount };
    
    const currentList = formData.roomCustomizations?.[roomType] || [];
    let newList = [...currentList];
    if (newCount > currentList.length && defaultRoomId) {
      for (let i = 0; i < newCount - currentList.length; i++) {
        newList.push(defaultRoomId);
      }
    } else if (newCount < currentList.length) {
      newList = newList.slice(0, newCount);
    }

    if (errors.rooms) setErrors((e) => ({ ...e, rooms: "" }));

    onChange({ 
      rooms: newRooms,
      roomCustomizations: { ...(formData.roomCustomizations || {}), [roomType]: newList }
    });
  };

  const updateRoomCustomization = (type: string, index: number, roomId: string) => {
    const currentList = formData.roomCustomizations?.[type] || [];
    const newList = [...currentList];
    newList[index] = roomId;
    onChange({ roomCustomizations: { ...(formData.roomCustomizations || {}), [type]: newList } });
  };

  const handleGuestChange = (type: "adults" | "children" | "infants", increment: boolean) => {
    if (errors.adults && type === "adults") setErrors((e) => ({ ...e, adults: "" }));
    if (errors.rooms) setErrors((e) => ({ ...e, rooms: "" }));
    onChange({ [type]: Math.max(0, formData[type] + (increment ? 1 : -1)) });
  };

  const handleContinue = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.startDate) newErrors.startDate = "Check-in date is required.";
    if (!formData.endDate) newErrors.endDate = "Check-out date is required.";

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (formData.startDate) {
      const checkInDate = new Date(formData.startDate);
      checkInDate.setHours(0, 0, 0, 0);
      if (checkInDate < today) {
        newErrors.startDate = "Check-in date cannot be in the past.";
      }
    }

    if (formData.startDate && formData.endDate) {
      const checkInDate = new Date(formData.startDate);
      checkInDate.setHours(0, 0, 0, 0);
      const checkOutDate = new Date(formData.endDate);
      checkOutDate.setHours(0, 0, 0, 0);

      if (checkOutDate <= checkInDate) {
        newErrors.endDate = "Check-out date must be after check-in date.";
      }
    }

    if (!formData.adults || formData.adults < 1) {
      newErrors.adults = "At least 1 adult is required.";
    }

    let totalCapacity = 0;
    let totalRooms = 0;
    Object.entries(formData.rooms || {}).forEach(([key, count]) => {
      const c = Number(count) || 0;
      totalRooms += c;
      const k = key.toLowerCase();
      if (k.includes("single")) totalCapacity += c * 1;
      else if (k.includes("double")) totalCapacity += c * 2;
      else if (k.includes("triple")) totalCapacity += c * 3;
      else totalCapacity += c * 2; // fallback
    });

    if (totalRooms === 0) {
      newErrors.rooms = "Please select at least one room.";
    } else if (formData.adults > totalCapacity) {
      newErrors.rooms = `Selected rooms only accommodate ${totalCapacity} ${totalCapacity === 1 ? "adult" : "adults"}, but ${formData.adults} adults are selected.`;
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    onContinue();
  };

  return (
    <div className={planPage.stepFormCard}>
      <header className={planPage.stepFormCardHeader}>
        <div className={planPage.formHeaderColumn}>
          <h2 className={planPage.formTitle}>Find the Perfect Room for Your Stay</h2>
          <p className={planPage.formSubtitle}>Select your dates, number of guests, and room preferences to find the best option for your stay.</p>
        </div>
      </header>

      <div className={planPage.stepFormCardScroll}>
        {/* ── Dates & Guests ── */}
        <div className={planPage.formGrid}>
          <FormField label="Check-in" required error={errors.startDate}>
            <CustomDatePicker
              variant="input"
              className={`${formStyles.input} ${planPage.dateInput} ${errors.startDate ? formStyles.inputInvalid : ""}`}
              value={formData.startDate}
              onChange={(date) => {
                onChange({ startDate: date });
                if (errors.startDate) setErrors((e) => ({ ...e, startDate: "" }));
              }}
            />
          </FormField>
          <FormField label="Check-out" required error={errors.endDate}>
            <CustomDatePicker
              variant="input"
              className={`${formStyles.input} ${planPage.dateInput} ${errors.endDate ? formStyles.inputInvalid : ""}`}
              value={formData.endDate}
              onChange={(date) => {
                onChange({ endDate: date });
                if (errors.endDate) setErrors((e) => ({ ...e, endDate: "" }));
              }}
            />
          </FormField>

          {(["adults", "children", "infants"] as const).map((type) => {
            const meta = {
              adults: { title: "No of Adults", hint: "(+12 years)" },
              children: { title: "No of Children", hint: "(2 to 11 years)" },
              infants: { title: "No of Infants", hint: "(0 to 2 years)" },
            };
            return (
              <div key={type} className={planPage.formGroup}>
                <CounterPill
                  label={meta[type].title}
                  subLabel={meta[type].hint}
                  value={formData[type]}
                  onIncrease={() => handleGuestChange(type, true)}
                  onDecrease={() => handleGuestChange(type, false)}
                  required={type === "adults"}
                />
                {type === "adults" && errors.adults && (
                  <div className={styles.errorText} style={{ color: "#C11515", fontSize: "0.75rem", display: "flex", alignItems: "center", gap: "4px", marginTop: "8px" }}>
                    <Image src="/images/information-fill.svg" alt="" width={16} height={16} />
                    <span>{errors.adults}</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
        <hr className={styles.divider} aria-hidden="true" />

        {/* ── Room Type ── */}
        <h3 className={styles.sectionTitle} style={{ marginBottom: '1.5rem' }}>
          Type of Room <span style={{ color: '#0E2851' }}>*</span>
        </h3>
        <div className={styles.roomList}>
          {Object.entries(groupedRooms).length === 0 && (
            <div style={{ color: "#666", padding: "1rem" }}>No rooms available for this hotel.</div>
          )}
          {Object.entries(groupedRooms).map(([type, rooms]) => {
            if (!rooms || rooms.length === 0) return null;
            const t = type.toLowerCase();
            
            // Base room is either Garden View, or cheapest, or first.
            const gardenRoom = rooms.find((r) => r.view.toLowerCase().includes("garden"));
            const baseRoom = gardenRoom || [...rooms].sort((a, b) => a.pricePerNight - b.pricePerNight)[0];
            
            const count = formData.rooms[t] || 0;
            let guestsNum = 2;
            if (t.includes("single")) guestsNum = 1;
            else if (t.includes("double") || t.includes("twin")) guestsNum = 2;
            else if (t.includes("triple")) guestsNum = 3;
            else if (t.includes("quad")) guestsNum = 4;
            
            const rawTitle = type.trim();
            const title = rawTitle.toLowerCase().endsWith("room")
              ? rawTitle
              : `${rawTitle.charAt(0).toUpperCase() + rawTitle.slice(1)} Room`;
            
            return (
              <div key={type} className={styles.roomRowWrapper}>
                <label className={`${styles.roomInfoBox} ${count > 0 ? styles.selected : ""}`}>
                  <div className={styles.roomTexts}>
                    <span className={styles.roomTitle}>
                      {title} - {baseRoom.view}
                    </span>
                    <span className={styles.roomSub}>{guestsNum} {guestsNum === 1 ? 'person' : 'people'}</span>
                  </div>
                  <div className={styles.priceCol}>
                    <span className={styles.priceVal}>{formatCurrency(baseRoom.pricePerNight)}</span>
                    <span className={styles.roomSub}>/ night</span>
                  </div>
                </label>
                <CounterPill
                  value={count}
                  onIncrease={() => handleRoomChange(t, true, baseRoom.id)}
                  onDecrease={() => handleRoomChange(t, false, baseRoom.id)}
                  className={styles.roomCounter}
                  pillOnly
                />
              </div>
            );
          })}
        </div>
        {errors.rooms && (
          <div className={styles.errorText} style={{ color: "#C11515", fontSize: "0.75rem", display: "flex", alignItems: "center", gap: "4px" }}>
            <Image src="/images/information-fill.svg" alt="" width={16} height={16} />
            <span>{errors.rooms}</span>
          </div>
        )}

        {Object.entries(groupedRooms).map(([type, rooms]) => {
          const t = type.toLowerCase();
          const count = formData.rooms[t] || 0;
          if (count === 0) return null;
          
          const gardenRoom = rooms.find((r) => r.view.toLowerCase().includes("garden"));
          const baseRoom = gardenRoom || [...rooms].sort((a, b) => a.pricePerNight - b.pricePerNight)[0];

          // Map other views to dropdown options
          const options: SelectOption[] = rooms.map((r) => {
            const isBase = r.id === baseRoom.id;
            const diff = r.pricePerNight - baseRoom.pricePerNight;
            const displayPrice = isBase
              ? "Included"
              : `${diff > 0 ? "+" : "-"}${formatCurrency(Math.abs(diff))}`;
            return {
              label: `${r.view}${isBase ? " (Included)" : ""}`,
              value: r.id,
              price: displayPrice,
              isFree: isBase,
            };
          });

          return (
            <React.Fragment key={`custom-${type}`}>
              <h3 className={styles.sectionTitle}>Customize {type.charAt(0).toUpperCase() + type.slice(1)} Rooms ({count} selected)</h3>
              <div className={planPage.formGrid}>
                {Array.from({ length: count }).map((_, i) => {
                  const val = formData.roomCustomizations?.[t]?.[i] || baseRoom.id;
                  return (
                    <div key={i} className={planPage.formGroup}>
                      <label className={formStyles.fieldLabel}>Room {i + 1}</label>
                      <SelectDropdown
                        id={`${type}-room-${i}`}
                        options={options}
                        value={val}
                        onChange={(newVal) => updateRoomCustomization(t, i, newVal)}
                      />
                    </div>
                  );
                })}
              </div>
            </React.Fragment>
          );
        })}

        {(formData.rooms.double > 0 || formData.rooms.triple > 0) && (
          <hr className={styles.divider} aria-hidden="true" />
        )}

        {/* ── Special Requests ── */}
        <h3 className={styles.sectionTitle}>Special Requests (Optional)</h3>
        <FormField
          id="rd-requests"
          label=""
          isTextarea
          wrapperClassName={planPage.formGroupFull}
          className={travelerStyles.formTextarea}
          placeholder="Any special requirements or requests for your trip..."
          value={formData.specialRequests}
          onChange={(e) => onChange({ specialRequests: e.target.value })}
          rows={4}
        />
      </div>

      <BookingStepFooter
        onContinue={handleContinue}
        continueLabel="Continue"
      />
    </div>
  );
}

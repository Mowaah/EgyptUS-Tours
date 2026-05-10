import React from "react";
import {
  BookingStepFooter,
  FormField,
  CustomDatePicker,
  SelectDropdown,
  CounterPill,
} from "@/components/shared";
import type { SelectOption } from "@/components/shared";
import planPage from "../../../PlanYourTripPage/PlanYourTripPage.module.scss";
import travelerStyles from "../../../PlanYourTripPage/steps/TravelerInfo/StepTravelerInfo.module.scss";
import formStyles from "@/components/shared/FormField/FormField.module.scss";
import styles from "./StepRoomDates.module.scss";
import { BookingData } from "../../BookHotelPage";
import { Hotel } from "@/types";

const ROOM_VIEW_OPTIONS: SelectOption[] = [
  { label: "Garden View (Included)", value: "garden", price: "Free", isFree: true },
  { label: "Nile View", value: "nile", price: "+$ 456" },
  { label: "Sea View", value: "sea", price: "+$ 456" },
];

const ROOM_TYPES = [
  { id: "single" as const, label: "Single Room", sub: "1 person", price: "EGP 5,800", per: "/ person" },
  { id: "double" as const, label: "Double Room", sub: "1 person", price: "EGP 4,100", per: "/ person" },
  { id: "triple" as const, label: "Triple Room", sub: "1 person", price: "EGP 3,500", per: "/ person" },
];

interface StepRoomDatesProps {
  formData: BookingData;
  onChange: (patch: Partial<BookingData>) => void;
  onContinue: () => void;
  hotel: Hotel;
}

export default function StepRoomDates({ formData, onChange, onContinue }: StepRoomDatesProps) {
  const handleRoomChange = (roomType: "single" | "double" | "triple", increment: boolean) => {
    onChange({
      rooms: {
        ...formData.rooms,
        [roomType]: Math.max(0, formData.rooms[roomType] + (increment ? 1 : -1)),
      },
    });
  };

  const handleGuestChange = (type: "adults" | "children" | "infants", increment: boolean) => {
    onChange({ [type]: Math.max(0, formData[type] + (increment ? 1 : -1)) });
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
          <div className={formStyles.field}>
            <label className={formStyles.fieldLabel}>Check-in</label>
            <CustomDatePicker
              variant="input"
              className={`${formStyles.input} ${planPage.dateInput}`}
              value={formData.startDate}
              onChange={(date) => onChange({ startDate: date })}
            />
          </div>
          <div className={formStyles.field}>
            <label className={formStyles.fieldLabel}>Check-out</label>
            <CustomDatePicker
              variant="input"
              className={`${formStyles.input} ${planPage.dateInput}`}
              value={formData.endDate}
              onChange={(date) => onChange({ endDate: date })}
            />
          </div>

          {(["adults", "children", "infants"] as const).map((type) => {
            const meta = {
              adults:   { title: "No of Adults",   hint: "(+12 years)" },
              children: { title: "No of Children", hint: "(2 to 11 years)" },
              infants:  { title: "No of Infants",  hint: "(0 to 2 years)" },
            };
            return (
              <div key={type} className={planPage.formGroup}>
                <CounterPill
                  label={meta[type].title}
                  subLabel={meta[type].hint}
                  value={formData[type]}
                  onIncrease={() => handleGuestChange(type, true)}
                  onDecrease={() => handleGuestChange(type, false)}
                />
              </div>
            );
          })}
        </div>
        <hr className={styles.divider} aria-hidden="true" />

        {/* ── Room Type ── */}
        <h3 className={styles.sectionTitle}>Type of Room</h3>
        <div className={styles.roomList}>
          {ROOM_TYPES.map((room) => {
            const count = formData.rooms[room.id];
            return (
              <div key={room.id} className={styles.roomRowWrapper}>
                <label className={`${styles.roomInfoBox} ${count > 0 ? styles.selected : ""}`}>
                  <div className={styles.roomTexts}>
                    <span className={styles.roomTitle}>{room.label}</span>
                    <span className={styles.roomSub}>{room.sub}</span>
                  </div>
                  <div className={styles.priceCol}>
                    <span className={styles.priceVal}>{room.price}</span>
                    <span className={styles.roomSub}>{room.per}</span>
                  </div>
                </label>
                <CounterPill
                  value={count}
                  onIncrease={() => handleRoomChange(room.id, true)}
                  onDecrease={() => handleRoomChange(room.id, false)}
                  className={styles.roomCounter}
                  pillOnly
                />
              </div>
            );
          })}
        </div>

        {/* Customize double rooms */}
        {formData.rooms.double > 0 && (
          <>
            <h3 className={styles.sectionTitle}>Customize Your Double Rooms ( {formData.rooms.double} selected )</h3>
            <div className={planPage.formGrid}>
              {Array.from({ length: formData.rooms.double }).map((_, i) => (
                <div key={i} className={planPage.formGroup}>
                  <label className={formStyles.fieldLabel}>Room {i + 1}</label>
                  <SelectDropdown id={`double-room-${i}`} options={ROOM_VIEW_OPTIONS} value="garden" onChange={() => {}} />
                </div>
              ))}
            </div>
          </>
        )}

        {/* Customize triple rooms */}
        {formData.rooms.triple > 0 && (
          <>
            <h3 className={styles.sectionTitle}>Customize Your Triple Rooms ( {formData.rooms.triple} selected )</h3>
            <div className={planPage.formGrid}>
              {Array.from({ length: formData.rooms.triple }).map((_, i) => (
                <div key={i} className={planPage.formGroup}>
                  <label className={formStyles.fieldLabel}>Room {i + 1}</label>
                  <SelectDropdown id={`triple-room-${i}`} options={ROOM_VIEW_OPTIONS} value="garden" onChange={() => {}} />
                </div>
              ))}
            </div>
          </>
        )}

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
        onContinue={onContinue}
        continueLabel="Continue"
      />
    </div>
  );
}

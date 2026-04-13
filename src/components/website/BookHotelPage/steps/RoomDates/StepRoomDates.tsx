import React from "react";
import {
  FormField,
  CustomDatePicker,
  RoomViewDropdown,
} from "@/components/shared";
import type { RoomViewOption } from "@/components/shared";
import planPage from "../../../PlanYourTripPage/PlanYourTripPage.module.scss";
import travelerStyles from "../../../PlanYourTripPage/steps/TravelerInfo/StepTravelerInfo.module.scss";
import formStyles from "@/components/shared/FormField/FormField.module.scss";
import styles from "./StepRoomDates.module.scss";
import { BookingData } from "../../BookHotelPage";
import { IconMinus, IconPlus } from "../../../PlanYourTripPage/PlanYourTripIcons";
import { Hotel } from "@/types";

const ROOM_VIEW_OPTIONS: RoomViewOption[] = [
  { label: "Garden View (Included)", value: "garden" },
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
                <div className={travelerStyles.numberFieldRow}>
                  <p className={travelerStyles.counterRowLabel} id={`rd-${type}-label`}>
                    <span className={travelerStyles.counterRowTitle}>{meta[type].title}</span>
                    <span className={travelerStyles.counterRowHint}>{meta[type].hint}</span>
                  </p>
                  <div className={travelerStyles.counterPill} role="group" aria-labelledby={`rd-${type}-label`}>
                    <button type="button" onClick={() => handleGuestChange(type, false)}
                      className={`${travelerStyles.counterPillButton} ${travelerStyles.counterPillButtonMinus}`}>
                      <IconMinus size={16} />
                    </button>
                    <span className={travelerStyles.counterPillValue}>{formData[type]}</span>
                    <button type="button" onClick={() => handleGuestChange(type, true)}
                      className={`${travelerStyles.counterPillButton} ${travelerStyles.counterPillButtonPlus}`}>
                      <IconPlus size={16} />
                    </button>
                  </div>
                </div>
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
                  <div className={styles.roomRadioGroup}>
                    <div className={`${styles.radioCircle} ${count > 0 ? styles.checked : ""}`}>
                      <input type="radio" name="roomType" checked={count > 0}
                        onChange={() => handleRoomChange(room.id, true)}
                        className={styles.radioInputHidden} />
                    </div>
                    <div className={styles.roomTexts}>
                      <span className={styles.roomTitle}>{room.label}</span>
                      <span className={styles.roomSub}>{room.sub}</span>
                    </div>
                  </div>
                  <div className={styles.priceCol}>
                    <span className={styles.priceVal}>{room.price}</span>
                    <span className={styles.roomSub}>{room.per}</span>
                  </div>
                </label>
                <div className={`${travelerStyles.counterPill} ${styles.roomCounter}`} role="group">
                  <button type="button" onClick={() => handleRoomChange(room.id, false)}
                    className={`${travelerStyles.counterPillButton} ${travelerStyles.counterPillButtonMinus}`}
                    style={{ opacity: count === 0 ? 0.4 : 1 }}>
                    <IconMinus size={16} />
                  </button>
                  <span className={travelerStyles.counterPillValue}>{count}</span>
                  <button type="button" onClick={() => handleRoomChange(room.id, true)}
                    className={`${travelerStyles.counterPillButton} ${travelerStyles.counterPillButtonPlus}`}>
                    <IconPlus size={16} />
                  </button>
                </div>
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
                  <RoomViewDropdown id={`double-room-${i}`} options={ROOM_VIEW_OPTIONS} value="garden" onChange={() => {}} />
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
                  <RoomViewDropdown id={`triple-room-${i}`} options={ROOM_VIEW_OPTIONS} value="garden" onChange={() => {}} />
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

      <hr className={planPage.stepFormCardDivider} aria-hidden="true" style={{ margin: "24px 0" }} />

      <div className={planPage.stepFormCardFooter}>
        <div className={planPage.formActions}>
          <button className={planPage.continueButton} onClick={onContinue} type="button" style={{ width: "100%" }}>
            Continue
          </button>
        </div>
      </div>
    </div>
  );
}

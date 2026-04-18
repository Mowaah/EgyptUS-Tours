"use client";

import {
  type KeyboardEvent as ReactKeyboardEvent,
  type MouseEvent as ReactMouseEvent,
  type ReactNode,
} from "react";

import { StarRating, SelectDropdown, MultiSelectDropdown } from "@/components/shared";
import CheckboxDropdown from "@/components/shared/CheckboxDropdown/CheckboxDropdown";

import {
  HOTEL_CATEGORY_OPTIONS,
  ROOM_TYPE_OPTIONS,
  type HotelCategoryOption,
} from "../../planYourTripData";
import planPage from "../../PlanYourTripPage.module.scss";
import styles from "./StepPreferences.module.scss";

type Preferences = {
  hotelCategory: string;
  roomType: string;
  transportation: string;
  experiences: string[];
};


function starsFromHotelValue(value: string): 3 | 4 | 5 | null {
  if (value === "5.0") return 5;
  if (value === "4.0") return 4;
  if (value === "3.0") return 3;
  return null;
}

export default function StepPreferences({
  preferences,
  transportOptions,
  experienceOptions,
  onSetPreferences,
  onPrevious,
  onContinue,
}: {
  preferences: Preferences;
  transportOptions: readonly string[];
  experienceOptions: readonly string[];
  onSetPreferences: (patch: Partial<Preferences>) => void;
  onPrevious: () => void;
  onContinue: () => void;
}) {

  const exp = preferences.experiences;

  return (
    <div className={planPage.stepFormCard}>
      <header className={planPage.stepFormCardHeader}>
        <div className={planPage.formHeaderColumn}>
          <h2 className={planPage.formTitle}>Travel Preferences</h2>
          <p className={planPage.formSubtitle}>Select your travel options to help us plan your trip.</p>
        </div>
      </header>

      <div className={planPage.stepFormCardScroll}>
        <div className={`${planPage.formGrid} ${styles.prefGrid}`}>
          <div className={planPage.formGroup}>
            <label id="pti-hotel-label" htmlFor="pti-hotel-trigger">
              Preferred hotel category
            </label>
            <SelectDropdown
              id="pti-hotel-trigger"
              options={HOTEL_CATEGORY_OPTIONS.map(opt => ({ ...opt, label: opt.value, value: opt.value }))}
              value={preferences.hotelCategory}
              onChange={(val) => onSetPreferences({ hotelCategory: val })}
              label="Select hotel category"
              renderValue={(v) => {
                const stars = starsFromHotelValue(v);
                return stars !== null ? (
                  <StarRating
                    className={styles.hotelCategoryStarRating}
                    filled={stars}
                    value={stars}
                    formatDisplayValue={(n) => n.toFixed(1)}
                    valueClassName={styles.hotelCategoryValue}
                    size={14}
                  />
                ) : (
                  <span className={styles.dropdownValue}>{v}</span>
                );
              }}
              renderOption={(opt) => (
                <span className={styles.prefOptionRow}>
                  {opt.starCount !== null ? (
                    <span className={styles.prefOptionListStar}>
                      <StarRating
                        filled={opt.starCount}
                        value={opt.starCount}
                        formatDisplayValue={(n) => n.toFixed(1)}
                        showValue
                        size={12}
                      />
                    </span>
                  ) : (
                    <span>{opt.value}</span>
                  )}
                </span>
              )}
            />
          </div>

          <div className={planPage.formGroup}>
            <label id="pti-room-label" htmlFor="pti-room-trigger">
              Ideal room type
            </label>
            <SelectDropdown
              id="pti-room-trigger"
              options={ROOM_TYPE_OPTIONS.map(opt => ({ label: opt, value: opt }))}
              value={preferences.roomType}
              onChange={(val) => onSetPreferences({ roomType: val })}
              label="Select room type"
            />
          </div>

          <div className={planPage.formGroup}>
            <label id="pti-transport-label" htmlFor="pti-transport-trigger">
              Transportation Preferences
            </label>
            <SelectDropdown
              id="pti-transport-trigger"
              options={transportOptions.map(opt => ({ label: opt, value: opt }))}
              value={preferences.transportation}
              onChange={(val) => onSetPreferences({ transportation: val })}
              label="Select Transportation"
            />
          </div>

          <div className={planPage.formGroup}>
            <label id="pti-experience-label" htmlFor="pti-experience-trigger">
              Enhance Your Experience
            </label>
            <MultiSelectDropdown
              id="pti-experience-trigger"
              options={experienceOptions.map(opt => ({ label: opt, value: opt }))}
              value={preferences.experiences}
              onChange={(val) => onSetPreferences({ experiences: val })}
              placeholder="Select Experiences"
            />
          </div>
        </div>
      </div>

      <hr className={planPage.stepFormCardDivider} aria-hidden="true" />

      <div className={planPage.stepFormCardFooter}>
        <div className={planPage.formActions}>
          <button className={planPage.previousButton} onClick={onPrevious} type="button">
            Previous
          </button>
          <button className={planPage.continueButton} onClick={onContinue} type="button">
            Continue
          </button>
        </div>
      </div>
    </div>
  );
}

"use client";

import {
  type KeyboardEvent as ReactKeyboardEvent,
  type MouseEvent as ReactMouseEvent,
  type ReactNode,
} from "react";

import { BookingStepFooter, StarRating, SelectDropdown, MultiSelectDropdown, FormField, CheckboxIndicator } from "@/components/shared";
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
  roomType: string[];
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
          <FormField
            id="pti-hotel-trigger"
            label="Preferred hotel category"
            required
          >
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
          </FormField>

          <FormField
            id="pti-room-trigger"
            label="Ideal room type"
            required
          >
            <MultiSelectDropdown
              id="pti-room-trigger"
              options={ROOM_TYPE_OPTIONS.map(opt => ({ label: opt, value: opt }))}
              value={preferences.roomType}
              onChange={(val) => onSetPreferences({ roomType: val })}
              placeholder="Select room types"
              checkboxStyle="radio"
            />
          </FormField>

          <FormField
            id="pti-transport-trigger"
            label="Transportation Preferences"
            required
          >
            <SelectDropdown
              id="pti-transport-trigger"
              options={transportOptions.map(opt => ({ label: opt, value: opt }))}
              value={preferences.transportation}
              onChange={(val) => onSetPreferences({ transportation: val })}
              label="Select Transportation"
            />
          </FormField>

          <FormField
            id="pti-experience-trigger"
            label="Enhance Your Experience"
            required
          >
            <MultiSelectDropdown
              id="pti-experience-trigger"
              options={experienceOptions.map(opt => ({ label: opt, value: opt }))}
              value={preferences.experiences}
              onChange={(val) => onSetPreferences({ experiences: val })}
              placeholder="Select Experiences"
            />
          </FormField>
        </div>
      </div>

      <BookingStepFooter
        onPrevious={onPrevious}
        onContinue={onContinue}
        continueLabel="Continue"
      />
    </div>
  );
}

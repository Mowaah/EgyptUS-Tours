"use client";

import {
  BookingStepFooter,
  StarRating,
  SelectDropdown,
  MultiSelectDropdown,
  FormField,
} from "@/components/shared";

import {
  HOTEL_CATEGORY_OPTIONS,
  ROOM_TYPE_OPTIONS,
  TRIP_CATEGORY_OPTIONS,
  DURATION_OPTIONS,
  BUDGET_OPTIONS,
  ACTIVITIES_OPTIONS,
  CONTACT_METHOD_OPTIONS,
  TRANSPORT_OPTIONS,
  EXPERIENCE_OPTIONS,
} from "../../planYourTripData";
import planPage from "../../PlanYourTripPage.module.scss";
import styles from "./StepPreferences.module.scss";

type Preferences = {
  tripCategory: string[];
  duration: string;
  budget: string;
  hotelCategory: string;
  roomType: string[];
  transportation: string;
  experiences: string[];
  activities: string[];
  contactMethod: string;
};

function starsFromHotelValue(value: string): 3 | 4 | 5 | null {
  if (value === "5.0") return 5;
  if (value === "4.0") return 4;
  if (value === "3.0") return 3;
  return null;
}

export default function StepPreferences({
  preferences,
  onSetPreferences,
  tripDetails,
  onTripDetailsChange,
  onPrevious,
  onContinue,
}: {
  preferences: Preferences;
  onSetPreferences: (patch: Partial<Preferences>) => void;
  tripDetails: string;
  onTripDetailsChange: (val: string) => void;
  onPrevious: () => void;
  onContinue: () => void;
}) {
  return (
    <div className={planPage.stepFormCard}>
      <header className={planPage.stepFormCardHeader}>
        <div className={planPage.formHeaderColumn}>
          <h2 className={planPage.formTitle}>Trip Details & Preferences</h2>
          <p className={planPage.formSubtitle}>Select your travel options to help us plan your trip.</p>
        </div>
      </header>

      <div className={planPage.stepFormCardScroll}>
        <div className={`${planPage.formGrid} ${styles.prefGrid}`}>
          <FormField
            id="pti-trip-category-trigger"
            label="Trip category"
            required
          >
            <MultiSelectDropdown
              id="pti-trip-category-trigger"
              options={TRIP_CATEGORY_OPTIONS.map(opt => ({ label: opt, value: opt }))}
              value={preferences.tripCategory}
              onChange={(val) => onSetPreferences({ tripCategory: val })}
              placeholder="Select Trip Category"
              checkboxStyle="radio"
            />
          </FormField>

          <FormField
            id="pti-duration-trigger"
            label="Number of Days"
            required
          >
            <SelectDropdown
              id="pti-duration-trigger"
              options={DURATION_OPTIONS.map(opt => ({ label: opt, value: opt }))}
              value={preferences.duration}
              onChange={(val) => onSetPreferences({ duration: val })}
              label="Select Duration"
            />
          </FormField>

          <FormField
            id="pti-budget-trigger"
            label="Budget"
            required
          >
            <SelectDropdown
              id="pti-budget-trigger"
              options={BUDGET_OPTIONS.map(opt => ({ label: opt, value: opt }))}
              value={preferences.budget}
              onChange={(val) => onSetPreferences({ budget: val })}
              label="Select Budget"
            />
          </FormField>

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
              options={TRANSPORT_OPTIONS.map(opt => ({ label: opt, value: opt }))}
              value={preferences.transportation}
              onChange={(val) => onSetPreferences({ transportation: val })}
              label="Select Transportation"
            />
          </FormField>

          <FormField
            id="pti-experience-trigger"
            label="Additional Experiences"
            required
          >
            <MultiSelectDropdown
              id="pti-experience-trigger"
              options={EXPERIENCE_OPTIONS.map(opt => ({ label: opt, value: opt }))}
              value={preferences.experiences}
              onChange={(val) => onSetPreferences({ experiences: val })}
              placeholder="Select Experiences"
              checkboxStyle="checkbox"
            />
          </FormField>

          <FormField
            id="pti-activities-trigger"
            label="Activities"
          >
            <MultiSelectDropdown
              id="pti-activities-trigger"
              options={ACTIVITIES_OPTIONS.map(opt => ({ label: opt, value: opt }))}
              value={preferences.activities}
              onChange={(val) => onSetPreferences({ activities: val })}
              placeholder="Select Activities"
              checkboxStyle="checkbox"
            />
          </FormField>

          <FormField
            id="pti-contact-trigger"
            label="Preferred Contact Method"
            required
          >
            <SelectDropdown
              id="pti-contact-trigger"
              options={CONTACT_METHOD_OPTIONS.map(opt => ({ label: opt, value: opt }))}
              value={preferences.contactMethod}
              onChange={(val) => onSetPreferences({ contactMethod: val })}
              label="Select Contact Method"
            />
          </FormField>

          <FormField
            id="pti-details"
            label="Special Requests"
            isTextarea
            wrapperClassName={planPage.formGroupFull}
            placeholder="Honeymoon room setup, vegetarian meals, airport fast-track assistance, etc."
            value={tripDetails}
            onChange={(e) => onTripDetailsChange(e.target.value)}
            rows={4}
          />
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

"use client";

import { useState } from "react";
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
  availableCategories = [],
}: {
  preferences: Preferences;
  onSetPreferences: (patch: Partial<Preferences>) => void;
  tripDetails: string;
  onTripDetailsChange: (val: string) => void;
  onPrevious: () => void;
  onContinue: () => void;
  availableCategories?: string[];
}) {
  const [showErrors, setShowErrors] = useState(false);

  const handleContinueClick = () => {
    setShowErrors(true);
    const isValid =
      preferences.tripCategory.length > 0 &&
      preferences.duration !== "" &&
      preferences.budget !== "" &&
      preferences.hotelCategory !== "" &&
      preferences.roomType.length > 0 &&
      preferences.transportation !== "" &&
      preferences.contactMethod !== "";

    if (isValid) {
      onContinue();
    }
  };

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
            error={showErrors && preferences.tripCategory.length === 0 ? "This field is required" : undefined}
          >
            <MultiSelectDropdown
              id="pti-trip-category-trigger"
              options={availableCategories.map(opt => ({ label: opt, value: opt }))}
              value={preferences.tripCategory}
              onChange={(val) => onSetPreferences({ tripCategory: val })}
              placeholder="Select Trip Category"
              checkboxStyle="radio"
              error={showErrors && preferences.tripCategory.length === 0}
            />
          </FormField>

          <FormField
            id="pti-duration-trigger"
            label="Number of Days"
            required
            error={showErrors && preferences.duration === "" ? "This field is required" : undefined}
          >
            <SelectDropdown
              id="pti-duration-trigger"
              options={DURATION_OPTIONS.map(opt => ({ label: opt, value: opt }))}
              value={preferences.duration}
              onChange={(val) => onSetPreferences({ duration: val })}
              label="Select Duration"
              error={showErrors && preferences.duration === ""}
            />
          </FormField>

          <FormField
            id="pti-budget-trigger"
            label="Budget"
            required
            error={showErrors && preferences.budget === "" ? "This field is required" : undefined}
          >
            <SelectDropdown
              id="pti-budget-trigger"
              options={BUDGET_OPTIONS.map(opt => ({ label: opt, value: opt }))}
              value={preferences.budget}
              onChange={(val) => onSetPreferences({ budget: val })}
              label="Select Budget"
              error={showErrors && preferences.budget === ""}
            />
          </FormField>

          <FormField
            id="pti-hotel-trigger"
            label="Preferred hotel category"
            required
            error={showErrors && preferences.hotelCategory === "" ? "This field is required" : undefined}
          >
            <SelectDropdown
              id="pti-hotel-trigger"
              options={HOTEL_CATEGORY_OPTIONS.map(opt => ({ ...opt, label: opt.value, value: opt.value }))}
              value={preferences.hotelCategory}
              onChange={(val) => onSetPreferences({ hotelCategory: val })}
              label="Select hotel category"
              error={showErrors && preferences.hotelCategory === ""}
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
                        valueClassName={styles.hotelCategoryValue}
                        size={12}
                      />
                    </span>
                  ) : (
                    <span className={styles.dropdownValue}>{opt.value}</span>
                  )}
                </span>
              )}
            />
          </FormField>

          <FormField
            id="pti-room-trigger"
            label="Ideal room type"
            required
            error={showErrors && preferences.roomType.length === 0 ? "This field is required" : undefined}
          >
            <MultiSelectDropdown
              id="pti-room-trigger"
              options={ROOM_TYPE_OPTIONS.map(opt => ({ label: opt, value: opt }))}
              value={preferences.roomType}
              onChange={(val) => onSetPreferences({ roomType: val })}
              placeholder="Select room types"
              checkboxStyle="radio"
              error={showErrors && preferences.roomType.length === 0}
            />
          </FormField>

          <FormField
            id="pti-transport-trigger"
            label="Transportation Preferences"
            required
            error={showErrors && preferences.transportation === "" ? "This field is required" : undefined}
          >
            <SelectDropdown
              id="pti-transport-trigger"
              options={TRANSPORT_OPTIONS.map(opt => ({ label: opt, value: opt }))}
              value={preferences.transportation}
              onChange={(val) => onSetPreferences({ transportation: val })}
              label="Select Transportation"
              error={showErrors && preferences.transportation === ""}
            />
          </FormField>

          <FormField
            id="pti-experience-trigger"
            label="Additional Experiences"
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
            error={showErrors && preferences.contactMethod === "" ? "This field is required" : undefined}
          >
            <SelectDropdown
              id="pti-contact-trigger"
              options={CONTACT_METHOD_OPTIONS.map(opt => ({ label: opt, value: opt }))}
              value={preferences.contactMethod}
              onChange={(val) => onSetPreferences({ contactMethod: val })}
              label="Select Contact Method"
              error={showErrors && preferences.contactMethod === ""}
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
        onContinue={handleContinueClick}
        continueLabel="Continue"
      />
    </div>
  );
}

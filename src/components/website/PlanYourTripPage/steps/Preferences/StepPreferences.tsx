"use client";

import {
  type KeyboardEvent as ReactKeyboardEvent,
  type MouseEvent as ReactMouseEvent,
  type ReactNode,
} from "react";

import { StarRating } from "@/components/shared";
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

function Chevron({ open }: { open: boolean }) {
  return (
    <svg
      className={`${styles.multiSelectChevron} ${open ? styles.multiSelectChevronOpen : ""}`}
      width={12}
      height={8}
      viewBox="0 0 10 6"
      fill="none"
      aria-hidden
    >
      <path d="M1 1l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function starsFromHotelValue(value: string): 3 | 4 | 5 | null {
  if (value === "5.0") return 5;
  if (value === "4.0") return 4;
  if (value === "3.0") return 3;
  return null;
}

function ClearIcon() {
  return (
    <img
      src="/images/x-close.svg"
      alt=""
      width={12}
      height={12}
      className={styles.clearIcon}
    />
  );
}

function Cluster({
  hasValue,
  showClear,
  clearLabel,
  onClear,
  children,
}: {
  hasValue: boolean;
  showClear: boolean;
  clearLabel: string;
  onClear: () => void;
  children: ReactNode;
}) {
  return (
    <div
      className={styles.prefTriggerValueCluster}
      {...(hasValue ? { "data-pref-has-value": "" } : {})}
    >
      <div className={styles.prefTriggerMain}>{children}</div>
      {showClear ? (
        <button
          type="button"
          data-pref-clear
          className={styles.prefClear}
          aria-label={clearLabel}
          onClick={(e) => {
            e.stopPropagation();
            onClear();
          }}
        >
          <ClearIcon />
        </button>
      ) : null}
    </div>
  );
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

  const v = preferences.hotelCategory;
  const hotelStars = starsFromHotelValue(v);
  const hotelTrigger =
    hotelStars !== null ? (
      <StarRating
        className={styles.hotelCategoryStarRating}
        filled={hotelStars}
        value={hotelStars}
        formatDisplayValue={(n) => n.toFixed(1)}
        valueClassName={styles.hotelCategoryValue}
        size={14}
      />
    ) : v ? (
      <span className={styles.prefTriggerValue}>{v}</span>
    ) : (
      <span className={styles.multiSelectPlaceholder}>Select hotel category</span>
    );

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
            <CheckboxDropdown
              options={HOTEL_CATEGORY_OPTIONS.map(opt => ({ ...opt, label: opt.value, value: opt.value }))}
              value={preferences.hotelCategory}
              onChange={(val) => onSetPreferences({ hotelCategory: val })}
              dropdownClassName={styles.prefPanel}
              checkboxStyle="radio"
              renderTrigger={(isOpen, setIsOpen) => (
                <div
                  id="pti-hotel-trigger"
                  className={`${styles.prefTrigger} ${isOpen ? styles.prefTriggerOpen : ""}`}
                  role="combobox"
                  aria-expanded={isOpen}
                  aria-controls="pti-hotel-listbox"
                  aria-labelledby="pti-hotel-label"
                  tabIndex={0}
                  onClick={(e) => {
                    if ((e.target as HTMLElement).closest("[data-pref-clear]")) return;
                    setIsOpen(!isOpen);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      setIsOpen(!isOpen);
                    }
                  }}
                >
                  <Cluster
                    hasValue={!!preferences.hotelCategory}
                    showClear={isOpen && !!preferences.hotelCategory}
                    clearLabel="Clear hotel category"
                    onClear={() => onSetPreferences({ hotelCategory: "" })}
                  >
                    {hotelTrigger}
                  </Cluster>
                  <Chevron open={isOpen} />
                </div>
              )}
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
            <CheckboxDropdown
              options={ROOM_TYPE_OPTIONS.map(opt => ({ label: opt, value: opt }))}
              value={preferences.roomType}
              onChange={(val) => onSetPreferences({ roomType: val })}
              dropdownClassName={styles.prefPanel}
              checkboxStyle="radio"
              renderTrigger={(isOpen, setIsOpen) => (
                <div
                  id="pti-room-trigger"
                  className={`${styles.prefTrigger} ${isOpen ? styles.prefTriggerOpen : ""}`}
                  role="combobox"
                  aria-expanded={isOpen}
                  aria-controls="pti-room-listbox"
                  aria-labelledby="pti-room-label"
                  tabIndex={0}
                  onClick={(e) => {
                    if ((e.target as HTMLElement).closest("[data-pref-clear]")) return;
                    setIsOpen(!isOpen);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      setIsOpen(!isOpen);
                    }
                  }}
                >
                  <Cluster
                    hasValue={!!preferences.roomType}
                    showClear={isOpen && !!preferences.roomType}
                    clearLabel="Clear room type"
                    onClear={() => onSetPreferences({ roomType: "" })}
                  >
                    {preferences.roomType ? (
                      <span className={styles.prefTriggerValue}>{preferences.roomType}</span>
                    ) : (
                      <span className={styles.multiSelectPlaceholder}>Select room type</span>
                    )}
                  </Cluster>
                  <Chevron open={isOpen} />
                </div>
              )}
            />
          </div>

          <div className={planPage.formGroup}>
            <label id="pti-transport-label" htmlFor="pti-transport-trigger">
              Transportation Preferences
            </label>
            <CheckboxDropdown
              options={transportOptions.map(opt => ({ label: opt, value: opt }))}
              value={preferences.transportation}
              onChange={(val) => onSetPreferences({ transportation: val })}
              dropdownClassName={styles.prefPanel}
              checkboxStyle="radio"
              renderTrigger={(isOpen, setIsOpen) => (
                <div
                  id="pti-transport-trigger"
                  className={`${styles.prefTrigger} ${isOpen ? styles.prefTriggerOpen : ""}`}
                  role="combobox"
                  aria-expanded={isOpen}
                  aria-controls="pti-transport-listbox"
                  aria-labelledby="pti-transport-label"
                  tabIndex={0}
                  onClick={(e) => {
                    if ((e.target as HTMLElement).closest("[data-pref-clear]")) return;
                    setIsOpen(!isOpen);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      setIsOpen(!isOpen);
                    }
                  }}
                >
                  <Cluster
                    hasValue={!!preferences.transportation}
                    showClear={isOpen && !!preferences.transportation}
                    clearLabel="Clear transportation"
                    onClear={() => onSetPreferences({ transportation: "" })}
                  >
                    {preferences.transportation ? (
                      <span className={styles.prefTriggerValue}>{preferences.transportation}</span>
                    ) : (
                      <span className={styles.multiSelectPlaceholder}>Select Transportation</span>
                    )}
                  </Cluster>
                  <Chevron open={isOpen} />
                </div>
              )}
            />
          </div>

          <div className={planPage.formGroup}>
            <label id="pti-experience-label" htmlFor="pti-experience-trigger">
              Enhance Your Experience
            </label>
            <CheckboxDropdown
              options={experienceOptions.map(opt => ({ label: opt, value: opt }))}
              value={preferences.experiences}
              onChange={(val) => onSetPreferences({ experiences: val })}
              multiple={true}
              dropdownClassName={styles.prefPanel}
              checkboxStyle="checkbox"
              renderTrigger={(isOpen, setIsOpen) => (
                <div
                  id="pti-experience-trigger"
                  className={`${styles.prefTrigger} ${isOpen ? styles.prefTriggerOpen : ""}`}
                  role="combobox"
                  aria-expanded={isOpen}
                  aria-controls="pti-experience-listbox"
                  aria-labelledby="pti-experience-label"
                  title={exp.length > 0 ? exp.join(", ") : undefined}
                  tabIndex={0}
                  onClick={(e) => {
                    if ((e.target as HTMLElement).closest("[data-experience-chip-clear]")) return;
                    setIsOpen(!isOpen);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      setIsOpen(!isOpen);
                    }
                  }}
                >
                  <div
                    className={`${styles.prefTriggerValueCluster}${
                      isOpen && exp.length > 0 ? ` ${styles.prefTriggerValueClusterMultiline}` : ""
                    }`}
                  >
                    <div
                      className={`${styles.prefTriggerMain}${
                        isOpen && exp.length > 0 ? ` ${styles.prefTriggerMainMultiline}` : ""
                      }`}
                    >
                      {exp.length === 0 ? (
                        <span className={styles.multiSelectPlaceholder}>Select Experiences</span>
                      ) : isOpen ? (
                        <div className={styles.experienceChipList}>
                          {exp.map((item) => (
                            <span key={item} className={styles.experienceChip}>
                              <span className={styles.experienceChipLabel}>{item}</span>
                              <button
                                type="button"
                                className={styles.experienceChipClear}
                                data-experience-chip-clear
                                aria-label={`Remove ${item}`}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onSetPreferences({
                                    experiences: exp.filter((x) => x !== item),
                                  });
                                }}
                              >
                                <ClearIcon />
                              </button>
                            </span>
                          ))}
                        </div>
                      ) : (
                        <div className={styles.experienceSummary}>
                          <span className={styles.experienceSummaryFirst}>{exp[0]}</span>
                          {exp.length > 1 ? (
                            <span className={styles.experienceMoreBadge}>+{exp.length - 1}</span>
                          ) : null}
                        </div>
                      )}
                    </div>
                  </div>
                  <Chevron open={isOpen} />
                </div>
              )}
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

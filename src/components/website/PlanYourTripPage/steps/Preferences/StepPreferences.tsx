"use client";

import {
  useEffect,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
  type MouseEvent as ReactMouseEvent,
  type ReactNode,
} from "react";

import { StarRating } from "@/components/shared";

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

const OPEN0 = { hotel: false, room: false, transport: false, experience: false };
type OpenKey = keyof typeof OPEN0;

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
  const [open, setOpen] = useState(OPEN0);
  const box = useRef<Record<OpenKey, HTMLDivElement | null>>({
    hotel: null,
    room: null,
    transport: null,
    experience: null,
  });

  const toggle = (k: OpenKey) =>
    setOpen((o) => ({ ...OPEN0, [k]: !o[k] }));

  const tProps = (clearSel: string, k: OpenKey) => ({
    onClick: (e: ReactMouseEvent) => {
      if ((e.target as HTMLElement).closest(clearSel)) return;
      toggle(k);
    },
    onKeyDown: (e: ReactKeyboardEvent) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        toggle(k);
      }
    },
  });

  const toggleInArray = (arr: string[], value: string) =>
    arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value];

  useEffect(() => {
    if (!Object.values(open).some(Boolean)) return;
    const ptr = (e: PointerEvent) => {
      const t = e.target as Node;
      (Object.keys(open) as OpenKey[]).forEach((k) => {
        if (!open[k]) return;
        const el = box.current[k];
        if (el && !el.contains(t)) setOpen((o) => ({ ...o, [k]: false }));
      });
    };
    const esc = (e: globalThis.KeyboardEvent) => {
      if (e.key === "Escape") setOpen(OPEN0);
    };
    document.addEventListener("pointerdown", ptr);
    document.addEventListener("keydown", esc);
    return () => {
      document.removeEventListener("pointerdown", ptr);
      document.removeEventListener("keydown", esc);
    };
  }, [open]);

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

  const pickHotel = (opt: HotelCategoryOption) => {
    onSetPreferences({ hotelCategory: opt.value });
    setOpen((o) => ({ ...o, hotel: false }));
  };

  const optRow = (key: string, label: string, sel: boolean, onPick: () => void) => (
    <button
      key={key}
      type="button"
      className={`${styles.prefOption} ${sel ? styles.prefOptionSelected : ""}`}
      role="option"
      aria-selected={sel}
      onClick={onPick}
    >
      <span
        className={`${styles.prefOptionRadio} ${sel ? styles.prefOptionRadioSelected : ""}`}
        aria-hidden
      />
      <span className={styles.prefOptionRow}>{label}</span>
    </button>
  );

  const experienceOptRow = (opt: string, sel: boolean, onPick: () => void) => (
    <button
      key={opt}
      type="button"
      className={`${styles.prefOption} ${sel ? styles.prefOptionSelected : ""}`}
      role="option"
      aria-selected={sel}
      onClick={onPick}
    >
      <span
        className={`${styles.prefOptionCheckbox} ${sel ? styles.prefOptionCheckboxSelected : ""}`}
        aria-hidden
      />
      <span className={styles.prefOptionRow}>{opt}</span>
    </button>
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
            <div className={styles.prefDropdown} ref={(el) => { box.current.hotel = el; }}>
              <div
                id="pti-hotel-trigger"
                className={`${styles.prefTrigger} ${open.hotel ? styles.prefTriggerOpen : ""}`}
                role="combobox"
                aria-expanded={open.hotel}
                aria-controls="pti-hotel-listbox"
                aria-labelledby="pti-hotel-label"
                tabIndex={0}
                {...tProps("[data-pref-clear]", "hotel")}
              >
                <Cluster
                  hasValue={!!preferences.hotelCategory}
                  showClear={open.hotel && !!preferences.hotelCategory}
                  clearLabel="Clear hotel category"
                  onClear={() => onSetPreferences({ hotelCategory: "" })}
                >
                  {hotelTrigger}
                </Cluster>
                <Chevron open={open.hotel} />
              </div>
              {open.hotel && (
                <div
                  id="pti-hotel-listbox"
                  className={styles.prefPanel}
                  role="listbox"
                  aria-labelledby="pti-hotel-label"
                >
                  {HOTEL_CATEGORY_OPTIONS.map((opt) => {
                    const sel = preferences.hotelCategory === opt.value;
                    return (
                      <button
                        key={opt.value}
                        type="button"
                        className={`${styles.prefOption} ${sel ? styles.prefOptionSelected : ""}`}
                        role="option"
                        aria-selected={sel}
                        onClick={() => pickHotel(opt)}
                      >
                        <span
                          className={`${styles.prefOptionRadio} ${sel ? styles.prefOptionRadioSelected : ""}`}
                          aria-hidden
                        />
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
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          <div className={planPage.formGroup}>
            <label id="pti-room-label" htmlFor="pti-room-trigger">
              Ideal room type
            </label>
            <div className={styles.prefDropdown} ref={(el) => { box.current.room = el; }}>
              <div
                id="pti-room-trigger"
                className={`${styles.prefTrigger} ${open.room ? styles.prefTriggerOpen : ""}`}
                role="combobox"
                aria-expanded={open.room}
                aria-controls="pti-room-listbox"
                aria-labelledby="pti-room-label"
                tabIndex={0}
                {...tProps("[data-pref-clear]", "room")}
              >
                <Cluster
                  hasValue={!!preferences.roomType}
                  showClear={open.room && !!preferences.roomType}
                  clearLabel="Clear room type"
                  onClear={() => onSetPreferences({ roomType: "" })}
                >
                  {preferences.roomType ? (
                    <span className={styles.prefTriggerValue}>{preferences.roomType}</span>
                  ) : (
                    <span className={styles.multiSelectPlaceholder}>Select room type</span>
                  )}
                </Cluster>
                <Chevron open={open.room} />
              </div>
              {open.room && (
                <div
                  id="pti-room-listbox"
                  className={styles.prefPanel}
                  role="listbox"
                  aria-labelledby="pti-room-label"
                >
                  {ROOM_TYPE_OPTIONS.map((opt) =>
                    optRow(opt, opt, preferences.roomType === opt, () => {
                      onSetPreferences({ roomType: opt });
                      setOpen(OPEN0);
                    }),
                  )}
                </div>
              )}
            </div>
          </div>

          <div className={planPage.formGroup}>
            <label id="pti-transport-label" htmlFor="pti-transport-trigger">
              Transportation Preferences
            </label>
            <div className={styles.prefDropdown} ref={(el) => { box.current.transport = el; }}>
              <div
                id="pti-transport-trigger"
                className={`${styles.prefTrigger} ${open.transport ? styles.prefTriggerOpen : ""}`}
                role="combobox"
                aria-expanded={open.transport}
                aria-controls="pti-transport-listbox"
                aria-labelledby="pti-transport-label"
                tabIndex={0}
                {...tProps("[data-pref-clear]", "transport")}
              >
                <Cluster
                  hasValue={!!preferences.transportation}
                  showClear={open.transport && !!preferences.transportation}
                  clearLabel="Clear transportation"
                  onClear={() => onSetPreferences({ transportation: "" })}
                >
                  {preferences.transportation ? (
                    <span className={styles.prefTriggerValue}>{preferences.transportation}</span>
                  ) : (
                    <span className={styles.multiSelectPlaceholder}>Select Transportation</span>
                  )}
                </Cluster>
                <Chevron open={open.transport} />
              </div>
              {open.transport && (
                <div
                  id="pti-transport-listbox"
                  className={styles.prefPanel}
                  role="listbox"
                  aria-labelledby="pti-transport-label"
                >
                  {transportOptions.map((opt) =>
                    optRow(opt, opt, preferences.transportation === opt, () => {
                      onSetPreferences({ transportation: opt });
                      setOpen((o) => ({ ...o, transport: false }));
                    }),
                  )}
                </div>
              )}
            </div>
          </div>

          <div className={planPage.formGroup}>
            <label id="pti-experience-label" htmlFor="pti-experience-trigger">
              Enhance Your Experience
            </label>
            <div className={styles.prefDropdown} ref={(el) => { box.current.experience = el; }}>
              <div
                id="pti-experience-trigger"
                className={`${styles.prefTrigger} ${open.experience ? styles.prefTriggerOpen : ""}`}
                role="combobox"
                aria-expanded={open.experience}
                aria-controls="pti-experience-listbox"
                aria-labelledby="pti-experience-label"
                title={exp.length > 0 ? exp.join(", ") : undefined}
                tabIndex={0}
                {...tProps("[data-experience-chip-clear]", "experience")}
              >
                <div
                  className={`${styles.prefTriggerValueCluster}${
                    open.experience && exp.length > 0 ? ` ${styles.prefTriggerValueClusterMultiline}` : ""
                  }`}
                >
                  <div
                    className={`${styles.prefTriggerMain}${
                      open.experience && exp.length > 0 ? ` ${styles.prefTriggerMainMultiline}` : ""
                    }`}
                  >
                    {exp.length === 0 ? (
                      <span className={styles.multiSelectPlaceholder}>Select Experiences</span>
                    ) : open.experience ? (
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
                <Chevron open={open.experience} />
              </div>
              {open.experience && (
                <div
                  id="pti-experience-listbox"
                  className={styles.prefPanel}
                  role="listbox"
                  aria-labelledby="pti-experience-label"
                  aria-multiselectable="true"
                >
                  {experienceOptions.map((opt) => {
                    const sel = preferences.experiences.includes(opt);
                    return experienceOptRow(opt, sel, () =>
                      onSetPreferences({ experiences: toggleInArray(preferences.experiences, opt) }),
                    );
                  })}
                </div>
              )}
            </div>
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

"use client";

import Image from "next/image";

import pageStyles from "../../PlanYourTripPage.module.scss";
import styles from "./StepTravelerInfo.module.scss";

type TravelerInfo = {
  name: string;
  email: string;
  phone: string;
  nationality: string;
  startDate: string;
  endDate: string;
  adults: number;
  children: number;
  infants: number;
  tripDetails: string;
};

function PhoneChevron() {
  return (
    <svg width={10} height={6} viewBox="0 0 10 6" fill="none" aria-hidden="true">
      <path
        d="M1 1l4 4 4-4"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

export default function StepTravelerInfo({
  travelerInfo,
  onTravelerChange,
  onNumberChange,
  onPrevious,
  onContinue,
  IconMinus,
  IconPlus,
}: {
  travelerInfo: TravelerInfo;
  onTravelerChange: <K extends keyof TravelerInfo>(field: K, value: TravelerInfo[K]) => void;
  onNumberChange: (field: "adults" | "children" | "infants", inc: boolean) => void;
  onPrevious: () => void;
  onContinue: () => void;
  IconMinus: (props: { size?: number; className?: string }) => React.ReactNode;
  IconPlus: (props: { size?: number; className?: string }) => React.ReactNode;
}) {
  return (
    <div className={pageStyles.stepFormCard}>
      <header className={pageStyles.stepFormCardHeader}>
        <div className={pageStyles.formHeaderColumn}>
          <h2 className={pageStyles.formTitle}>Traveler Information</h2>
          <p className={pageStyles.formSubtitle}>
            Please provide your personal details so we can tailor your journey perfectly.
          </p>
        </div>
      </header>

      <div className={pageStyles.stepFormCardScroll}>
        <div className={pageStyles.formGrid}>
          <div className={pageStyles.formGroup}>
            <label htmlFor="pti-name">Enter your Name</label>
            <input
              id="pti-name"
              className={pageStyles.formInput}
              type="text"
              placeholder="John Doe"
              value={travelerInfo.name}
              onChange={(e) => onTravelerChange("name", e.target.value)}
            />
          </div>

          <div className={pageStyles.formGroup}>
            <label htmlFor="pti-email">Enter your E-mail</label>
            <input
              id="pti-email"
              className={pageStyles.formInput}
              type="email"
              placeholder="example@gmail.com"
              value={travelerInfo.email}
              onChange={(e) => onTravelerChange("email", e.target.value)}
            />
          </div>

          <div className={pageStyles.formGroup}>
            <label htmlFor="pti-phone">Enter your Phone Number</label>
            <div className={styles.phoneRow}>
              <div className={styles.phonePrefix} aria-hidden="true">
                <Image src="/images/en.svg" alt="" width={20} height={14} />
                <span>+1</span>
                <PhoneChevron />
              </div>
              <input
                id="pti-phone"
                className={`${pageStyles.formInput} ${styles.inputPhone}`}
                type="tel"
                placeholder="000-0000"
                value={travelerInfo.phone}
                onChange={(e) => onTravelerChange("phone", e.target.value)}
              />
            </div>
          </div>

          <div className={pageStyles.formGroup}>
            <label htmlFor="pti-nationality">Select Your Nationality</label>
            <select
              id="pti-nationality"
              className={pageStyles.formInput}
              value={travelerInfo.nationality}
              onChange={(e) => onTravelerChange("nationality", e.target.value)}
            >
              <option value="">Your Nationality</option>
              <option value="US">United States</option>
              <option value="UK">United Kingdom</option>
              <option value="CA">Canada</option>
              <option value="AU">Australia</option>
              <option value="EG">Egypt</option>
              <option value="AE">United Arab Emirates</option>
            </select>
          </div>

          <div className={pageStyles.formGroup}>
            <label htmlFor="pti-start">Start Date</label>
            <input
              id="pti-start"
              className={pageStyles.formInput}
              type="date"
              value={travelerInfo.startDate}
              onChange={(e) => onTravelerChange("startDate", e.target.value)}
            />
          </div>

          <div className={pageStyles.formGroup}>
            <label htmlFor="pti-end">End Date</label>
            <input
              id="pti-end"
              className={pageStyles.formInput}
              type="date"
              value={travelerInfo.endDate}
              onChange={(e) => onTravelerChange("endDate", e.target.value)}
            />
          </div>

          <div className={pageStyles.formGroup}>
            <div className={styles.numberFieldRow}>
              <p className={styles.counterRowLabel} id="pti-adults-label">
                <span className={styles.counterRowTitle}>No of Adults</span>
                <span className={styles.counterRowHint}>( +12 years )</span>
              </p>
              <div
                className={styles.counterPill}
                role="group"
                aria-labelledby="pti-adults-label"
              >
                <button
                  type="button"
                  onClick={() => onNumberChange("adults", false)}
                  className={`${styles.counterPillButton} ${styles.counterPillButtonMinus}`}
                  aria-label="Decrease adults"
                >
                  <IconMinus size={16} />
                </button>
                <span className={styles.counterPillValue}>{travelerInfo.adults}</span>
                <button
                  type="button"
                  onClick={() => onNumberChange("adults", true)}
                  className={`${styles.counterPillButton} ${styles.counterPillButtonPlus}`}
                  aria-label="Increase adults"
                >
                  <IconPlus size={16} />
                </button>
              </div>
            </div>
          </div>

          <div className={pageStyles.formGroup}>
            <div className={styles.numberFieldRow}>
              <p className={styles.counterRowLabel} id="pti-children-label">
                <span className={styles.counterRowTitle}>No of Children</span>
                <span className={styles.counterRowHint}>( 2 to 11 years )</span>
              </p>
              <div
                className={styles.counterPill}
                role="group"
                aria-labelledby="pti-children-label"
              >
                <button
                  type="button"
                  onClick={() => onNumberChange("children", false)}
                  className={`${styles.counterPillButton} ${styles.counterPillButtonMinus}`}
                  aria-label="Decrease children"
                >
                  <IconMinus size={16} />
                </button>
                <span className={styles.counterPillValue}>{travelerInfo.children}</span>
                <button
                  type="button"
                  onClick={() => onNumberChange("children", true)}
                  className={`${styles.counterPillButton} ${styles.counterPillButtonPlus}`}
                  aria-label="Increase children"
                >
                  <IconPlus size={16} />
                </button>
              </div>
            </div>
          </div>

          <div className={pageStyles.formGroup}>
            <div className={styles.numberFieldRow}>
              <p className={styles.counterRowLabel} id="pti-infants-label">
                <span className={styles.counterRowTitle}>No of Infants</span>
                <span className={styles.counterRowHint}>( 0 to 2 years )</span>
              </p>
              <div
                className={styles.counterPill}
                role="group"
                aria-labelledby="pti-infants-label"
              >
                <button
                  type="button"
                  onClick={() => onNumberChange("infants", false)}
                  className={`${styles.counterPillButton} ${styles.counterPillButtonMinus}`}
                  aria-label="Decrease infants"
                >
                  <IconMinus size={16} />
                </button>
                <span className={styles.counterPillValue}>{travelerInfo.infants}</span>
                <button
                  type="button"
                  onClick={() => onNumberChange("infants", true)}
                  className={`${styles.counterPillButton} ${styles.counterPillButtonPlus}`}
                  aria-label="Increase infants"
                >
                  <IconPlus size={16} />
                </button>
              </div>
            </div>
          </div>

          <div className={pageStyles.formGroupFull}>
            <label htmlFor="pti-details">Trip Details</label>
            <textarea
              id="pti-details"
              className={styles.formTextarea}
              placeholder="Share your trip details"
              value={travelerInfo.tripDetails}
              onChange={(e) => onTravelerChange("tripDetails", e.target.value)}
              rows={4}
            />
          </div>
        </div>
      </div>

      <hr className={pageStyles.stepFormCardDivider} aria-hidden="true" />

      <div className={pageStyles.stepFormCardFooter}>
        <div className={pageStyles.formActions}>
          <button className={pageStyles.previousButton} onClick={onPrevious} type="button">
            Previous
          </button>
          <button className={pageStyles.continueButton} onClick={onContinue} type="button">
            Continue
          </button>
        </div>
      </div>
    </div>
  );
}

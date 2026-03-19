"use client";

import styles from "../../PlanYourTripPage.module.scss";

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
    <>
      <div className={styles.formHeaderColumn}>
        <h2 className={styles.formTitle}>Traveler Information</h2>
        <p className={styles.formSubtitle}>
          Please provide your personal details so we can tailor your journey perfectly.
        </p>
      </div>

      <div className={styles.formGrid}>
        <div className={styles.formGroup}>
          <label htmlFor="pti-name">Enter your Name</label>
          <input
            id="pti-name"
            className={styles.formInput}
            type="text"
            value={travelerInfo.name}
            onChange={(e) => onTravelerChange("name", e.target.value)}
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="pti-email">Enter your E-mail</label>
          <input
            id="pti-email"
            className={styles.formInput}
            type="email"
            placeholder="Example@Gmail.Com"
            value={travelerInfo.email}
            onChange={(e) => onTravelerChange("email", e.target.value)}
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="pti-phone">Enter your Phone Number</label>
          <div className={styles.phoneInput}>
            <span className={styles.phonePrefix}>🇱🇷 +855</span>
            <input
              id="pti-phone"
              className={styles.formInput}
              type="tel"
              placeholder="000-000"
              value={travelerInfo.phone}
              onChange={(e) => onTravelerChange("phone", e.target.value)}
            />
          </div>
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="pti-nationality">Select Your Nationality</label>
          <select
            id="pti-nationality"
            className={styles.formInput}
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

        <div className={styles.formGroup}>
          <label htmlFor="pti-start">Start Date</label>
          <input
            id="pti-start"
            className={styles.formInput}
            type="date"
            value={travelerInfo.startDate}
            onChange={(e) => onTravelerChange("startDate", e.target.value)}
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="pti-end">End Date</label>
          <input
            id="pti-end"
            className={styles.formInput}
            type="date"
            value={travelerInfo.endDate}
            onChange={(e) => onTravelerChange("endDate", e.target.value)}
          />
        </div>

        <div className={styles.formGroup}>
          <label>No of Adults</label>
          <div className={styles.numberInput}>
            <span className={styles.numberHint}>(+12 years)</span>
            <div className={styles.counter}>
              <button
                type="button"
                onClick={() => onNumberChange("adults", false)}
                className={styles.counterButton}
                aria-label="Decrease adults"
              >
                <IconMinus size={16} />
              </button>
              <span className={styles.counterValue}>{travelerInfo.adults}</span>
              <button
                type="button"
                onClick={() => onNumberChange("adults", true)}
                className={`${styles.counterButton} ${styles.counterButtonOrange}`}
                aria-label="Increase adults"
              >
                <IconPlus size={16} />
              </button>
            </div>
          </div>
        </div>

        <div className={styles.formGroup}>
          <label>No of Children</label>
          <div className={styles.numberInput}>
            <span className={styles.numberHint}>(2 to 11 years)</span>
            <div className={styles.counter}>
              <button
                type="button"
                onClick={() => onNumberChange("children", false)}
                className={styles.counterButton}
                aria-label="Decrease children"
              >
                <IconMinus size={16} />
              </button>
              <span className={styles.counterValue}>{travelerInfo.children}</span>
              <button
                type="button"
                onClick={() => onNumberChange("children", true)}
                className={`${styles.counterButton} ${styles.counterButtonOrange}`}
                aria-label="Increase children"
              >
                <IconPlus size={16} />
              </button>
            </div>
          </div>
        </div>

        <div className={styles.formGroupFull}>
          <label>No of Infants</label>
          <div className={styles.numberInput}>
            <span className={styles.numberHint}>(0 to 2 years)</span>
            <div className={styles.counter}>
              <button
                type="button"
                onClick={() => onNumberChange("infants", false)}
                className={styles.counterButton}
                aria-label="Decrease infants"
              >
                <IconMinus size={16} />
              </button>
              <span className={styles.counterValue}>{travelerInfo.infants}</span>
              <button
                type="button"
                onClick={() => onNumberChange("infants", true)}
                className={`${styles.counterButton} ${styles.counterButtonOrange}`}
                aria-label="Increase infants"
              >
                <IconPlus size={16} />
              </button>
            </div>
          </div>
        </div>

        <div className={styles.formGroupFull}>
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

      <div className={styles.formActions}>
        <button className={styles.previousButton} onClick={onPrevious} type="button">
          Previous
        </button>
        <button className={styles.continueButton} onClick={onContinue} type="button">
          Continue
        </button>
      </div>
    </>
  );
}


"use client";

import Image from "next/image";
import { BookingStepFooter, FormField, PhonePrefixSelect, CustomDatePicker, NationalitySelect } from "@/components/shared";

import pageStyles from "../../PlanYourTripPage.module.scss";
import styles from "./StepTravelerInfo.module.scss";
import formStyles from "@/components/shared/FormField/FormField.module.scss";

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
          <FormField
            id="pti-name"
            label="Enter your Name"
            className={pageStyles.formInput}
            type="text"
            placeholder="John Doe"
            value={travelerInfo.name}
            onChange={(e) => onTravelerChange("name", e.target.value)}
          />

          <FormField
            id="pti-email"
            label="Enter your E-mail"
            className={pageStyles.formInput}
            type="email"
            placeholder="example@gmail.com"
            value={travelerInfo.email}
            onChange={(e) => onTravelerChange("email", e.target.value)}
          />

          <div className={formStyles.field}>
            <label htmlFor="pti-phone" className={formStyles.fieldLabel}>Phone Number</label>
            <div className={styles.phoneRow}>
              <PhonePrefixSelect
                phoneValue={travelerInfo.phone}
                onPhoneChange={(val) => onTravelerChange("phone", val)}
              />
              <input
                id="pti-phone"
                type="tel"
                className={`${formStyles.input} ${styles.inputPhone}`}
                value={travelerInfo.phone}
                onChange={(e) => onTravelerChange("phone", e.target.value)}
                placeholder="+1 555-0000"
              />
            </div>
          </div>

          <div className={formStyles.field}>
            <label className={formStyles.fieldLabel}>Select Your Nationality</label>
            <NationalitySelect 
              value={travelerInfo.nationality}
              onChange={(val) => onTravelerChange("nationality", val)}
            />
          </div>

          <div className={formStyles.field}>
            <label className={formStyles.fieldLabel}>Start Date</label>
            <CustomDatePicker
              variant="input"
              className={`${formStyles.input} ${pageStyles.dateInput}`}
              value={travelerInfo.startDate}
              onChange={(date) => onTravelerChange("startDate", date)}
            />
          </div>

          <div className={formStyles.field}>
            <label className={formStyles.fieldLabel}>End Date</label>
            <CustomDatePicker
              variant="input"
              className={`${formStyles.input} ${pageStyles.dateInput}`}
              value={travelerInfo.endDate}
              onChange={(date) => onTravelerChange("endDate", date)}
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

          <FormField
            id="pti-details"
            label="Trip Details"
            isTextarea
            wrapperClassName={pageStyles.formGroupFull}
            className={styles.formTextarea}
            placeholder="Share your trip details"
            value={travelerInfo.tripDetails}
            onChange={(e) => onTravelerChange("tripDetails", e.target.value)}
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

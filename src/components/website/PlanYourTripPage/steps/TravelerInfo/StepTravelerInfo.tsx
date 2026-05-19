"use client";

import { BookingStepFooter, FormField, PhonePrefixSelect, CustomDatePicker, NationalitySelect, CounterPill } from "@/components/shared";

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
}: {
  travelerInfo: TravelerInfo;
  onTravelerChange: <K extends keyof TravelerInfo>(field: K, value: TravelerInfo[K]) => void;
  onNumberChange: (field: "adults" | "children" | "infants", inc: boolean) => void;
  onPrevious: () => void;
  onContinue: () => void;
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
            required
          />

          <FormField
            id="pti-email"
            label="Enter your E-mail"
            className={pageStyles.formInput}
            type="email"
            placeholder="example@gmail.com"
            value={travelerInfo.email}
            onChange={(e) => onTravelerChange("email", e.target.value)}
            required
          />

          <FormField
            id="pti-phone"
            label="Phone Number"
            required
          >
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
          </FormField>

          <FormField label="Select Your Nationality" required>
            <NationalitySelect
              value={travelerInfo.nationality}
              onChange={(val) => onTravelerChange("nationality", val)}
            />
          </FormField>

          <FormField label="Start Date" required>
            <CustomDatePicker
              variant="input"
              className={`${formStyles.input} ${pageStyles.dateInput}`}
              value={travelerInfo.startDate}
              onChange={(date) => onTravelerChange("startDate", date)}
            />
          </FormField>

          <FormField label="End Date" required>
            <CustomDatePicker
              variant="input"
              className={`${formStyles.input} ${pageStyles.dateInput}`}
              value={travelerInfo.endDate}
              onChange={(date) => onTravelerChange("endDate", date)}
            />
          </FormField>

          {(["adults", "children", "infants"] as const).map((type) => {
            const meta = {
              adults: { title: "No of Adults", hint: "( +12 years )" },
              children: { title: "No of Children", hint: "( 2 to 11 years )" },
              infants: { title: "No of Infants", hint: "( 0 to 2 years )" },
            };
            return (
              <div key={type} className={pageStyles.formGroup}>
                <CounterPill
                  label={meta[type].title}
                  subLabel={meta[type].hint}
                  value={travelerInfo[type]}
                  onIncrease={() => onNumberChange(type, true)}
                  onDecrease={() => onNumberChange(type, false)}
                  required={type === "adults"}
                />
              </div>
            );
          })}
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

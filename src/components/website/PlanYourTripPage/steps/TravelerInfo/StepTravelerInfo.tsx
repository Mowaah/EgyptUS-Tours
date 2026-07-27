"use client";

import { useState } from "react";
import { BookingStepFooter, FormField, CustomDatePicker, NationalitySelect, CounterPill, PhoneInput } from "@/components/shared";
import { isValidEmail, isValidPhone } from "@/utils/validators";

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
  const [showErrors, setShowErrors] = useState(false);

  const isDateInvalid = travelerInfo.startDate && travelerInfo.endDate 
    ? new Date(travelerInfo.endDate) < new Date(travelerInfo.startDate)
    : false;

  const emailValid = isValidEmail(travelerInfo.email);
  const phoneValid = isValidPhone(travelerInfo.phone);

  const handleContinueClick = () => {
    setShowErrors(true);
    const isValid = 
      travelerInfo.name.trim() !== "" &&
      emailValid &&
      phoneValid &&
      travelerInfo.nationality !== "" &&
      travelerInfo.startDate !== "" &&
      travelerInfo.endDate !== "" &&
      !isDateInvalid &&
      travelerInfo.adults > 0;
      
    if (isValid) {
      onContinue();
    }
  };

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
            name="name"
            autoComplete="name"
            label="Enter your Name"
            className={pageStyles.formInput}
            type="text"
            placeholder="John Doe"
            value={travelerInfo.name}
            onChange={(e) => onTravelerChange("name", e.target.value)}
            required
            error={showErrors && !travelerInfo.name.trim() ? "This field is required" : undefined}
          />

          <FormField
            id="pti-email"
            name="email"
            autoComplete="email"
            label="Enter your E-mail"
            className={pageStyles.formInput}
            type="email"
            placeholder="example@gmail.com"
            value={travelerInfo.email}
            onChange={(e) => onTravelerChange("email", e.target.value)}
            required
            error={showErrors ? (travelerInfo.email.trim() === "" ? "This field is required" : !emailValid ? "Please enter a valid email address" : undefined) : undefined}
          />

          <FormField
            id="pti-phone"
            label="Phone Number"
            required
            error={showErrors ? (travelerInfo.phone.trim() === "" ? "This field is required" : !phoneValid ? "Please enter a valid phone number" : undefined) : undefined}
          >
            <PhoneInput 
              id="pti-phone"
              name="tel"
              autoComplete="tel"
              value={travelerInfo.phone}
              onChange={(val) => onTravelerChange("phone", val)}
            />
          </FormField>

          <FormField 
            label="Select Your Nationality" 
            required
            error={showErrors && !travelerInfo.nationality ? "This field is required" : undefined}
          >
            <NationalitySelect
              value={travelerInfo.nationality}
              onChange={(val) => onTravelerChange("nationality", val)}
            />
          </FormField>

          <FormField 
            label="Start Date" 
            required
            error={showErrors && !travelerInfo.startDate ? "This field is required" : undefined}
          >
            <CustomDatePicker
              variant="input"
              className={`${formStyles.input} ${pageStyles.dateInput}`}
              value={travelerInfo.startDate}
              onChange={(date) => onTravelerChange("startDate", date)}
            />
          </FormField>

          <FormField 
            label="End Date" 
            required
            error={showErrors ? (!travelerInfo.endDate ? "This field is required" : isDateInvalid ? "End date cannot be before start date" : undefined) : undefined}
          >
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
                {type === "adults" && showErrors && travelerInfo.adults === 0 && (
                  <div className={formStyles.errorMessage} style={{ marginTop: '4px' }}>
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M6 1C3.23858 1 1 3.23858 1 6C1 8.76142 3.23858 11 6 11C8.76142 11 11 8.76142 11 6C11 3.23858 8.76142 1 6 1ZM6.5 8.5H5.5V5.5H6.5V8.5ZM6.5 4.5H5.5V3.5H6.5V4.5Z" fill="#D32F2F" />
                    </svg>
                    <span>At least 1 adult is required</span>
                  </div>
                )}
              </div>
            );
          })}
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

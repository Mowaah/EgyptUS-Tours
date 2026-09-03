"use client";

import { useState } from "react";
import Image from "next/image";
import { BookingStepFooter, FormField, CustomDatePicker, NationalitySelect, CounterPill, PhoneInput } from "@/components/shared";
import { isValidEmail, isValidPhone } from "@/utils/validators";
import { useTranslation } from "@/hooks/useTranslation";

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
  const { t } = useTranslation("booking");
  const [showErrors, setShowErrors] = useState(false);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const isStartDateInPast = travelerInfo.startDate
    ? new Date(travelerInfo.startDate) < today
    : false;

  const isEndDateInPast = travelerInfo.endDate
    ? new Date(travelerInfo.endDate) < today
    : false;

  const isDateInvalid = travelerInfo.startDate && travelerInfo.endDate
    ? new Date(travelerInfo.endDate) < new Date(travelerInfo.startDate)
    : false;

  const emailValid = isValidEmail(travelerInfo.email);
  const phoneValid = isValidPhone(travelerInfo.phone);

  const phoneDigits = (travelerInfo.phone || "").replace(/^(\+\d+\s*)/, "").replace(/\D/g, "");
  const isPhoneFilled = travelerInfo.phone.trim() !== "" && phoneDigits.length > 0;
  const isEmailFilled = travelerInfo.email.trim() !== "";
  const isNameFilled = travelerInfo.name.trim() !== "";
  const isNationalityFilled = travelerInfo.nationality.trim() !== "";
  const isStartDateFilled = travelerInfo.startDate.trim() !== "";
  const isEndDateFilled = travelerInfo.endDate.trim() !== "";
  const areAdultsValid = travelerInfo.adults > 0;

  const handleContinueClick = () => {
    setShowErrors(true);
    const isValid =
      isNameFilled &&
      isEmailFilled &&
      emailValid &&
      isPhoneFilled &&
      phoneValid &&
      isNationalityFilled &&
      isStartDateFilled &&
      isEndDateFilled &&
      !isStartDateInPast &&
      !isEndDateInPast &&
      !isDateInvalid &&
      areAdultsValid;

    if (isValid) {
      onContinue();
    }
  };

  const counters = [
    { type: "adults" as const, title: t("planYourTrip.travelerInfo.adults", "No of Adults"), hint: t("planYourTrip.travelerInfo.adultsHint", "( +12 years )") },
    { type: "children" as const, title: t("planYourTrip.travelerInfo.children", "No of Children"), hint: t("planYourTrip.travelerInfo.childrenHint", "( 2 to 11 years )") },
    { type: "infants" as const, title: t("planYourTrip.travelerInfo.infants", "No of Infants"), hint: t("planYourTrip.travelerInfo.infantsHint", "( 0 to 2 years )") },
  ];

  return (
    <div className={pageStyles.stepFormCard}>
      <header className={pageStyles.stepFormCardHeader}>
        <div className={pageStyles.formHeaderColumn}>
          <h2 className={pageStyles.formTitle}>{t("planYourTrip.travelerInfo.title", "Traveler Information")}</h2>
          <p className={pageStyles.formSubtitle}>
            {t("planYourTrip.travelerInfo.subtitle", "Please provide your personal details so we can tailor your journey perfectly.")}
          </p>
        </div>
      </header>

      <div className={pageStyles.stepFormCardScroll}>
        <div className={pageStyles.formGrid}>
          <FormField
            id="pti-name"
            name="name"
            autoComplete="name"
            label={t("planYourTrip.travelerInfo.name", "Enter your Name")}
            className={pageStyles.formInput}
            type="text"
            placeholder={t("planYourTrip.travelerInfo.namePlaceholder", "John Doe")}
            value={travelerInfo.name}
            onChange={(e) => onTravelerChange("name", e.target.value)}
            required
            error={showErrors && !isNameFilled ? t("errors.required", "This field is required") : undefined}
          />

          <FormField
            id="pti-email"
            name="email"
            autoComplete="email"
            label={t("planYourTrip.travelerInfo.email", "Enter your E-mail")}
            className={pageStyles.formInput}
            type="email"
            placeholder={t("planYourTrip.travelerInfo.emailPlaceholder", "example@gmail.com")}
            value={travelerInfo.email}
            onChange={(e) => onTravelerChange("email", e.target.value)}
            required
            error={showErrors ? (!isEmailFilled ? t("errors.required", "This field is required") : !emailValid ? t("errors.emailInvalid", "Please enter a valid email address") : undefined) : undefined}
          />

          <FormField
            id="pti-phone"
            label={t("planYourTrip.travelerInfo.phone", "Phone Number")}
            required
            error={showErrors ? (!isPhoneFilled ? t("errors.required", "This field is required") : !phoneValid ? t("errors.phoneInvalid", "Please enter a valid phone number") : undefined) : undefined}
          >
            <PhoneInput
              id="pti-phone"
              name="tel"
              autoComplete="tel"
              value={travelerInfo.phone}
              onChange={(val) => onTravelerChange("phone", val)}
              hasError={showErrors && (!isPhoneFilled || !phoneValid)}
            />
          </FormField>

          <FormField
            label={t("planYourTrip.travelerInfo.nationality", "Select Your Nationality")}
            required
            error={showErrors && !isNationalityFilled ? t("errors.required", "This field is required") : undefined}
          >
            <NationalitySelect
              value={travelerInfo.nationality}
              onChange={(val) => onTravelerChange("nationality", val)}
              error={showErrors && !isNationalityFilled}
            />
          </FormField>

          <FormField
            label={t("planYourTrip.travelerInfo.startDate", "Start Date")}
            required
            error={showErrors ? (!isStartDateFilled ? t("errors.required", "This field is required") : isStartDateInPast ? t("planYourTrip.travelerInfo.startDatePast", "Start date cannot be in the past") : undefined) : undefined}
          >
            <CustomDatePicker
              variant="input"
              className={`${formStyles.input} ${pageStyles.dateInput} ${showErrors && (!isStartDateFilled || isStartDateInPast) ? formStyles.inputInvalid : ""}`}
              value={travelerInfo.startDate}
              onChange={(date) => onTravelerChange("startDate", date)}
              minDate={today}
            />
          </FormField>

          <FormField
            label={t("planYourTrip.travelerInfo.endDate", "End Date")}
            required
            error={showErrors ? (!isEndDateFilled ? t("errors.required", "This field is required") : isEndDateInPast ? t("planYourTrip.travelerInfo.endDatePast", "End date cannot be in the past") : isDateInvalid ? t("planYourTrip.travelerInfo.endDateBeforeStart", "End date cannot be before start date") : undefined) : undefined}
          >
            <CustomDatePicker
              variant="input"
              className={`${formStyles.input} ${pageStyles.dateInput} ${showErrors && (!isEndDateFilled || isEndDateInPast || isDateInvalid) ? formStyles.inputInvalid : ""}`}
              value={travelerInfo.endDate}
              onChange={(date) => onTravelerChange("endDate", date)}
              minDate={today}
            />
          </FormField>

          {counters.map(({ type, title, hint }) => (
            <div key={type} className={pageStyles.formGroup}>
              <CounterPill
                label={title}
                subLabel={hint}
                value={travelerInfo[type]}
                onIncrease={() => onNumberChange(type, true)}
                onDecrease={() => onNumberChange(type, false)}
                required={type === "adults"}
                error={type === "adults" && showErrors && !areAdultsValid}
              />
              {type === "adults" && showErrors && !areAdultsValid && (
                <div className={formStyles.errorMessage} style={{ marginTop: "4px" }}>
                  <Image src="/images/information-fill.svg" alt="" width={16} height={16} aria-hidden="true" />
                  <span>{t("planYourTrip.travelerInfo.adultsRequired", "At least 1 adult is required")}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <BookingStepFooter
        onPrevious={onPrevious}
        onContinue={handleContinueClick}
      />
    </div>
  );
}

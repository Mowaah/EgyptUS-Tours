"use client";

import { useState } from "react";
import { TransportationBookingData, Vehicle } from "@/types";
import {
  FormField,
  PhoneInput,
  CheckboxIndicator,
  NationalitySelect,
  BookingStepFooter
} from "@/components/shared";
import { useTranslation } from "@/hooks/useTranslation";
import styles from "./StepPersonalInfo.module.scss";
import ImportantLinksModal from "@/components/website/TripDetailPage/TripImportantLinks/ImportantLinksModal";

interface StepPersonalInfoProps {
  formData: TransportationBookingData;
  onChange: (patch: Partial<TransportationBookingData>) => void;
  onPrevious: () => void;
  onContinue: () => void;
  errors?: Record<string, string>;
}

export default function StepPersonalInfo({
  formData, onChange, onPrevious, onContinue, errors = {},
}: StepPersonalInfoProps) {
  const [showTermsModal, setShowTermsModal] = useState(false);
  const { t } = useTranslation("booking");

  return (
    <div className={styles.stepCard}>
      <div className={styles.header}>
        <h2 className={styles.title}>{t("transportBooking.contactDetails.title", "Passenger Contact Information")}</h2>
        <p className={styles.subtitle}>{t("transportBooking.contactDetails.subtitle", "We will use this information to send booking confirmations and ride updates.")}</p>
      </div>

      <div className={styles.formSection}>
        <div className={styles.twoColumn}>
          <FormField
            id="trans-name"
            name="name"
            autoComplete="name"
            label={t("transportBooking.contactDetails.name", "Full Name")}
            placeholder={t("transportBooking.contactDetails.namePlaceholder", "John Doe")}
            value={formData.name}
            onChange={(e) => onChange({ name: e.target.value })}
            required
            error={errors.name}
          />
          <FormField
            id="trans-email"
            name="email"
            autoComplete="email"
            label={t("transportBooking.contactDetails.email", "Email Address")}
            placeholder={t("transportBooking.contactDetails.emailPlaceholder", "example@gmail.com")}
            value={formData.email}
            onChange={(e) => onChange({ email: e.target.value })}
            required
            error={errors.email}
          />
        </div>

        <div className={styles.twoColumn}>
          <FormField label={t("transportBooking.contactDetails.phone", "Phone Number")} required error={errors.phone}>
            <PhoneInput
              id="trans-phone"
              name="tel"
              autoComplete="tel"
              value={formData.phone}
              onChange={(val) => onChange({ phone: val })}
              hasError={!!errors.phone}
            />
          </FormField>
          <FormField label={t("transportBooking.contactDetails.nationality", "Select Your Nationality")} required error={errors.nationality}>
            <NationalitySelect
              value={formData.nationality}
              onChange={(val) => onChange({ nationality: val })}
              error={!!errors.nationality}
            />
          </FormField>
        </div>

        <div className={styles.row}>
          <FormField
            label={t("transportBooking.contactDetails.notes", "Special Instructions for Driver (Optional)")}
            isTextarea
            placeholder={t("transportBooking.contactDetails.notesPlaceholder", "Any extra stops, infant seats needed, or landmark hints...")}
            value={formData.specialRequests}
            onChange={(e) => onChange({ specialRequests: e.target.value })}
            rows={4}
          />
        </div>

        <label className={styles.checkboxRow}>
          <input
            type="checkbox"
            checked={formData.termsAccepted}
            onChange={(e) => onChange({ termsAccepted: e.target.checked })}
            style={{ display: "none" }}
          />
          <div className={styles.checkboxWrap}>
            <CheckboxIndicator variant="square" size="md" selected={formData.termsAccepted} aria-hidden />
          </div>
          <span className={styles.checkboxLabel}>
            I have read and agree to the{" "}
            <button
              type="button"
              className={styles.linkBtn}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setShowTermsModal(true);
              }}
            >
              Terms &amp; Conditions and Cancellation
            </button>{" "}
            Policy.
          </span>
        </label>
      </div>

      <BookingStepFooter
        onPrevious={onPrevious}
        onContinue={onContinue}
        continueLabel={t("transportBooking.contactDetails.continueToPayment", "Continue To Payment")}
        continueDisabled={!formData.termsAccepted}
        showMoneyIcon
      />

      <ImportantLinksModal
        open={showTermsModal}
        initialTab="terms"
        onClose={() => setShowTermsModal(false)}
      />
    </div>
  );
}

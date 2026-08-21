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

  return (
    <div className={styles.stepCard}>
      <div className={styles.header}>
        <h2 className={styles.title}>Personal Information</h2>
        <p className={styles.subtitle}>Fill in your details to proceed with your booking securely.</p>
      </div>

      <div className={styles.formSection}>
        <div className={styles.twoColumn}>
          <FormField
            id="trans-name"
            name="name"
            autoComplete="name"
            label="Enter your Name"
            placeholder="John Doe"
            value={formData.name}
            onChange={(e) => onChange({ name: e.target.value })}
            required
            error={errors.name}
          />
          <FormField
            id="trans-email"
            name="email"
            autoComplete="email"
            label="Enter your E-mail"
            placeholder="Example@Gmail.Com"
            value={formData.email}
            onChange={(e) => onChange({ email: e.target.value })}
            required
            error={errors.email}
          />
        </div>

        <div className={styles.twoColumn}>
          <FormField label="Enter your Phone Number" required error={errors.phone}>
            <PhoneInput
              id="trans-phone"
              name="tel"
              autoComplete="tel"
              value={formData.phone}
              onChange={(val) => onChange({ phone: val })}
              hasError={!!errors.phone}
            />
          </FormField>
          <FormField label="Select Your Nationality" required error={errors.nationality}>
            <NationalitySelect 
              value={formData.nationality}
              onChange={(val) => onChange({ nationality: val })}
              error={!!errors.nationality}
            />
          </FormField>
        </div>

        <div className={styles.row}>
          <FormField
            label="Special Requests (Optional)"
            isTextarea
            placeholder="Any special requirements or requests for your trip..."
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
              Terms & Conditions and Cancellation
            </button>{" "}
            Policy.
          </span>
        </label>
      </div>

      <BookingStepFooter
        onPrevious={onPrevious}
        onContinue={onContinue}
        continueLabel="Continue To Payment"
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

import React, { useState } from "react";
import {
  BookingStepFooter,
  FormField,
  PhoneInput,
  CheckboxIndicator,
  NationalitySelect,
} from "@/components/shared";
import { isValidEmail, isValidPhone } from "@/utils/validators";
import planPage from "../../../PlanYourTripPage/PlanYourTripPage.module.scss";
import travelerStyles from "../../../PlanYourTripPage/steps/TravelerInfo/StepTravelerInfo.module.scss";
import formStyles from "@/components/shared/FormField/FormField.module.scss";
import styles from "./StepPersonalInfo.module.scss";
import { BookingData } from "../../BookHotelPage";
import { Hotel } from "@/types";
import BookingSidebar from "@/components/shared/BookingSidebar/BookingSidebar";
import ImportantLinksModal from "@/components/website/TripDetailPage/TripImportantLinks/ImportantLinksModal";

interface StepPersonalInfoProps {
  hotel: Hotel;
  formData: BookingData;
  onChange: (patch: Partial<BookingData>) => void;
  onPrevious: () => void;
  onContinue: () => void;
  totalAmount: number;
  vatAmount: number;
  depositAmount: number;
  totalRooms: number;
  totalGuests: number;
}

export default function StepPersonalInfo({
  hotel, formData, onChange, onPrevious, onContinue,
  totalAmount, vatAmount, depositAmount, totalRooms, totalGuests,
}: StepPersonalInfoProps) {
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleContinue = () => {
    const errs: Record<string, string> = {};
    if (!formData.name?.trim()) errs.name = "Name is required.";
    if (!formData.email?.trim()) {
      errs.email = "Email is required.";
    } else if (!isValidEmail(formData.email)) {
      errs.email = "Please enter a valid email address.";
    }

    const phoneDigits = (formData.phone || "").replace(/^(\+\d+\s*)/, "").replace(/\D/g, "");
    if (!formData.phone?.trim() || phoneDigits.length === 0) {
      errs.phone = "Phone number is required.";
    } else if (!isValidPhone(formData.phone)) {
      errs.phone = "The phone number entered is not valid.";
    }

    if (!formData.nationality?.trim()) errs.nationality = "Nationality is required.";
    if (!formData.termsAccepted) {
      alert("Please accept the Terms and Conditions and Privacy Policy to continue.");
      return;
    }

    setErrors(errs);
    if (Object.keys(errs).length === 0) {
      onContinue();
    }
  };

  return (
    <div>
      <div className={styles.twoColumnLayout}>
        <div className={styles.leftCol}>
          <div className={styles.infoCard}>
            <header className={planPage.stepFormCardHeader} style={{ padding: 0, border: 'none', margin: 0 }}>
              <div className={planPage.formHeaderColumn}>
                <h2 className={planPage.formTitle}>Personal Information</h2>
                <p className={planPage.formSubtitle}>Fill in your details to proceed with your booking securely.</p>
              </div>
            </header>

            <div className={styles.mobileSummary}>
              <BookingSidebar
                detailsId="hotel-step2-summary-mobile"
                hotel={hotel}
                formData={formData}
                totalAmount={totalAmount}
                vatAmount={vatAmount}
                depositAmount={depositAmount}
                totalRooms={totalRooms}
                totalGuests={totalGuests}
              />
            </div>

            {/* Contact fields */}
            <div className={planPage.formGrid}>
              <FormField
                id="pi-name"
                name="name"
                autoComplete="name"
                label="Enter your Name"
                className={planPage.formInput}
                type="text"
                required
                placeholder="John Doe"
                value={formData.name}
                onChange={(e) => onChange({ name: e.target.value })}
                error={errors.name}
              />
              <FormField
                id="pi-email"
                name="email"
                autoComplete="email"
                label="Enter your E-mail"
                className={planPage.formInput}
                type="email"
                required
                placeholder="Example@Gmail.Com"
                value={formData.email}
                onChange={(e) => onChange({ email: e.target.value })}
                error={errors.email}
              />
              <FormField
                label="Enter your Phone Number"
                required
                error={errors.phone}
              >
                <PhoneInput 
                  id="pi-phone"
                  name="tel"
                  autoComplete="tel"
                  value={formData.phone}
                  onChange={(val) => onChange({ phone: val })}
                  hasError={!!errors.phone}
                />
              </FormField>

              <FormField
                label="Select Your Nationality"
                required
                error={errors.nationality}
              >
                <NationalitySelect 
                  value={formData.nationality}
                  onChange={(val) => onChange({ nationality: val })}
                  error={!!errors.nationality}
                />
              </FormField>
            </div>

            {/* Terms */}
            <label className={styles.checkboxRow}>
              <input
                type="checkbox"
                checked={formData.termsAccepted}
                onChange={(e) => onChange({ termsAccepted: e.target.checked })}
                className={styles.checkboxHidden}
              />
              <CheckboxIndicator variant="square" size="md" selected={formData.termsAccepted} aria-hidden />
              <span>
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

            <BookingStepFooter
              onPrevious={onPrevious}
              onContinue={handleContinue}
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
        </div>

        <div className={styles.desktopSummary}>
          <BookingSidebar
            detailsId="hotel-step2-summary-desktop"
            hotel={hotel}
            formData={formData}
            totalAmount={totalAmount}
            vatAmount={vatAmount}
            depositAmount={depositAmount}
            totalRooms={totalRooms}
            totalGuests={totalGuests}
          />
        </div>
      </div>
    </div>
  );
}

import React from "react";
import {
  BookingStepFooter,
  FormField,
  PhonePrefixSelect,
  CheckboxIndicator,
  NationalitySelect,
} from "@/components/shared";
import planPage from "../../../PlanYourTripPage/PlanYourTripPage.module.scss";
import travelerStyles from "../../../PlanYourTripPage/steps/TravelerInfo/StepTravelerInfo.module.scss";
import formStyles from "@/components/shared/FormField/FormField.module.scss";
import styles from "./StepPersonalInfo.module.scss";
import { BookingData } from "../../BookHotelPage";
import { Hotel } from "@/types";
import BookingSidebar from "@/components/shared/BookingSidebar/BookingSidebar";

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

            {/* Contact fields */}
            <div className={planPage.formGrid}>
              <FormField
                id="pi-name"
                label="Enter your Name"
                className={planPage.formInput}
                type="text"
                required
                placeholder="John Doe"
                value={formData.name}
                onChange={(e) => onChange({ name: e.target.value })}
              />
              <FormField
                id="pi-email"
                label="Enter your E-mail"
                className={planPage.formInput}
                type="email"
                required
                placeholder="Example@Gmail.Com"
                value={formData.email}
                onChange={(e) => onChange({ email: e.target.value })}
              />
              <FormField
                label="Enter your Phone Number"
                required
              >
                <div className={travelerStyles.phoneRow}>
                  <PhonePrefixSelect phoneValue={formData.phone} onPhoneChange={(val) => onChange({ phone: val })} />
                  <input
                    id="pi-phone"
                    type="tel"
                    className={`${formStyles.input} ${travelerStyles.inputPhone}`}
                    value={formData.phone}
                    onChange={(e) => onChange({ phone: e.target.value })}
                    placeholder="000-0000"
                  />
                </div>
              </FormField>

              <FormField
                label="Select Your Nationality"
                required
              >
                <NationalitySelect 
                  value={formData.nationality}
                  onChange={(val) => onChange({ nationality: val })}
                />
              </FormField>
            </div>

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

            {/* Terms */}
            <label className={styles.checkboxRow}>
              <input
                type="checkbox"
                checked={formData.termsAccepted}
                onChange={(e) => onChange({ termsAccepted: e.target.checked })}
                className={styles.checkboxHidden}
              />
              <CheckboxIndicator variant="square" size="md" selected={formData.termsAccepted} aria-hidden />
              <span>I have read and agree to the <a href="#">Terms &amp; Conditions and Cancellation</a> Policy.</span>
            </label>

            <BookingStepFooter
              onPrevious={onPrevious}
              onContinue={onContinue}
              continueLabel="Continue To Payment"
              continueDisabled={!formData.termsAccepted}
              showMoneyIcon
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

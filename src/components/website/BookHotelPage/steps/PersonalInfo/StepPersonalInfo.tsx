import React from "react";
import {
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
import Image from "next/image";

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
    <div className={styles.root}>
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
                placeholder="John Doe"
                value={formData.name}
                onChange={(e) => onChange({ name: e.target.value })}
              />
              <FormField
                id="pi-email"
                label="Enter your E-mail"
                className={planPage.formInput}
                type="email"
                placeholder="Example@Gmail.Com"
                value={formData.email}
                onChange={(e) => onChange({ email: e.target.value })}
              />
              <div className={formStyles.field}>
                <label htmlFor="pi-phone" className={formStyles.fieldLabel}>Enter your Phone Number</label>
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
              </div>
              <div className={formStyles.field}>
                <label className={formStyles.fieldLabel}>Select Your Nationality</label>
                <NationalitySelect 
                  value={formData.nationality}
                  onChange={(val) => onChange({ nationality: val })}
                />
              </div>
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

            <hr className={planPage.stepFormCardDivider} aria-hidden="true" style={{ margin: '8px 0' }} />

            <div className={planPage.formActions}>
              <button className={planPage.previousButton} onClick={onPrevious} type="button">Previous</button>
              <button className={planPage.continueButton} onClick={onContinue} type="button" disabled={!formData.termsAccepted}>
                Continue To Payment
                <Image src="/images/money-send.svg" width={24} height={24} alt="" />
              </button>
            </div>
          </div>
        </div>

        <BookingSidebar
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
  );
}

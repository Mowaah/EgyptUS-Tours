"use client";

import React from "react";
import Image from "next/image";
import { TransportationBookingData, Vehicle } from "@/types";
import { 
  FormField, 
  PhonePrefixSelect, 
  CheckboxIndicator, 
  Button 
} from "@/components/shared";
import styles from "./StepPersonalInfo.module.scss";
import travelerStyles from "../../../PlanYourTripPage/steps/TravelerInfo/StepTravelerInfo.module.scss";
import formStyles from "@/components/shared/FormField/FormField.module.scss";

interface StepPersonalInfoProps {
  formData: TransportationBookingData;
  onChange: (patch: Partial<TransportationBookingData>) => void;
  onPrevious: () => void;
  onContinue: () => void;
  vehicle: Vehicle;
}

export default function StepPersonalInfo({
  formData, onChange, onPrevious, onContinue, vehicle
}: StepPersonalInfoProps) {
  return (
    <div className={styles.stepCard}>
      <div className={styles.header}>
        <h2 className={styles.title}>Personal Information</h2>
        <p className={styles.subtitle}>Fill in your details to proceed with your booking securely.</p>
      </div>

      <div className={styles.formSection}>
        <div className={styles.twoColumn}>
          <FormField
            label="Enter your Name"
            placeholder="John Doe"
            value={formData.name}
            onChange={(e) => onChange({ name: e.target.value })}
          />
          <FormField
            label="Enter your E-mail"
            placeholder="Example@Gmail.Com"
            value={formData.email}
            onChange={(e) => onChange({ email: e.target.value })}
          />
        </div>

        <div className={styles.twoColumn}>
          <div className={formStyles.field}>
            <label className={formStyles.fieldLabel}>Enter your Phone Number</label>
            <div className={travelerStyles.phoneRow}>
              <PhonePrefixSelect phoneValue={formData.phone} onPhoneChange={(val) => onChange({ phone: val })} />
              <input
                type="tel"
                className={`${formStyles.input} ${travelerStyles.inputPhone}`}
                value={formData.phone}
                onChange={(e) => onChange({ phone: e.target.value })}
                placeholder="000-0000"
              />
            </div>
          </div>
          <FormField
            label="Select Your Nationality"
            isSelect
            value={formData.nationality}
            onChange={(e) => onChange({ nationality: e.target.value })}
          >
            <option value="">Your Nationality</option>
            <option value="Egyptian">Egyptian</option>
            <option value="USA">USA</option>
            <option value="UK">UK</option>
          </FormField>
        </div>

        <div className={styles.row}>
          <FormField
            label="Special Requests (Optional)"
            isTextarea
            placeholder="Any special requirements or requests for your trip..."
            value={formData.specialRequests}
            onChange={(e) => onChange({ specialRequests: (e.target as HTMLTextAreaElement).value })}
            rows={4}
          />
        </div>

        <label className={styles.checkboxRow} onClick={() => onChange({ termsAccepted: !formData.termsAccepted })}>
          <div className={styles.checkboxWrap}>
            <CheckboxIndicator variant="square" size="md" selected={formData.termsAccepted} />
          </div>
          <span className={styles.checkboxLabel}>
            I have read and agree to the <a href="#" className={styles.link}>Terms & Conditions and Cancellation</a> Policy.
          </span>
        </label>
      </div>

      <div className={styles.footer}>
         <Button variant="outline" className={styles.prevBtn} onClick={onPrevious}>Previous</Button>
         <Button 
            variant="primary" 
            className={styles.contBtn} 
            onClick={onContinue}
            disabled={!formData.termsAccepted}
            icon={<Image src="/images/money-send.svg" alt="" width={20} height={20} />}
            iconPosition="right"
         >
           Continue To Payment
         </Button>
      </div>
    </div>
  );
}

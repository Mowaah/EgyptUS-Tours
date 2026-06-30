import React from "react";
import DashboardField from "@/components/dashboard/shared/DashboardField/DashboardField";
import { PhonePrefixSelect, NationalitySelect } from "@/components/shared";
import { AddTransportationBookingData } from "../../AddTransportationBookingModal";

import styles from "./StepGuestDetails.module.scss";

interface StepGuestDetailsProps {
  formData: AddTransportationBookingData;
  onChange: (patch: Partial<AddTransportationBookingData>) => void;
}

export default function StepGuestDetails({ formData, onChange }: StepGuestDetailsProps) {
  return (
    <div className={styles.container}>
      <div className={styles.row}>
        <div className={styles.col}>
          <DashboardField
            control="input"
            label="Enter Guest Name"
            placeholder="Enter Your Name"
            value={formData.guestName}
            onChange={(e: any) => onChange({ guestName: e.target.value })}
          />
        </div>
        <div className={styles.col}>
          <DashboardField
            control="input"
            label="Enter Guest E-mail"
            placeholder="Example@Gmail.Com"
            type="email"
            value={formData.guestEmail}
            onChange={(e: any) => onChange({ guestEmail: e.target.value })}
          />
        </div>
      </div>

      <div className={styles.row}>
        <div className={styles.col}>
          <div className={styles.phoneField}>
            <label className={styles.phoneLabel}>Enter Guest Phone number</label>
            <div className={styles.phoneInputWrapper}>
              <PhonePrefixSelect 
                phoneValue={formData.guestPhonePrefix} 
                onPhoneChange={(val) => onChange({ guestPhonePrefix: val })} 
                variant="ghost" 
              />
              <input
                type="text"
                className={styles.phoneInput}
                placeholder="000-0000"
                value={formData.guestPhone}
                onChange={(e) => onChange({ guestPhone: e.target.value })}
              />
            </div>
          </div>
        </div>
        <div className={styles.col}>
          <div className={styles.countrySelectWrap}>
            <label className={styles.phoneLabel}>Select Guest Nationality</label>
            <NationalitySelect
              value={formData.guestNationality}
              onChange={(val) => onChange({ guestNationality: val })}
              placeholder="Your Nationality"
              variant="outline"
            />
          </div>
        </div>
      </div>

      <div className={styles.specialRequestsSection}>
        <DashboardField
          control="textarea"
          label="Special Requests (Optional)"
          placeholder="e.g. Dietary requirements, accessibility needs..."
          value={formData.specialRequests}
          onChange={(e: any) => onChange({ specialRequests: e.target.value })}
          rows={5}
        />
      </div>
    </div>
  );
}

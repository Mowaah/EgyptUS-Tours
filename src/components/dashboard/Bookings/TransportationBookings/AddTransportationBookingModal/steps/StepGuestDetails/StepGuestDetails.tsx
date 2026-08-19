import React from "react";
import Image from "next/image";
import DashboardField from "@/components/dashboard/shared/DashboardField/DashboardField";
import { PhonePrefixSelect, NationalitySelect } from "@/components/shared";
import { AddTransportationBookingData } from "../../AddTransportationBookingModal";

import styles from "./StepGuestDetails.module.scss";

interface StepGuestDetailsProps {
  formData: AddTransportationBookingData;
  onChange: (patch: Partial<AddTransportationBookingData>) => void;
  errors?: Record<string, string>;
}

export default function StepGuestDetails({ formData, onChange, errors = {} }: StepGuestDetailsProps) {
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
            error={errors.guestName}
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
            error={errors.guestEmail}
          />
        </div>
      </div>

      <div className={styles.row}>
        <div className={styles.col}>
          <div className={styles.phoneField}>
            <label className={styles.phoneLabel}>Enter Guest Phone number</label>
            <div className={`${styles.phoneInputWrapper} ${errors.guestPhone ? styles.hasError : ""}`}>
              <PhonePrefixSelect 
                phoneValue={formData.guestPhonePrefix} 
                onPhoneChange={(val) => onChange({ guestPhonePrefix: val })} 
                variant="ghost" 
              />
              <input
                type="tel"
                className={styles.phoneInput}
                placeholder="000-0000"
                value={formData.guestPhone}
                onChange={(e) => {
                  const val = e.target.value.replace(/[^0-9+\-()\s]/g, "");
                  onChange({ guestPhone: val });
                }}
              />
            </div>
            {errors.guestPhone && (
              <div className={styles.errorMessage}>
                <Image src="/images/information-fill.svg" alt="" width={16} height={16} />
                <span>{errors.guestPhone}</span>
              </div>
            )}
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
              error={!!errors.guestNationality}
            />
            {errors.guestNationality && (
              <div className={styles.errorMessage}>
                <Image src="/images/information-fill.svg" alt="" width={16} height={16} />
                <span>{errors.guestNationality}</span>
              </div>
            )}
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

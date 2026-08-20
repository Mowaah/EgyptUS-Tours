import React from "react";
import Image from "next/image";
import DashboardField from "@/components/dashboard/shared/DashboardField/DashboardField";
import { DashboardPhoneField } from "@/components/dashboard/shared";
import { NationalitySelect } from "@/components/shared";
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
          <DashboardPhoneField
            label="Enter Guest Phone number"
            phoneValue={formData.guestPhone}
            prefixValue={formData.guestPhonePrefix}
            onPhoneChange={(val) => onChange({ guestPhone: val })}
            onPrefixChange={(val) => onChange({ guestPhonePrefix: val })}
            error={errors.guestPhone}
          />
        </div>
        <div className={styles.col}>
          <div className={styles.countrySelectWrap}>
            <label className={styles.phoneLabel}>Select Guest Nationality</label>
            <NationalitySelect
              value={formData.guestNationality}
              onChange={(val) => onChange({ guestNationality: val })}
              placeholder="Your Nationality"
              variant="dashboard"
              error={!!errors.guestNationality}
            />
            {errors.guestNationality && (
              <div className={styles.errorText}>
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

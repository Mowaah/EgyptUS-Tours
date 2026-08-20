import { CustomDatePicker, CounterPill, NationalitySelect } from "@/components/shared";
import { DashboardField, DashboardPhoneField } from "@/components/dashboard/shared";
import Image from "next/image";
import { AddTripBookingData } from "../../AddTripBookingModal";

import styles from "./StepGuestDetails.module.scss";

interface StepGuestDetailsProps {
  formData: AddTripBookingData;
  onChange: (patch: Partial<AddTripBookingData>) => void;
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
              error={!!errors.guestNationality}
              variant="dashboard"
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

      {formData.tourType === "private" && (
        <div className={styles.row}>
          <div className={styles.col}>
            <CustomDatePicker
              variant="custom"
              value={formData.startDate}
              onChange={(date) => onChange({ startDate: date })}
              renderTrigger={(isOpen, setIsOpen, displayTxt) => (
                <div onClick={() => setIsOpen(!isOpen)} className={styles.datePickerTrigger}>
                  <DashboardField
                    label="Start Date"
                    value={displayTxt || formData.startDate || ""}
                    readOnly
                    placeholder="DD/MM/YYYY"
                    error={errors.startDate}
                    endAdornment={<Image src="/images/calendar3.svg" alt="calendar icon" width={20} height={20} aria-hidden className={styles.iconOverlay} />}
                  />
                </div>
              )}
            />
          </div>
          <div className={styles.col}>
            <CustomDatePicker
              variant="custom"
              value={formData.endDate}
              onChange={(date) => onChange({ endDate: date })}
              renderTrigger={(isOpen, setIsOpen, displayTxt) => (
                <div onClick={() => setIsOpen(!isOpen)} className={styles.datePickerTrigger}>
                  <DashboardField
                    label="End Date"
                    value={displayTxt || formData.endDate || ""}
                    readOnly
                    placeholder="DD/MM/YYYY"
                    error={errors.endDate}
                    endAdornment={<Image src="/images/calendar3.svg" alt="calendar icon" width={20} height={20} aria-hidden className={styles.iconOverlay} />}
                  />
                </div>
              )}
            />
          </div>
        </div>
      )}

      <div className={styles.countersRow}>
        <div className={styles.counterColumn}>
          <div className={styles.counterWrap}>
            <div className={styles.counterLabelWrap}>
              <span className={styles.counterLabel}>No of Adults</span>
              <span className={styles.counterHint}>(+12 years)</span>
            </div>
            <CounterPill
              value={formData.adults}
              onIncrease={() => onChange({ adults: formData.adults + 1 })}
              onDecrease={() => onChange({ adults: Math.max(0, formData.adults - 1) })}
            />
          </div>
          {errors.adults && (
            <div className={styles.errorText} role="alert">
              <Image src="/images/information-fill.svg" alt="" width={16} height={16} aria-hidden="true" />
              <span>{errors.adults}</span>
            </div>
          )}
        </div>

        <div className={styles.counterColumn}>
          <div className={styles.counterWrap}>
            <div className={styles.counterLabelWrap}>
              <span className={styles.counterLabel}>No of Children</span>
              <span className={styles.counterHint}>( 2 to 11 years)</span>
            </div>
            <CounterPill
              value={formData.children}
              onIncrease={() => onChange({ children: formData.children + 1 })}
              onDecrease={() => onChange({ children: Math.max(0, formData.children - 1) })}
            />
          </div>
        </div>

        <div className={styles.counterColumn}>
          <div className={styles.counterWrap}>
            <div className={styles.counterLabelWrap}>
              <span className={styles.counterLabel}>No of Infants</span>
              <span className={styles.counterHint}>( 0 to 2 years)</span>
            </div>
            <CounterPill
              value={formData.infants}
              onIncrease={() => onChange({ infants: formData.infants + 1 })}
              onDecrease={() => onChange({ infants: Math.max(0, formData.infants - 1) })}
            />
          </div>
        </div>
      </div>

      <div className={styles.fullRow}>
        <DashboardField
          control="textarea"
          label="Special Requests (Optional)"
          placeholder="e.g. Dietary requirements, accessibility needs..."
          rows={5}
          value={formData.specialRequests}
          onChange={(e: any) => onChange({ specialRequests: e.target.value })}
        />
      </div>
    </div>
  );
}

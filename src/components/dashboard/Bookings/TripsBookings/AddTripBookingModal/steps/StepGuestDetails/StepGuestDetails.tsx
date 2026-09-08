import { CustomDatePicker, CounterPill, NationalitySelect, SelectDropdown } from "@/components/shared";
import { DashboardField, DashboardPhoneField } from "@/components/dashboard/shared";
import Image from "next/image";
import { AddTripBookingData } from "../../AddTripBookingModal";

import styles from "./StepGuestDetails.module.scss";

const CHILD_AGE_OPTIONS = Array.from({ length: 10 }, (_, i) => ({
  label: `${i + 2} years`,
  value: String(i + 2),
}));

interface StepGuestDetailsProps {
  formData: AddTripBookingData;
  onChange: (patch: Partial<AddTripBookingData>) => void;
  errors?: Record<string, string>;
  hasFixedAvailability?: boolean;
  durationDays?: number;
}

export default function StepGuestDetails({ formData, onChange, errors = {}, hasFixedAvailability = false, durationDays }: StepGuestDetailsProps) {
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
            autoComplete="name"
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
            autoComplete="email"
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

      {!hasFixedAvailability && (
        <div className={styles.row}>
          <div className={styles.col}>
            <CustomDatePicker
              variant="custom"
              value={formData.startDate}
              onChange={(date) => {
                onChange({ startDate: date });
                if (date && durationDays) {
                  const d = new Date(date);
                  d.setDate(d.getDate() + durationDays - 1);
                  const endStr = `${String(d.getMonth() + 1).padStart(2, '0')}/${String(d.getDate()).padStart(2, '0')}/${d.getFullYear()}`;
                  onChange({ startDate: date, endDate: endStr });
                }
              }}
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
            <DashboardField
              label="End Date"
              value={formData.endDate || ""}
              readOnly
              placeholder="DD/MM/YYYY"
              error={errors.endDate}
              endAdornment={<Image src="/images/calendar3.svg" alt="calendar icon" width={20} height={20} aria-hidden className={styles.iconOverlay} />}
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
              onIncrease={() => {
                const nextCount = formData.children + 1;
                onChange({
                  children: nextCount,
                  childrenAges: [...(formData.childrenAges || []), 0].slice(0, nextCount),
                });
              }}
              onDecrease={() => {
                const nextCount = Math.max(0, formData.children - 1);
                onChange({
                  children: nextCount,
                  childrenAges: (formData.childrenAges || []).slice(0, nextCount),
                });
              }}
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

      {formData.children > 0 && (
        <div className={styles.childPricingPolicy}>
          Child pricing: 6-11 yrs 50% · 2-5 yrs 25% · Under 2 free
        </div>
      )}

      {formData.children > 0 && (
        <div className={styles.childAgesGrid}>
          {Array.from({ length: formData.children }).map((_, i) => {
            const currentAge = formData.childrenAges?.[i] != null && formData.childrenAges[i] > 0
              ? String(formData.childrenAges[i])
              : "";
            return (
              <div key={`child-age-${i}`} className={styles.childPricingItem}>
                <label className={styles.childPricingLabel}>
                  Child {i + 1} <span className={styles.requiredStar}>*</span>
                </label>
                <SelectDropdown
                  id={`child-age-select-${i}`}
                  placeholder="Select Age"
                  options={CHILD_AGE_OPTIONS}
                  value={currentAge}
                  onChange={(val) => {
                    const current = [...(formData.childrenAges || [])];
                    current[i] = Number(val);
                    onChange({ childrenAges: current });
                  }}
                />
              </div>
            );
          })}
        </div>
      )}

      {errors.childrenAges && (
        <div className={styles.errorText} role="alert">
          <Image src="/images/information-fill.svg" alt="" width={16} height={16} aria-hidden="true" />
          <span>{errors.childrenAges}</span>
        </div>
      )}

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

import Image from "next/image";
import { CounterPill, NationalitySelect, PhonePrefixSelect } from "@/components/shared";
import DashboardField from "@/components/dashboard/shared/DashboardField/DashboardField";
import { AddHotelBookingData } from "../../AddHotelBookingModal";
import CustomDatePicker from "@/components/shared/CustomDatePicker/CustomDatePicker";

import styles from "./StepGuestDetails.module.scss";

interface StepGuestDetailsProps {
  formData: AddHotelBookingData;
  onChange: (patch: Partial<AddHotelBookingData>) => void;
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
            />
          </div>
        </div>
      </div>

      <div className={styles.row}>
        <div className={styles.col}>
          <CustomDatePicker
            variant="custom"
            value={formData.checkInDate}
            onChange={(date) => onChange({ checkInDate: date })}
            renderTrigger={(isOpen, setIsOpen, displayTxt) => (
              <div onClick={() => setIsOpen(!isOpen)} className={styles.datePickerTrigger}>
                <DashboardField
                  label="Check-in Date"
                  value={displayTxt || formData.checkInDate || ""}
                  readOnly
                  placeholder="DD/MM/YYYY"
                  endAdornment={<Image src="/images/calendar3.svg" alt="calendar icon" width={20} height={20} aria-hidden className={styles.iconOverlay} />}
                />
              </div>
            )}
          />
        </div>
        <div className={styles.col}>
          <CustomDatePicker
            variant="custom"
            value={formData.checkOutDate}
            onChange={(date) => onChange({ checkOutDate: date })}
            renderTrigger={(isOpen, setIsOpen, displayTxt) => (
              <div onClick={() => setIsOpen(!isOpen)} className={styles.datePickerTrigger}>
                <DashboardField
                  label="Check-out Date"
                  value={displayTxt || formData.checkOutDate || ""}
                  readOnly
                  placeholder="DD/MM/YYYY"
                  endAdornment={<Image src="/images/calendar3.svg" alt="calendar icon" width={20} height={20} aria-hidden className={styles.iconOverlay} />}
                />
              </div>
            )}
          />
        </div>
      </div>

      <div className={styles.countersRow}>
        <div className={styles.counterWrap}>
          <div className={styles.counterLabelWrap}>
            <span className={styles.counterLabel}>No of Adults</span>
            <span className={styles.counterHint}>(+12 years)</span>
          </div>
          <CounterPill 
            value={formData.adults} 
            onIncrease={() => onChange({ adults: formData.adults + 1 })} 
            onDecrease={() => onChange({ adults: Math.max(0, formData.adults - 1) })} 
            min={0}
            pillOnly
          />
        </div>

        <div className={styles.counterWrap}>
          <div className={styles.counterLabelWrap}>
            <span className={styles.counterLabel}>No of Infants</span>
            <span className={styles.counterHint}>( 0 to 2 years)</span>
          </div>
          <CounterPill 
            value={formData.infants} 
            onIncrease={() => onChange({ infants: formData.infants + 1 })} 
            onDecrease={() => onChange({ infants: Math.max(0, formData.infants - 1) })} 
            min={0}
            pillOnly
          />
        </div>

        <div className={styles.counterWrap}>
          <div className={styles.counterLabelWrap}>
            <span className={styles.counterLabel}>No of Children</span>
            <span className={styles.counterHint}>( 2 to 11 years)</span>
          </div>
          <CounterPill 
            value={formData.children} 
            onIncrease={() => onChange({ children: formData.children + 1 })} 
            onDecrease={() => onChange({ children: Math.max(0, formData.children - 1) })} 
            min={0}
            pillOnly
          />
        </div>
      </div>

      <div className={styles.fullRow}>
        <DashboardField
          control="textarea"
          label="Special Requests (Optional)"
          placeholder=""
          rows={5}
          value={formData.specialRequests}
          onChange={(e: any) => onChange({ specialRequests: e.target.value })}
        />
      </div>
    </div>
  );
}

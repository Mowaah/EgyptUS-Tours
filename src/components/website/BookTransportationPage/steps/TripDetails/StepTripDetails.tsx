"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { TransportationBookingData, Vehicle } from "@/types";
import { FormField, Button, CustomDatePicker, SelectDropdown, CheckboxIndicator, TimePicker, TimeValue, BookingStepFooter } from "@/components/shared";
import formStyles from "@/components/shared/FormField/FormField.module.scss";
import styles from "./StepTripDetails.module.scss";

// ─── Static option lists ─────────────────────────────────────────────────────
const PASSENGER_OPTIONS = [1, 2, 3, 4, 5, 6].map((n) => ({
  label: `${n} Passenger${n > 1 ? "s" : ""}`,
  value: n.toString(),
}));

const LUGGAGE_OPTIONS = [1, 2, 3, 4].map((n) => ({
  label: `${n} Bag${n > 1 ? "s" : ""}`,
  value: n.toString(),
}));

const ADDITIONAL_SERVICES = [
  { key: "childSeat" as const, label: "Child Seat", price: "+$10.00" },
  { key: "extraLuggage" as const, label: "Extra Luggage Space", price: "+$15.00" },
  { key: "meetAndGreet" as const, label: "Meet & Greet Service", price: "+$20.00" },
];

// ─── Types ────────────────────────────────────────────────────────────────────
interface StepTripDetailsProps {
  formData: TransportationBookingData;
  onChange: (patch: Partial<TransportationBookingData>) => void;
  onContinue: () => void;
  vehicle: Vehicle;
  errors?: Record<string, string>;
}

// ─── Sub-components ──────────────────────────────────────────────────────────
function TripTypeSelector({
  value,
  onChange,
}: {
  value: "One Way" | "Round Trip";
  onChange: (v: "One Way" | "Round Trip") => void;
}) {
  return (
    <FormField label="Trip Type" required>
      <div className={styles.typeChoices}>
        {(["One Way", "Round Trip"] as const).map((type) => (
          <button
            key={type}
            type="button"
            className={`${styles.typeBtn} ${value === type ? styles.active : ""}`}
            onClick={() => onChange(type)}
          >
            <CheckboxIndicator
              variant="radio"
              size="lg"
              selected={value === type}
              aria-hidden
            />
            <span className={styles.typeLabel}>{type}</span>
          </button>
        ))}
      </div>
    </FormField>
  );
}

function ServiceItem({
  label,
  price,
  checked,
  onChange,
}: {
  label: string;
  price: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <button
      type="button"
      className={`${styles.serviceItem} ${checked ? styles.checked : ""}`}
      onClick={() => onChange(!checked)}
    >
      <CheckboxIndicator
        variant="square"
        size="lg"
        selected={checked}
        aria-hidden
      />
      <div className={styles.serviceInfo}>
        <span className={styles.serviceLabel}>{label}</span>
        <span className={styles.servicePrice}>{price}</span>
      </div>
    </button>
  );
}

// ─── TimePickerField ──────────────────────────────────────────────────────────
function TimePickerField({
  value,
  onChange,
  inputClassName,
}: {
  value: string;
  onChange: (v: string) => void;
  inputClassName?: string;
}) {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Close when clicking outside
  useEffect(() => {
    if (!open) return;
    const handleOutside = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, [open]);

  // Parse stored "HH:MM AM/PM" or fallback defaults
  const parse = (v: string): TimeValue => {
    const match = v.match(/^(\d{1,2}):(\d{2})\s?(AM|PM)?$/i);
    if (match) {
      return {
        hour: parseInt(match[1]) || 12,
        minute: parseInt(match[2]) || 0,
        period: (match[3]?.toUpperCase() as "AM" | "PM") ?? "AM",
      };
    }
    return { hour: 12, minute: 0, period: "AM" };
  };

  const tv = parse(value);
  const display = value
    ? `${String(tv.hour).padStart(2, "0")}:${String(tv.minute).padStart(2, "0")} ${tv.period}`
    : "";

  return (
    <div ref={wrapperRef} className={styles.inputWithIcon} style={{ position: "relative" }}>
      <div className={styles.inputIcon}>
        <Image src="/images/clock-gray.svg" alt="" width={20} height={20} />
      </div>
      <input
        type="text"
        readOnly
        className={inputClassName}
        value={display}
        placeholder="HH : MM  AM/PM"
        onClick={() => setOpen((o) => !o)}
      />

      {open && (
        <div style={{ position: "absolute", top: "calc(100% + 8px)", left: 0, zIndex: 100 }}>
          <TimePicker
            value={tv}
            onChange={(t) => {
              onChange(`${String(t.hour).padStart(2, "0")}:${String(t.minute).padStart(2, "0")} ${t.period}`);
            }}
          />
        </div>
      )}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function StepTripDetails({
  formData,
  onChange,
  onContinue,
  errors = {},
}: StepTripDetailsProps) {
  return (
    <div className={styles.stepCard}>
      {/* Header */}
      <div className={styles.header}>
        <h2 className={styles.title}>Trip Details</h2>
        <p className={styles.subtitle}>
          Enter your trip details including pickup, drop-off, and timing to proceed with your booking.
        </p>
      </div>

      <div className={styles.formSection}>
        {/* Pickup & Drop-off */}
        <FormField
          label="Pickup Location"
          placeholder="Luxor, Luxor Airport."
          value={formData.pickupLocation}
          onChange={(e) => onChange({ pickupLocation: e.target.value })}
          wrapperClassName={styles.formField}
          className={styles.tallInput}
          required
          error={errors.pickupLocation}
        />
        <FormField
          label="Drop-off Location"
          placeholder="Luxor, next to Ahmed Ali st."
          value={formData.dropoffLocation}
          onChange={(e) => onChange({ dropoffLocation: e.target.value })}
          wrapperClassName={styles.formField}
          className={styles.tallInput}
          required
          error={errors.dropoffLocation}
        />

        {/* Trip Type */}
        <TripTypeSelector
          value={formData.tripType}
          onChange={(v) => onChange({ tripType: v })}
        />

        {/* Date & Time */}
        <div className={styles.twoColumn}>
          <FormField label="Pickup Date" required wrapperClassName={styles.formField} error={errors.pickupDate}>
            <div className={styles.inputWithIcon}>
              <div className={styles.inputIcon}>
                <Image src="/images/calendar-gray.svg" alt="" width={20} height={20} />
              </div>
              <CustomDatePicker
                value={formData.pickupDate}
                onChange={(val) => onChange({ pickupDate: val })}
                variant="input"
                className={`${formStyles.input} ${styles.tallInput} ${styles.inputWithPaddingLeft}`}
              />
            </div>
          </FormField>
          <FormField label="Pickup Time" required wrapperClassName={styles.formField} error={errors.pickupTime}>
            <TimePickerField
              value={formData.pickupTime}
              onChange={(val) => onChange({ pickupTime: val })}
              inputClassName={`${formStyles.input} ${styles.tallInput}`}
            />
          </FormField>
        </div>

        {/* Passengers & Luggage */}
        <div className={styles.twoColumn}>
          <FormField label="Passengers" required wrapperClassName={styles.formField}>
            <SelectDropdown
              options={PASSENGER_OPTIONS}
              value={formData.passengers.toString()}
              onChange={(val) => onChange({ passengers: parseInt(val) })}
              triggerClassName={styles.selectTrigger}
            />
          </FormField>
          <FormField label="Luggage" required wrapperClassName={styles.formField}>
            <SelectDropdown
              options={LUGGAGE_OPTIONS}
              value={formData.luggage.toString()}
              onChange={(val) => onChange({ luggage: parseInt(val) })}
              triggerClassName={styles.selectTrigger}
            />
          </FormField>
        </div>

        {/* Additional Services */}
        <div className={styles.servicesSection}>
          <label className={styles.label}>Additional Services</label>
          <div className={styles.serviceList}>
            {ADDITIONAL_SERVICES.map(({ key, label, price }) => (
              <ServiceItem
                key={key}
                label={label}
                price={price}
                checked={formData.services[key]}
                onChange={(checked) =>
                  onChange({ services: { ...formData.services, [key]: checked } })
                }
              />
            ))}
          </div>
        </div>
      </div>

      <BookingStepFooter
        onContinue={onContinue}
      />
    </div>
  );
}

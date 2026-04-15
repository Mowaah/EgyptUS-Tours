"use client";

import Image from "next/image";
import { TransportationBookingData, Vehicle } from "@/types";
import { FormField, Button, CustomDatePicker, SelectDropdown, CheckboxIndicator } from "@/components/shared";
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
    <div className={styles.typeSelector}>
      <label className={styles.label}>Trip Type</label>
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
    </div>
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

// ─── Main Component ───────────────────────────────────────────────────────────
export default function StepTripDetails({
  formData,
  onChange,
  onContinue,
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
        />
        <FormField
          label="Drop-off Location"
          placeholder="Luxor, next to Ahmed Ali st."
          value={formData.dropoffLocation}
          onChange={(e) => onChange({ dropoffLocation: e.target.value })}
          wrapperClassName={styles.formField}
          className={styles.tallInput}
        />

        {/* Trip Type */}
        <TripTypeSelector
          value={formData.tripType}
          onChange={(v) => onChange({ tripType: v })}
        />

        {/* Date & Time */}
        <div className={styles.twoColumn}>
          <div className={styles.formField}>
            <label className={styles.label}>Pickup Date</label>
            <CustomDatePicker
              value={formData.pickupDate}
              onChange={(val) => onChange({ pickupDate: val })}
              variant="input"
              className={`${formStyles.input} ${styles.tallInput}`}
            />
          </div>
          <FormField
            label="Pickup Time"
            type="time"
            value={formData.pickupTime}
            onChange={(e) => onChange({ pickupTime: e.target.value })}
            wrapperClassName={styles.formField}
            className={styles.tallInput}
          />
        </div>

        {/* Passengers & Luggage */}
        <div className={styles.twoColumn}>
          <div className={styles.formField}>
            <label className={styles.label}>Passengers</label>
            <SelectDropdown
              options={PASSENGER_OPTIONS}
              value={formData.passengers.toString()}
              onChange={(val) => onChange({ passengers: parseInt(val) })}
              triggerClassName={styles.selectTrigger}
            />
          </div>
          <div className={styles.formField}>
            <label className={styles.label}>Luggage</label>
            <SelectDropdown
              options={LUGGAGE_OPTIONS}
              value={formData.luggage.toString()}
              onChange={(val) => onChange({ luggage: parseInt(val) })}
              triggerClassName={styles.selectTrigger}
            />
          </div>
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

      {/* Footer */}
      <div className={styles.footer}>
        <button type="button" className={styles.prevBtn} disabled>
          Previous
        </button>
        <button type="button" className={styles.contBtn} onClick={onContinue}>
          Continue
        </button>
      </div>
    </div>
  );
}

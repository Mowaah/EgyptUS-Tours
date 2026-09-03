"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import Image from "next/image";
import { TransportationBookingData, Vehicle } from "@/types";
import useSWR from "swr";
import { apiClient } from "@/lib/api";
import { FormField, Button, CustomDatePicker, SelectDropdown, CheckboxIndicator, TimePicker, TimeValue, BookingStepFooter } from "@/components/shared";
import { useTranslation } from "@/hooks/useTranslation";
import formStyles from "@/components/shared/FormField/FormField.module.scss";
import styles from "./StepTripDetails.module.scss";

const fetcher = (url: string) => apiClient.get(url).then((res: any) => res.results || res);

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
  const { t } = useTranslation("booking");
  const options = [
    { type: "One Way" as const, label: t("transportBooking.rideDetails.oneWay", "One Way") },
    { type: "Round Trip" as const, label: t("transportBooking.rideDetails.roundTrip", "Round Trip") },
  ];

  return (
    <FormField label={t("transportBooking.rideDetails.tripType", "Trip Type")} required>
      <div className={styles.typeChoices}>
        {options.map(({ type, label }) => (
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
            <span className={styles.typeLabel}>{label}</span>
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
  vehicle,
  errors = {},
}: StepTripDetailsProps) {
  const { data: vehicleDetailsData } = useSWR(`/vehicles/${vehicle.id}/`, fetcher);
  const additionalServices = vehicleDetailsData?.additional_services || [];
  const { t } = useTranslation("booking");

  const maxPassengers = Math.max(1, vehicleDetailsData?.passengers || vehicle.passengers || 1);
  const maxLuggage = Math.max(0, vehicleDetailsData?.luggage_capacity ?? (typeof vehicle.luggage === "number" ? vehicle.luggage : parseInt(vehicle.luggage) || 0));

  const passengerOptions = useMemo(() => {
    return Array.from({ length: maxPassengers }, (_, i) => {
      const val = i + 1;
      const unit = val === 1
        ? t("transportBooking.rideDetails.passenger", "Passenger")
        : t("transportBooking.rideDetails.passengers", "Passengers");
      return {
        label: `${val} ${unit}`,
        value: val.toString(),
      };
    });
  }, [maxPassengers, t]);

  const luggageOptions = useMemo(() => {
    if (maxLuggage === 0) {
      return [{ label: `0 ${t("transportBooking.rideDetails.bags", "Bags")}`, value: "0" }];
    }
    return Array.from({ length: maxLuggage }, (_, i) => {
      const val = i + 1;
      const unit = val === 1
        ? t("transportBooking.rideDetails.bag", "Bag")
        : t("transportBooking.rideDetails.bags", "Bags");
      return {
        label: `${val} ${unit}`,
        value: val.toString(),
      };
    });
  }, [maxLuggage, t]);

  useEffect(() => {
    if (formData.passengers > maxPassengers) {
      onChange({ passengers: maxPassengers });
    }
    if (formData.luggage > maxLuggage && maxLuggage >= 0) {
      onChange({ luggage: maxLuggage });
    }
  }, [maxPassengers, maxLuggage, formData.passengers, formData.luggage, onChange]);

  return (
    <div className={styles.stepCard}>
      {/* Header */}
      <div className={styles.header}>
        <h2 className={styles.title}>{t("transportBooking.rideDetails.title", "Transfer & Schedule Details")}</h2>
        <p className={styles.subtitle}>
          {t("transportBooking.rideDetails.subtitle", "Enter your trip details including pickup, drop-off, and timing to proceed with your booking.")}
        </p>
      </div>

      <div className={styles.formSection}>
        {/* Pickup & Drop-off */}
        <FormField
          label={t("transportBooking.rideDetails.pickupLocation", "Pickup Location")}
          placeholder={t("transportBooking.rideDetails.pickupLocationPlaceholder", "e.g. Cairo Airport Terminal 3, or Hotel Name")}
          value={formData.pickupLocation}
          onChange={(e) => onChange({ pickupLocation: e.target.value })}
          wrapperClassName={styles.formField}
          className={styles.tallInput}
          required
          error={errors.pickupLocation}
        />
        <FormField
          label={t("transportBooking.rideDetails.dropoffLocation", "Drop-off Location")}
          placeholder={t("transportBooking.rideDetails.dropoffLocationPlaceholder", "e.g. Mena House Hotel, Giza")}
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
          <FormField label={t("transportBooking.rideDetails.pickupDate", "Pickup Date")} required wrapperClassName={styles.formField} error={errors.pickupDate}>
            <div className={styles.inputWithIcon}>
              <div className={styles.inputIcon}>
                <Image src="/images/calendar-gray.svg" alt="" width={20} height={20} />
              </div>
              <CustomDatePicker
                value={formData.pickupDate}
                onChange={(val) => onChange({ pickupDate: val })}
                variant="input"
                className={`${formStyles.input} ${styles.tallInput} ${styles.inputWithPaddingLeft} ${errors.pickupDate ? formStyles.inputInvalid : ""}`}
              />
            </div>
          </FormField>
          <FormField label={t("transportBooking.rideDetails.pickupTime", "Pickup Time")} required wrapperClassName={styles.formField} error={errors.pickupTime}>
            <TimePickerField
              value={formData.pickupTime}
              onChange={(val) => onChange({ pickupTime: val })}
              inputClassName={`${formStyles.input} ${styles.tallInput} ${styles.inputWithPaddingLeft} ${errors.pickupTime ? formStyles.inputInvalid : ""}`}
            />
          </FormField>
        </div>

        {/* Passengers & Luggage */}
        <div className={styles.twoColumn}>
          <FormField label={t("transportBooking.rideDetails.passengers", "Passengers")} required wrapperClassName={styles.formField}>
            <SelectDropdown
              options={passengerOptions}
              value={formData.passengers.toString()}
              onChange={(val) => onChange({ passengers: parseInt(val) })}
              triggerClassName={styles.selectTrigger}
            />
          </FormField>
          <FormField label={t("transportBooking.rideDetails.luggage", "Luggage")} required wrapperClassName={styles.formField}>
            <SelectDropdown
              options={luggageOptions}
              value={formData.luggage.toString()}
              onChange={(val) => onChange({ luggage: parseInt(val) })}
              triggerClassName={styles.selectTrigger}
            />
          </FormField>
        </div>

        {/* Additional Services */}
        <div className={styles.servicesSection}>
          <label className={styles.label}>{t("transportBooking.rideDetails.additionalServices", "Additional Services")}</label>
          <div className={styles.serviceList}>
            {additionalServices.map((service: any) => {
              const isSelected = formData.additionalServiceIds.includes(service.id);
              return (
                <ServiceItem
                  key={service.id}
                  label={service.name}
                  price={`+$${service.price}`}
                  checked={isSelected}
                  onChange={() => {
                    if (isSelected) {
                      onChange({ additionalServiceIds: formData.additionalServiceIds.filter(id => id !== service.id) });
                    } else {
                      onChange({ additionalServiceIds: [...formData.additionalServiceIds, service.id] });
                    }
                  }}
                />
              );
            })}
          </div>
        </div>
      </div>

      <BookingStepFooter
        onContinue={onContinue}
      />
    </div>
  );
}

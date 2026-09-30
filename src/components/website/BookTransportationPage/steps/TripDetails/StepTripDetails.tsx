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
  const additionalServices = vehicle.additionalServices ?? vehicleDetailsData?.additional_services ?? [];
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

  const { language } = useTranslation();
  const { data: routesData } = useSWR(
    vehicle.id ? `/vehicles/${vehicle.id}/routes/?lang=${language}` : null,
    fetcher
  );

  const pickupOptions = useMemo(() => {
    const routes = Array.isArray(routesData) ? routesData : [];
    const uniqueFrom = Array.from(new Set(routes.map((r: any) => r.from_location).filter(Boolean)));
    return [
      { label: t("transportBooking.rideDetails.selectPickup", "Select pickup location"), value: "" },
      ...uniqueFrom.map((loc) => ({ label: loc, value: loc })),
    ];
  }, [routesData, t]);

  const dropoffOptions = useMemo(() => {
    const routes = Array.isArray(routesData) ? routesData : [];
    if (!formData.pickupLocation) {
      return [{ label: t("transportBooking.rideDetails.selectDropoff", "Select drop-off location"), value: "" }];
    }
    const filtered = routes.filter(
      (r: any) => r.from_location?.toLowerCase() === formData.pickupLocation.toLowerCase()
    );
    const uniqueTo = Array.from(new Set(filtered.map((r: any) => r.to_location).filter(Boolean)));
    return [
      { label: t("transportBooking.rideDetails.selectDropoff", "Select drop-off location"), value: "" },
      ...uniqueTo.map((loc) => ({ label: loc, value: loc })),
    ];
  }, [routesData, formData.pickupLocation, t]);

  useEffect(() => {
    const routes = Array.isArray(routesData) ? routesData : [];
    if (!formData.pickupLocation || !formData.dropoffLocation) {
      if (formData.routeId) {
        onChange({
          routeId: null,
          routePrice: 0,
          routePriceEgp: undefined,
          routePriceEur: undefined,
          selectedRoute: null,
        });
      }
      return;
    }
    const matched = routes.find(
      (r: any) =>
        r.from_location?.toLowerCase() === formData.pickupLocation.toLowerCase() &&
        r.to_location?.toLowerCase() === formData.dropoffLocation.toLowerCase()
    );
    if (matched && matched.id !== formData.routeId) {
      onChange({
        routeId: matched.id,
        routePrice: parseFloat(matched.price) || 0,
        routePriceEgp: matched.price_egp ? parseFloat(matched.price_egp) : undefined,
        routePriceEur: matched.price_eur ? parseFloat(matched.price_eur) : undefined,
        selectedRoute: matched,
      });
    }
  }, [routesData, formData.pickupLocation, formData.dropoffLocation, formData.routeId, onChange]);

  const handlePickupChange = (newPickup: string) => {
    const routes = Array.isArray(routesData) ? routesData : [];
    const isValidDropoff = routes.some(
      (r: any) =>
        r.from_location?.toLowerCase() === newPickup.toLowerCase() &&
        r.to_location?.toLowerCase() === formData.dropoffLocation?.toLowerCase()
    );
    onChange({
      pickupLocation: newPickup,
      dropoffLocation: isValidDropoff ? formData.dropoffLocation : "",
      routeId: null,
      selectedRoute: null,
    });
  };

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
          required
          wrapperClassName={styles.formField}
          error={errors.pickupLocation}
        >
          <SelectDropdown
            id="pickup-location-select"
            label={t("transportBooking.rideDetails.selectPickup", "Select pickup location")}
            options={pickupOptions}
            value={formData.pickupLocation}
            onChange={handlePickupChange}
            triggerClassName={`${formStyles.input} ${styles.tallInput} ${errors.pickupLocation ? formStyles.inputInvalid : ""}`}
            error={!!errors.pickupLocation}
          />
        </FormField>
        <FormField
          label={t("transportBooking.rideDetails.dropoffLocation", "Drop-off Location")}
          required
          wrapperClassName={styles.formField}
          error={errors.dropoffLocation}
        >
          <SelectDropdown
            id="dropoff-location-select"
            label={t("transportBooking.rideDetails.selectDropoff", "Select drop-off location")}
            options={dropoffOptions}
            value={formData.dropoffLocation}
            onChange={(val) => onChange({ dropoffLocation: val })}
            triggerClassName={`${formStyles.input} ${styles.tallInput} ${errors.dropoffLocation ? formStyles.inputInvalid : ""}`}
            error={!!errors.dropoffLocation}
            disabled={!formData.pickupLocation}
          />
        </FormField>


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

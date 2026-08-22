import React, { useMemo, useEffect } from "react";
import Image from "next/image";
import DashboardField from "@/components/dashboard/shared/DashboardField/DashboardField";
import dashboardFieldStyles from "@/components/dashboard/shared/DashboardField/DashboardField.module.scss";
import CheckboxIndicator from "@/components/shared/CheckboxIndicator/CheckboxIndicator";
import { CustomDatePicker, TimePicker } from "@/components/shared";
import useSWR from "swr";
import { getCatalogVehicles } from "@/services/admin/adminCatalogVehiclesService";
import { apiClient } from "@/lib/api";
import { AddTransportationBookingData } from "../../AddTransportationBookingModal";
import styles from "./StepBookingDetails.module.scss";

interface StepBookingDetailsProps {
  formData: AddTransportationBookingData;
  onChange: (patch: Partial<AddTransportationBookingData>) => void;
  errors?: Record<string, string>;
}

export default function StepBookingDetails({ formData, onChange, errors = {} }: StepBookingDetailsProps) {
  const { data: vehiclesData } = useSWR(
    "/catalog/vehicles/", 
    () => getCatalogVehicles({ publish_status: "published" })
  );

  const { data: vehicleDetailsData } = useSWR(
    formData.vehicleId ? `/vehicles/${formData.vehicleId}/` : null,
    (url) => apiClient.get(url)
  );

  const vehicles = vehiclesData?.results || vehiclesData?.data?.results || [];
  const additionalServices = (vehicleDetailsData as any)?.additional_services || [];

  const selectedVehicle = vehicles.find((v: any) => String(v.id) === String(formData.vehicleId));
  const maxPassengers = Math.max(1, (vehicleDetailsData as any)?.passengers || selectedVehicle?.passengers || 1);
  const maxLuggage = Math.max(0, (vehicleDetailsData as any)?.luggage_capacity ?? selectedVehicle?.luggage_capacity ?? (typeof selectedVehicle?.luggage === "number" ? selectedVehicle?.luggage : parseInt(selectedVehicle?.luggage) || 0));

  const passengerOptions = useMemo(() => {
    return Array.from({ length: maxPassengers }, (_, i) => {
      const val = i + 1;
      return {
        label: `${val} Passenger${val > 1 ? "s" : ""}`,
        value: val.toString(),
      };
    });
  }, [maxPassengers]);

  const luggageOptions = useMemo(() => {
    if (maxLuggage === 0) {
      return [{ label: "0 Bags", value: "0" }];
    }
    return Array.from({ length: maxLuggage }, (_, i) => {
      const val = i + 1;
      return {
        label: `${val} Bag${val > 1 ? "s" : ""}`,
        value: val.toString(),
      };
    });
  }, [maxLuggage]);

  useEffect(() => {
    if (formData.passengers > maxPassengers) {
      onChange({ passengers: maxPassengers });
    }
    const currentLuggage = parseInt(formData.luggage) || 0;
    if (currentLuggage > maxLuggage && maxLuggage >= 0) {
      onChange({ luggage: maxLuggage.toString() });
    }
  }, [maxPassengers, maxLuggage, formData.passengers, formData.luggage, onChange]);

  return (
    <div className={styles.container}>
      <div className={styles.row}>
        <div className={styles.col}>
          <DashboardField
            control="select"
            label="Vehicle"
            options={[
              { label: "Select Vehicle...", value: "", disabled: true },
              ...vehicles.map((v: any) => ({
                label: `${v.name} ${v.vehicle_type ? `(${v.vehicle_type})` : ''}`,
                value: String(v.id)
              }))
            ]}
            value={formData.vehicleId ? String(formData.vehicleId) : ""}
            onChange={(e: any) => onChange({ vehicleId: e.target.value ? parseInt(e.target.value) : null })}
            error={errors.vehicleId}
          />
        </div>
        <div className={styles.col}>
          <DashboardField
            control="input"
            label="Distance (km)"
            placeholder="e.g. 50"
            type="number"
            value={formData.distanceKm}
            onChange={(e: any) => onChange({ distanceKm: e.target.value })}
          />
        </div>
      </div>

      <div className={styles.row}>
        <div className={styles.col}>
          <DashboardField
            control="input"
            label="Pickup Location"
            placeholder="Luxor, Luxor Airport."
            value={formData.pickupLocation}
            onChange={(e: any) => onChange({ pickupLocation: e.target.value })}
            error={errors.pickupLocation}
          />
        </div>
        <div className={styles.col}>
          <DashboardField
            control="input"
            label="Drop-off Location"
            placeholder="Luxor, next to Ahmed Ali st."
            value={formData.dropoffLocation}
            onChange={(e: any) => onChange({ dropoffLocation: e.target.value })}
            error={errors.dropoffLocation}
          />
        </div>
      </div>

      <div className={styles.row}>
        <div className={styles.col}>
          <div className={dashboardFieldStyles.field}>
            <label className={dashboardFieldStyles.label}>Pickup Date</label>
            <div className={dashboardFieldStyles.control}>
              <CustomDatePicker
                variant="input"
                value={formData.pickupDate}
                onChange={(v) => onChange({ pickupDate: v })}
                className={`${dashboardFieldStyles.input} ${dashboardFieldStyles.hasAdornment} ${errors.pickupDate ? styles.hasError : ""}`}
              />
              <div className={dashboardFieldStyles.endAdornment} style={{ pointerEvents: 'none' }}>
                 <Image src="/images/calendar-gray.svg" alt="" width={20} height={20} />
              </div>
            </div>
            {errors.pickupDate && (
              <div className={styles.errorMessage}>
                <Image src="/images/information-fill.svg" alt="" width={16} height={16} />
                <span>{errors.pickupDate}</span>
              </div>
            )}
          </div>
        </div>
        <div className={styles.col}>
          <div className={dashboardFieldStyles.field}>
            <label className={dashboardFieldStyles.label}>Pickup Time</label>
            <div className={dashboardFieldStyles.control}>
              <div className={styles.timePickerWrapper}>
                <TimePicker
                  variant="input"
                  value={formData.pickupTime}
                  onChange={(v, str) => onChange({ pickupTime: str })}
                  className={`${dashboardFieldStyles.input} ${dashboardFieldStyles.hasAdornment} ${errors.pickupTime ? styles.hasError : ""}`}
                />
                <div className={dashboardFieldStyles.endAdornment} style={{ pointerEvents: 'none' }}>
                   <Image src="/images/clock-gray.svg" alt="" width={20} height={20} />
                </div>
              </div>
            </div>
            {errors.pickupTime && (
              <div className={styles.errorMessage}>
                <Image src="/images/information-fill.svg" alt="" width={16} height={16} />
                <span>{errors.pickupTime}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className={styles.row}>
        <div className={styles.col}>
          <div className={styles.tripTypeWrapper}>
            <label className={styles.fieldLabel}>Trip Type</label>
            <div className={styles.tripTypeContainer}>
              <button
                type="button"
                className={`${styles.tripTypeBtn} ${formData.tripType === "one_way" ? styles.tripTypeActive : ""}`}
                onClick={() => onChange({ tripType: "one_way" })}
              >
                <CheckboxIndicator selected={formData.tripType === "one_way"} variant="radio" size="lg" />
                <span>One Way</span>
              </button>
              <button
                type="button"
                className={`${styles.tripTypeBtn} ${formData.tripType === "round_trip" ? styles.tripTypeActive : ""}`}
                onClick={() => onChange({ tripType: "round_trip" })}
              >
                <CheckboxIndicator selected={formData.tripType === "round_trip"} variant="radio" size="lg" />
                <span>Round Trip</span>
              </button>
              <button
                type="button"
                className={`${styles.tripTypeBtn} ${formData.tripType === "multi_day" ? styles.tripTypeActive : ""}`}
                onClick={() => onChange({ tripType: "multi_day" })}
              >
                <CheckboxIndicator selected={formData.tripType === "multi_day"} variant="radio" size="lg" />
                <span>Multi-day</span>
              </button>
            </div>
          </div>
        </div>
        <div className={styles.col}></div>
      </div>

      <div className={styles.row}>
        <div className={styles.col}>
          <DashboardField
            control="select"
            label="Passengers"
            options={passengerOptions}
            value={formData.passengers.toString()}
            onChange={(e: any) => onChange({ passengers: parseInt(e.target.value) || 1 })}
          />
        </div>
        <div className={styles.col}>
          <DashboardField
            control="select"
            label="Luggage"
            options={luggageOptions}
            value={formData.luggage}
            onChange={(e: any) => onChange({ luggage: e.target.value })}
          />
        </div>
      </div>

      <div className={styles.additionalServices}>
        <label className={styles.fieldLabel}>Additional Services</label>
        <div className={styles.servicesGrid}>
          {additionalServices.map((service: any) => {
            const isSelected = formData.additionalServiceIds.includes(service.id);
            return (
              <button
                key={service.id}
                type="button"
                className={`${styles.serviceCard} ${isSelected ? styles.serviceActive : ""}`}
                onClick={() => {
                  if (isSelected) {
                    onChange({ additionalServiceIds: formData.additionalServiceIds.filter((id: number) => id !== service.id) });
                  } else {
                    onChange({ additionalServiceIds: [...formData.additionalServiceIds, service.id] });
                  }
                }}
              >
                <CheckboxIndicator selected={isSelected} variant="square" size="lg" />
                <div className={styles.serviceText}>
                  <span className={styles.serviceTitle}>{service.name}</span>
                  <span className={styles.servicePrice}>+${service.price}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

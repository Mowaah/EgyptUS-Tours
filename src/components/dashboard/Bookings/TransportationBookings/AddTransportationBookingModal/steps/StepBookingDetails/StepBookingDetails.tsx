import React from "react";
import Image from "next/image";
import DashboardField from "@/components/dashboard/shared/DashboardField/DashboardField";
import dashboardFieldStyles from "@/components/dashboard/shared/DashboardField/DashboardField.module.scss";
import CheckboxIndicator from "@/components/shared/CheckboxIndicator/CheckboxIndicator";
import { CustomDatePicker, TimePicker } from "@/components/shared";
import { AddTransportationBookingData } from "../../AddTransportationBookingModal";
import styles from "./StepBookingDetails.module.scss";

interface StepBookingDetailsProps {
  formData: AddTransportationBookingData;
  onChange: (patch: Partial<AddTransportationBookingData>) => void;
}

export default function StepBookingDetails({ formData, onChange }: StepBookingDetailsProps) {
  return (
    <div className={styles.container}>
      <div className={styles.row}>
        <div className={styles.col}>
          <DashboardField
            control="select"
            label="Vehicle Type"
            options={[
              { label: "Select Vehicle Type", value: "", disabled: true },
              { label: "Sedan", value: "Sedan" },
              { label: "SUV", value: "SUV" },
              { label: "Van", value: "Van" },
              { label: "Bus", value: "Bus" },
            ]}
            value={formData.vehicleType}
            onChange={(e: any) => onChange({ vehicleType: e.target.value })}
          />
        </div>
        <div className={styles.col}>
          <DashboardField
            control="select"
            label="Specific Vehicle"
            options={[
              { label: "Select Vehicle Type first...", value: "", disabled: true },
              { label: "Toyota Camry", value: "Toyota Camry" },
              { label: "Hyundai Tucson", value: "Hyundai Tucson" },
              { label: "Mercedes Sprinter", value: "Mercedes Sprinter" },
            ]}
            value={formData.specificVehicle}
            onChange={(e: any) => onChange({ specificVehicle: e.target.value })}
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
          />
        </div>
        <div className={styles.col}>
          <DashboardField
            control="input"
            label="Drop-off Location"
            placeholder="Luxor, next to Ahmed Ali st."
            value={formData.dropoffLocation}
            onChange={(e: any) => onChange({ dropoffLocation: e.target.value })}
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
                value={formData.date}
                onChange={(v) => onChange({ date: v })}
                className={`${dashboardFieldStyles.input} ${dashboardFieldStyles.hasAdornment}`}
              />
              <div className={dashboardFieldStyles.endAdornment} style={{ pointerEvents: 'none' }}>
                 <Image src="/images/calendar-gray.svg" alt="" width={20} height={20} />
              </div>
            </div>
          </div>
        </div>
        <div className={styles.col}>
          <div className={dashboardFieldStyles.field}>
            <label className={dashboardFieldStyles.label}>Pickup Time</label>
            <div className={dashboardFieldStyles.control}>
              <div className={styles.timePickerWrapper}>
                <TimePicker
                  variant="input"
                  value={formData.time}
                  onChange={(v, str) => onChange({ time: str })}
                  className={`${dashboardFieldStyles.input} ${dashboardFieldStyles.hasAdornment}`}
                />
                <div className={dashboardFieldStyles.endAdornment} style={{ pointerEvents: 'none' }}>
                   <Image src="/images/clock-gray.svg" alt="" width={20} height={20} />
                </div>
              </div>
            </div>
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
                className={`${styles.tripTypeBtn} ${formData.tripType === "One Way" ? styles.tripTypeActive : ""}`}
                onClick={() => onChange({ tripType: "One Way" })}
              >
                <CheckboxIndicator selected={formData.tripType === "One Way"} variant="radio" size="lg" />
                <span>One Way</span>
              </button>
              <button
                type="button"
                className={`${styles.tripTypeBtn} ${formData.tripType === "Round Trip" ? styles.tripTypeActive : ""}`}
                onClick={() => onChange({ tripType: "Round Trip" })}
              >
                <CheckboxIndicator selected={formData.tripType === "Round Trip"} variant="radio" size="lg" />
                <span>Round Trip</span>
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
            options={[
              { label: "1 Passenger", value: "1" },
              { label: "2 Passengers", value: "2" },
              { label: "3 Passengers", value: "3" },
              { label: "4 Passengers", value: "4" },
              { label: "5+ Passengers", value: "5" },
            ]}
            value={formData.passengers.toString()}
            onChange={(e: any) => onChange({ passengers: parseInt(e.target.value) || 1 })}
          />
        </div>
        <div className={styles.col}>
          <DashboardField
            control="select"
            label="Luggage"
            options={[
              { label: "0 Bags", value: "0" },
              { label: "1 Bag", value: "1" },
              { label: "2 Bags", value: "2" },
              { label: "3 Bags", value: "3" },
              { label: "4+ Bags", value: "4" },
            ]}
            value={formData.luggage.toString()}
            onChange={(e: any) => onChange({ luggage: parseInt(e.target.value) || 0 })}
          />
        </div>
      </div>

      <div className={styles.additionalServices}>
        <label className={styles.fieldLabel}>Additional Services</label>
        <div className={styles.servicesGrid}>
          <button
            type="button"
            className={`${styles.serviceCard} ${formData.childSeat ? styles.serviceActive : ""}`}
            onClick={() => onChange({ childSeat: !formData.childSeat })}
          >
            <CheckboxIndicator selected={formData.childSeat} variant="square" size="lg" />
            <div className={styles.serviceText}>
              <span className={styles.serviceTitle}>Child Seat</span>
              <span className={styles.servicePrice}>+$10.00</span>
            </div>
          </button>

          <button
            type="button"
            className={`${styles.serviceCard} ${formData.extraLuggageSpace ? styles.serviceActive : ""}`}
            onClick={() => onChange({ extraLuggageSpace: !formData.extraLuggageSpace })}
          >
            <CheckboxIndicator selected={formData.extraLuggageSpace} variant="square" size="lg" />
            <div className={styles.serviceText}>
              <span className={styles.serviceTitle}>Extra Luggage Space</span>
              <span className={styles.servicePrice}>+$15.00</span>
            </div>
          </button>

          <button
            type="button"
            className={`${styles.serviceCard} ${formData.meetAndGreetService ? styles.serviceActive : ""}`}
            onClick={() => onChange({ meetAndGreetService: !formData.meetAndGreetService })}
          >
            <CheckboxIndicator selected={formData.meetAndGreetService} variant="square" size="lg" />
            <div className={styles.serviceText}>
              <span className={styles.serviceTitle}>Meet & Greet Service</span>
              <span className={styles.servicePrice}>+$20.00</span>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}

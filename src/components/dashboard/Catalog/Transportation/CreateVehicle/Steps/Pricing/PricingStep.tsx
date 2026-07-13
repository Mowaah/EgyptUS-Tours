import React, { useState } from "react";
import { useFormContext } from "react-hook-form";
import { FormSection } from "@/components/dashboard/FormFields";
import { CurrencyField } from "@/components/dashboard/shared";
import { CreateVehicleValues } from "../../CreateVehicleSchema";
import dashboardStyles from "../../CreateVehicle.module.scss";
import styles from "./PricingStep.module.scss";

export function PricingStep() {
  const { watch, control, setValue } = useFormContext<CreateVehicleValues>();

  const basePrice = watch("basePrice");
  const vat = watch("vat");
  const insurance = watch("insurance");
  const additionalServices = watch("additionalServices") || [];

  const numBase = parseFloat(basePrice as string) || 0;
  const numVat = parseFloat(vat as string) || 0;
  const numInsurance = parseFloat(insurance as string) || 0;
  // Mock values from Figma design
  const mockMeetAndGreet = 10;
  const mockExtraLuggage = 15;
  const total = numBase + numVat + numInsurance + mockMeetAndGreet + mockExtraLuggage;

  const ALL_SERVICES = [
    "Meet & Greet",
    "Extra Luggage",
    "Child Seat",
    "Waiting Time (Per Hour)",
    "Airport Parking Fee",
    "Night Service"
  ];

  const handleToggleService = (tag: string) => {
    if (additionalServices.includes(tag)) {
      setValue("additionalServices", additionalServices.filter((s) => s !== tag));
    } else {
      setValue("additionalServices", [...additionalServices, tag]);
    }
  };

  return (
    <div className={dashboardStyles.columnsContainer}>
      {/* Left: Pricing fields + Additional Services */}
      <div className={dashboardStyles.leftColumn} style={{ flex: 1.835 }}>
        <FormSection
          title="Pricing"
          iconSrc="/images/dashboard/catalog/trips/pricing.svg"
          className={styles.card}
        >
          <div className={styles.inputContainer}>
            <CurrencyField
              name="basePrice"
              label="Base Price Per Person ($)"
              control={control}
            />

            <div className={styles.inputRow}>
              <CurrencyField
                name="vat"
                label="Vat (14%)"
                control={control}
              />
              <CurrencyField
                name="insurance"
                label="Insurance Fee ($)"
                control={control}
              />
            </div>

            <CurrencyField
              name="pricePerKm"
              label="Price per Km ($)"
              control={control}
            />
          </div>
        </FormSection>

        <FormSection
          title="Additional Services"
          iconSrc="/images/dashboard/catalog/hotels/facilities.svg"
          className={styles.card}
        >
          <div className={styles.facilitiesTags}>
            {ALL_SERVICES.map((service) => {
              const isActive = additionalServices.includes(service);
              return (
                <div 
                  key={service} 
                  className={`${styles.facilityTag} ${isActive ? '' : styles.inactiveTag}`}
                  onClick={() => handleToggleService(service)}
                >
                  <span>{service}</span>
                  <button type="button">
                    {isActive ? (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 22C17.5 22 22 17.5 22 12C22 6.5 17.5 2 12 2C6.5 2 2 6.5 2 12C2 17.5 6.5 22 12 22Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M9.17 14.83L14.83 9.17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M14.83 14.83L9.17 9.17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    ) : (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 22C17.5 22 22 17.5 22 12C22 6.5 17.5 2 12 2C6.5 2 2 6.5 2 12C2 17.5 6.5 22 12 22Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M8 12H16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M12 16V8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        </FormSection>
      </div>

      {/* Right: Price Summary */}
      <div className={dashboardStyles.rightColumn} style={{ flex: 1 }}>
        <FormSection
          title="Price Summary"
          iconSrc="/images/dashboard/catalog/hotels/basic.svg"
          className={styles.summaryCard}
        >
          <div className={styles.summaryContainer}>
            <div className={styles.summaryRow}>
              <span className={styles.summaryLabel}>Base Price</span>
              <span className={styles.summaryValue}>{numBase}$</span>
            </div>
            <div className={styles.summaryRow}>
              <span className={styles.summaryLabel}>Vat (14%)</span>
              <span className={styles.summaryValue}>{numVat}$</span>
            </div>
            <div className={styles.summaryRow}>
              <span className={styles.summaryLabel}>Insurance</span>
              <span className={styles.summaryValue}>{numInsurance}$</span>
            </div>
            
            {/* Mock fields directly in the summary as requested */}
            <div className={styles.summaryRow}>
              <span className={styles.summaryLabel}>Meet & Greet</span>
              <span className={styles.summaryValue}>{mockMeetAndGreet}$</span>
            </div>
            <div className={styles.summaryRow}>
              <span className={styles.summaryLabel}>Extra Luggage</span>
              <span className={styles.summaryValue}>{mockExtraLuggage}$</span>
            </div>

            <div className={styles.totalRow}>
              <span className={styles.totalLabel}>Total Price Person</span>
              <span className={styles.totalValue}>{total}$</span>
            </div>
          </div>
        </FormSection>
      </div>
    </div>
  );
}

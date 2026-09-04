import React, { useState } from "react";
import { useFormContext } from "react-hook-form";
import { FormSection } from "@/components/dashboard/FormFields";
import { CurrencyField } from "@/components/dashboard/shared";
import { DASHBOARD_CURRENCY } from "@/constants/currency";
import { useVehicleAdditionalServices } from "@/hooks/useCatalogVehicles";
import { getLocalizedName } from "@/components/dashboard/shared/i18n";
import { CreateVehicleValues } from "../../CreateVehicleSchema";
import dashboardStyles from "../../CreateVehicle.module.scss";
import styles from "./PricingStep.module.scss";

export function PricingStep() {
  const { watch, control, setValue, formState: { errors } } = useFormContext<CreateVehicleValues>();

  const basePrice = watch("basePrice");
  const additionalServices = watch("additionalServices") || [];

  const numBase = parseFloat(basePrice as string) || 0;
  const { services } = useVehicleAdditionalServices();

  const selectedServices = services.filter((s: any) => additionalServices.includes(String(s.id)));
  const additionalServicesTotal = selectedServices.reduce((acc: number, s: any) => acc + (parseFloat(s.price) || 0), 0);
  const total = numBase + additionalServicesTotal;

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
              label={`Base Price Per Person (${DASHBOARD_CURRENCY.symbol})`}
              control={control}
              error={errors.basePrice?.message}
            />

            <CurrencyField
              name="pricePerKm"
              label={`Price per Km (${DASHBOARD_CURRENCY.symbol})`}
              control={control}
              error={errors.pricePerKm?.message}
            />
          </div>
        </FormSection>

        <FormSection
          title="Additional Services"
          iconSrc="/images/dashboard/catalog/hotels/facilities.svg"
          className={styles.card}
        >
          <div className={styles.facilitiesTags}>
            {services.map((service: any) => {
              const serviceId = String(service.id);
              const isActive = additionalServices.includes(serviceId);
              const serviceName = getLocalizedName(service, "English");
              return (
                <div 
                  key={serviceId} 
                  className={`${styles.facilityTag} ${isActive ? '' : styles.inactiveTag}`}
                  onClick={() => handleToggleService(serviceId)}
                >
                  <span>{serviceName}</span>
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
              <span className={styles.summaryValue}>{DASHBOARD_CURRENCY.symbol}{numBase}</span>
            </div>
            {selectedServices.map((service: any) => (
              <div key={service.id} className={styles.summaryRow}>
                <span className={styles.summaryLabel}>{getLocalizedName(service, "English")}</span>
                <span className={styles.summaryValue}>{DASHBOARD_CURRENCY.symbol}{service.price || 0}</span>
              </div>
            ))}

            <div className={styles.totalRow}>
              <span className={styles.totalLabel}>Total Price Person</span>
              <span className={styles.totalValue}>{DASHBOARD_CURRENCY.symbol}{total}</span>
            </div>
          </div>
        </FormSection>
      </div>
    </div>
  );
}

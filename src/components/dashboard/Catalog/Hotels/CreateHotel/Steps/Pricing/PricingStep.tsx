import React from "react";
import { useFormContext, Controller } from "react-hook-form";
import { FormSection } from "@/components/dashboard/FormFields";
import DashboardField from "@/components/dashboard/shared/DashboardField/DashboardField";
import { CreateHotelValues } from "../../CreateHotelSchema";
import dashboardStyles from "../../CreateHotel.module.scss";
import { CurrencyField } from "@/components/dashboard/shared";
import styles from "./PricingStep.module.scss";



export function PricingStep() {
  const { watch, control } = useFormContext<CreateHotelValues>();

  const basePrice = watch("basePrice");
  const vat = watch("vat");
  const insurance = watch("insurance");

  const numBase = parseFloat(basePrice as string) || 0;
  const numVat = parseFloat(vat as string) || 0;
  const numInsurance = parseFloat(insurance as string) || 0;
  const total = numBase + numVat + numInsurance;

  return (
    <div className={dashboardStyles.columnsContainer}>
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
          </div>
        </FormSection>
      </div>

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

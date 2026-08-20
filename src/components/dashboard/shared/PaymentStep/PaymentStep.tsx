import React, { useState } from "react";
import styles from "./PaymentStep.module.scss";

export interface PaymentStepProps {
  total: number;
  paymentPlan?: "deposit" | "full";
  onChangePlan?: (plan: "deposit" | "full") => void;
  paymentMethod?: "cash" | "paymob";
  onChangeMethod?: (method: "cash" | "paymob") => void;
}

export default function PaymentStep({
  total,
  paymentPlan: propPlan,
  onChangePlan,
  paymentMethod: propMethod,
  onChangeMethod,
}: PaymentStepProps) {
  const [internalPlan, setInternalPlan] = useState<"deposit" | "full">("deposit");
  const [internalMethod, setInternalMethod] = useState<"cash" | "paymob">("cash");

  const paymentPlan = propPlan ?? internalPlan;
  const paymentMethod = propMethod ?? internalMethod;

  const handlePlanChange = (p: "deposit" | "full") => {
    setInternalPlan(p);
    onChangePlan?.(p);
  };

  const handleMethodChange = (m: "cash" | "paymob") => {
    setInternalMethod(m);
    onChangeMethod?.(m);
  };

  const amountDue = paymentPlan === "deposit" ? total * 0.3 : total;
  const remainingBalance = total - amountDue;

  return (
    <div className={styles.container}>
      {/* Payment Plan */}
      <div className={styles.section}>
        <div className={styles.label}>Payment Plan</div>
        <div className={styles.optionsRow}>
          <button
            type="button"
            className={`${styles.optionCard} ${paymentPlan === "deposit" ? styles.selected : ""}`}
            onClick={() => handlePlanChange("deposit")}
          >
            <div className={styles.radioCircle}>
              {paymentPlan === "deposit" && (
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" className={styles.checkIcon}>
                  <path
                    d="M5 13l4 4L19 7"
                    stroke="#FFFFFF"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )}
            </div>
            <span className={styles.optionText}>Deposit (30%)</span>
          </button>

          <button
            type="button"
            className={`${styles.optionCard} ${paymentPlan === "full" ? styles.selected : ""}`}
            onClick={() => handlePlanChange("full")}
          >
            <div className={styles.radioCircle}>
              {paymentPlan === "full" && (
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" className={styles.checkIcon}>
                  <path
                    d="M5 13l4 4L19 7"
                    stroke="#FFFFFF"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )}
            </div>
            <span className={styles.optionText}>Full Payment</span>
          </button>
        </div>
      </div>

      {/* Payment Method */}
      <div className={styles.section}>
        <div className={styles.label}>Payment Method</div>
        <div className={styles.optionsRow}>
          <button
            type="button"
            className={`${styles.optionCard} ${paymentMethod === "cash" ? styles.selected : ""}`}
            onClick={() => handleMethodChange("cash")}
          >
            <div className={styles.radioCircle}>
              {paymentMethod === "cash" && (
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" className={styles.checkIcon}>
                  <path
                    d="M5 13l4 4L19 7"
                    stroke="#FFFFFF"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )}
            </div>
            <span className={styles.optionText}>Cash</span>
          </button>

          <button
            type="button"
            className={`${styles.optionCard} ${paymentMethod === "paymob" ? styles.selected : ""}`}
            onClick={() => handleMethodChange("paymob")}
          >
            <div className={styles.radioCircle}>
              {paymentMethod === "paymob" && (
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" className={styles.checkIcon}>
                  <path
                    d="M5 13l4 4L19 7"
                    stroke="#FFFFFF"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )}
            </div>
            <span className={styles.optionText}>Paymob</span>
          </button>
        </div>
      </div>

      {/* Summary Block */}
      <div className={styles.summaryBlock}>
        <div className={styles.summaryItem}>
          <span className={styles.summaryLabel}>Package Total</span>
          <span className={styles.summaryValue}>${total.toFixed(2)}</span>
        </div>
        <div className={styles.summaryItem}>
          <span className={styles.summaryLabel}>Amount Due Today</span>
          <span className={styles.summaryValue}>${amountDue.toFixed(2)}</span>
        </div>
        <div className={styles.summaryItem}>
          <span className={styles.summaryLabel}>Remaining Balance</span>
          <span className={styles.summaryValue}>${remainingBalance.toFixed(2)}</span>
        </div>
      </div>

      {/* Generate Payment Link Button */}
      {paymentMethod === "paymob" && (
        <button type="button" className={styles.generateLinkBtn}>
          <span className={styles.generateLinkText}>Generate Payment Link</span>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className={styles.addCircleIcon}>
            <circle cx="12" cy="12" r="10" stroke="#2971E6" strokeWidth="1.5" />
            <path d="M12 8V16M8 12H16" stroke="#2971E6" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </button>
      )}
    </div>
  );
}

import React, { useState } from "react";
import Image from "next/image";
import styles from "./StepPayment.module.scss";

export default function StepPayment() {
  const [paymentPlan, setPaymentPlan] = useState<"deposit" | "full">("deposit");
  const [paymentMethod, setPaymentMethod] = useState<"cash" | "paymob">("cash");

  return (
    <div className={styles.container}>
      {/* Payment Plan */}
      <div className={styles.section}>
        <div className={styles.label}>Payment Plan</div>
        <div className={styles.optionsRow}>
          <button
            type="button"
            className={`${styles.optionCard} ${paymentPlan === "deposit" ? styles.selected : ""}`}
            onClick={() => setPaymentPlan("deposit")}
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
            onClick={() => setPaymentPlan("full")}
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
            onClick={() => setPaymentMethod("cash")}
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
            onClick={() => setPaymentMethod("paymob")}
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
          <span className={styles.summaryValue}>$2,500</span>
        </div>
        <div className={styles.summaryItem}>
          <span className={styles.summaryLabel}>Amount Due Today</span>
          <span className={styles.summaryValue}>$750</span>
        </div>
        <div className={styles.summaryItem}>
          <span className={styles.summaryLabel}>Remaining Balance</span>
          <span className={styles.summaryValue}>$1,750</span>
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

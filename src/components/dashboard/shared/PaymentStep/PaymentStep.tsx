import React, { useState } from "react";
import Image from "next/image";
import { DASHBOARD_CURRENCY } from "@/constants/currency";
import styles from "./PaymentStep.module.scss";

export interface PaymentStepProps {
  total: number;
  paymentPlan?: "deposit" | "full";
  onChangePlan?: (plan: "deposit" | "full") => void;
  paymentMethod?: "cash" | "paymob";
  onChangeMethod?: (method: "cash" | "paymob") => void;
  onGenerateLink?: () => void;
  isSubmitting?: boolean;
  paymentUrl?: string;
  paymentStatus?: "pending" | "partially_paid" | "paid" | string;
}

export default function PaymentStep({
  total,
  paymentPlan: propPlan,
  onChangePlan,
  paymentMethod: propMethod,
  onChangeMethod,
  onGenerateLink,
  isSubmitting,
  paymentUrl,
  paymentStatus,
}: PaymentStepProps) {
  const [internalPlan, setInternalPlan] = useState<"deposit" | "full">("deposit");
  const [internalMethod, setInternalMethod] = useState<"cash" | "paymob">("cash");
  const [copied, setCopied] = useState(false);

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

      {/* Generate Payment Link Button OR Result */}
      {paymentMethod === "paymob" && onGenerateLink && !paymentUrl && (
        <button 
          type="button" 
          className={styles.generateLinkBtn} 
          onClick={onGenerateLink}
          disabled={isSubmitting}
        >
          <span className={styles.generateLinkText}>
            {isSubmitting ? "Generating..." : "Generate Payment Link"}
          </span>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className={styles.addCircleIcon}>
            <path
              d="M12 22C17.5 22 22 17.5 22 12C22 6.5 17.5 2 12 2C6.5 2 2 6.5 2 12C2 17.5 6.5 22 12 22Z"
              stroke="#2971E6"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M8 12H16"
              stroke="#2971E6"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M12 16V8"
              stroke="#2971E6"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      )}

      {/* Generated Link UI */}
      {paymentUrl && (
        <div className={styles.generatedLinkContainer}>
          <div className={styles.generatedLinkRow}>
            <span className={styles.generatedLinkLabel}>Payment URL:&nbsp;</span>
            <div className={styles.generatedLinkRight}>
              <span className={styles.paymentUrlText}>{paymentUrl}</span>
              <div className={styles.copyContainer}>
                <button 
                  type="button"
                  className={styles.copyIconButton}
                  onClick={() => {
                    navigator.clipboard.writeText(paymentUrl);
                    setCopied(true);
                    setTimeout(() => setCopied(false), 2000);
                  }}
                  aria-label="Copy URL"
                >
                  <Image src="/images/dashboard/copy.svg" alt="Copy URL" width={24} height={24} />
                </button>
                <div className={`${styles.copyTooltip} ${copied ? styles.copiedText : ""}`}>
                  {copied ? "Copied!" : "Copy URL"}
                </div>
              </div>
            </div>
          </div>
          <div className={styles.generatedLinkRow}>
            <span className={styles.generatedLinkLabel}>Payment Status</span>
            <div className={styles.generatedLinkRight}>
              <span className={`${styles.paymentStatusPill} ${paymentStatus === 'paid' ? styles.statusPaid : styles.statusPending}`}>
                {paymentStatus === 'paid' ? 'Paid' : 'Awaiting Payment'}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Summary Block */}
      <div className={styles.summaryBlock}>
        <div className={styles.summaryItem}>
          <span className={styles.summaryLabel}>Package Total</span>
          <span className={styles.summaryValue}>{DASHBOARD_CURRENCY.symbol}{total.toFixed(2)}</span>
        </div>
        <div className={styles.summaryItem}>
          <span className={styles.summaryLabel}>Amount Due Today</span>
          <span className={styles.summaryValue}>{DASHBOARD_CURRENCY.symbol}{amountDue.toFixed(2)}</span>
        </div>
        <div className={styles.summaryItem}>
          <span className={styles.summaryLabel}>Remaining Balance</span>
          <span className={styles.summaryValue}>{DASHBOARD_CURRENCY.symbol}{remainingBalance.toFixed(2)}</span>
        </div>
      </div>

    </div>
  );
}

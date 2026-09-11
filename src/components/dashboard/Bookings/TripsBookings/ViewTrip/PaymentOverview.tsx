import React from "react";
import Image from "next/image";
import styles from "./ViewTrip.module.scss";

interface PaymentOverviewProps {
  overview: any;
  payload?: any;
}

export default function PaymentOverview({ overview, payload }: PaymentOverviewProps) {
  let total = Number(
    overview?.total_package ??
    overview?.total ??
    payload?.price_details?.total ??
    payload?.total_price ??
    payload?.total_amount ??
    0
  );

  if (total === 0 && payload?.price_details) {
    const items = payload.price_details.line_items || payload.price_details.items || [];
    total = items.reduce((acc: number, item: any) => acc + Number(item.price || item.amount || item.line_total || 0), 0);
  }

  const rawCurrency = (payload?.currency || overview?.currency || "usd").toLowerCase();
  const currencySymbol = rawCurrency === "usd" ? "$" : rawCurrency === "eur" ? "€" : `${rawCurrency.toUpperCase()} `;

  const formatMoney = (amount: number | string) => {
    const num = typeof amount === "number" ? amount : parseFloat(String(amount));
    if (isNaN(num)) return "0";
    return num.toLocaleString("en-US", {
      minimumFractionDigits: num % 1 !== 0 ? 2 : 0,
      maximumFractionDigits: 2,
    });
  };

  const formatLabel = (str: string) => {
    if (!str) return "-";
    return str
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  };

  const paymentPlanRaw = String(overview?.payment_plan || payload?.payment_plan || "").toLowerCase();
  const isDeposit = !paymentPlanRaw || paymentPlanRaw.includes("deposit");

  const depositPercentage = Number(String(overview?.deposit_percentage || "").replace("%", "")) || 30;
  const depositAmount = overview?.deposit_amount 
    ? Number(overview.deposit_amount) 
    : (total * (depositPercentage / 100));
  const remainingPercent = 100 - depositPercentage;
  const remainingAmount = Math.max(0, total - depositAmount);

  const paymentPlanDisplay = overview?.payment_plan_label || (isDeposit ? `Deposit (${depositPercentage}%)` : "Full Payment");
  const paymentMethodDisplay = formatLabel(overview?.payment_method || payload?.payment_method || "-");

  const isRefunded = 
    payload?.operational_status === "refunded" || 
    payload?.operational_status === "no_refund" || 
    payload?.operational_status === "no_refunded" || 
    payload?.operational_status === "no_refunded_amount";

  const refunded = Number(overview?.refunded_amount || payload?.refunded_amount || 0);

  return (
    <div className={styles.card}>
      <div className={styles.cardTitle}>
        <div className={styles.titleLeft}>
          <div className={styles.titleIcon}>
            <Image src="/images/dashboard/booking/trips/view/payment.svg" alt="" width={20} height={20} aria-hidden />
          </div>
          Payment Overview
        </div>
      </div>

      <div className={styles.infoList}>
        <div className={styles.infoRow}>
          <span className={styles.infoLabel}>Payment Plan</span>
          <span className={styles.infoValue}>{paymentPlanDisplay}</span>
        </div>

        <div className={styles.infoRow}>
          <span className={styles.infoLabel}>Payment Method</span>
          <span className={styles.infoValue}>{paymentMethodDisplay}</span>
        </div>

        <div className={styles.infoRow}>
          <span className={styles.infoLabel}>Total Package</span>
          <span className={`${styles.infoValue} ${styles.paymentTotal}`}>
            {currencySymbol}{formatMoney(total)}
          </span>
        </div>

        {isDeposit ? (
          <>
            <div className={styles.infoRow}>
              <span className={styles.infoLabel}>Deposit ({depositPercentage}%)</span>
              <span className={`${styles.infoValue} ${styles.paymentAmount}`}>
                {currencySymbol}{formatMoney(depositAmount)}
              </span>
            </div>

            <div className={styles.infoRow}>
              <span className={styles.infoLabel}>Remaining ({remainingPercent}%)</span>
              <span className={`${styles.infoValue} ${styles.paymentAmount}`}>
                {currencySymbol}{formatMoney(remainingAmount)}
              </span>
            </div>
          </>
        ) : (
          <div className={styles.infoRow}>
            <span className={styles.infoLabel}>Payment Amount (100%)</span>
            <span className={`${styles.infoValue} ${styles.paymentAmount}`}>
              {currencySymbol}{formatMoney(total)}
            </span>
          </div>
        )}

        {isRefunded && (
          <div className={styles.infoRow}>
            <span className={styles.infoLabel}>Refunded Amount</span>
            <span className={`${styles.infoValue} ${styles.refundedAmount}`}>
              {refunded > 0 ? `${currencySymbol}${formatMoney(refunded)}` : "No Refunded Amount"}
            </span>
          </div>
        )}

        {!isRefunded && refunded > 0 && (
          <div className={styles.infoRow}>
            <span className={styles.infoLabel}>Refunded Amount</span>
            <span className={`${styles.infoValue} ${styles.refundedAmount}`}>
              {currencySymbol}{formatMoney(refunded)}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

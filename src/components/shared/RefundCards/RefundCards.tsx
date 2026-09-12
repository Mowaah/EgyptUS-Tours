"use client";

import React from "react";
import Image from "next/image";
import { useTranslation } from "@/hooks/useTranslation";
import { getLocalizedPolicyLabel } from "@/utils/cancellationPolicy";
import { BASE_URL } from "@/lib/api";
import styles from "./RefundCards.module.scss";

export interface RefundBankDetailsData {
  account_holder_name?: string;
  bank_name?: string;
  bank_country?: string;
  country?: string;
  account_number?: string;
  bank_account_number?: string;
  iban?: string;
  swift?: string;
  swift_code?: string;
}

export interface RefundSummaryData {
  package_total?: number | string;
  paid_to_date?: number | string;
  paid_amount?: number | string;
  days_before_travel?: number | string;
  policy_applied?: string;
  deduction_percentage?: number | string;
  deduction_percent?: number | string;
  deduction_amount?: number | string;
  refund_amount?: number | string;
  transaction_reference?: string;
  reference?: string;
}

interface RefundBankDetailsCardProps {
  data: RefundBankDetailsData;
  className?: string;
}

export function RefundBankDetailsCard({ data, className }: RefundBankDetailsCardProps) {
  const { t } = useTranslation();

  const accountHolder = data.account_holder_name || "";
  const bankName = data.bank_name || "";
  const bankCountry = data.bank_country || data.country || "";
  const accountNumber = data.account_number || data.bank_account_number || "";
  const iban = data.iban || "";
  const swift = data.swift || data.swift_code || "";

  const rows = [
    { label: t("cancelModal.accountHolderName", "Account Holder Name"), value: accountHolder },
    { label: t("cancelModal.bankName", "Bank Name"), value: bankName },
    { label: t("cancelModal.bankCountry", "Bank Country"), value: bankCountry },
    { label: t("cancelModal.accountNumber", "Bank Account Number"), value: accountNumber },
    { label: t("cancelModal.iban", "IBAN"), value: iban },
    { label: t("cancelModal.swift", "SWIFT/BIC Code"), value: swift },
  ].filter((r) => Boolean(r.value));

  if (rows.length === 0) return null;

  return (
    <article className={`${styles.card} ${className ?? ""}`}>
      <header className={styles.header}>
        <div className={styles.iconWrap} aria-hidden>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M2 8.5H22" stroke="#BFC1C5" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M6 16.5H8" stroke="#BFC1C5" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M10.5 16.5H14.5" stroke="#BFC1C5" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M22 12.03V16.11C22 19.62 21.11 20.5 17.56 20.5H6.44C2.89 20.5 2 19.62 2 16.11V7.89C2 4.38 2.89 3.5 6.44 3.5H17.55C21.11 3.5 22 4.38 22 7.89V9.1" stroke="#BFC1C5" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <h3 className={styles.title}>{t("refund.bankDetailsTitle", "Refund Bank Details")}</h3>
      </header>

      <div className={styles.rowsList}>
        {rows.map((row) => (
          <div key={row.label} className={styles.row}>
            <span className={styles.label}>{row.label}</span>
            <span className={styles.value}>{row.value}</span>
          </div>
        ))}
      </div>
    </article>
  );
}

interface RefundSummaryCardProps {
  data: RefundSummaryData;
  receipt?: string;
  receiptFileName?: string;
  receiptFileSize?: string;
  reason?: string;
  currency?: string;
  className?: string;
}

const getFullReceiptUrl = (rawUrl?: string | null): string => {
  if (!rawUrl) return "#";
  if (
    rawUrl.startsWith("http://") ||
    rawUrl.startsWith("https://") ||
    rawUrl.startsWith("blob:") ||
    rawUrl.startsWith("data:")
  ) {
    return rawUrl;
  }
  const cleanBase = BASE_URL.replace(/\/$/, "");
  const cleanPath = rawUrl.startsWith("/") ? rawUrl : `/${rawUrl}`;
  return `${cleanBase}${cleanPath}`;
};

export function RefundSummaryCard({
  data,
  receipt,
  receiptFileName,
  receiptFileSize,
  reason,
  currency = "USD",
  className,
}: RefundSummaryCardProps) {
  const { t } = useTranslation();

  const resolveSymbol = (c?: string) => {
    const u = (c || "USD").toUpperCase();
    if (u === "EUR" || u === "€") return "€";
    if (u === "GBP" || u === "£") return "£";
    if (u === "EGP") return "EGP ";
    return "$";
  };

  const currSymbol = resolveSymbol(currency);

  const formatAmount = (val?: number | string | null) => {
    if (val == null || val === "") return "";
    const num = typeof val === "number" ? val : parseFloat(String(val).replace(/[^0-9.-]/g, ""));
    if (isNaN(num)) return String(val);
    return `${currSymbol}${num.toLocaleString()}`;
  };

  const pkgTotal = data.package_total;
  const paidToDate = data.paid_to_date ?? data.paid_amount;
  const daysBefore = data.days_before_travel;
  const policy = data.policy_applied;
  const deductionPct = data.deduction_percentage ?? data.deduction_percent;
  const deductionAmt = data.deduction_amount;
  const refundAmt = data.refund_amount;
  const ref = data.transaction_reference || data.reference;

  const rows: Array<{ label: string; value: string; isPill?: boolean }> = [];

  if (pkgTotal != null && pkgTotal !== "") {
    rows.push({ label: t("refund.packageTotal", "Package Total"), value: formatAmount(pkgTotal) });
  }
  if (paidToDate != null && paidToDate !== "") {
    rows.push({ label: t("refund.paidToDate", "Paid to Date"), value: formatAmount(paidToDate) });
  }
  if (daysBefore != null && daysBefore !== "") {
    rows.push({ label: t("refund.daysBeforeTravel", "Days Before Travel"), value: `${daysBefore} Days` });
  }
  if (policy) {
    rows.push({
      label: t("refund.cancellationPolicyApplied", "Cancellation Policy Applied"),
      value: getLocalizedPolicyLabel(policy, t),
    });
  }
  if (deductionPct != null && deductionPct !== "") {
    rows.push({ label: t("refund.deduction", "Deduction"), value: `${deductionPct}%` });
  }
  if (deductionAmt != null && deductionAmt !== "") {
    rows.push({ label: t("refund.deductionAmount", "Deduction Amount"), value: formatAmount(deductionAmt) });
  }
  if (refundAmt != null && refundAmt !== "") {
    rows.push({ label: t("refund.refundAmount", "Refund Amount"), value: formatAmount(refundAmt), isPill: true });
  }
  if (ref) {
    rows.push({ label: t("refund.transactionReference", "Transaction Reference"), value: ref });
  }

  const getFileNameFromUrl = (url: string) => {
    try {
      const pathOnly = url.split("?")[0].split("#")[0];
      const name = pathOnly.split("/").pop();
      return name ? decodeURIComponent(name) : "";
    } catch {
      return url.split("/").pop() || "";
    }
  };

  const effectiveFileName =
    receiptFileName ||
    (receipt ? getFileNameFromUrl(receipt) : "") ||
    "Refund Payment.pdf";
  const effectiveFileSize = receiptFileSize || "200 KB of 200 KB";
  const hasReceipt = Boolean(receipt);
  const receiptUrl = getFullReceiptUrl(receipt);

  if (rows.length === 0 && !hasReceipt && !reason) return null;

  return (
    <article className={`${styles.card} ${className ?? ""}`}>
      <header className={styles.header}>
        <div className={styles.iconWrap} aria-hidden>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M9.5 13.7483C9.5 14.7183 10.25 15.4983 11.17 15.4983H13.05C13.85 15.4983 14.5 14.8183 14.5 13.9683C14.5 13.0583 14.1 12.7283 13.51 12.5183L10.5 11.4683C9.91 11.2583 9.51001 10.9383 9.51001 10.0183C9.51001 9.17828 10.16 8.48828 10.96 8.48828H12.84C13.76 8.48828 14.51 9.26828 14.51 10.2383"
              stroke="#BFC1C5"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path d="M12 7.5V16.5" stroke="#BFC1C5" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M12 2C6.48 2 2 6.48 2 12C2 15.94 4.28001 19.35 7.60001 20.98" stroke="#BFC1C5" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M22 12C22 17.52 17.52 22 12 22" stroke="#BFC1C5" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M22 6V2H18" stroke="#BFC1C5" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M17 7L22 2" stroke="#BFC1C5" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <h3 className={styles.title}>{t("refund.summaryTitle", "Refund Summary")}</h3>
      </header>

      <div className={styles.rowsList}>
        {rows.map((row) => (
          <div key={row.label} className={styles.row}>
            <span className={styles.label}>{row.label}</span>
            {row.isPill ? (
              <span className={styles.refundAmountPill}>{row.value}</span>
            ) : (
              <span className={styles.value}>{row.value}</span>
            )}
          </div>
        ))}

        {hasReceipt && (
          <div className={styles.receiptSection}>
            <span className={styles.label}>{t("refund.refundReceipt", "Refund Receipt")}</span>
            <a
              href={receiptUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.pdfCard}
              download={effectiveFileName}
            >
              <div className={styles.pdfIcon} aria-hidden>
                <Image
                  src="/images/dashboard/file/pdf.svg"
                  alt="PDF"
                  width={40}
                  height={40}
                />
              </div>
              <div className={styles.pdfMeta}>
                <p className={styles.pdfTitle}>{effectiveFileName}</p>
                <span className={styles.pdfSubtitle}>{effectiveFileSize}</span>
              </div>
            </a>
          </div>
        )}

        {reason && (
          <div className={styles.reasonSection}>
            <span className={styles.label}>{t("refund.reason", "Reason")}</span>
            <p className={styles.reasonText}>{reason}</p>
          </div>
        )}
      </div>
    </article>
  );
}

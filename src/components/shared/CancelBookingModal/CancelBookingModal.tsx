"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import styles from "./CancelBookingModal.module.scss";
import SelectDropdown from "@/components/shared/SelectDropdown/SelectDropdown";
import NationalitySelect from "@/components/shared/NationalitySelect/NationalitySelect";
import FormField from "@/components/shared/FormField/FormField";
import CheckboxIndicator from "@/components/shared/CheckboxIndicator/CheckboxIndicator";

const CANCELLATION_REASONS = [
  { label: "Select a Reason", value: "", disabled: true, hidden: true },
  { label: "Change of plans", value: "Change of plans" },
  { label: "Medical reasons", value: "Medical reasons" },
  { label: "Travel restrictions", value: "Travel restrictions" },
  { label: "Personal reasons", value: "Personal reasons" },
  { label: "Found another option", value: "Found another option" },
  { label: "Other", value: "Other" },
];



import { RefundSummary } from "@/utils/cancellationPolicy";
import { useTranslation } from "@/hooks/useTranslation";
import { useCurrency } from "@/contexts/CurrencyContext";
import type { MultiCurrencyPrice } from "@/constants/currency";

export interface CancelBookingModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  refundSummary?: RefundSummary;
  currency?: string;
  loading?: boolean;
  error?: string | null;
}

export default function CancelBookingModal({
  open,
  onClose,
  onSubmit,
  refundSummary,
  currency,
  loading = false,
  error = null,
}: CancelBookingModalProps) {
  const { t } = useTranslation("common");
  const { formatCurrency } = useCurrency();
  const bookingCurr = (currency || "USD").toUpperCase();

  const toMultiPrice = (amt?: number | null): MultiCurrencyPrice | undefined => {
    if (amt == null || isNaN(amt)) return undefined;
    if (bookingCurr === "EGP" || bookingCurr === "£") return { egp: amt };
    if (bookingCurr === "EUR" || bookingCurr === "€") return { eur: amt };
    return { usd: amt };
  };
  const [reason, setReason] = useState("");
  const [detailedReason, setDetailedReason] = useState("");
  const [accountName, setAccountName] = useState("");
  const [bankName, setBankName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [iban, setIban] = useState("");
  const [swift, setSwift] = useState("");
  const [country, setCountry] = useState("Egypt");
  const [agreed, setAgreed] = useState(false);

  const [hasSubmitted, setHasSubmitted] = useState(false);

  const cancellationReasons = [
    { label: t("cancelModal.selectReason", "Select a Reason"), value: "", disabled: true, hidden: true },
    { label: t("cancelModal.reasons.changeOfPlans", "Change of plans"), value: "Change of plans" },
    { label: t("cancelModal.reasons.medical", "Medical reasons"), value: "Medical reasons" },
    { label: t("cancelModal.reasons.restrictions", "Travel restrictions"), value: "Travel restrictions" },
    { label: t("cancelModal.reasons.personal", "Personal reasons"), value: "Personal reasons" },
    { label: t("cancelModal.reasons.anotherOption", "Found another option"), value: "Found another option" },
    { label: t("cancelModal.reasons.other", "Other"), value: "Other" },
  ];

  useEffect(() => {
    if (!open) return;
    setReason("");
    setDetailedReason("");
    setAccountName("");
    setBankName("");
    setAccountNumber("");
    setIban("");
    setSwift("");
    setCountry("Egypt");
    setAgreed(false);
    setHasSubmitted(false);

    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  if (!open) return null;

  const isOther = reason === "Other";

  const getErrors = () => {
    const errs: Record<string, string> = {};

    if (!reason) {
      errs.reason = t("cancelModal.errors.reasonRequired", "Please select a cancellation reason.");
    }

    if (isOther) {
      if (!detailedReason.trim()) {
        errs.detailedReason = t("cancelModal.errors.detailedReasonRequired", "Please provide details for your cancellation.");
      } else if (detailedReason.trim().length < 5) {
        errs.detailedReason = t("cancelModal.errors.detailedReasonMin", "Please provide at least 5 characters.");
      }
    }

    if (!accountName.trim()) {
      errs.accountName = t("cancelModal.errors.accountNameRequired", "Account holder name is required.");
    } else if (accountName.trim().length < 3) {
      errs.accountName = t("cancelModal.errors.accountNameMin", "Account holder name must be at least 3 characters.");
    } else if (!/^[\p{L}\s.'-]+$/u.test(accountName.trim())) {
      errs.accountName = t("cancelModal.errors.accountNameInvalid", "Please enter a valid name.");
    }

    if (!bankName.trim()) {
      errs.bankName = t("cancelModal.errors.bankNameRequired", "Bank name is required.");
    } else if (bankName.trim().length < 2) {
      errs.bankName = t("cancelModal.errors.bankNameMin", "Bank name must be at least 2 characters.");
    }

    const cleanAcc = accountNumber.replace(/[\s-]/g, "");
    if (!accountNumber.trim()) {
      errs.accountNumber = t("cancelModal.errors.accountNumberRequired", "Account number is required.");
    } else if (cleanAcc.length < 6 || cleanAcc.length > 34 || !/^[A-Za-z0-9]+$/.test(cleanAcc)) {
      errs.accountNumber = t("cancelModal.errors.accountNumberInvalid", "Please enter a valid account number (6–34 characters).");
    }

    const cleanIban = iban.replace(/\s/g, "").toUpperCase();
    if (!iban.trim()) {
      errs.iban = t("cancelModal.errors.ibanRequired", "IBAN is required.");
    } else if (!/^[A-Z]{2}[0-9A-Z]{13,32}$/.test(cleanIban)) {
      errs.iban = t("cancelModal.errors.ibanInvalid", "Please enter a valid IBAN format.");
    }

    const cleanSwift = swift.replace(/\s/g, "").toUpperCase();
    if (!swift.trim()) {
      errs.swift = t("cancelModal.errors.swiftRequired", "SWIFT / BIC code is required.");
    } else if (!/^[A-Z]{4}[A-Z]{2}[A-Z0-9]{2}([A-Z0-9]{3})?$/.test(cleanSwift)) {
      errs.swift = t("cancelModal.errors.swiftInvalid", "Please enter a valid SWIFT/BIC code (8 or 11 characters).");
    }

    if (!country || !country.trim()) {
      errs.country = t("cancelModal.errors.countryRequired", "Please select a bank country.");
    }

    if (!agreed) {
      errs.agreed = t("cancelModal.errors.agreedRequired", "You must confirm and agree to proceed.");
    }

    return errs;
  };

  const errors = getErrors();
  const isFormValid = Object.keys(errors).length === 0;

  const getFieldError = (field: string) => {
    return hasSubmitted ? errors[field] : undefined;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setHasSubmitted(true);
    if (!isFormValid) return;

    onSubmit({
      reason,
      detailedReason: detailedReason.trim(),
      bankDetails: {
        accountName: accountName.trim(),
        bankName: bankName.trim(),
        accountNumber: accountNumber.trim(),
        iban: iban.replace(/\s/g, "").toUpperCase(),
        swift: swift.replace(/\s/g, "").toUpperCase(),
        country: country.trim(),
      },
    });
  };

  return (
    <div className={styles.overlay} onMouseDown={onClose}>
      <div className={styles.modal} onMouseDown={(e) => e.stopPropagation()}>
        <div className={styles.scrollableContent}>
          
          {/* Header */}
          <div className={styles.header}>
            <div className={styles.warningIconWrap}>
              <Image src="/images/confirm_cancel.svg" alt="Confirm Cancel" width={48} height={48} className={styles.warningIcon} />
            </div>
            <div className={styles.titleBlock}>
              <h2 className={styles.title}>{t("cancelModal.title", "Are you sure you want to cancel?")}</h2>
              <p className={styles.subtitle}>
                {t("cancelModal.subtitle", "Your refund amount will be calculated automatically based on the cancellation policy.")}
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} noValidate>
            {/* Cancellation Reason */}
            <div className={styles.formGroup}>
              <label className={styles.label}>{t("cancelModal.reasonLabel", "Cancellation Reason")} *</label>
              <SelectDropdown
                options={cancellationReasons}
                value={reason}
                onChange={(val) => {
                  setReason(val);
                  if (val !== "Other") {
                    setDetailedReason("");
                  }
                }}
                error={Boolean(getFieldError("reason"))}
              />
              {getFieldError("reason") && (
                <div className={styles.fieldError}>
                  <Image src="/images/information-fill.svg" alt="" width={16} height={16} aria-hidden="true" />
                  <span>{getFieldError("reason")}</span>
                </div>
              )}
            </div>

            {isOther && (
              <FormField
                isTextarea
                wrapperClassName={styles.formGroup}
                label={t("cancelModal.otherReasonLabel", "Reason:")}
                placeholder={t("cancelModal.otherReasonPlaceholder", "Please provide your reason...")}
                value={detailedReason}
                onChange={(e) => setDetailedReason(e.target.value)}
                error={getFieldError("detailedReason")}
                required
              />
            )}

            {/* Refund Summary */}
            <h3 className={styles.sectionTitle}>{t("cancelModal.refundSummary", "Refund Summary")}</h3>
            <div className={styles.summaryCard}>
              <div className={styles.summaryRow}>
                <span className={styles.summaryLabel}>{t("cancelModal.packageTotal", "Package Total")}</span>
                <span className={styles.summaryValue}>
                  {formatCurrency(toMultiPrice(refundSummary?.package_total))}
                </span>
              </div>
              {refundSummary?.paid_amount != null && (
                <div className={styles.summaryRow}>
                  <span className={styles.summaryLabel}>{t("cancelModal.paidToDate", "Paid to Date")}</span>
                  <span className={styles.summaryValue}>
                    {formatCurrency(toMultiPrice(refundSummary?.paid_amount))}
                  </span>
                </div>
              )}
              <div className={styles.summaryRow}>
                <span className={styles.summaryLabel}>{t("cancelModal.cancellationWindow", "Cancellation Window")}</span>
                <span className={styles.summaryValue}>{refundSummary?.policy_applied ?? "N/A"}</span>
              </div>
              <div className={styles.summaryRow}>
                <span className={styles.summaryLabel}>{t("cancelModal.deductionRate", "Deduction Rate")}</span>
                <span className={styles.summaryValue}>{refundSummary?.deduction_percentage ?? "0"}%</span>
              </div>
              <div className={styles.summaryRow}>
                <span className={styles.summaryLabel}>{t("cancelModal.deductionAmount", "Deduction Amount")}</span>
                <span className={styles.summaryValue}>
                  {formatCurrency(toMultiPrice(refundSummary?.deduction_amount))}
                </span>
              </div>
              <div className={styles.summaryRow}>
                <span className={styles.summaryLabel}>{t("cancelModal.estimatedRefund", "Estimated Refund")}</span>
                <div className={styles.estimatedRefund}>
                  <span>
                    {formatCurrency(toMultiPrice(refundSummary?.refund_amount))}
                  </span>
                </div>
              </div>
            </div>

            {/* Refund Bank Details */}
            <h3 className={styles.sectionTitle}>{t("cancelModal.bankInfo", "Refund Bank Details")}</h3>
            <div className={`${styles.summaryCard} ${styles.bankDetailsCard}`}>
              <FormField
                label={t("cancelModal.accountName", "Account Holder Name")}
                placeholder={t("cancelModal.accountName", "Account Holder Name")}
                value={accountName}
                onChange={(e) => setAccountName(e.target.value)}
                error={getFieldError("accountName")}
                required
              />

              <FormField
                label={t("cancelModal.bankName", "Bank Name")}
                placeholder={t("cancelModal.bankName", "Bank Name")}
                value={bankName}
                onChange={(e) => setBankName(e.target.value)}
                error={getFieldError("bankName")}
                required
              />

              <FormField
                label={t("cancelModal.accountNumber", "Bank Account Number")}
                placeholder={t("cancelModal.accountNumber", "Bank Account Number")}
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value)}
                error={getFieldError("accountNumber")}
                required
              />

              <FormField
                label={t("cancelModal.iban", "IBAN")}
                placeholder="EG12 XXXX XXXX XXXX XXXX XXXX"
                value={iban}
                onChange={(e) => setIban(e.target.value)}
                error={getFieldError("iban")}
                required
              />

              <FormField
                label={t("cancelModal.swift", "SWIFT Code")}
                placeholder="CIBEEGCX"
                value={swift}
                onChange={(e) => setSwift(e.target.value)}
                error={getFieldError("swift")}
                required
              />

              <div className={styles.formGroup} style={{ marginBottom: 0 }}>
                <label className={styles.label}>{t("cancelModal.country", "Country")} *</label>
                <NationalitySelect
                  useCountryName={true}
                  value={country}
                  onChange={setCountry}
                  error={Boolean(getFieldError("country"))}
                  placeholder={t("forms.selectCountry", "Select Country")}
                  placement="top"
                />
                {getFieldError("country") && (
                  <div className={styles.fieldError}>
                    <Image src="/images/information-fill.svg" alt="" width={16} height={16} aria-hidden="true" />
                    <span>{getFieldError("country")}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Terms Checkbox */}
            <div className={styles.checkboxContainer}>
              <label className={styles.checkboxWrap}>
                <input 
                  type="checkbox" 
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                  className={styles.hiddenCheckbox}
                  required
                />
                <CheckboxIndicator variant="square" size="md" selected={agreed} aria-hidden />
                <span className={styles.checkboxLabel}>
                  {t("cancelModal.agreePrefix", "I have read and agree to the")}{" "}
                  <a
                    href="/terms"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.policyLink}
                    onClick={(e) => {
                      e.stopPropagation();
                    }}
                  >
                    {t("cancelModal.cancellationPolicyLink", "Cancellation")}
                  </a>{" "}
                  {t("cancelModal.policySuffix", "Policy.")}
                </span>
              </label>
              {getFieldError("agreed") && (
                <div className={styles.agreedError}>
                  <Image src="/images/information-fill.svg" alt="" width={16} height={16} aria-hidden="true" />
                  <span>{getFieldError("agreed")}</span>
                </div>
              )}
            </div>

            {error && <p className={styles.errorText}>{error}</p>}

            {/* Actions */}
            <div className={styles.actions}>
              <button 
                type="button" 
                className={styles.btnOutline} 
                onClick={onClose}
                disabled={loading}
              >
                {t("cancelModal.keepBooking", "Keep Booking")}
              </button>
              <button 
                type="submit" 
                className={styles.btnSolid}
                disabled={loading}
              >
                {loading ? t("common.processing", "Processing...") : t("cancelModal.cancelAction", "Confirm Cancellation")}
              </button>
            </div>
          </form>

        </div>
      </div>
    </div>
  );
}

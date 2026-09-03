"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import styles from "./CancelBookingModal.module.scss";
import SelectDropdown from "@/components/shared/SelectDropdown/SelectDropdown";
import NationalitySelect from "@/components/shared/NationalitySelect/NationalitySelect";
import FormField from "@/components/shared/FormField/FormField";

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

export interface CancelBookingModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  refundSummary?: RefundSummary;
}

export default function CancelBookingModal({ open, onClose, onSubmit, refundSummary }: CancelBookingModalProps) {
  const { t } = useTranslation("common");
  const [reason, setReason] = useState("");
  const [detailedReason, setDetailedReason] = useState("");
  const [accountName, setAccountName] = useState("");
  const [bankName, setBankName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [iban, setIban] = useState("");
  const [swift, setSwift] = useState("");
  const [country, setCountry] = useState("Egypt");
  const [agreed, setAgreed] = useState(false);

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
    setCountry("");
    setAgreed(false);

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreed) return;

    onSubmit({
      reason,
      detailedReason,
      bankDetails: {
        accountName,
        bankName,
        accountNumber,
        iban,
        swift,
        country
      }
    });
  };

  const isFormValid = reason && detailedReason && accountName && bankName && accountNumber && iban && swift && country && agreed;

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

          <form onSubmit={handleSubmit}>
            {/* Cancellation Reason */}
            <div className={styles.formGroup}>
              <label className={styles.label}>{t("cancelModal.reasonLabel", "Cancellation Reason")} *</label>
              <SelectDropdown
                options={cancellationReasons}
                value={reason}
                onChange={(val) => setReason(val)}
              />
            </div>

            {reason && (
              <FormField
                isTextarea
                wrapperClassName={styles.formGroup}
                label={t("cancelModal.detailsLabel", "Additional Details (Optional)")}
                placeholder={t("cancelModal.detailsPlaceholder", "Please provide any additional context...")}
                value={detailedReason}
                onChange={(e) => setDetailedReason(e.target.value)}
                required
              />
            )}

            {/* Refund Summary */}
            <h3 className={styles.sectionTitle}>{t("cancelModal.refundSummary", "Refund Summary")}</h3>
            <div className={styles.summaryCard}>
              <div className={styles.summaryRow}>
                <span className={styles.summaryLabel}>{t("cancelModal.packageTotal", "Package Total")}</span>
                <span className={styles.summaryValue}>£{refundSummary?.package_total?.toLocaleString() ?? "0"}</span>
              </div>
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
                <span className={styles.summaryValue}>£{refundSummary?.deduction_amount?.toLocaleString() ?? "0"}</span>
              </div>
              <div className={styles.summaryRow}>
                <span className={styles.summaryLabel}>{t("cancelModal.estimatedRefund", "Estimated Refund")}</span>
                <div className={styles.estimatedRefund}>
                  <span style={{ marginLeft: "4px" }}>£{refundSummary?.refund_amount?.toLocaleString() ?? "0"}</span>
                </div>
              </div>
            </div>

            {/* Refund Bank Details */}
            <h3 className={styles.sectionTitle}>{t("cancelModal.bankInfo", "Refund Bank Details")}</h3>
            <div className={styles.summaryCard} style={{ gap: "14px" }}>
              <FormField
                label={t("cancelModal.accountName", "Account Holder Name")}
                placeholder={t("cancelModal.accountName", "Account Holder Name")}
                value={accountName}
                onChange={(e) => setAccountName(e.target.value)}
                required
              />

              <FormField
                label={t("cancelModal.bankName", "Bank Name")}
                placeholder={t("cancelModal.bankName", "Bank Name")}
                value={bankName}
                onChange={(e) => setBankName(e.target.value)}
                required
              />

              <FormField
                label={t("cancelModal.accountNumber", "Bank Account Number")}
                placeholder={t("cancelModal.accountNumber", "Bank Account Number")}
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value)}
                required
              />

              <FormField
                label={t("cancelModal.iban", "IBAN")}
                placeholder="EG12 XXXX XXXX XXXX XXXX XXXX"
                value={iban}
                onChange={(e) => setIban(e.target.value)}
                required
              />

              <FormField
                label={t("cancelModal.swift", "SWIFT Code")}
                placeholder="CIBEEGCX"
                value={swift}
                onChange={(e) => setSwift(e.target.value)}
                required
              />

              <div className={styles.formGroup} style={{ marginBottom: 0 }}>
                <label className={styles.label}>{t("cancelModal.country", "Country")} *</label>
                <NationalitySelect
                  useCountryName={true}
                  value={country}
                  onChange={(val) => setCountry(val)}
                  placeholder={t("forms.selectCountry", "Select Country")}
                  placement="top"
                />
              </div>
            </div>

            {/* Terms Checkbox */}
            <label className={styles.checkboxWrap}>
              <input 
                type="checkbox" 
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                required
              />
              <span className={styles.checkboxLabel}>
                {t("cancelModal.confirmText", "I confirm that I want to cancel this booking and agree to the cancellation policy.")}
              </span>
            </label>

            {/* Actions */}
            <div className={styles.actions}>
              <button 
                type="button" 
                className={styles.btnOutline} 
                onClick={onClose}
              >
                {t("cancelModal.keepBooking", "Keep Booking")}
              </button>
              <button 
                type="submit" 
                className={styles.btnSolid}
                disabled={!isFormValid}
              >
                {t("cancelModal.cancelAction", "Confirm Cancellation")}
              </button>
            </div>
          </form>

        </div>
      </div>
    </div>
  );
}

import { useState, useEffect, useMemo } from "react";
import { ModalHeader, ModalFooter } from "@/components/dashboard/shared";
import DashboardField from "@/components/dashboard/shared/DashboardField/DashboardField";
import { UploadDropzone } from "@/components/dashboard/FormFields/UploadDropzone";
import styles from "./RequestModals.module.scss";

interface RefundPaymentModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: { transaction_reference: string; notes: string; file: File | undefined }) => void;
  refundSummary?: {
    package_total: string;
    paid_amount?: string | number;
    days_before_travel: number;
    policy_applied: string;
    deduction_percentage: number;
    deduction_amount: string;
    refund_amount: string;
    currency: string;
  };
}

export default function RefundPaymentModal({ open, onClose, onSubmit, refundSummary }: RefundPaymentModalProps) {
  const [file, setFile] = useState<File | undefined>(undefined);
  const [transactionRef, setTransactionRef] = useState("");
  const [notes, setNotes] = useState("");

  const [transactionRefError, setTransactionRefError] = useState("");
  const [fileError, setFileError] = useState("");

  useEffect(() => {
    if (open) {
      setFile(undefined);
      setTransactionRef("");
      setNotes("");
      setTransactionRefError("");
      setFileError("");
    }
  }, [open]);

  const currencySymbol = useMemo(() => {
    const curr = (refundSummary?.currency || "$").trim().toUpperCase();
    if (curr === "EUR" || curr === "€") return "€";
    if (curr === "EGP") return "EGP ";
    return "$";
  }, [refundSummary?.currency]);

  const formatMoney = (val?: number | string) => {
    if (val === undefined || val === null || val === "") return "0.00";
    const num = typeof val === "string" ? parseFloat(val) : val;
    if (isNaN(num)) return "0.00";
    return num.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  if (!open) return null;

  const parsedRefundAmount = refundSummary?.refund_amount ? parseFloat(refundSummary.refund_amount) : 0;
  const isRefundable = parsedRefundAmount > 0;

  const handleSubmit = () => {
    let hasError = false;

    if (isRefundable) {
      if (transactionRef.trim() === "") {
        setTransactionRefError("Transaction reference is required.");
        hasError = true;
      } else {
        setTransactionRefError("");
      }

      if (!file) {
        setFileError("Refund receipt is required.");
        hasError = true;
      } else {
        setFileError("");
      }

      if (hasError) return;
    }

    onSubmit({
      transaction_reference: isRefundable ? transactionRef.trim() : (transactionRef.trim() || "N/A"),
      notes: notes.trim(),
      file: isRefundable ? file : undefined,
    });
    onClose();
  };

  return (
    <div className={styles.overlay} onMouseDown={onClose}>
      <div className={styles.modal} onMouseDown={(e) => e.stopPropagation()}>
        <ModalHeader
          title="Refund Payment"
          iconSrc="/images/dashboard/booking/refund.svg"
          onClose={onClose}
        />
        <div className={styles.body}>
          <div className={styles.summarySection}>

            <div className={styles.summaryRow}>
              <span className={styles.summaryLabel}>Package Total</span>
              <span className={styles.summaryValue}>{currencySymbol}{formatMoney(refundSummary?.package_total)}</span>
            </div>

            {refundSummary?.paid_amount != null && (
              <div className={styles.summaryRow}>
                <span className={styles.summaryLabel}>Paid to Date</span>
                <span className={styles.summaryValue}>{currencySymbol}{formatMoney(refundSummary.paid_amount)}</span>
              </div>
            )}

            <div className={styles.summaryRow}>
              <span className={styles.summaryLabel}>Days Before Travel</span>
              <span className={styles.summaryValue}>{refundSummary?.days_before_travel ?? "N/A"} Days</span>
            </div>

            <div className={styles.summaryRow}>
              <span className={styles.summaryLabel}>Cancellation Policy Applied</span>
              <span className={styles.summaryValue}>{refundSummary?.policy_applied || "N/A"}</span>
            </div>

            <div className={styles.summaryRow}>
              <span className={styles.summaryLabel}>Deduction</span>
              <span className={styles.summaryValue}>{refundSummary?.deduction_percentage !== undefined ? `${refundSummary.deduction_percentage}%` : "N/A"}</span>
            </div>

            <div className={styles.summaryRow}>
              <span className={styles.summaryLabel}>Deduction Amount</span>
              <span className={styles.summaryValue}>{currencySymbol}{formatMoney(refundSummary?.deduction_amount)}</span>
            </div>

            <div className={styles.summaryRow}>
              <span className={styles.summaryLabel}>Refund Amount</span>
              <div className={styles.refundAmountPill}>
                <span>{currencySymbol}{formatMoney(refundSummary?.refund_amount)}</span>
              </div>
            </div>

          </div>

          {isRefundable && (
            <>
              <DashboardField
                label="Transaction Reference"
                variant="modal"
                required
                id="txn-ref"
                placeholder="Enter transaction/reference number"
                value={transactionRef}
                onChange={(e) => {
                  setTransactionRef(e.target.value);
                  if (e.target.value.trim() !== "") setTransactionRefError("");
                }}
                error={transactionRefError}
              />

              <div className={styles.fieldGroup}>
                <label className={styles.fieldLabel}>Upload Refund Receipt <span className={styles.requiredStar}>*</span></label>
                <UploadDropzone
                  value={file}
                  onFileSelect={(f) => {
                    setFile(f ?? undefined);
                    if (f) setFileError("");
                  }}
                  accept="application/pdf, image/png, image/jpeg"
                  title="Click to upload a PDF File or PNG"
                  subtitle="up to 10MB"
                  error={fileError}
                />
              </div>

              <DashboardField
                label="Notes"
                control="textarea"
                variant="modal"
                id="notes"
                placeholder="Add any additional notes or important details related to this refund here."
                rows={4}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </>
          )}
        </div>
        <ModalFooter
          secondaryLabel="Cancel"
          primaryLabel="Confirm Refund"
          secondaryOnClick={onClose}
          primaryOnClick={handleSubmit}
        />
      </div>
    </div>
  );
}


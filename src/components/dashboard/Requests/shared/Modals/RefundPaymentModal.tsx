import { useState, useEffect } from "react";
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
  const [generalError, setGeneralError] = useState("");

  useEffect(() => {
    if (open) {
      setFile(undefined);
      setTransactionRef("");
      setNotes("");
      setTransactionRefError("");
      setFileError("");
      setGeneralError("");
    }
  }, [open]);

  if (!open) return null;

  const parsedRefundAmount = refundSummary?.refund_amount ? parseFloat(refundSummary.refund_amount) : 0;
  const isRefundable = parsedRefundAmount > 0;

  const handleSubmit = () => {
    let hasError = false;

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

    onSubmit({
      transaction_reference: transactionRef,
      notes,
      file,
    });
    onClose();
  };

  return (
    <div className={styles.overlay} onMouseDown={onClose}>
      <div className={styles.modal} style={{ width: "600px" }} onMouseDown={(e) => e.stopPropagation()}>
        <ModalHeader
          title="Refund Payment"
          iconSrc="/images/dashboard/requests/footer/refund-payment.svg"
          onClose={onClose}
        />
        <div className={styles.body}>
          <div style={{ display: "flex", flexDirection: "column", width: "100%", marginBottom: "24px" }}>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 0", borderBottom: "1px solid #F8FAFC" }}>
              <span style={{ color: "#A3A3A3", fontSize: "14px", fontWeight: 500 }}>Package Total</span>
              <span style={{ color: "#374151", fontSize: "16px", fontFamily: "Trip Sans", fontWeight: 500 }}>{refundSummary?.package_total ? `${refundSummary.currency?.toUpperCase() === 'GBP' ? '£' : refundSummary.currency?.toUpperCase() === 'USD' ? '$' : refundSummary.currency?.toUpperCase() || ''} ${parseFloat(refundSummary.package_total).toLocaleString()}` : "N/A"}</span>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 0", borderBottom: "1px solid #F8FAFC" }}>
              <span style={{ color: "#A3A3A3", fontSize: "14px", fontWeight: 500 }}>Days Before Travel</span>
              <span style={{ color: "#374151", fontSize: "16px", fontFamily: "Trip Sans", fontWeight: 500 }}>{refundSummary?.days_before_travel ?? "N/A"} Days</span>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 0", borderBottom: "1px solid #F8FAFC" }}>
              <span style={{ color: "#A3A3A3", fontSize: "14px", fontWeight: 500 }}>Cancellation Policy Applied</span>
              <span style={{ color: "#374151", fontSize: "16px", fontFamily: "Trip Sans", fontWeight: 500 }}>{refundSummary?.policy_applied || "N/A"}</span>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 0", borderBottom: "1px solid #F8FAFC" }}>
              <span style={{ color: "#A3A3A3", fontSize: "14px", fontWeight: 500 }}>Deduction</span>
              <span style={{ color: "#374151", fontSize: "16px", fontFamily: "Trip Sans", fontWeight: 500 }}>{refundSummary?.deduction_percentage !== undefined ? `${refundSummary.deduction_percentage}%` : "N/A"}</span>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 0", borderBottom: "1px solid #F8FAFC" }}>
              <span style={{ color: "#A3A3A3", fontSize: "14px", fontWeight: 500 }}>Deduction Amount</span>
              <span style={{ color: "#374151", fontSize: "16px", fontFamily: "Trip Sans", fontWeight: 500 }}>{refundSummary?.deduction_amount ? `${refundSummary.currency?.toUpperCase() === 'GBP' ? '£' : refundSummary.currency?.toUpperCase() === 'USD' ? '$' : refundSummary.currency?.toUpperCase() || ''} ${parseFloat(refundSummary.deduction_amount).toLocaleString()}` : "N/A"}</span>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 0", borderBottom: "1px solid #F8FAFC" }}>
              <span style={{ color: "#A3A3A3", fontSize: "14px", fontWeight: 500 }}>Refund Amount</span>
              <div style={{ background: "rgba(255, 102, 0, 0.1)", borderRadius: "128px", padding: "4px 12px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <span style={{ color: "#FF6600", fontSize: "16px", fontFamily: "Trip Sans", fontWeight: 500 }}>{refundSummary?.refund_amount ? `${refundSummary.currency?.toUpperCase() === 'GBP' ? '£' : refundSummary.currency?.toUpperCase() === 'USD' ? '$' : refundSummary.currency?.toUpperCase() || ''} ${parseFloat(refundSummary.refund_amount).toLocaleString()}` : "N/A"}</span>
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

              <div className={styles.fieldGroup} style={{ marginTop: "16px" }}>
                <label className={styles.fieldLabel}>Upload Refund Receipt <span style={{ color: "#EF4444" }}>*</span></label>
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
          primaryDisabled={!isRefundable}
        />
      </div>
    </div>
  );
}

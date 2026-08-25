import React, { useState, useEffect } from "react";
import Image from "next/image";
import { ModalHeader, ModalFooter } from "@/components/dashboard/shared";
import DashboardField from "@/components/dashboard/shared/DashboardField/DashboardField";
import { UploadDropzone } from "@/components/dashboard/FormFields/UploadDropzone";
import styles from "./RequestModals.module.scss";

interface RefundPaymentModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: { transaction_ref: string; notes: string; file: File | undefined }) => void;
}

export default function RefundPaymentModal({ open, onClose, onSubmit }: RefundPaymentModalProps) {
  const [file, setFile] = useState<File | undefined>(undefined);
  const [transactionRef, setTransactionRef] = useState("");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    if (open) {
      setFile(undefined);
      setTransactionRef("");
      setNotes("");
    }
  }, [open]);

  if (!open) return null;

  const handleSubmit = () => {
    onSubmit({
      transaction_ref: transactionRef,
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
            <span style={{ color: "#374151", fontSize: "16px", fontFamily: "Trip Sans", fontWeight: 500 }}>£2,500</span>
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 0", borderBottom: "1px solid #F8FAFC" }}>
            <span style={{ color: "#A3A3A3", fontSize: "14px", fontWeight: 500 }}>Days Before Travel</span>
            <span style={{ color: "#374151", fontSize: "16px", fontFamily: "Trip Sans", fontWeight: 500 }}>20 Days</span>
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 0", borderBottom: "1px solid #F8FAFC" }}>
            <span style={{ color: "#A3A3A3", fontSize: "14px", fontWeight: 500 }}>Cancellation Policy Applied</span>
            <span style={{ color: "#374151", fontSize: "16px", fontFamily: "Trip Sans", fontWeight: 500 }}>29-15 days before service</span>
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 0", borderBottom: "1px solid #F8FAFC" }}>
            <span style={{ color: "#A3A3A3", fontSize: "14px", fontWeight: 500 }}>Deduction</span>
            <span style={{ color: "#374151", fontSize: "16px", fontFamily: "Trip Sans", fontWeight: 500 }}>40%</span>
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 0", borderBottom: "1px solid #F8FAFC" }}>
            <span style={{ color: "#A3A3A3", fontSize: "14px", fontWeight: 500 }}>Deduction Amount</span>
            <span style={{ color: "#374151", fontSize: "16px", fontFamily: "Trip Sans", fontWeight: 500 }}>£1,000</span>
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 0", borderBottom: "1px solid #F8FAFC" }}>
            <span style={{ color: "#A3A3A3", fontSize: "14px", fontWeight: 500 }}>Refund Amount</span>
            <div style={{ background: "rgba(255, 102, 0, 0.1)", borderRadius: "128px", padding: "4px 12px", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ color: "#FF6600", fontSize: "16px", fontFamily: "Trip Sans", fontWeight: 500 }}>£1,500</span>
            </div>
          </div>
          
        </div>

        <DashboardField 
          label="Transaction Reference" 
          variant="modal" 
          required 
          id="txn-ref"
          placeholder="Enter transaction/reference number"
          value={transactionRef}
          onChange={(e) => setTransactionRef(e.target.value)}
        />
        
        <div className={styles.fieldGroup} style={{ marginTop: "16px" }}>
          <label className={styles.fieldLabel}>Upload Refund Receipt <span style={{ color: "#EF4444" }}>*</span></label>
          <UploadDropzone
            value={file}
            onFileSelect={(f) => setFile(f ?? undefined)}
            accept="application/pdf, image/png, image/jpeg"
            title="Click to upload a PDF File or PNG"
            subtitle="up to 10MB"
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

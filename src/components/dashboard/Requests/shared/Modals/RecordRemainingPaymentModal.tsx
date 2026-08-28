"use client";

import React, { useState, useEffect } from "react";
import { ModalHeader, ModalFooter } from "@/components/dashboard/shared";
import DashboardField from "@/components/dashboard/shared/DashboardField/DashboardField";
import rootStyles from "./RequestModals.module.scss";
import styles from "./ApproveRequestModal.module.scss";

interface RecordRemainingPaymentModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  paymentOverview?: {
    total_price: string;
    deposit_amount: string;
    remaining_balance: string;
    currency: string;
  };
}

export default function RecordRemainingPaymentModal({ open, onClose, onSubmit, paymentOverview }: RecordRemainingPaymentModalProps) {
  const [note, setNote] = useState("");

  useEffect(() => {
    if (!open) return;
    
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

  const handleSubmit = () => {
    onSubmit({ payment_note: note });
    onClose();
  };

  return (
    <div className={rootStyles.overlay} onMouseDown={onClose}>
      <div className={rootStyles.modal} style={{ width: "647px" }} onMouseDown={(e) => e.stopPropagation()}>
        <ModalHeader
          title="Record Remaining Payment"
          iconSrc="/images/dashboard/requests/footer/record-deposit-payment.svg"
          onClose={onClose}
          id="record-remaining-payment-modal"
        />
        <div className={styles.modalBody}>
          
          <div className={styles.fieldGroup}>
            <label className={styles.fieldLabel}>Total Trip Cost</label>
            <DashboardField
              control="input"
              label=""
              id="total-trip-cost"
              variant="modal"
              value={paymentOverview?.total_price ? `${paymentOverview.currency?.toUpperCase() === 'GBP' ? '£' : paymentOverview.currency?.toUpperCase() === 'USD' ? '$' : paymentOverview.currency?.toUpperCase() || ''} ${parseFloat(paymentOverview.total_price).toLocaleString()}` : "N/A"}
              disabled
              onChange={() => {}}
            />
          </div>

          <div className={styles.fieldGroup}>
            <DashboardField
              control="textarea"
              id="payment-note"
              label="Payment Note"
              variant="modal"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="This note is for internal use only and will not be visible to the customer."
              style={{ minHeight: "127px", resize: "none" }}
            />
          </div>

          <div className={styles.summaryBox}>
            <div className={styles.summaryCol}>
              <span className={styles.summaryTitle}>Deposit Amount</span>
              <span className={styles.summaryValue}>{paymentOverview?.deposit_amount ? `${paymentOverview.currency?.toUpperCase() === 'GBP' ? '£' : paymentOverview.currency?.toUpperCase() === 'USD' ? '$' : paymentOverview.currency?.toUpperCase() || ''} ${parseFloat(paymentOverview.deposit_amount).toLocaleString()}` : "N/A"}</span>
            </div>
            <div className={styles.summaryCol}>
              <span className={styles.summaryTitle}>Remaining Balance</span>
              <span className={styles.summaryValue}>{paymentOverview?.remaining_balance ? `${paymentOverview.currency?.toUpperCase() === 'GBP' ? '£' : paymentOverview.currency?.toUpperCase() === 'USD' ? '$' : paymentOverview.currency?.toUpperCase() || ''} ${parseFloat(paymentOverview.remaining_balance).toLocaleString()}` : "N/A"}</span>
            </div>
          </div>
          
        </div>
        <ModalFooter
          primaryLabel="Record Remaining Payment"
          secondaryLabel="Cancel"
          primaryOnClick={handleSubmit}
          secondaryOnClick={onClose}
        />
      </div>
    </div>
  );
}

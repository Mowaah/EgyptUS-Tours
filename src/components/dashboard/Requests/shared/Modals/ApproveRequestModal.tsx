"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { ModalHeader, ModalFooter } from "@/components/dashboard/shared";
import DashboardField from "@/components/dashboard/shared/DashboardField/DashboardField";
import rootStyles from "./RequestModals.module.scss";
import styles from "./ApproveRequestModal.module.scss";

interface ApproveRequestModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
}

export default function ApproveRequestModal({ open, onClose, onSubmit }: ApproveRequestModalProps) {
  const [totalCost, setTotalCost] = useState<number | undefined>();
  const [paymentPlan, setPaymentPlan] = useState<"30% Deposit" | "Full Payment">("30% Deposit");
  const [paymentMethod, setPaymentMethod] = useState<"Cash" | "Paymob">("Cash");
  const [paymentStatus, setPaymentStatus] = useState<"Pending" | "Deposit Paid" | "Full payment Paid">("Pending");
  const [approvalNote, setApprovalNote] = useState("");

  useEffect(() => {
    if (!open) return;
    
    // Reset or keep default state when opened
    // You could reset them if needed, but keeping defaults matches the mockups
    
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
    if (!totalCost || totalCost <= 0) {
      alert("Please enter a valid total trip cost.");
      return;
    }

    if (paymentMethod === "Paymob" && paymentStatus !== "Pending") {
      alert("Paymob payments cannot be manually marked as paid at approval. Please set the payment status to Pending.");
      return;
    }

    const payload: any = {
      total_price: totalCost,
      payment_plan: paymentPlan === "30% Deposit" ? "deposit" : "full",
      payment_method: paymentMethod.toLowerCase(),
      initial_payment_state: paymentStatus === "Pending" ? "pending" : "paid",
      approval_notes: approvalNote
    };

    if (paymentMethod === "Paymob") {
      payload.currency = "egp";
    }

    onSubmit(payload);
    onClose();
  };

  const depositAmount = paymentPlan === "30% Deposit" ? (totalCost || 0) * 0.3 : (totalCost || 0);
  const remainingBalance = (totalCost || 0) - depositAmount;

  const renderRadioCard = (label: string, checked: boolean, onChange: () => void) => (
    <div className={`${styles.radioCard} ${checked ? styles.selected : ""}`} onClick={onChange}>
      <div className={`${styles.radioCircle} ${checked ? styles.selected : ""}`}>
        {checked && <Image src="/images/check.svg" alt="check" width={15} height={15} />}
      </div>
      <span className={styles.radioLabel}>{label}</span>
    </div>
  );

  return (
    <div className={rootStyles.overlay} onMouseDown={onClose}>
      <div className={rootStyles.modal} style={{ width: "647px" }} onMouseDown={(e) => e.stopPropagation()}>
        <ModalHeader
          title="Approve Request"
          iconSrc="/images/dashboard/requests/footer/mark-as-approved.svg"
          onClose={onClose}
          id="approve-request-modal"
        />
        <div className={styles.modalBody}>
          
          <div className={styles.fieldGroup}>
            <label className={styles.fieldLabel}>Total Trip Cost</label>
            <DashboardField
              control="input"
              label=""
              id="total-trip-cost"
              variant="modal"
              value={totalCost === undefined ? "" : `£${totalCost.toLocaleString()}`}
              onChange={(e: any) => {
                const val = e.target.value.replace(/[^0-9]/g, "");
                setTotalCost(val ? parseInt(val, 10) : undefined);
              }}
              placeholder="£0"
            />
          </div>

          <div className={styles.fieldGroup}>
            <label className={styles.fieldLabel}>Payment Plan</label>
            <div className={styles.radioGroupRow}>
              {renderRadioCard("30% Deposit", paymentPlan === "30% Deposit", () => {
                setPaymentPlan("30% Deposit");
                if (paymentStatus === "Full payment Paid") setPaymentStatus("Pending");
              })}
              {renderRadioCard("Full Payment", paymentPlan === "Full Payment", () => {
                setPaymentPlan("Full Payment");
                if (paymentStatus === "Deposit Paid") setPaymentStatus("Pending");
              })}
            </div>
          </div>

          <div className={styles.fieldGroup}>
            <label className={styles.fieldLabel}>Payment Method</label>
            <div className={styles.radioGroupRow}>
              {renderRadioCard("Cash", paymentMethod === "Cash", () => setPaymentMethod("Cash"))}
              {renderRadioCard("Paymob", paymentMethod === "Paymob", () => setPaymentMethod("Paymob"))}
            </div>
          </div>

          <div className={styles.fieldGroup}>
            <label className={styles.fieldLabel}>Payment Status</label>
            <div className={styles.radioGroupRow}>
              {renderRadioCard("Pending", paymentStatus === "Pending", () => setPaymentStatus("Pending"))}
              {paymentPlan === "30% Deposit" 
                ? renderRadioCard("Deposit Paid", paymentStatus === "Deposit Paid", () => setPaymentStatus("Deposit Paid"))
                : renderRadioCard("Full payment Paid", paymentStatus === "Full payment Paid", () => setPaymentStatus("Full payment Paid"))
              }
            </div>
          </div>

          <div className={styles.fieldGroup}>
            <DashboardField
              control="textarea"
              id="approval-note"
              label="Approval Note"
              variant="modal"
              value={approvalNote}
              onChange={(e) => setApprovalNote(e.target.value)}
              placeholder="e.g. Customer approved the proposal via WhatsApp..."
              style={{ minHeight: "127px", resize: "none" }}
            />
          </div>

          <div className={styles.summaryBox}>
            <div className={styles.summaryCol}>
              <span className={styles.summaryTitle}>{paymentPlan === "30% Deposit" ? "Deposit Amount" : "Amount"}</span>
              <span className={styles.summaryValue}>${depositAmount.toLocaleString()}</span>
            </div>
            <div className={styles.summaryCol}>
              <span className={styles.summaryTitle}>Remaining Balance</span>
              <span className={styles.summaryValue}>${remainingBalance.toLocaleString()}</span>
            </div>
          </div>
          
        </div>
        <ModalFooter
          primaryLabel="Approve Request"
          secondaryLabel="Cancel"
          primaryOnClick={handleSubmit}
          secondaryOnClick={onClose}
        />
      </div>
    </div>
  );
}

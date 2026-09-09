"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { ModalHeader, ModalFooter } from "@/components/dashboard/shared";
import { CustomDatePicker } from "@/components/shared";
import DashboardField from "@/components/dashboard/shared/DashboardField/DashboardField";
import { DASHBOARD_CURRENCY } from "@/constants/currency";
import rootStyles from "./RequestModals.module.scss";
import styles from "./ApproveRequestModal.module.scss";

interface ApproveRequestModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  defaultStartDate?: string;
  defaultEndDate?: string;
}

const formatDateToMDY = (dateString?: string) => {
  if (!dateString) return "";
  if (/^\d{2}\/\d{2}\/\d{4}$/.test(dateString)) return dateString;
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
    const [yyyy, mm, dd] = dateString.split("-");
    return `${mm}/${dd}/${yyyy}`;
  }
  const d = new Date(dateString);
  if (isNaN(d.getTime())) return dateString;
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${mm}/${dd}/${yyyy}`;
};

const formatDateToYMD = (dateString?: string) => {
  if (!dateString) return undefined;
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) return dateString;
  const parts = dateString.split("/");
  if (parts.length === 3) {
    const [mm, dd, yyyy] = parts;
    return `${yyyy}-${mm.padStart(2, "0")}-${dd.padStart(2, "0")}`;
  }
  const d = new Date(dateString);
  if (isNaN(d.getTime())) return dateString;
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
};

export default function ApproveRequestModal({
  open,
  onClose,
  onSubmit,
  defaultStartDate,
  defaultEndDate,
}: ApproveRequestModalProps) {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [totalCost, setTotalCost] = useState<number | undefined>();
  const [paymentPlan, setPaymentPlan] = useState<"30% Deposit" | "Full Payment">("30% Deposit");
  const [paymentMethod, setPaymentMethod] = useState<"Cash" | "Paymob">("Cash");
  const [paymentStatus, setPaymentStatus] = useState<"Pending" | "Deposit Paid" | "Full payment Paid">("Pending");
  const [approvalNote, setApprovalNote] = useState("");
  const [errors, setErrors] = useState<{
    startDate?: string;
    endDate?: string;
    totalCost?: string;
  }>({});

  useEffect(() => {
    if (!open) return;
    
    setStartDate(defaultStartDate ? formatDateToMDY(defaultStartDate) : "");
    setEndDate(defaultEndDate ? formatDateToMDY(defaultEndDate) : "");
    setErrors({});
    
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
  }, [open, onClose, defaultStartDate, defaultEndDate]);

  if (!open) return null;

  const handleSubmit = () => {
    const newErrors: { startDate?: string; endDate?: string; totalCost?: string } = {};

    if (!startDate) {
      newErrors.startDate = "Start date is required.";
    }

    if (!endDate) {
      newErrors.endDate = "End date is required.";
    } else if (startDate) {
      const sYMD = formatDateToYMD(startDate);
      const eYMD = formatDateToYMD(endDate);
      if (sYMD && eYMD && sYMD > eYMD) {
        newErrors.endDate = "End date must be on or after start date.";
      }
    }

    if (!totalCost || totalCost <= 0) {
      newErrors.totalCost = "Please enter a valid total trip cost.";
    }

    if (paymentMethod === "Paymob" && paymentStatus !== "Pending") {
      alert("Paymob payments cannot be manually marked as paid at approval. Please set the payment status to Pending.");
      return;
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const payload: any = {
      start_date: formatDateToYMD(startDate),
      end_date: formatDateToYMD(endDate),
      total_price: totalCost,
      payment_plan: paymentPlan === "30% Deposit" ? "deposit" : "full",
      payment_method: paymentMethod.toLowerCase(),
      initial_payment_state: paymentStatus === "Pending" ? "pending" : "paid",
      approval_notes: approvalNote,
      currency: DASHBOARD_CURRENCY.code.toLowerCase(),
    };

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
          <div className={styles.twoColRow}>
            <div className={styles.col}>
              <label className={styles.fieldLabel}>Start Date</label>
              <CustomDatePicker
                variant="custom"
                value={startDate}
                onChange={(val) => {
                  setStartDate(val);
                  if (errors.startDate) {
                    setErrors((prev) => ({ ...prev, startDate: undefined }));
                  }
                }}
                renderTrigger={(isOpen, setIsOpen) => (
                  <div onClick={() => setIsOpen(!isOpen)} className={styles.datePickerTrigger}>
                    <DashboardField
                      control="input"
                      label=""
                      id="approve-start-date"
                      variant="modal"
                      startAdornment={
                        <Image src="/images/calendar3.svg" alt="calendar" width={20} height={20} />
                      }
                      value={startDate}
                      readOnly
                      placeholder="mm/dd/yyyy"
                      error={errors.startDate}
                      style={{ cursor: "pointer" }}
                    />
                  </div>
                )}
              />
            </div>

            <div className={styles.col}>
              <label className={styles.fieldLabel}>End Date</label>
              <CustomDatePicker
                variant="custom"
                value={endDate}
                onChange={(val) => {
                  setEndDate(val);
                  if (errors.endDate) {
                    setErrors((prev) => ({ ...prev, endDate: undefined }));
                  }
                }}
                minDate={startDate ? new Date(startDate) : null}
                renderTrigger={(isOpen, setIsOpen) => (
                  <div onClick={() => setIsOpen(!isOpen)} className={styles.datePickerTrigger}>
                    <DashboardField
                      control="input"
                      label=""
                      id="approve-end-date"
                      variant="modal"
                      startAdornment={
                        <Image src="/images/calendar3.svg" alt="calendar" width={20} height={20} />
                      }
                      value={endDate}
                      readOnly
                      placeholder="mm/dd/yyyy"
                      error={errors.endDate}
                      style={{ cursor: "pointer" }}
                    />
                  </div>
                )}
              />
            </div>
          </div>
          
          <div className={styles.fieldGroup}>
            <label className={styles.fieldLabel}>Total Trip Cost</label>
            <DashboardField
              control="input"
              label=""
              id="total-trip-cost"
              variant="modal"
              value={totalCost === undefined ? "" : `$${totalCost.toLocaleString()}`}
              onChange={(e: any) => {
                const val = e.target.value.replace(/[^0-9]/g, "");
                setTotalCost(val ? parseInt(val, 10) : undefined);
                if (errors.totalCost) {
                  setErrors((prev) => ({ ...prev, totalCost: undefined }));
                }
              }}
              placeholder="$0"
              error={errors.totalCost}
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
            <label className={styles.fieldLabel}>Approval Note</label>
            <DashboardField
              control="textarea"
              id="approval-note"
              label=""
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

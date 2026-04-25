"use client";

import React from "react";
import Image from "next/image";
import { FormField } from "@/components/shared";
import BookingStepFooter from "../BookingStepFooter/BookingStepFooter";
import styles from "./PaymentForm.module.scss";

export interface PaymentFormData {
  cardNumber: string;
  cardName: string;
  expiry: string;
  cvv: string;
}

interface PaymentFormProps {
  /** Controlled card field values */
  formData: PaymentFormData;
  onChange: (patch: Partial<PaymentFormData>) => void;
  /** Label shown inside the Confirm button, e.g. "Confirm & Pay $500 Deposit" */
  confirmLabel: React.ReactNode;
  onPrevious: () => void;
  onConfirm: () => void;
  /** Optional sidebar rendered to the right of the card (hotel summary, trip summary, etc.) */
  sidebar?: React.ReactNode;
}

export default function PaymentForm({
  formData,
  onChange,
  confirmLabel,
  onPrevious,
  onConfirm,
  sidebar,
}: PaymentFormProps) {
  return (
    <div className={sidebar ? styles.twoCol : undefined}>
      {/* ── Card ── */}
      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <h2 className={styles.cardTitle}>Payment Information</h2>
          <p className={styles.cardSubtitle}>
            Securely complete your payment to confirm your booking.
          </p>
        </div>

        <div className={styles.fields}>
          {/* Full-width fields */}
          <FormField
            id="pf-card-number"
            label="Card Number"
            type="text"
            placeholder="1234 5678 9012 3456"
            value={formData.cardNumber}
            onChange={(e) => onChange({ cardNumber: e.target.value })}
          />
          <FormField
            id="pf-card-name"
            label="Card Holder Name"
            type="text"
            placeholder="John Doe"
            value={formData.cardName}
            onChange={(e) => onChange({ cardName: e.target.value })}
          />

          {/* Two-column row */}
          <div className={styles.twoFields}>
            <FormField
              id="pf-expiry"
              label="Expiry Date"
              type="text"
              placeholder="MM/YY"
              value={formData.expiry}
              onChange={(e) => onChange({ expiry: e.target.value })}
            />
            <FormField
              id="pf-cvv"
              label="CVV"
              type="text"
              placeholder="123"
              value={formData.cvv}
              onChange={(e) => onChange({ cvv: e.target.value })}
            />
          </div>
        </div>

        {/* Secure badge */}
        <div className={styles.secureBadge}>
          <Image src="/images/secure.svg" width={24} height={24} alt="" />
          <div>
            <strong>Secure Payment</strong>
            Your payment information is encrypted and secure. We never store
            your card details.
          </div>
        </div>

        <BookingStepFooter
          onPrevious={onPrevious}
          onContinue={onConfirm}
          continueLabel={confirmLabel}
          showMoneyIcon
        />
      </div>

      {/* ── Optional sidebar ── */}
      {sidebar}
    </div>
  );
}

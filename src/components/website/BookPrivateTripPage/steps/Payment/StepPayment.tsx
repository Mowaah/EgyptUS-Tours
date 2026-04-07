import React from "react";
import Image from "next/image";
import { FormField } from "@/components/shared";
import planPage from "../../../PlanYourTripPage/PlanYourTripPage.module.scss";
import localStyles from "../../BookPrivateTripPage.module.scss";
import stepStyles from "./StepPayment.module.scss";
import { BookingData } from "../../BookPrivateTripPage";
import { Trip } from "@/types";
import RightSidebar from "@/components/shared/BookingSidebar/BookingSidebar";

interface StepPaymentProps {
  trip: Trip;
  formData: BookingData;
  onChange: (patch: Partial<BookingData>) => void;
  onPrevious: () => void;
  onContinue: () => void;
  totalAmount: number;
  depositAmount: number;
}

export default function StepPayment({
  trip,
  formData,
  onChange,
  onPrevious,
  onContinue,
  totalAmount,
  depositAmount
}: StepPaymentProps) {
  return (
    <div className={planPage.stepFormCard}>
      <header className={planPage.stepFormCardHeader}>
        <div className={`${planPage.formHeaderColumn} ${stepStyles.headerCol}`}>
          <h2 className={planPage.formTitle}>Review & Confirm Your Booking</h2>
          <p className={`${planPage.formSubtitle} ${stepStyles.subtitle}`}>Please review your trip details carefully before confirming your reservation.</p>
        </div>
      </header>

      <div className={localStyles.twoColumnLayout}>
        <div className={stepStyles.leftColumnCards}>
          <div className={stepStyles.paymentSection}>
            <div className={stepStyles.paymentSectionHeader}>
              <span className={stepStyles.paymentSectionTitle}>Payment Information</span>
            </div>

            <div className={planPage.formGrid}>
              <FormField
                id="payment-card-number"
                label="Card Number"
                className={planPage.formInput}
                wrapperClassName={planPage.formGroupFull}
                type="text"
                placeholder="1234 5678 9012 3456"
                value={formData.cardNumber}
                onChange={(e) => onChange({ cardNumber: e.target.value })}
              />

              <FormField
                id="payment-card-name"
                label="Card holder Name"
                className={planPage.formInput}
                wrapperClassName={planPage.formGroupFull}
                type="text"
                placeholder="John Doe"
                value={formData.cardName}
                onChange={(e) => onChange({ cardName: e.target.value })}
              />

              <FormField
                id="payment-expiry"
                label="Expiry Date"
                className={planPage.formInput}
                type="text"
                placeholder="MM/YY"
                value={formData.expiry}
                onChange={(e) => onChange({ expiry: e.target.value })}
              />

              <FormField
                id="payment-cvv"
                label="CVV"
                className={planPage.formInput}
                type="text"
                placeholder="123"
                value={formData.cvv}
                onChange={(e) => onChange({ cvv: e.target.value })}
              />
            </div>

            <div className={stepStyles.securePayment}>
              <Image src="/images/secure.svg" width={24} height={24} alt="" />
              <div>
                <strong>Secure Payment</strong>
                Your payment information is encrypted and secure. We never store your card details.
              </div>
            </div>
          </div>
        </div>

        <RightSidebar
          trip={trip}
          formData={formData}
          totalAmount={totalAmount}
          depositAmount={depositAmount}
        />
      </div>

      <hr className={planPage.stepFormCardDivider} aria-hidden="true" />

      <div className={planPage.stepFormCardFooter}>
        <div className={planPage.formActions}>
          <button className={planPage.previousButton} onClick={onPrevious} type="button">
            Previous
          </button>
          <button className={planPage.continueButton} onClick={onContinue} type="button">
            Confirm & Pay ${depositAmount.toLocaleString()} Deposit
          </button>
        </div>
      </div>
    </div>
  );
}

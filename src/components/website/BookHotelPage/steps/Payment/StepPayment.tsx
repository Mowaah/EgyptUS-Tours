import React from "react";
import Image from "next/image";
import { FormField } from "@/components/shared";
import planPage from "../../../PlanYourTripPage/PlanYourTripPage.module.scss";
import styles from "./StepPayment.module.scss";
import { BookingData } from "../../BookHotelPage";
import { Hotel } from "@/types";
import BookingSidebar from "@/components/shared/BookingSidebar/BookingSidebar";

interface StepPaymentProps {
  hotel: Hotel;
  formData: BookingData;
  onChange: (patch: Partial<BookingData>) => void;
  onPrevious: () => void;
  onContinue: () => void;
  totalAmount: number;
  vatAmount: number;
  depositAmount: number;
  totalRooms: number;
  totalGuests: number;
}

export default function StepPayment({
  hotel, formData, onChange, onPrevious, onContinue,
  totalAmount, vatAmount, depositAmount, totalRooms, totalGuests,
}: StepPaymentProps) {
  return (
    <div className={styles.root}>
      <div className={styles.twoColumnLayout}>
        <div className={styles.leftCol}>
          <div className={styles.paymentCard}>
            <h2 className={styles.cardTitle}>Payment Information</h2>
            <p className={styles.cardSubtitle}>Securely complete your payment to confirm your booking.</p>

            <div className={planPage.formGrid}>
              <FormField
                id="pay-card-number"
                label="Card Number"
                className={planPage.formInput}
                wrapperClassName={planPage.formGroupFull}
                type="text"
                placeholder="1234 5678 9012 3456"
                value={formData.cardNumber}
                onChange={(e) => onChange({ cardNumber: e.target.value })}
              />
              <FormField
                id="pay-card-name"
                label="Card holder Name"
                className={planPage.formInput}
                wrapperClassName={planPage.formGroupFull}
                type="text"
                placeholder="John Doe"
                value={formData.cardName}
                onChange={(e) => onChange({ cardName: e.target.value })}
              />
              <FormField
                id="pay-expiry"
                label="Expiry Date"
                className={planPage.formInput}
                type="text"
                placeholder="MM/YY"
                value={formData.expiry}
                onChange={(e) => onChange({ expiry: e.target.value })}
              />
              <FormField
                id="pay-cvv"
                label="CVV"
                className={planPage.formInput}
                type="text"
                placeholder="123"
                value={formData.cvv}
                onChange={(e) => onChange({ cvv: e.target.value })}
              />
            </div>

            <div className={styles.secureNotice}>
              <Image src="/images/secure.svg" width={20} height={20} alt="" />
              <div>
                <strong>Secure Payment</strong>
                Your payment information is encrypted and secure. We never store your card details.
              </div>
            </div>

            <hr className={planPage.stepFormCardDivider} aria-hidden="true" />

            <div className={planPage.formActions}>
              <button className={planPage.previousButton} onClick={onPrevious} type="button">Previous</button>
              <button className={planPage.continueButton} onClick={onContinue} type="button">
                Confirm &amp; Pay ${depositAmount.toFixed(2)} Deposit
                <Image src="/images/money-send.svg" width={24} height={24} alt="" />
              </button>
            </div>
          </div>
        </div>

        <BookingSidebar
          hotel={hotel}
          formData={formData}
          totalAmount={totalAmount}
          vatAmount={vatAmount}
          depositAmount={depositAmount}
          totalRooms={totalRooms}
          totalGuests={totalGuests}
        />
      </div>
    </div>
  );
}

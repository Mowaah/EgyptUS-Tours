import React from "react";
import Image from "next/image";
import planPage from "../../../PlanYourTripPage/PlanYourTripPage.module.scss";
import localStyles from "../../BookPrivateTripPage.module.scss";
import stepStyles from "./StepBookingSummary.module.scss";
import { BookingData } from "../../BookPrivateTripPage";
import { Trip } from "@/types";
import RightSidebar from "@/components/shared/BookingSidebar/BookingSidebar";

interface StepBookingSummaryProps {
  trip: Trip;
  formData: BookingData;
  onChange: (patch: Partial<BookingData>) => void;
  onPrevious: () => void;
  onContinue: () => void;
  totalAmount: number;
  depositAmount: number;
}

export default function StepBookingSummary({
  trip,
  formData,
  onChange,
  onPrevious,
  onContinue,
  totalAmount,
  depositAmount
}: StepBookingSummaryProps) {
  const specialRequestItems = formData.specialRequests
    ? formData.specialRequests.split(",").map((s) => s.trim()).filter(Boolean)
    : [];

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

          {/* Contact Info */}
          <div className={stepStyles.reviewSection}>
            <div className={stepStyles.reviewSectionHeader}>
              <div className={stepStyles.reviewSectionIcon}>
                <Image src="/images/summary/contact.svg" width={16} height={16} alt="" />
              </div>
              <span className={stepStyles.reviewSectionTitle}>Contact Info</span>
            </div>
            <div className={stepStyles.reviewGrid}>
              <div className={stepStyles.reviewItem}><label>Name</label><span>{formData.name}</span></div>
              <div className={stepStyles.reviewItem}><label>Email</label><span>{formData.email}</span></div>
              <div className={stepStyles.reviewItem}><label>Phone Number</label><span>{formData.phone}</span></div>
              <div className={stepStyles.reviewItem}><label>Nationality</label><span>{formData.nationality}</span></div>
            </div>
          </div>

          {/* Trip Info */}
          <div className={stepStyles.reviewSection}>
            <div className={stepStyles.reviewSectionHeader}>
              <div className={stepStyles.reviewSectionIcon}>
                <Image src="/images/summary/trip.svg" width={16} height={16} alt="" />
              </div>
              <span className={stepStyles.reviewSectionTitle}>Trip Info</span>
            </div>
            <div className={stepStyles.reviewGrid}>
              <div className={stepStyles.reviewItem}><label>Trip Name</label><span>{trip.title}</span></div>
              <div className={stepStyles.reviewItem}><label>Destination</label><span>Santorini, Greece</span></div>
              <div className={stepStyles.reviewItem}><label>Travel Type</label><span>Private</span></div>
              <div className={stepStyles.reviewItem}><label>Duration</label><span>7 Nights / 8 Days</span></div>
            </div>
          </div>

          {/* Rooms */}
          {(formData.rooms.single > 0 || formData.rooms.double > 0 || formData.rooms.triple > 0) && (
            <div className={stepStyles.reviewSection}>
              <div className={stepStyles.reviewSectionHeader}>
                <div className={stepStyles.reviewSectionIcon}>
                  <Image src="/images/summary/rooms.svg" width={16} height={16} alt="" />
                </div>
                <span className={stepStyles.reviewSectionTitle}>Rooms</span>
              </div>
              <ul className={stepStyles.reviewRoomsList}>
                {formData.rooms.single > 0 && <li>•&nbsp;&nbsp;&nbsp;{formData.rooms.single} × Single Room - Garden View</li>}
                {formData.rooms.double > 0 && <li>•&nbsp;&nbsp;&nbsp;{formData.rooms.double} × Double Room - Sea View</li>}
                {formData.rooms.triple > 0 && <li>•&nbsp;&nbsp;&nbsp;{formData.rooms.triple} × Triple Room - Garden View</li>}
              </ul>
            </div>
          )}

          {/* Special Requests */}
          <div className={stepStyles.reviewSection}>
            <div className={stepStyles.reviewSectionHeader}>
              <div className={stepStyles.reviewSectionIcon}>
                <Image src="/images/summary/special.svg" width={16} height={16} alt="" />
              </div>
              <span className={stepStyles.reviewSectionTitle}>Special Requests</span>
            </div>
            {specialRequestItems.length > 0 ? (
              <ul className={stepStyles.reviewSpecialList}>
                {specialRequestItems.map((item, i) => <li key={i}>•&nbsp;&nbsp;&nbsp;{item}</li>)}
              </ul>
            ) : (
              <p style={{ fontSize: '14px', color: '#999', margin: 0 }}>None</p>
            )}
          </div>

        </div>

        <RightSidebar
          trip={trip}
          formData={formData}
          totalAmount={totalAmount}
          depositAmount={depositAmount}
        />
      </div>

      <label className={stepStyles.checkboxRow}>
        <input
          type="checkbox"
          name="termsAccepted"
          checked={formData.termsAccepted}
          onChange={(e) => onChange({ termsAccepted: e.target.checked })}
          className={stepStyles.checkboxInputHidden}
        />
        <div className={`${stepStyles.checkboxBox} ${formData.termsAccepted ? stepStyles.checked : ''}`} />
        <span>I have read and agree to the <a href="#">Terms & Conditions and Cancellation</a> Policy.</span>
      </label>

      <hr className={planPage.stepFormCardDivider} aria-hidden="true" />

      <div className={planPage.stepFormCardFooter}>
        <div className={planPage.formActions}>
          <button className={planPage.previousButton} onClick={onPrevious} type="button">
            Previous
          </button>
          <button className={planPage.continueButton} onClick={onContinue} type="button" disabled={!formData.termsAccepted}>
            Continue To Payment
            <Image src="/images/money-send.svg" width={24} height={24} alt="" />
          </button>
        </div>
      </div>
    </div>
  );
}

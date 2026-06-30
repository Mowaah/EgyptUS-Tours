"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { ModalHeader, ModalFooter } from "@/components/dashboard/shared";
import { SuccessModal } from "@/components/shared";
import StatusPill from "@/components/shared/StatusPill/StatusPill";
import { IconStepper, IconStepDef } from "@/components/shared/IconStepper/IconStepper";

import StepGuestDetails from "./steps/StepGuestDetails/StepGuestDetails";
import StepBookingDetails from "./steps/StepBookingDetails/StepBookingDetails";
import StepBookingSummary from "./steps/StepBookingSummary/StepBookingSummary";
import StepPayment from "./steps/StepPayment/StepPayment";

import styles from "./AddTripBookingModal.module.scss";

interface AddTripBookingModalProps {
  open: boolean;
  onClose: () => void;
}

const STEPS: IconStepDef[] = [
  { label: "Guest Details", iconSrc: "/images/profile.svg" },
  { label: "Booking Details", iconSrc: "/images/dashboard/sidebar/plan-your-trip.svg" },
  { label: "Booking Summary", iconSrc: "/images/dashboard/sidebar/financial-reports.svg" },
  { label: "Payment & Confirmation", iconSrc: "/images/dashboard/sidebar/payments.svg" },
];

export interface AddTripBookingData {
  guestName: string;
  guestEmail: string;
  guestPhonePrefix: string;
  guestPhone: string;
  guestNationality: string;
  startDate: string;
  endDate: string;
  adults: number;
  children: number;
  infants: number;
  specialRequests: string;
  departureMonth: string;
  departureDateId: string;
  rooms: {
    single: number;
    double: number;
    triple: number;
  };
}

const INITIAL_DATA: AddTripBookingData = {
  guestName: "",
  guestEmail: "",
  guestPhonePrefix: "+1",
  guestPhone: "",
  guestNationality: "",
  startDate: "",
  endDate: "",
  adults: 0,
  children: 0,
  infants: 0,
  specialRequests: "",
  departureMonth: "",
  departureDateId: "",
  rooms: { single: 0, double: 0, triple: 0 },
};

export default function AddTripBookingModal({ open, onClose }: AddTripBookingModalProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [formData, setFormData] = useState<AddTripBookingData>(INITIAL_DATA);

  useEffect(() => {
    if (!open) return;
    
    // Reset state when opening
    setCurrentStep(0);
    setIsConfirmed(false);
    setFormData(INITIAL_DATA);

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

  const handleNext = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep((prev) => prev + 1);
    } else {
      setIsConfirmed(true);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleChange = (patch: Partial<AddTripBookingData>) => {
    setFormData((prev) => ({ ...prev, ...patch }));
  };

  if (isConfirmed) {
    return (
      <SuccessModal
        title="Booking Confirmed"
        message="The booking has been successfully created and a confirmation email has been sent to the customer."
        buttonText="Back to Bookings"
        onClose={onClose}
        primaryButtonText="View Booking"
        onPrimaryClick={onClose}
        metadata={[
          { label: "Booking ID", value: "#BK53602205" },
          { label: "Trip Name", value: "Aswan Nile Cruise Experience" },
          { 
            label: "Payment Status", 
            value: <StatusPill label="Paid" variant="green" hideDot /> 
          },
          { label: "Amount Paid", value: "$110.42", valueColor: "#FF6600" }
        ]}
      />
    );
  }

  return (
    <div className={styles.overlay} onMouseDown={onClose}>
      <div className={styles.modal} onMouseDown={(e) => e.stopPropagation()}>
        <div className={styles.headerWrap}>
          <ModalHeader
            title="Add New Trip Booking"
            subtitle="Enter the Trip details and create a new booking."
            iconSrc="/images/dashboard/sidebar/trips.svg"
            onClose={onClose}
          />
        </div>

        <div className={styles.contentWrap}>
          <div className={styles.stepperWrap}>
            <IconStepper steps={STEPS} currentStep={currentStep} />
          </div>

          {currentStep === 0 && (
            <StepGuestDetails formData={formData} onChange={handleChange} />
          )}
          {currentStep === 1 && <StepBookingDetails formData={formData} onChange={handleChange} />}
          {currentStep === 2 && <StepBookingSummary formData={formData} />}
          {currentStep === 3 && <StepPayment />}
        </div>

        <div className={styles.footerWrap}>
          <ModalFooter
            secondaryLabel={
              <>
                <Image src="/images/dashboard/previous.svg" alt="" width={20} height={20} />
                <span style={{ marginLeft: "0.5rem" }}>Previous</span>
              </>
            }
            secondaryOnClick={handlePrevious}
            secondaryDisabled={currentStep === 0}
            primaryLabel={
              <>
                <span>
                  {currentStep === STEPS.length - 1 
                    ? "Confirm Booking" 
                    : currentStep === 2 
                      ? "Continue to Payment" 
                      : "Next"}
                </span>
                {currentStep !== STEPS.length - 1 && (
                  <Image style={{ marginLeft: "0.5rem" }} src="/images/dashboard/next.svg" alt="" width={20} height={20} />
                )}
              </>
            }
            primaryOnClick={handleNext}
          />
        </div>
      </div>
    </div>
  );
}

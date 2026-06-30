"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { ModalHeader, ModalFooter } from "@/components/dashboard/shared";
import { SuccessModal } from "@/components/shared";
import { IconStepper, IconStepDef } from "@/components/shared/IconStepper/IconStepper";

import StepGuestDetails from "./steps/StepGuestDetails/StepGuestDetails";
import StepBookingDetails from "./steps/StepBookingDetails/StepBookingDetails";
import StepBookingSummary from "./steps/StepBookingSummary/StepBookingSummary";
import StepPayment from "./steps/StepPayment/StepPayment";

import styles from "./AddTransportationBookingModal.module.scss";

interface AddTransportationBookingModalProps {
  open: boolean;
  onClose: () => void;
}

const STEPS: IconStepDef[] = [
  { label: "Guest Details", iconSrc: "/images/profile.svg" },
  { label: "Booking Details", iconSrc: "/images/dashboard/sidebar/plan-your-trip.svg" },
  { label: "Booking Summary", iconSrc: "/images/dashboard/sidebar/financial-reports.svg" },
  { label: "Payment & Confirmation", iconSrc: "/images/dashboard/sidebar/payments.svg" },
];

export interface AddTransportationBookingData {
  guestName: string;
  guestEmail: string;
  guestPhonePrefix: string;
  guestPhone: string;
  guestNationality: string;
  specialRequests: string;

  // Placeholder for transportation specific fields
  vehicleType: string;
  specificVehicle: string;
  pickupLocation: string;
  dropoffLocation: string;
  date: string;
  time: string;
  tripType: string;
  passengers: number;
  luggage: number;
  childSeat: boolean;
  extraLuggageSpace: boolean;
  meetAndGreetService: boolean;
}

const INITIAL_DATA: AddTransportationBookingData = {
  guestName: "",
  guestEmail: "",
  guestPhonePrefix: "+1",
  guestPhone: "",
  guestNationality: "",
  specialRequests: "",
  vehicleType: "",
  specificVehicle: "",
  pickupLocation: "",
  dropoffLocation: "",
  date: "",
  time: "",
  tripType: "One Way",
  passengers: 2,
  luggage: 1,
  childSeat: false,
  extraLuggageSpace: false,
  meetAndGreetService: false,
};

export default function AddTransportationBookingModal({ open, onClose }: AddTransportationBookingModalProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<AddTransportationBookingData>(INITIAL_DATA);
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    setCurrentStep(0);
    setFormData(INITIAL_DATA);
    setIsSuccessOpen(false);
    
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = originalOverflow;
      document.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  if (!open) return null;

  const handleNext = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep((prev) => prev + 1);
    } else {
      setIsSuccessOpen(true);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const updateFormData = (patch: Partial<AddTransportationBookingData>) => {
    setFormData((prev) => ({ ...prev, ...patch }));
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return <StepGuestDetails formData={formData} onChange={updateFormData} />;
      case 1:
        return <StepBookingDetails formData={formData} onChange={updateFormData} />;
      case 2:
        return <StepBookingSummary formData={formData} />;
      case 3:
        return <StepPayment formData={formData} onChange={updateFormData} />;
      default:
        return null;
    }
  };

  if (isSuccessOpen) {
    const getVehicleBasePrice = (type: string) => {
      switch (type) {
        case "SUV": return 80;
        case "Van": return 120;
        case "Bus": return 200;
        case "Sedan":
        default: return 50;
      }
    };
    const basePrice = getVehicleBasePrice(formData.vehicleType);
    const tripMultiplier = formData.tripType === "Round Trip" ? 2 : 1;
    const subtotal = basePrice * tripMultiplier + (formData.childSeat ? 10 : 0) + (formData.extraLuggageSpace ? 15 : 0) + (formData.meetAndGreetService ? 20 : 0);
    const total = subtotal - 5 + (subtotal * 0.10);

    return (
      <SuccessModal
        title="Booking Confirmed"
        message="The booking has been successfully created and a confirmation email has been sent to the customer."
        buttonText="Back to Bookings"
        primaryButtonText="View Booking"
        onPrimaryClick={() => {
          setIsSuccessOpen(false);
          onClose();
        }}
        onClose={() => {
          setIsSuccessOpen(false);
          onClose();
        }}
        metadata={[
          { label: "Booking ID", value: "#BK53602205" },
          { label: "Vehicle", value: formData.vehicleType || "Mercedes S-Class" },
          { 
            label: "Route", 
            value: `${formData.pickupLocation || "Luxor Airport"} ➔ ${formData.dropoffLocation || "Hilton Luxor"}` 
          },
          { 
            label: "Travel Date", 
            value: `${formData.date || "Mar 22, 2026"} - ${formData.time || "10:30 AM"}` 
          },
          { 
            label: "Payment Status", 
            value: (
              <span style={{
                background: "#E8F8EE",
                color: "#15803D",
                padding: "4px 12px",
                borderRadius: "100px",
                fontSize: "12px",
                fontWeight: 600,
                display: "inline-block",
              }}>
                Paid
              </span>
            ) 
          },
          { 
            label: "Amount Paid", 
            value: `$${total.toFixed(2)}`, 
            valueColor: "#FF6600" 
          },
        ]}
      />
    );
  }

  return (
    <div className={styles.overlay} onMouseDown={onClose}>
      <div className={styles.modal} onMouseDown={(e) => e.stopPropagation()}>
        <ModalHeader
          title="Add New Transportation Booking"
          subtitle="Enter the transportation details and create a new booking."
          iconSrc="/images/dashboard/sidebar/transportation.svg" // using a transportation car icon
          onClose={onClose}
        />
        <div className={styles.contentWrap}>
          <div className={styles.stepperWrap}>
            <IconStepper steps={STEPS} currentStep={currentStep} onStepClick={setCurrentStep} />
          </div>
          {renderStepContent()}
        </div>
        <div className={styles.footerWrap}>
          <ModalFooter
            secondaryLabel={
              currentStep > 0 ? (
                <>
                  <Image src="/images/dashboard/previous.svg" alt="" width={20} height={20} />
                  <span style={{ marginLeft: "0.5rem" }}>Previous</span>
                </>
              ) : (
                "Cancel"
              )
            }
            secondaryOnClick={currentStep > 0 ? handlePrev : onClose}
            primaryLabel={
              <>
                <span>{currentStep === STEPS.length - 1 ? "Submit" : "Next"}</span>
                {currentStep !== STEPS.length - 1 && (
                  <Image
                    src="/images/dashboard/next.svg"
                    alt=""
                    width={20}
                    height={20}
                    style={{ marginLeft: "0.5rem" }}
                  />
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

"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { ModalHeader, ModalFooter } from "@/components/dashboard/shared";
import { SuccessModal } from "@/components/shared";
import { IconStepper, IconStepDef } from "@/components/shared/IconStepper/IconStepper";

import StepGuestDetails from "./steps/StepGuestDetails/StepGuestDetails";
import StepBookingDetails from "./steps/StepBookingDetails/StepBookingDetails";
import StepBookingSummary from "./steps/StepBookingSummary/StepBookingSummary";
import PaymentStep from "@/components/dashboard/shared/PaymentStep/PaymentStep";
import BookingModalContainer from "../../shared/BookingModalContainer/BookingModalContainer";
import { BaseGuestDetails } from "../../shared/types";
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

export interface AddTransportationBookingData extends BaseGuestDetails {
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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingId, setBookingId] = useState("");

  useEffect(() => {
    if (!open) return;
    setCurrentStep(0);
    setFormData(INITIAL_DATA);
    setIsSuccessOpen(false);
    setIsSubmitting(false);
    setBookingId(`#BK${Math.floor(Math.random() * 1000000)}`);
  }, [open]);

  if (!open) return null;

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

  const handleNext = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep((prev) => prev + 1);
    } else {
      setIsSubmitting(true);
      setTimeout(() => {
        setIsSubmitting(false);
        setIsSuccessOpen(true);
      }, 1500);
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
        return <PaymentStep total={total} />;
      default:
        return null;
    }
  };

  if (isSuccessOpen) {

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
          { label: "Booking ID", value: bookingId },
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
    <BookingModalContainer
      open={open}
      onClose={onClose}
      title="Add New Transportation Booking"
      subtitle="Enter the transportation details and create a new booking."
      iconSrc="/images/dashboard/sidebar/transportation.svg"
      steps={STEPS}
      currentStep={currentStep}
      onStepClick={setCurrentStep}
      onNext={handleNext}
      onPrevious={handlePrev}
      isSubmitting={isSubmitting}
      isConfirmed={isSuccessOpen}
    >
      {renderStepContent()}
    </BookingModalContainer>
  );
}

"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { ModalHeader, ModalFooter } from "@/components/dashboard/shared";
import { SuccessModal } from "@/components/shared";
import StatusPill from "@/components/shared/StatusPill/StatusPill";
import { IconStepper, IconStepDef } from "@/components/shared/IconStepper/IconStepper";

import StepBookingDetails from "./steps/StepBookingDetails/StepBookingDetails";
import StepGuestDetails from "./steps/StepGuestDetails/StepGuestDetails";
import StepBookingSummary from "./steps/StepBookingSummary/StepBookingSummary";
import PaymentStep from "@/components/dashboard/shared/PaymentStep/PaymentStep";
import BookingModalContainer from "../../shared/BookingModalContainer/BookingModalContainer";
import { BaseGuestDetails } from "../../shared/types";

import styles from "./AddHotelBookingModal.module.scss";

interface AddHotelBookingModalProps {
  open: boolean;
  onClose: () => void;
}

const STEPS: IconStepDef[] = [
  { label: "Guest Details", iconSrc: "/images/profile.svg" },
  { label: "Booking Details", iconSrc: "/images/dashboard/sidebar/plan-your-trip.svg" },
  { label: "Booking Summary", iconSrc: "/images/dashboard/sidebar/financial-reports.svg" },
  { label: "Payment & Confirmation", iconSrc: "/images/dashboard/sidebar/payments.svg" },
];

export interface AddHotelBookingData extends BaseGuestDetails {
  checkInDate: string;
  checkOutDate: string;
  adults: number;
  infants: number;
  children: number;
  
  // Booking Details
  hotelCategory: string;
  specificHotel: string;
  roomsCount: number;
  rooms: { single: number; double: number; triple: number };
  roomCustomizations: Record<string, string[]>;
}

const INITIAL_DATA: AddHotelBookingData = {
  guestName: "",
  guestEmail: "",
  guestPhonePrefix: "+1",
  guestPhone: "",
  guestNationality: "",
  checkInDate: "",
  checkOutDate: "",
  adults: 0,
  infants: 0,
  children: 0,
  specialRequests: "",
  
  hotelCategory: "",
  specificHotel: "",
  roomsCount: 1,
  rooms: { single: 0, double: 2, triple: 1 },
  roomCustomizations: {},
};

export default function AddHotelBookingModal({ open, onClose }: AddHotelBookingModalProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<AddHotelBookingData>(INITIAL_DATA);
  const [bookingId, setBookingId] = useState("");

  useEffect(() => {
    if (!open) return;
    
    // Reset state when opening
    setCurrentStep(0);
    setIsConfirmed(false);
    setIsSubmitting(false);
    setFormData(INITIAL_DATA);
    setBookingId(`#BK${Math.floor(Math.random() * 1000000)}`);
  }, [open]);

  if (!open) return null;

  const calculateTotal = () => {
    // Mock calculation for hotel price based on rooms
    const basePrice = 100;
    const roomsTotal = (formData.rooms.single * 1) + (formData.rooms.double * 1.5) + (formData.rooms.triple * 2);
    return basePrice * (roomsTotal || 1);
  };
  
  const total = calculateTotal();

  const handleNext = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep((prev) => prev + 1);
    } else {
      setIsSubmitting(true);
      // Simulate API call
      setTimeout(() => {
        setIsSubmitting(false);
        setIsConfirmed(true);
      }, 1500);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleChange = (patch: Partial<AddHotelBookingData>) => {
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
          { label: "Booking Reference", value: bookingId },
          { label: "Hotel", value: formData.specificHotel || "Beach Nile Palace Hotel & Spa" },
          { label: "Check-in", value: formData.checkInDate || "12 Oct 2026" },
          { label: "Check-out", value: formData.checkOutDate || "24 Oct 2026" },
          { 
            label: "Payment Status", 
            value: <StatusPill label="Paid" variant="green" hideDot /> 
          },
          { label: "Amount Paid", value: `$${total.toFixed(2)}`, valueColor: "#FF6600" }
        ]}
      />
    );
  }

  return (
    <BookingModalContainer
      open={open}
      onClose={onClose}
      title="Add New Hotel Booking"
      subtitle="Create and confirm a new hotel booking by entering the guest details, stay information"
      iconSrc="/images/dashboard/sidebar/hotels.svg"
      steps={STEPS}
      currentStep={currentStep}
      onStepClick={setCurrentStep}
      onNext={handleNext}
      onPrevious={handlePrevious}
      isSubmitting={isSubmitting}
      isConfirmed={isConfirmed}
    >
      {currentStep === 0 && <StepGuestDetails formData={formData} onChange={handleChange} />}
      {currentStep === 1 && <StepBookingDetails formData={formData} onChange={handleChange} />}
      {currentStep === 2 && <StepBookingSummary formData={formData} />}
      {currentStep === 3 && <PaymentStep total={total} />}
    </BookingModalContainer>
  );
}

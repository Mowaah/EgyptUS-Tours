"use client";

import React, { useState, useEffect } from "react";
import { SuccessModal } from "@/components/shared";
import { IconStepper, IconStepDef } from "@/components/shared/IconStepper/IconStepper";

import StepGuestDetails from "./steps/StepGuestDetails/StepGuestDetails";
import StepBookingDetails from "./steps/StepBookingDetails/StepBookingDetails";
import StepBookingSummary from "./steps/StepBookingSummary/StepBookingSummary";
import PaymentStep from "@/components/dashboard/shared/PaymentStep/PaymentStep";
import BookingModalContainer from "../../shared/BookingModalContainer/BookingModalContainer";
import { BaseGuestDetails } from "../../shared/types";
import { isValidEmail, isValidPhone } from "@/utils/validators";
import { createTransportationBooking } from "@/services/admin/adminBookingsService";
import { triggerToast } from "@/components/dashboard/shared/GlobalToastContainer/GlobalToastContainer";
import { mutate } from "swr";
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
  vehicleId: number | null;
  distanceKm: string;
  tripType: string;
  pickupLocation: string;
  dropoffLocation: string;
  pickupDate: string;
  pickupTime: string;
  passengers: number;
  luggage: string;
  additionalServiceIds: number[];
  paymentPlan: string;
  paymentMethod: string;
  termsAccepted: boolean;
}

const INITIAL_DATA: AddTransportationBookingData = {
  guestName: "",
  guestEmail: "",
  guestPhonePrefix: "+1",
  guestPhone: "",
  guestNationality: "",
  specialRequests: "",
  vehicleId: null,
  distanceKm: "0",
  tripType: "one_way",
  pickupLocation: "",
  dropoffLocation: "",
  pickupDate: "",
  pickupTime: "",
  passengers: 1,
  luggage: "",
  additionalServiceIds: [],
  paymentPlan: "deposit",
  paymentMethod: "cash",
  termsAccepted: true,
};

export default function AddTransportationBookingModal({ open, onClose }: AddTransportationBookingModalProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<AddTransportationBookingData>(INITIAL_DATA);
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!open) return;
    setCurrentStep(0);
    setFormData(INITIAL_DATA);
    setIsSuccessOpen(false);
    setIsSubmitting(false);
    setIsConfirmed(false);
    setErrors({});
  }, [open]);

  if (!open) return null;

  const total = 0;

  const handleNext = async () => {
    const newErrors: Record<string, string> = {};

    if (currentStep === 0) {
      if (!formData.guestName) newErrors.guestName = "Guest name is required";
      if (!formData.guestEmail) newErrors.guestEmail = "Email is required";
      else if (!isValidEmail(formData.guestEmail)) newErrors.guestEmail = "Invalid email format";
      
      if (!formData.guestPhone) newErrors.guestPhone = "Phone is required";
      else if (!isValidPhone(formData.guestPhone)) newErrors.guestPhone = "Invalid phone format";
      
      if (!formData.guestNationality) newErrors.guestNationality = "Nationality is required";

      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        return;
      }
    }

    if (currentStep === 1) {
      if (!formData.vehicleId) newErrors.vehicleId = "Vehicle is required";
      if (!formData.pickupLocation) newErrors.pickupLocation = "Pickup location is required";
      if (!formData.dropoffLocation) newErrors.dropoffLocation = "Drop-off location is required";
      if (!formData.pickupDate) newErrors.pickupDate = "Pickup date is required";

      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        return;
      }
    }

    if (currentStep < STEPS.length - 1) {
      setCurrentStep((prev) => prev + 1);
    } else {
      try {
        setIsSubmitting(true);
        const formatDateToYMD = (dateString: string) => {
          if (!dateString) return dateString;
          const d = new Date(dateString);
          if (isNaN(d.getTime())) return dateString;
          const yyyy = d.getFullYear();
          const mm = String(d.getMonth() + 1).padStart(2, "0");
          const dd = String(d.getDate()).padStart(2, "0");
          return `${yyyy}-${mm}-${dd}`;
        };

        const formatTime = (timeStr: string) => {
          if (!timeStr) return null;
          if (!timeStr.toLowerCase().includes("m")) {
            return timeStr.includes(":") ? timeStr : null;
          }
          const match = timeStr.trim().match(/^(\d{1,2}):(\d{2})\s*(AM|PM|am|pm)$/i);
          if (!match) return null;
          let hours = parseInt(match[1], 10);
          const minutes = match[2];
          const period = match[3].toUpperCase();
          if (period === "AM" && hours === 12) hours = 0;
          if (period === "PM" && hours < 12) hours += 12;
          return `${String(hours).padStart(2, "0")}:${minutes}:00`;
        };

        const payload = {
          vehicle_id: formData.vehicleId,
          distance_km: parseFloat(formData.distanceKm) || 0,
          trip_type: formData.tripType,
          full_name: formData.guestName,
          email: formData.guestEmail,
          phone: `${formData.guestPhonePrefix}${formData.guestPhone}`,
          nationality: formData.guestNationality,
          pickup_location: formData.pickupLocation,
          dropoff_location: formData.dropoffLocation,
          pickup_date: formatDateToYMD(formData.pickupDate),
          pickup_time: formatTime(formData.pickupTime),
          passengers: formData.passengers,
          luggage: formData.luggage,
          additional_service_ids: formData.additionalServiceIds,
          special_requests: formData.specialRequests,
          payment_plan: formData.paymentPlan,
          payment_method: formData.paymentMethod,
          terms_accepted: formData.termsAccepted,
        };
        
        await createTransportationBooking(payload);
        setIsConfirmed(true);
        mutate("/bookings/transportation/");
      } catch (error: any) {
        triggerToast(error?.response?.data?.detail || "Failed to create booking. Please try again.", "error");
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const updateFormData = (patch: Partial<AddTransportationBookingData>) => {
    setFormData((prev) => ({ ...prev, ...patch }));
    if (Object.keys(errors).length > 0) {
      const keys = Object.keys(patch);
      setErrors((prev) => {
        const next = { ...prev };
        keys.forEach((k) => delete next[k]);
        return next;
      });
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return <StepGuestDetails formData={formData} onChange={updateFormData} errors={errors} />;
      case 1:
        return <StepBookingDetails formData={formData} onChange={updateFormData} errors={errors} />;
      case 2:
        return <StepBookingSummary formData={formData} />;
      case 3:
        return <PaymentStep total={total} />;
      default:
        return null;
    }
  };

  if (isConfirmed) {
    return (
      <SuccessModal
        title="Booking Successful"
        message="The transportation booking has been successfully created."
        buttonText="Back to Bookings"
        onClose={() => {
          setIsConfirmed(false);
          onClose();
        }}
        primaryButtonText="Done"
        onPrimaryClick={() => {
          setIsConfirmed(false);
          onClose();
        }}
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
        isConfirmed={isConfirmed}
      >
        {renderStepContent()}
      </BookingModalContainer>
  );
}

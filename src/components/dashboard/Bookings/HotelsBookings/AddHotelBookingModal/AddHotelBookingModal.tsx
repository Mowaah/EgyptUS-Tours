"use client";

import { useState, useEffect } from "react";
import useSWRMutation from "swr/mutation";
import { useSWRConfig } from "swr";
import { SuccessModal } from "@/components/shared";
import StatusPill from "@/components/shared/StatusPill/StatusPill";
import { IconStepDef } from "@/components/shared/IconStepper/IconStepper";

import StepBookingDetails from "./steps/StepBookingDetails/StepBookingDetails";
import StepGuestDetails from "./steps/StepGuestDetails/StepGuestDetails";
import StepBookingSummary from "./steps/StepBookingSummary/StepBookingSummary";
import PaymentStep from "@/components/dashboard/shared/PaymentStep/PaymentStep";
import BookingModalContainer from "../../shared/BookingModalContainer/BookingModalContainer";
import { BaseGuestDetails } from "../../shared/types";
import { isValidEmail, isValidPhone } from "@/utils/validators";
import { createHotelBooking } from "@/services/admin/adminBookingsService";

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
  hotelLocation: string;
  specificHotel: string;
  rooms?: Record<string, number>;
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
  
  hotelLocation: "",
  specificHotel: "",
  rooms: {},
  roomCustomizations: {},
};

const triggerToast = (message: string, variant: "error" | "success" = "error") => {
  if (typeof window !== "undefined") {
    window.dispatchEvent(
      new CustomEvent("dashboard-toast", {
        detail: { message, variant },
      })
    );
  } else {
    alert(message);
  }
};

export default function AddHotelBookingModal({ open, onClose }: AddHotelBookingModalProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [formData, setFormData] = useState<AddHotelBookingData>(INITIAL_DATA);
  const [bookingId, setBookingId] = useState("");
  const [previewData, setPreviewData] = useState<any>(null);
  const { mutate } = useSWRConfig();

  const { trigger: submitBooking, isMutating: isSubmitting } = useSWRMutation(
    "/bookings/hotels/",
    async (url, { arg }: { arg: any }) => {
      return await createHotelBooking(arg);
    }
  );

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!open) return;
    
    // Reset state when opening
    setCurrentStep(0);
    setIsConfirmed(false);
    setFormData(INITIAL_DATA);
    setErrors({});
    setPreviewData(null);
    setBookingId(`#BK${Math.floor(Math.random() * 1000000)}`);
  }, [open]);

  if (!open) return null;

  const total = previewData ? parseFloat(previewData.total_price) : 0;

  const handleNext = async () => {
    const newErrors: Record<string, string> = {};

    if (currentStep === 0) {
      if (!formData.guestName) newErrors.guestName = "Guest name is required";
      if (!formData.guestEmail) newErrors.guestEmail = "Email is required";
      else if (!isValidEmail(formData.guestEmail)) newErrors.guestEmail = "Invalid email format";
      
      if (!formData.guestPhone) newErrors.guestPhone = "Phone is required";
      else if (!isValidPhone(formData.guestPhone)) newErrors.guestPhone = "Invalid phone format";
      
      if (!formData.guestNationality) newErrors.guestNationality = "Nationality is required";
      if (!formData.checkInDate) newErrors.checkInDate = "Check-in date is required";
      if (!formData.checkOutDate) newErrors.checkOutDate = "Check-out date is required";
      if (formData.adults === 0) newErrors.adults = "At least one adult is required";

      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        return;
      }
    }

    if (currentStep === 1) {
      if (!formData.hotelLocation) newErrors.hotelLocation = "Hotel location is required";
      if (!formData.specificHotel) newErrors.specificHotel = "Specific hotel is required";
      
      const totalRooms = Object.values(formData.roomCustomizations).reduce((sum, ids) => sum + ids.length, 0);
      if (totalRooms === 0) {
        newErrors.rooms = "At least one room is required";
      } else {
        const getRoomCount = (key: string) => {
          if (!formData.rooms) return 0;
          let count = 0;
          const lowerKey = key.toLowerCase();
          for (const [k, v] of Object.entries(formData.rooms)) {
            if (k.toLowerCase().includes(lowerKey)) {
              count += (v as number) || 0;
            }
          }
          return count;
        };
        const singleCount = getRoomCount("Single");
        const doubleCount = getRoomCount("Double");
        const tripleCount = getRoomCount("Triple");
        const totalCapacity = (singleCount * 1) + (doubleCount * 2) + (tripleCount * 3);
        if (formData.adults > totalCapacity) {
          newErrors.rooms = `Selected rooms only accommodate ${totalCapacity} adults, but ${formData.adults} adults are booked.`;
        }
      }

      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        return;
      }
    }

    setErrors({});

    if (currentStep < STEPS.length - 1) {
      setCurrentStep((prev) => prev + 1);
    } else {
      try {
        const room_selections: { hotel_room_id: number; quantity: number }[] = [];
        Object.values(formData.roomCustomizations).forEach(roomIds => {
          roomIds.forEach(id => {
            const parsedId = parseInt(id);
            if (isNaN(parsedId)) return;
            const existing = room_selections.find(s => s.hotel_room_id === parsedId);
            if (existing) {
              existing.quantity += 1;
            } else {
              room_selections.push({ hotel_room_id: parsedId, quantity: 1 });
            }
          });
        });

        const formatDateToYMD = (dateString: string) => {
          if (!dateString) return dateString;
          const d = new Date(dateString);
          if (isNaN(d.getTime())) return dateString;
          const yyyy = d.getFullYear();
          const mm = String(d.getMonth() + 1).padStart(2, "0");
          const dd = String(d.getDate()).padStart(2, "0");
          return `${yyyy}-${mm}-${dd}`;
        };

        const payload = {
          hotel_id: parseInt(formData.specificHotel),
          full_name: formData.guestName,
          email: formData.guestEmail,
          phone: `${formData.guestPhonePrefix}${formData.guestPhone}`,
          nationality: formData.guestNationality,
          check_in_date: formatDateToYMD(formData.checkInDate),
          check_out_date: formatDateToYMD(formData.checkOutDate),
          adults: formData.adults,
          infants: formData.infants,
          children: formData.children,
          room_selections,
          special_requests: formData.specialRequests,
          payment_plan: "full",
          payment_method: "cash",
          terms_accepted: true,
        };
        
        await submitBooking(payload);
        setIsConfirmed(true);
        // Refresh hotels list
        mutate("/bookings/hotels/");
      } catch (error: any) {
        triggerToast(error?.response?.data?.detail || "Failed to create booking. Please try again.");
      }
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleChange = (patch: Partial<AddHotelBookingData>) => {
    setFormData((prev) => ({ ...prev, ...patch }));
    // clear errors for fields being updated
    if (Object.keys(errors).length > 0) {
      const keys = Object.keys(patch);
      setErrors((prev) => {
        const next = { ...prev };
        keys.forEach((k) => delete next[k]);
        return next;
      });
    }
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
      {currentStep === 0 && <StepGuestDetails formData={formData} onChange={handleChange} errors={errors} />}
      {currentStep === 1 && <StepBookingDetails formData={formData} onChange={handleChange} errors={errors} />}
      {currentStep === 2 && <StepBookingSummary formData={formData} onSummaryLoad={setPreviewData} />}
      {currentStep === 3 && <PaymentStep total={total} />}
    </BookingModalContainer>
  );
}

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import useSWR, { useSWRConfig } from "swr";
import { getFullTripById } from "@/services/tripsService";
import {
  createTripBooking,
  generateTripPaymentLink,
  getTripBookingById,
} from "@/services/admin/adminBookingsService";
import { SuccessModal } from "@/components/shared";
import StatusPill from "@/components/shared/StatusPill/StatusPill";
import { IconStepDef } from "@/components/shared/IconStepper/IconStepper";
import StepGuestDetails from "./steps/StepGuestDetails/StepGuestDetails";
import StepBookingDetails from "./steps/StepBookingDetails/StepBookingDetails";
import StepBookingSummary from "./steps/StepBookingSummary/StepBookingSummary";
import PaymentStep from "@/components/dashboard/shared/PaymentStep/PaymentStep";
import BookingModalContainer from "../../shared/BookingModalContainer/BookingModalContainer";
import { isValidEmail, isValidPhone } from "@/utils/validators";
import { BaseGuestDetails } from "../../shared/types";

interface AddTripBookingModalProps {
  open: boolean;
  onClose: () => void;
  tourType?: "private" | "group";
  tripId?: string;
}

const STEPS: IconStepDef[] = [
  { label: "Guest Details", iconSrc: "/images/profile.svg" },
  { label: "Booking Details", iconSrc: "/images/dashboard/sidebar/plan-your-trip.svg" },
  { label: "Booking Summary", iconSrc: "/images/dashboard/sidebar/financial-reports.svg" },
  { label: "Payment & Confirmation", iconSrc: "/images/dashboard/sidebar/payments.svg" },
];

export interface AddTripBookingData extends BaseGuestDetails {
  startDate: string;
  endDate: string;
  adults: number;
  children: number;
  infants: number;
  departureMonth: string;
  departureDateId: string;
  rooms: {
    single: number;
    double: number;
    triple: number;
  };
  roomCustomizations: Record<string, string[]>;
  tourType?: "private" | "group";
  tripId?: string;
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
  roomCustomizations: {},
};

export default function AddTripBookingModal({ open, onClose, tourType, tripId }: AddTripBookingModalProps) {
  const router = useRouter();
  const { mutate } = useSWRConfig();

  const triggerToast = (message: string, variant: "error" | "success" = "error") => {
    if (typeof window !== "undefined") {
      window.dispatchEvent(
        new CustomEvent("dashboard-toast", {
          detail: { message, variant },
        })
      );
    }
  };

  const [currentStep, setCurrentStep] = useState(0);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState<AddTripBookingData>({
    ...INITIAL_DATA,
    tourType,
    tripId,
  });
  const [previewData, setPreviewData] = useState<any>(null);
  const [createdBooking, setCreatedBooking] = useState<any>(null);
  const [bookingId, setBookingId] = useState("");
  const [paymentPlan, setPaymentPlan] = useState<"deposit" | "full">("deposit");
  const [paymentMethod, setPaymentMethod] = useState<"cash" | "paymob">("cash");


  const { data: tripDetail } = useSWR(
    open && (formData.tripId || tripId) ? ["tripDetail", formData.tripId || tripId] : null,
    () => getFullTripById((formData.tripId || tripId) as string)
  );

  const { data: polledBooking } = useSWR(
    createdBooking?.id && createdBooking.payment_status !== "paid" && paymentMethod === "paymob"
      ? `/bookings/trips/${createdBooking.id}`
      : null,
    async () => {
      const res = await getTripBookingById(createdBooking.id);
      return res.data || res;
    },
    { refreshInterval: 5000 }
  );

  const currentBooking = polledBooking || createdBooking;
  const isPaid = currentBooking?.payment_status === "paid";

  useEffect(() => {
    if (!open) return;

    // Reset state when opening
    setCurrentStep(0);
    setIsConfirmed(false);
    setIsSubmitting(false);
    setErrors({});
    setFormData({ ...INITIAL_DATA, tourType, tripId });
    setPreviewData(null);
    setCreatedBooking(null);
    setPaymentPlan("deposit");
    setPaymentMethod("cash");
    setBookingId(`#BK${Math.floor(Math.random() * 1000000)}`);
  }, [open, tourType, tripId]);

  if (!open) return null;

  const total = previewData?.total_price
    ? parseFloat(previewData.total_price)
    : previewData?.price_breakdown?.total
    ? parseFloat(previewData.price_breakdown.total)
    : 0;

  const amountPaid = paymentPlan === "deposit" ? total * 0.3 : total;

  const formatDateToYMD = (dateString?: string) => {
    if (!dateString) return null;
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return dateString;
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  };

  const hasFixedAvailability = Boolean(
    tripDetail?.availability && tripDetail.availability.length > 0
  );

  const handleNext = async (generateLink: boolean = false) => {
    if (createdBooking) {
      if (paymentMethod === "cash" || isPaid) {
        setIsConfirmed(true);
      }
      return;
    }

    const newErrors: Record<string, string> = {};

    if (currentStep === 0) {
      if (!formData.guestName) newErrors.guestName = "Guest name is required";
      if (!formData.guestEmail) newErrors.guestEmail = "Email is required";
      else if (!isValidEmail(formData.guestEmail)) newErrors.guestEmail = "Invalid email format";

      if (!formData.guestPhone) newErrors.guestPhone = "Phone is required";
      else if (!isValidPhone(`${formData.guestPhonePrefix || ""}${formData.guestPhone || ""}`)) newErrors.guestPhone = "Invalid phone format";

      if (!formData.guestNationality) newErrors.guestNationality = "Nationality is required";

      if (!hasFixedAvailability) {
        if (!formData.startDate) newErrors.startDate = "Start date is required";
        if (!formData.endDate) newErrors.endDate = "End date is required";
      }

      if (formData.adults === 0) newErrors.adults = "At least one adult is required";

      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        return;
      }
    }

    if (currentStep === 1) {
      if (!formData.tripId) newErrors.tripId = "Specific trip is required";

      if (hasFixedAvailability) {
        if (!formData.departureDateId) newErrors.departureDateId = "Departure date is required";
      } else if (tripDetail?.duration?.days && formData.startDate) {
        const d = new Date(formData.startDate);
        d.setDate(d.getDate() + tripDetail.duration.days - 1);
        const endStr = `${String(d.getMonth() + 1).padStart(2, '0')}/${String(d.getDate()).padStart(2, '0')}/${d.getFullYear()}`;
        if (formData.endDate !== endStr) {
          setFormData((prev) => ({ ...prev, endDate: endStr }));
        }
      }

      const totalRooms = Object.values(formData.roomCustomizations || {}).reduce((sum, ids) => sum + ids.length, 0);
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
      setIsSubmitting(true);
      try {
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
        const totalCustomizedRooms = Object.values(formData.roomCustomizations || {}).reduce((sum, ids) => sum + ids.length, 0);
        const resolvedSingle = (singleCount > 0 || doubleCount > 0 || tripleCount > 0) ? singleCount : (totalCustomizedRooms || 1);

        const payload = {
          trip_id: parseInt(formData.tripId || "0", 10),
          tour_type: formData.tourType || "private",
          full_name: formData.guestName,
          email: formData.guestEmail,
          phone: `${formData.guestPhonePrefix || ""}${formData.guestPhone || ""}`,
          nationality: formData.guestNationality || "US",
          adults: formData.adults || 1,
          children: formData.children || 0,
          infants: formData.infants || 0,
          start_date: formatDateToYMD(formData.startDate),
          end_date: formatDateToYMD(formData.endDate),
          availability_slot_id: hasFixedAvailability && formData.departureDateId ? (parseInt(formData.departureDateId, 10) || null) : null,
          rooms_single: resolvedSingle,
          rooms_double: doubleCount,
          rooms_triple: tripleCount,
          special_requests: formData.specialRequests || "",
          payment_plan: paymentPlan,
          payment_method: paymentMethod,
          terms_accepted: true,
        };

        const res = await createTripBooking(payload);
        let data = res.data || res;
        
        if (generateLink && data.id) {
          try {
            const linkRes = await generateTripPaymentLink(data.id);
            data = linkRes.data || linkRes;
          } catch (err: any) {
            console.error("Link generation failed:", err);
            triggerToast("Booking created but failed to generate payment link.");
          }
        }
        
        setCreatedBooking(data);
        if (data.booking_code || data.id) {
          setBookingId(data.booking_code || `#${data.id}`);
        }
        
        // Revalidate trips bookings table
        mutate(
          (key: any) =>
            typeof key === "string"
              ? key.startsWith("/bookings/trips")
              : Array.isArray(key) && key[0]?.startsWith?.("/bookings/trips"),
          undefined,
          { revalidate: true }
        );

        if (!generateLink) {
          setIsConfirmed(true);
        }
      } catch (err: any) {
        console.error("Failed to create trip booking:", err);
        const errorMsg =
          err?.response?.data?.message ||
          err?.response?.data?.detail ||
          (typeof err?.response?.data === "string" ? err.response.data : null) ||
          "Failed to create booking. Please try again.";
        triggerToast(errorMsg, "error");
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleChange = (patch: Partial<AddTripBookingData>) => {
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

  const handleModalClose = () => {
    onClose();
    // Revalidate list upon close
    mutate(
      (key: any) =>
        typeof key === "string"
          ? key.startsWith("/bookings/trips")
          : Array.isArray(key) && key[0]?.startsWith?.("/bookings/trips"),
      undefined,
      { revalidate: true }
    );
  };

  const handleViewBooking = () => {
    handleModalClose();
    if (createdBooking?.id) {
      router.push(`/dashboard/bookings/trips/${createdBooking.id}`);
    }
  };

  if (isConfirmed) {
    const displayTripTitle =
      createdBooking?.booking?.trip_title ||
      previewData?.trip_title ||
      tripDetail?.title ||
      (formData.departureMonth ? `Trip in ${formData.departureMonth}` : "Trip Booking");

    return (
      <SuccessModal
        title="Booking Confirmed"
        message="The booking has been successfully created and a confirmation email has been sent to the customer."
        buttonText="Back to Bookings"
        onClose={handleModalClose}
        primaryButtonText="View Booking"
        onPrimaryClick={handleViewBooking}
        metadata={[
          { label: "Booking ID", value: bookingId },
          { label: "Trip Name", value: displayTripTitle },
          {
            label: "Payment Status",
            value: <StatusPill label={paymentPlan === "deposit" ? "Deposit Paid" : "Paid"} variant="green" hideDot />,
          },
          { label: "Amount Paid", value: `$${amountPaid.toFixed(2)}`, valueColor: "#FF6600" },
        ]}
      >
        {createdBooking?.payment_url && (
          <div style={{ marginTop: "1rem", padding: "1rem", background: "#f8f9fa", borderRadius: "8px", border: "1px solid #e9ecef" }}>
            <label style={{ display: "block", fontSize: "0.875rem", fontWeight: 500, color: "#495057", marginBottom: "0.5rem" }}>
              Payment Link
            </label>
            <div style={{ display: "flex", gap: "0.5rem" }}>
              <input 
                type="text" 
                readOnly 
                value={createdBooking.payment_url} 
                style={{ flex: 1, padding: "0.5rem", borderRadius: "4px", border: "1px solid #ced4da", fontSize: "0.875rem" }} 
              />
              <button 
                onClick={() => navigator.clipboard.writeText(createdBooking.payment_url)}
                style={{ padding: "0.5rem 1rem", background: "#2971E6", color: "white", border: "none", borderRadius: "4px", cursor: "pointer", fontSize: "0.875rem" }}
              >
                Copy
              </button>
            </div>
          </div>
        )}
      </SuccessModal>
    );
  }

  return (
    <BookingModalContainer
      open={open}
      onClose={onClose}
      title="Add New Trip Booking"
      subtitle="Enter the Trip details and create a new booking."
      iconSrc="/images/dashboard/sidebar/trips.svg"
      steps={STEPS}
      currentStep={currentStep}
      onStepClick={setCurrentStep}
      onNext={handleNext}
      onPrevious={handlePrevious}
      isSubmitting={isSubmitting}
      isConfirmed={isConfirmed}
      disablePrevious={!!createdBooking}
      isPrimaryDisabled={paymentMethod === "paymob" && !!createdBooking && !isPaid}
      finalStepButtonLabel={paymentMethod === "paymob" && !createdBooking?.payment_url ? "Generate Payment Link" : "Confirm Booking"}
      hidePrimaryButton={paymentMethod === "paymob" && !createdBooking?.payment_url && currentStep === STEPS.length - 1}
    >
      {currentStep === 0 && (
        <StepGuestDetails
          formData={formData}
          onChange={handleChange}
          errors={errors}
          hasFixedAvailability={hasFixedAvailability}
          durationDays={tripDetail?.duration?.days}
        />
      )}
      {currentStep === 1 && (
        <StepBookingDetails
          formData={formData}
          onChange={handleChange}
          errors={errors}
          hasFixedAvailability={hasFixedAvailability}
        />
      )}
      {currentStep === 2 && (
        <StepBookingSummary
          formData={formData}
          previewData={previewData}
          setPreviewData={setPreviewData}
          tripDetail={tripDetail}
        />
      )}
      {currentStep === 3 && (
        <PaymentStep
          total={total}
          paymentPlan={paymentPlan}
          onChangePlan={setPaymentPlan}
          paymentMethod={paymentMethod}
          onChangeMethod={setPaymentMethod}
          onGenerateLink={() => handleNext(true)}
          isSubmitting={isSubmitting}
          paymentUrl={currentBooking?.payment_url}
          paymentStatus={currentBooking?.payment_status}
        />
      )}
    </BookingModalContainer>
  );
}

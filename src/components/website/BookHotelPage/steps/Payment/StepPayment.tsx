import { useState } from "react";
import { PaymentForm } from "@/components/shared";
import BookingSidebar from "@/components/shared/BookingSidebar/BookingSidebar";
import { submitHotelBooking } from "@/lib/api";
import { BookingData } from "../../BookHotelPage";
import { Hotel } from "@/types";

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
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!formData.cardNumber || !formData.cardName || !formData.expiry || !formData.cvv) {
      alert("Please fill in all payment details.");
      return;
    }

    setIsSubmitting(true);
    try {
      // Helper to convert MM/DD/YYYY to YYYY-MM-DD
      const formatDate = (dateStr: string) => {
        if (!dateStr) return null;
        const parts = dateStr.split("/");
        if (parts.length === 3) {
          return `${parts[2]}-${parts[0]}-${parts[1]}`;
        }
        return dateStr;
      };

      // Format data as expected by HotelBookingCreateSerializer
      const payload = {
        name: formData.name,
        hotel_slug: hotel.id, // backend uses slug as id
        email: formData.email,
        phone: formData.phone,
        nationality: formData.nationality,
        start_date: formatDate(formData.startDate),
        end_date: formatDate(formData.endDate),
        adults: formData.adults,
        children: formData.children,
        infants: formData.infants,
        rooms: {
          single: formData.rooms.single,
          double: formData.rooms.double,
          triple: formData.rooms.triple,
        },
        requested_room_type: "Any",
        special_requests: formData.specialRequests,
        terms_accepted: formData.termsAccepted,
      };

      await submitHotelBooking(payload);
      // Wait a moment to mock payment processing
      await new Promise((resolve) => setTimeout(resolve, 1000));
      onContinue();
    } catch (error) {
      console.error("Failed to submit booking", error);
      alert("Something went wrong while confirming your booking. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <PaymentForm
      formData={formData}
      onChange={onChange}
      confirmLabel={`Confirm & Pay $${depositAmount.toFixed(2)} Deposit`}
      onPrevious={onPrevious}
      onConfirm={handleSubmit}
      isLoading={isSubmitting}
      sidebar={
        <BookingSidebar
          hotel={hotel}
          formData={formData}
          totalAmount={totalAmount}
          vatAmount={vatAmount}
          depositAmount={depositAmount}
          totalRooms={totalRooms}
          totalGuests={totalGuests}
        />
      }
    />
  );
}

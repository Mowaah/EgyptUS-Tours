import { Suspense } from "react";
import type { Metadata } from "next";
import ProfileBookingDetailsPage from "@/components/website/ProfileBookingDetailsPage/ProfileBookingDetailsPage";

export const metadata: Metadata = {
  title: "Booking Details | Egypt-Us",
  description: "View booking details and payment status for your trip.",
};

export default function BookingDetails() {
  return (
    <Suspense fallback={null}>
      <ProfileBookingDetailsPage />
    </Suspense>
  );
}

"use client";

import React, { useState } from "react";
import Image from "next/image";
import DashboardNavbar from "@/components/dashboard/Navbar/DashboardNavbar";
import ProfileHeader from "@/components/dashboard/shared/ProfileHeader/ProfileHeader";
import profileStyles from "@/components/dashboard/shared/ProfileHeader/ProfileHeader.module.scss";
import styles from "./ViewHotel.module.scss";

// Re-using the same sections as ViewTrip since they share a lot of structure
import GuestDetails from "@/components/dashboard/Bookings/TripsBookings/ViewTrip/GuestDetails";
import BookingInformation from "@/components/dashboard/Bookings/TripsBookings/ViewTrip/BookingInformation";
import RoomSelection from "@/components/dashboard/Bookings/TripsBookings/ViewTrip/RoomSelection";
import PaymentOverview from "@/components/dashboard/Bookings/TripsBookings/ViewTrip/PaymentOverview";
import PriceDetails from "@/components/dashboard/Bookings/TripsBookings/ViewTrip/PriceDetails";
import ActivityTimeline from "@/components/dashboard/Bookings/TripsBookings/ViewTrip/ActivityTimeline";

import type { HotelBookingRow } from "../types";
import { getTripsPillStyle } from "@/components/dashboard/Bookings/TripsBookings/TripsPanel/tripsColumns";
import ActionNoteModal, { ActionNoteModalConfig } from "@/components/dashboard/LeadsInquiries/ActionNoteModal/ActionNoteModal";
import DashboardStatusBanner from "@/components/dashboard/shared/DashboardStatusBanner/DashboardStatusBanner";
import { RefundModal, RefundSummary } from "@/components/dashboard/shared";
import type { RefundData } from "@/components/dashboard/shared/RefundSummary/RefundSummary";

interface ViewHotelProps {
  bookingId: string;
}

const cancelBookingConfig: ActionNoteModalConfig = {
  title: "Cancel Booking",
  iconSrc: "/images/dashboard/inquiries/close_lead.svg",
  label: "Enter Cancellation Reason",
  primaryLabel: "Confirm Cancellation",
  placeholder: "Enter the reason for cancelling this booking...",
  isDanger: true,
};

import { getHotelBookingById, cancelHotelBooking, sendHotelBookingReminder } from "@/services/admin/adminBookingsService";
import useSWR from "swr";

export default function ViewHotel({ bookingId }: ViewHotelProps) {
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [isRefundModalOpen, setIsRefundModalOpen] = useState(false);
  const [bannerMessage, setBannerMessage] = useState("");
  const [bannerVariant, setBannerVariant] = useState<"success" | "warning" | "error">("success");
  const [isSendingReminder, setIsSendingReminder] = useState(false);
  
  const { data: hotelData, isLoading, mutate } = useSWR(
    bookingId ? ["/bookings/hotels", bookingId] : null,
    () => getHotelBookingById(bookingId)
  );

  const payload = hotelData;
  const isRefunded = payload?.operational_status === "refunded";
  const isCancelled = payload?.operational_status === "cancelled";
  const displayId = payload?.booking_code || `BK-${bookingId}`;

  const customPills = payload ? (
    <div className={styles.customPills}>
      {!isRefunded && (
        <span className={getTripsPillStyle(payload.remaining_payment_status)}>
          <i aria-hidden></i>
          {payload.remaining_payment_status ? payload.remaining_payment_status.charAt(0).toUpperCase() + payload.remaining_payment_status.slice(1) : "-"}
        </span>
      )}
      <span className={getTripsPillStyle(payload.operational_status)}>
        <i aria-hidden></i>
        {payload.operational_status ? payload.operational_status.split('_').map((w: string) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ') : "-"}
      </span>
      <span className={getTripsPillStyle(payload.stay?.source)}>
        {payload.stay?.source === "website" ? (
          <Image src="/images/dashboard/customers/custom/website.svg" alt="website" width={14} height={14} />
        ) : (payload.stay?.source === "agent" || payload.stay?.source === "admin") ? (
          <Image src="/images/dashboard/customers/custom/agent.svg" alt="agent" width={14} height={14} />
        ) : null}
        {payload.stay?.source ? (payload.stay?.source === "admin" ? "Agent" : payload.stay.source.charAt(0).toUpperCase() + payload.stay.source.slice(1)) : "-"}
      </span>
    </div>
  ) : null;

  const handleSendReminder = async () => {
    try {
      setIsSendingReminder(true);
      await sendHotelBookingReminder(bookingId);
      setBannerVariant("success");
      setBannerMessage("Email reminder sent successfully.");
      mutate(); // Refresh the activity timeline
    } catch (err: any) {
      setBannerVariant("error");
      setBannerMessage(err?.response?.data?.payment?.[0] || err?.response?.data?.detail || "Failed to send email reminder.");
    } finally {
      setIsSendingReminder(false);
    }
  };

  const actionButtons = isRefunded ? null : isCancelled ? (
    <button 
      className={styles.primaryActionButton} 
      type="button"
      onClick={() => setIsRefundModalOpen(true)}
    >
      Refund Payment
      <Image src="/images/money-send.svg" alt="" width={20} height={20} />
    </button>
  ) : (
    <>
      <button 
        className={styles.dangerActionButton} 
        type="button"
        onClick={() => setIsCancelModalOpen(true)}
      >
        Cancel Booking
        <Image src="/images/dashboard/booking/trips/view/cancel.svg" alt="" width={20} height={20} />
      </button>

      <button 
        className={styles.primaryActionButton} 
        type="button"
        onClick={handleSendReminder}
        disabled={isSendingReminder}
        style={{ opacity: isSendingReminder ? 0.7 : 1 }}
      >
        {isSendingReminder ? "Sending..." : "Send Email Reminder"}
        <Image src="/images/dashboard/booking/trips/view/reminder.svg" alt="" width={20} height={20} />
      </button>
    </>
  );

  return (
    <>
      <DashboardNavbar
        breadcrumbTrail={[
          { label: "Bookings", href: "/dashboard/bookings/hotels" },
          { label: "Hotels", href: "/dashboard/bookings/hotels" },
          { label: "Details" }
        ]}
      >
        <ProfileHeader
          title={payload?.hotel_card?.hotel_name || payload?.stay?.hotel_name || "Hotel Booking"}
          customPills={customPills}
          subtitleElements={[`${displayId}`, payload?.stay?.check_in_date || "-", "10:30 AM"]}
          actionButtons={payload ? actionButtons : null}
        />
      </DashboardNavbar>

      <div className={styles.contentWrapper}>
        {isLoading ? (
          <div style={{ padding: "40px", textAlign: "center", color: "#6B7280" }}>Loading booking details...</div>
        ) : (
          <div className={styles.gridContainer}>
            <div className={styles.leftColumn}>
              <GuestDetails guest={payload?.guest} booking={payload?.stay} />
              <BookingInformation booking={payload?.stay} />
              <RoomSelection selections={payload?.room_selections} />
              <PaymentOverview overview={payload?.payment_overview} />
            </div>
            
            <div className={styles.rightColumn}>
              <PriceDetails details={payload?.price_details} overview={payload?.payment_overview} />
              <ActivityTimeline events={payload?.events || []} />
            </div>
          </div>
        )}
      </div>

      <ActionNoteModal 
        open={isCancelModalOpen}
        config={cancelBookingConfig}
        onClose={() => setIsCancelModalOpen(false)} 
        onSubmit={async (note) => {
          try {
            await cancelHotelBooking(bookingId, note);
            setIsCancelModalOpen(false);
            setBannerVariant("success");
            setBannerMessage("The Booking has been Successfully Cancelled");
            mutate();
          } catch (err: any) {
            console.error("Failed to cancel hotel booking:", err);
            setBannerVariant("error");
            setBannerMessage(err?.response?.data?.message || "Failed to cancel booking. Please try again.");
            setIsCancelModalOpen(false);
          }
        }} 
      />

      <RefundModal
        open={isRefundModalOpen}
        onClose={() => setIsRefundModalOpen(false)}
        onSubmit={async (data) => {
          console.log("Refunding payment with data:", data);
          setIsRefundModalOpen(false);
          setBannerMessage("The Refunded Payment has been Successfully Done");
          mutate();
        }}
      />
      <DashboardStatusBanner 
        message={bannerMessage} 
        variant={bannerVariant}
        show={!!bannerMessage} 
        onClose={() => setBannerMessage("")} 
      />
    </>
  );
}

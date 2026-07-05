"use client";

import React, { useState } from "react";
import Image from "next/image";
import DashboardNavbar from "@/components/dashboard/Navbar/DashboardNavbar";
import ProfileHeader from "@/components/dashboard/shared/ProfileHeader/ProfileHeader";
import styles from "./ViewHotel.module.scss";

// Re-using the same sections as ViewTrip since they share a lot of structure
import GuestDetails from "@/components/dashboard/Bookings/TripsBookings/ViewTrip/GuestDetails";
import BookingInformation from "@/components/dashboard/Bookings/TripsBookings/ViewTrip/BookingInformation";
import RoomSelection from "@/components/dashboard/Bookings/TripsBookings/ViewTrip/RoomSelection";
import PaymentOverview from "@/components/dashboard/Bookings/TripsBookings/ViewTrip/PaymentOverview";
import PriceDetails from "@/components/dashboard/Bookings/TripsBookings/ViewTrip/PriceDetails";
import ActivityTimeline from "@/components/dashboard/Bookings/TripsBookings/ViewTrip/ActivityTimeline";

import { MOCK_HOTEL_BOOKINGS } from "../hotelsData";
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

export default function ViewHotel({ bookingId }: ViewHotelProps) {
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [isRefundModalOpen, setIsRefundModalOpen] = useState(false);
  const [isCancelled, setIsCancelled] = useState(false);
  const [isRefunded, setIsRefunded] = useState(false);
  const [refundData, setRefundData] = useState<RefundData | null>(null);
  const [bannerMessage, setBannerMessage] = useState("");
  
  const hotel = MOCK_HOTEL_BOOKINGS.find((t) => t.id === bookingId) || MOCK_HOTEL_BOOKINGS[0];
  const displayId = hotel.id;

  const customPills = (
    <div className={styles.customPills}>
      {!isRefunded && (
        <span className={getTripsPillStyle(hotel.paymentStatus)}>
          <i aria-hidden></i>
          {["Paid", "Pending", "Overdue"].includes(hotel.paymentStatus) ? `70% ${hotel.paymentStatus}` : hotel.paymentStatus}
        </span>
      )}
      <span className={getTripsPillStyle(isRefunded ? "Refunded" : isCancelled ? "Canceled" : hotel.status)}>
        <i aria-hidden></i>
        {isRefunded ? "Refunded" : isCancelled ? "Canceled" : hotel.status}
      </span>
      <span className={getTripsPillStyle(hotel.source)}>
        {hotel.source === "Website" ? (
          <Image src="/images/dashboard/customers/custom/website.svg" alt="website" width={14} height={14} />
        ) : hotel.source === "Agent" ? (
          <Image src="/images/dashboard/customers/custom/agent.svg" alt="agent" width={14} height={14} />
        ) : null}
        {hotel.source}
      </span>
    </div>
  );

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

      <button className={styles.primaryActionButton} type="button">
        Send Email Reminder
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
          title={hotel.customerName}
          customPills={customPills}
          subtitleElements={[`${displayId}`, hotel.checkIn, "10:30 AM"]}
          actionButtons={actionButtons}
        />
      </DashboardNavbar>

      <div className={styles.contentWrapper}>
        <DashboardStatusBanner 
          message={bannerMessage} 
          show={!!bannerMessage} 
          onClose={() => setBannerMessage("")} 
          className={styles.toastBanner}
        />
        <div className={styles.gridContainer}>
          <div className={styles.leftColumn}>
            {/* Using mock trip data shape to satisfy GuestDetails types, 
                since we are re-using the trips components directly for mockup purposes */}
            <GuestDetails trip={{
              customerName: hotel.customerName,
              customerEmail: "example@gmail.com",
              customerPhone: "+20 123 456 789",
              nationality: "Egyptian",
              language: "Arabic"
            } as any} />
            <BookingInformation />
            <RoomSelection />
            <PaymentOverview />
          </div>
          
          <div className={styles.rightColumn}>
            <PriceDetails />
            <ActivityTimeline />
            {isRefunded && refundData && <RefundSummary data={refundData} />}
          </div>

        </div>
      </div>

      <ActionNoteModal 
        open={isCancelModalOpen}
        config={cancelBookingConfig}
        onClose={() => setIsCancelModalOpen(false)} 
        onSubmit={(note) => {
          console.log("Cancelling booking with note:", note);
          setIsCancelModalOpen(false);
          setIsCancelled(true);
          setBannerMessage("The Booking has been Successfully Cancelled");
        }} 
      />

      <RefundModal
        open={isRefundModalOpen}
        onClose={() => setIsRefundModalOpen(false)}
        onSubmit={(data) => {
          console.log("Refunding payment with data:", data);
          setIsRefundModalOpen(false);
          setIsRefunded(true);
          setRefundData(data);
          setBannerMessage("The Refunded Payment has been Successfully Done");
        }}
      />
    </>
  );
}

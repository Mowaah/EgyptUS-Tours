"use client";

import React, { useState } from "react";
import Image from "next/image";
import DashboardNavbar from "@/components/dashboard/Navbar/DashboardNavbar";
import ProfileHeader from "@/components/dashboard/shared/ProfileHeader/ProfileHeader";
import profileStyles from "@/components/dashboard/shared/ProfileHeader/ProfileHeader.module.scss";
import styles from "./ViewTrip.module.scss";

import GuestDetails from "./GuestDetails";
import BookingInformation from "./BookingInformation";
import RoomSelection from "./RoomSelection";
import PaymentOverview from "./PaymentOverview";
import PriceDetails from "./PriceDetails";
import ActivityTimeline from "./ActivityTimeline";
import { mockTripsData } from "../tripsData";
import { getTripsPillStyle } from "../TripsPanel/tripsColumns";
import ActionNoteModal, { ActionNoteModalConfig } from "@/components/dashboard/LeadsInquiries/ActionNoteModal/ActionNoteModal";
import DashboardStatusBanner from "@/components/dashboard/shared/DashboardStatusBanner/DashboardStatusBanner";
import { RefundModal, RefundSummary } from "@/components/dashboard/shared";
import type { RefundData } from "@/components/dashboard/shared/RefundSummary/RefundSummary";

interface ViewTripProps {
  tripId: string;
}

const cancelBookingConfig: ActionNoteModalConfig = {
  title: "Cancel Booking",
  iconSrc: "/images/dashboard/inquiries/close_lead.svg",
  label: "Enter Cancellation Reason",
  primaryLabel: "Confirm Cancellation",
  placeholder: "Enter the reason for cancelling this booking...",
  isDanger: true,
};

export default function ViewTrip({ tripId }: ViewTripProps) {
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [isRefundModalOpen, setIsRefundModalOpen] = useState(false);
  const [isCancelled, setIsCancelled] = useState(false);
  const [isRefunded, setIsRefunded] = useState(false);
  const [refundData, setRefundData] = useState<RefundData | null>(null);
  const [bannerMessage, setBannerMessage] = useState("");
  
  const trip = mockTripsData.find((t) => t.id === tripId) || mockTripsData[0];
  const displayId = trip.id;

  const customPills = (
    <div className={styles.customPills}>
      {!isRefunded && (
        <span className={getTripsPillStyle(trip.depositStatus)}>
          <i aria-hidden></i>
          {["Paid", "Pending", "Overdue"].includes(trip.depositStatus) ? `70% ${trip.depositStatus}` : trip.depositStatus}
        </span>
      )}
      <span className={getTripsPillStyle(isRefunded ? "Refunded" : isCancelled ? "Canceled" : trip.status)}>
        <i aria-hidden></i>
        {isRefunded ? "Refunded" : isCancelled ? "Canceled" : trip.status}
      </span>
      <span className={getTripsPillStyle(trip.source)}>
        {trip.source === "Website" ? (
          <Image src="/images/dashboard/customers/custom/website.svg" alt="website" width={14} height={14} />
        ) : trip.source === "Agent" ? (
          <Image src="/images/dashboard/customers/custom/agent.svg" alt="agent" width={14} height={14} />
        ) : null}
        {trip.source}
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
          { label: "Bookings", href: "/dashboard/bookings/trips" },
          { label: "Trips", href: "/dashboard/bookings/trips" },
          { label: "Details" }
        ]}
      >
        <ProfileHeader
          title={trip.customerName}
          customPills={customPills}
          subtitleElements={[`${displayId}`, trip.dates.split(" → ")[0], "10:30 AM"]}
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
            <GuestDetails trip={trip} />
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

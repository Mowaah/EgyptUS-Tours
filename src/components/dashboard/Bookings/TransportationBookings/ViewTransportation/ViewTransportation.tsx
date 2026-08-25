"use client";

import React from "react";
import Image from "next/image";
import DashboardNavbar from "@/components/dashboard/Navbar/DashboardNavbar";
import ProfileHeader from "@/components/dashboard/shared/ProfileHeader/ProfileHeader";
import profileStyles from "@/components/dashboard/shared/ProfileHeader/ProfileHeader.module.scss";
import styles from "./ViewTransportation.module.scss";

import PassengerInformation from "./PassengerInformation";
import TransferDetails from "./TransferDetails";
import PaymentOverview from "./PaymentOverview";
import TransportationPriceDetails from "./TransportationPriceDetails";
import ActivityTimeline from "./ActivityTimeline";
import type { TransportationBookingRow } from "../types";
import { getPillStyle } from "../TransportationPanel/transportationColumns";
import ActionNoteModal, { ActionNoteModalConfig } from "@/components/dashboard/LeadsInquiries/ActionNoteModal/ActionNoteModal";
import DashboardStatusBanner from "@/components/dashboard/shared/DashboardStatusBanner/DashboardStatusBanner";
import { RefundModal, RefundSummary } from "@/components/dashboard/shared";
import type { RefundData } from "@/components/dashboard/shared/RefundSummary/RefundSummary";

interface ViewTransportationProps {
  id: string;
}

const cancelBookingConfig: ActionNoteModalConfig = {
  title: "Cancel Booking",
  iconSrc: "/images/dashboard/inquiries/close_lead.svg",
  label: "Enter Cancellation Reason",
  primaryLabel: "Confirm Cancellation",
  placeholder: "Enter the reason for cancelling this booking...",
  isDanger: true,
};

import { getTransportationBookingById, cancelTransportationBooking, sendTransportationBookingReminder } from "@/services/admin/adminBookingsService";
import useSWR from "swr";

export default function ViewTransportation({ id }: ViewTransportationProps) {
  const [isCancelModalOpen, setIsCancelModalOpen] = React.useState(false);
  const [isRefundModalOpen, setIsRefundModalOpen] = React.useState(false);
  const [bannerMessage, setBannerMessage] = React.useState("");
  const [bannerVariant, setBannerVariant] = React.useState<"success" | "warning" | "error">("success");
  const [isSendingReminder, setIsSendingReminder] = React.useState(false);
  
  const { data: transportData, isLoading, mutate } = useSWR(
    id ? ["/bookings/transportation", id] : null,
    () => getTransportationBookingById(id)
  );

  const payload = transportData;
  const isRefunded = payload?.operational_status === "refunded";
  const isCancelled = payload?.operational_status === "cancelled";
  const displayId = payload?.booking_code || `BK-${String(id).padStart(6, "0")}`;

  const customPills = payload ? (
    <div className={styles.customPills}>
      {!isRefunded && (
        <span className={getPillStyle(payload.remaining_payment_status)}>
          <i aria-hidden></i>
          {payload.remaining_payment_status ? payload.remaining_payment_status.charAt(0).toUpperCase() + payload.remaining_payment_status.slice(1) : "-"}
        </span>
      )}
      <span className={getPillStyle(payload.operational_status)}>
        <i aria-hidden></i>
        {payload.operational_status ? payload.operational_status.split('_').map((w: string) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ') : "-"}
      </span>
      <span className={getPillStyle(payload.transfer?.source)}>
        {payload.transfer?.source === "website" ? (
          <Image src="/images/dashboard/customers/custom/website.svg" alt="website" width={14} height={14} />
        ) : (payload.transfer?.source === "agent" || payload.transfer?.source === "admin") ? (
          <Image src="/images/dashboard/customers/custom/agent.svg" alt="agent" width={14} height={14} />
        ) : null}
        {payload.transfer?.source ? (payload.transfer?.source === "admin" ? "Agent" : payload.transfer.source.charAt(0).toUpperCase() + payload.transfer.source.slice(1)) : "-"}
      </span>
    </div>
  ) : null;

  const handleSendReminder = async () => {
    try {
      setIsSendingReminder(true);
      await sendTransportationBookingReminder(id);
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
          { label: "Bookings", href: "/dashboard/bookings/transportation" },
          { label: "Transportation", href: "/dashboard/bookings/transportation" },
          { label: "Details", href: `/dashboard/bookings/transportation/${id}` }
        ]}
      >
        <ProfileHeader 
          title={payload?.transfer?.vehicle_class ? `Sedan \u2013 ${payload.transfer.vehicle_class}` : "Loading..."}
          subtitleElements={[`#${displayId}`, payload?.transfer?.pickup_date || "-", payload?.transfer?.pickup_time || "10:30 AM"]}
          customPills={customPills}
          actionButtons={payload ? actionButtons : null}
        />
      </DashboardNavbar>
      <div className={styles.contentWrapper}>

        {isLoading ? (
          <div style={{ padding: "40px", textAlign: "center", color: "#6B7280" }}>Loading booking details...</div>
        ) : (
          <div className={styles.gridContainer}>
            <div className={styles.leftColumn}>
              <PassengerInformation guest={payload?.guest} />
              <TransferDetails transfer={payload?.transfer} />
              <PaymentOverview overview={payload?.payment_overview} />
            </div>
            
            <div className={styles.rightColumn}>
              <TransportationPriceDetails details={payload?.price_details} overview={payload?.payment_overview} vehicleCard={payload?.vehicle_card} />
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
            await cancelTransportationBooking(id, note);
            setIsCancelModalOpen(false);
            setBannerVariant("success");
            setBannerMessage("The Booking has been Successfully Cancelled");
            mutate();
          } catch (err: any) {
            console.error("Failed to cancel transportation booking:", err);
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

"use client";

import React from "react";
import Image from "next/image";
import DashboardNavbar from "@/components/dashboard/Navbar/DashboardNavbar";
import ProfileHeader from "@/components/dashboard/shared/ProfileHeader/ProfileHeader";
import styles from "./ViewTransportation.module.scss";

import PassengerInformation from "./PassengerInformation";
import TransferDetails from "./TransferDetails";
import PaymentOverview from "./PaymentOverview";
import TransportationPriceDetails from "./TransportationPriceDetails";
import ActivityTimeline from "./ActivityTimeline";
import { mockTransportationData } from "../transportationData";
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

export default function ViewTransportation({ id }: ViewTransportationProps) {
  const [isCancelModalOpen, setIsCancelModalOpen] = React.useState(false);
  const [isRefundModalOpen, setIsRefundModalOpen] = React.useState(false);
  const [isCancelled, setIsCancelled] = React.useState(false);
  const [isRefunded, setIsRefunded] = React.useState(false);
  const [refundData, setRefundData] = React.useState<RefundData | null>(null);
  const [bannerMessage, setBannerMessage] = React.useState("");
  const transportation = mockTransportationData.find((t) => t.id === id) || mockTransportationData[0];
  const displayId = transportation.id;

  const customPills = (
    <div className={styles.customPills}>
      {!isRefunded && (
        <span className={getPillStyle(transportation.depositStatus)}>
          <i aria-hidden></i>
          {transportation.depositStatus === "Paid" || transportation.depositStatus === "Pending" || transportation.depositStatus === "Overdue" ? `70% ${transportation.depositStatus}` : transportation.depositStatus}
        </span>
      )}
        <span className={getPillStyle(isRefunded ? "Refunded" : isCancelled ? "Canceled" : transportation.status)}>
          <i aria-hidden></i>
          {isRefunded ? "Refunded" : isCancelled ? "Canceled" : transportation.status}
        </span>
      <span className={getPillStyle(transportation.source)}>
        {transportation.source === "Website" ? (
          <Image src="/images/dashboard/customers/custom/website.svg" alt="website" width={14} height={14} />
        ) : transportation.source === "Agent" ? (
          <Image src="/images/dashboard/customers/custom/agent.svg" alt="agent" width={14} height={14} />
        ) : null}
        {transportation.source}
      </span>
    </div>
  );

  const actionButtons = isRefunded ? null : isCancelled ? (
    <button 
      className={`${styles.actionButton} ${styles.primaryButton}`} 
      type="button"
      onClick={() => setIsRefundModalOpen(true)}
    >
      Refund Payment
      <Image src="/images/money-send.svg" alt="" width={20} height={20} />
    </button>
  ) : (
    <>
      <button 
        className={`${styles.actionButton} ${styles.dangerButton}`}
        onClick={() => setIsCancelModalOpen(true)}
      >
        Cancel Booking
        <Image src="/images/dashboard/booking/trips/view/cancel.svg" alt="" width={20} height={20} />
      </button>

      <button className={`${styles.actionButton} ${styles.primaryButton}`} type="button">
        Send Email Reminder
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
          title={`Sedan \u2013 ${transportation.vehicleClass}`}
          subtitleElements={[`#${displayId}`, transportation.dateTime.split(", ")[0] || "Mar 22", transportation.dateTime.split(", ")[1] || "10:30 AM"]}
          customPills={customPills}
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
            <PassengerInformation transportation={transportation} />
            <TransferDetails transportation={transportation} />
            <PaymentOverview />
          </div>
          
          <div className={styles.rightColumn}>
            <TransportationPriceDetails transportation={transportation} />
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
          console.log("Cancelling transportation with note:", note);
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

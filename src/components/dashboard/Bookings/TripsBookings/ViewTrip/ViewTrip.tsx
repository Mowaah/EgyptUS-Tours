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
import type { TripBookingRow } from "../types";
import { getTripsPillStyle } from "../TripsPanel/tripsColumns";
import ActionNoteModal, { ActionNoteModalConfig } from "@/components/dashboard/LeadsInquiries/ActionNoteModal/ActionNoteModal";
import DashboardStatusBanner from "@/components/dashboard/shared/DashboardStatusBanner/DashboardStatusBanner";
import useSWR from "swr";
import { getTripBookingById, cancelTripBooking, sendTripBookingReminder, refundTripBooking } from "@/services/admin/adminBookingsService";
import { RefundModal } from "@/components/dashboard/shared";
import { calculateRefundSummary, RefundSummary } from "@/utils/cancellationPolicy";

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
  const [bannerMessage, setBannerMessage] = useState("");
  const [bannerVariant, setBannerVariant] = useState<"success" | "warning" | "error">("success");
  const [isSendingReminder, setIsSendingReminder] = useState(false);
  const { data: tripData, isLoading, mutate } = useSWR(
    tripId ? ["/bookings/trips", tripId] : null,
    () => getTripBookingById(tripId)
  );

  const payload = tripData;
  const isRefunded = 
    payload?.operational_status === "refunded" || 
    payload?.operational_status === "no_refund" || 
    payload?.operational_status === "no_refunded" || 
    payload?.operational_status === "no_refunded_amount";
  const isCancelled = payload?.operational_status === "cancelled";
  const displayId = payload?.booking_code || `BK-${String(tripId).padStart(6, "0")}`;

  const refundSummary = React.useMemo(() => {
    if (!payload) return undefined;
    
    let total = Number(
      payload.payment_overview?.total_package ??
      payload.payment_overview?.total ??
      payload.price_details?.total ??
      payload.total_price ??
      payload.total_amount ??
      0
    );

    if (total === 0 && payload.price_details) {
      const items = payload.price_details.line_items || payload.price_details.items || [];
      total = items.reduce((acc: number, item: any) => acc + Number(item.price || item.amount || item.line_total || 0), 0);
    }
    
    const rem = payload.remaining_payment_status?.toLowerCase();
    const payStatus = payload.payment_status?.toLowerCase();
    const isFullyPaid = rem === "paid" || payStatus === "paid" || rem === "completed";
    const isPartiallyPaid = rem === "partially_paid" || payStatus === "partially_paid";

    let totalPaid = 0;
    if (isFullyPaid) {
      totalPaid = total;
    } else if (isPartiallyPaid) {
      const depAmt = Number(payload.payment_overview?.deposit_amount);
      totalPaid = !isNaN(depAmt) && depAmt > 0 ? depAmt : total * 0.3;
    } else if (payload.payment_overview?.paid_to_date != null) {
      const parsed = Number(payload.payment_overview.paid_to_date);
      if (!isNaN(parsed)) {
        totalPaid = parsed > total * 1.5 && total > 0 ? total : parsed;
      }
    } else {
      totalPaid = total;
    }
    
    const travelDate = payload.booking?.start_date || payload.start_date || new Date().toISOString();
    return calculateRefundSummary(total, totalPaid, travelDate);
  }, [payload]);

  const remainingPaymentLabel = React.useMemo(() => {
    if (!payload) return "-";
    const rem = payload.remaining_payment_status?.toLowerCase();
    if (rem === "paid" || payload.payment_status === "paid") return "Paid";
    if (rem === "overdue") return "Overdue";
    if (rem === "refunded") return "Refunded";

    if (rem === "pending" || payload.payment_status === "pending" || payload.payment_status === "partially_paid") {
      let total = Number(payload.payment_overview?.total || 0);
      if (total === 0) {
        total = Number(payload.total_price || payload.total_amount || 0);
      }
      let totalPaid = Number(payload.payment_overview?.total_paid || payload.amount_paid || payload.paid_amount || 0);
      
      if (total > 0 && totalPaid > 0 && totalPaid < total) {
        const pct = Math.round(((total - totalPaid) / total) * 100);
        return `${pct}% Pending`;
      }
      if (payload.payment_overview?.remaining_percentage && payload.payment_overview?.remaining_percentage !== "0%") {
        return `${payload.payment_overview.remaining_percentage} Pending`;
      }
      return "70% Pending";
    }

    return payload.remaining_payment_status
      ? payload.remaining_payment_status.charAt(0).toUpperCase() + payload.remaining_payment_status.slice(1)
      : "-";
  }, [payload]);

  const operationalStatusLabel = React.useMemo(() => {
    if (!payload?.operational_status) return "-";
    const op = payload.operational_status.toLowerCase();
    if (op === "no_refund" || op === "no_refunded" || op === "no_refunded_amount") {
      return "No Refunded Amount";
    }
    if (op === "refunded") {
      const refAmt = Number(payload.refunded_amount ?? payload.payment_overview?.refunded_amount);
      if (!isNaN(refAmt) && refAmt === 0 && (payload.refunded_amount !== undefined || payload.payment_overview?.refunded_amount !== undefined)) {
        return "No Refunded Amount";
      }
      return "Refunded";
    }
    return payload.operational_status.split('_').map((w: string) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  }, [payload]);

  const customPills = payload ? (
    <div className={styles.customPills}>
      {!isRefunded && (
        <span className={getTripsPillStyle(payload.remaining_payment_status)}>
          <i aria-hidden></i>
          {remainingPaymentLabel}
        </span>
      )}
      <span className={getTripsPillStyle(payload.operational_status)}>
        <i aria-hidden></i>
        {operationalStatusLabel}
      </span>
      <span className={getTripsPillStyle(payload.booking?.source)}>
        {payload.booking?.source === "website" ? (
          <Image src="/images/dashboard/customers/custom/website.svg" alt="website" width={14} height={14} />
        ) : (payload.booking?.source === "agent" || payload.booking?.source === "admin") ? (
          <Image src="/images/dashboard/customers/custom/agent.svg" alt="agent" width={14} height={14} />
        ) : null}
        {payload.booking?.source ? (payload.booking?.source === "admin" ? "Agent" : payload.booking.source.charAt(0).toUpperCase() + payload.booking.source.slice(1)) : "-"}
      </span>
    </div>
  ) : null;

  const handleSendReminder = async () => {
    try {
      setIsSendingReminder(true);
      await sendTripBookingReminder(tripId);
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

  const customerName = payload?.guest?.full_name || payload?.customer_name || payload?.booking?.full_name || "Trip Booking";
  const createdAtDate = payload?.created_at || payload?.booking?.created_at;
  const formattedDate = createdAtDate
    ? new Date(createdAtDate).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "-";
  const formattedTime = createdAtDate
    ? new Date(createdAtDate).toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      })
    : "-";

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
          title={customerName}
          customPills={customPills}
          subtitleElements={[`${displayId}`, formattedDate, formattedTime]}
          actionButtons={payload ? actionButtons : null}
        />
      </DashboardNavbar>

      <div className={styles.contentWrapper}>
        <DashboardStatusBanner 
          message={bannerMessage} 
          variant={bannerVariant}
          show={!!bannerMessage} 
          onClose={() => setBannerMessage("")} 
          className={styles.toastBanner}
        />

        {isLoading ? (
          <div style={{ padding: "40px", textAlign: "center", color: "#6B7280" }}>Loading booking details...</div>
        ) : (
          <div className={styles.gridContainer}>
            <div className={styles.leftColumn}>
              <GuestDetails guest={payload?.guest} booking={payload?.booking} />
              <BookingInformation booking={payload?.booking} />
              <RoomSelection selections={payload?.booking?.room_selections} booking={payload?.booking} />
              <PaymentOverview overview={payload?.payment_overview} payload={payload} />
            </div>
            
            <div className={styles.rightColumn}>
              <PriceDetails details={payload?.price_details} overview={payload?.payment_overview} booking={payload?.booking} />
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
            await cancelTripBooking(tripId, note);
            setIsCancelModalOpen(false);
            setBannerVariant("success");
            setBannerMessage("The Booking has been Successfully Cancelled");
            mutate();
          } catch (err: any) {
            console.error("Failed to cancel booking:", err);
            setBannerVariant("error");
            setBannerMessage(err?.response?.data?.message || "Failed to cancel booking. Please try again.");
            setIsCancelModalOpen(false);
          }
        }} 
      />

      <RefundModal
        open={isRefundModalOpen}
        onClose={() => setIsRefundModalOpen(false)}
        refundSummary={refundSummary}
        currency={payload?.currency || "$"}
        onSubmit={async (data) => {
          try {
            const formData = new FormData();
            formData.append("transaction_reference", data.reference);
            if (data.notes) formData.append("notes", data.notes);
            if (data.file) formData.append("receipt_file", data.file);
            
            await refundTripBooking(tripId, formData);
            setIsRefundModalOpen(false);
            setBannerVariant("success");
            setBannerMessage("The Refunded Payment has been Successfully Done");
            mutate();
          } catch (err: any) {
            console.error("Failed to refund trip booking:", err);
            setBannerVariant("error");
            setBannerMessage(err?.response?.data?.message || err?.response?.data?.detail || "Failed to process refund.");
            setIsRefundModalOpen(false);
          }
        }}
      />
    </>
  );
}

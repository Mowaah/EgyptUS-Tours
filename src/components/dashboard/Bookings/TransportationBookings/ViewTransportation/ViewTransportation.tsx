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
import { RefundModal } from "@/components/dashboard/shared";
import type { RefundData } from "@/components/dashboard/shared/RefundSummary/RefundSummary";
import { calculateRefundSummary } from "@/utils/cancellationPolicy";

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

import { getTransportationBookingById, cancelTransportationBooking, sendTransportationBookingReminder, refundTransportationBooking } from "@/services/admin/adminBookingsService";
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
  const isRefunded = 
    payload?.operational_status === "refunded" || 
    payload?.operational_status === "no_refund" || 
    payload?.operational_status === "no_refunded" || 
    payload?.operational_status === "no_refunded_amount";
  const isCancelled = payload?.operational_status === "cancelled";
  const displayId = payload?.booking_code || `BK-${String(id).padStart(6, "0")}`;

  const refundSummary = React.useMemo(() => {
    if (!payload) return undefined;
    
    let total = Number(
      payload.payment_overview?.total_package ??
      payload.payment_overview?.total ??
      payload.price_details?.total ??
      payload.total_price ??
      payload.total_amount ??
      payload.transfer?.total_price ??
      payload.transfer?.price ??
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
    
    const travelDate =
      payload.transfer?.pickup_date ||
      payload.pickup_date ||
      payload.booking?.pickup_date ||
      payload.booking?.start_date ||
      new Date().toISOString();
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
        <span className={getPillStyle(payload.remaining_payment_status)}>
          <i aria-hidden></i>
          {remainingPaymentLabel}
        </span>
      )}
      <span className={getPillStyle(payload.operational_status)}>
        <i aria-hidden></i>
        {operationalStatusLabel}
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

  const createdAtDate = payload?.created_at || payload?.booking?.created_at || payload?.transfer?.created_at;
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

  const customerName =
    payload?.guest?.full_name ||
    payload?.customer_name ||
    payload?.transfer?.full_name ||
    payload?.transfer?.customer_name ||
    payload?.booking?.full_name ||
    payload?.full_name ||
    (payload?.guest?.first_name ? `${payload.guest.first_name} ${payload.guest.last_name || ""}`.trim() : null) ||
    "Transportation Booking";

  const guestData = React.useMemo(() => {
    if (!payload) return undefined;
    return {
      ...payload,
      ...payload.transfer,
      ...(payload.guest || {}),
      full_name:
        payload.guest?.full_name ||
        payload.customer_name ||
        payload.transfer?.full_name ||
        payload.transfer?.customer_name ||
        payload.booking?.full_name ||
        payload.full_name,
    };
  }, [payload]);

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
          title={customerName}
          subtitleElements={[`${displayId}`, formattedDate, formattedTime]}
          customPills={customPills}
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
              <PassengerInformation guest={guestData} />
              <TransferDetails transfer={payload?.transfer} />
              <PaymentOverview overview={payload?.payment_overview} payload={payload} />
            </div>
            
            <div className={styles.rightColumn}>
              <TransportationPriceDetails 
                details={payload?.price_details} 
                overview={payload?.payment_overview} 
                vehicleCard={payload?.vehicle_card}
                transfer={payload?.transfer}
                payload={payload}
              />
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
        refundSummary={refundSummary}
        currency={payload?.currency || "$"}
        onSubmit={async (data) => {
          try {
            const formData = new FormData();
            formData.append("transaction_reference", data.reference);
            if (data.notes) formData.append("notes", data.notes);
            if (data.file) formData.append("receipt_file", data.file);

            await refundTransportationBooking(id, formData);
            setIsRefundModalOpen(false);
            setBannerVariant("success");
            setBannerMessage("The Refunded Payment has been Successfully Done");
            mutate();
          } catch (err: any) {
            console.error("Failed to refund transportation booking:", err);
            setBannerVariant("error");
            setBannerMessage(err?.response?.data?.message || err?.response?.data?.detail || "Failed to process refund.");
            setIsRefundModalOpen(false);
          }
        }}
      />
    </>
  );
}

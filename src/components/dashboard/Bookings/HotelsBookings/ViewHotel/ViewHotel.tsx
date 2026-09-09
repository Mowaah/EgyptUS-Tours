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
import { RefundModal } from "@/components/dashboard/shared";
import type { RefundData } from "@/components/dashboard/shared/RefundSummary/RefundSummary";
import { calculateRefundSummary } from "@/utils/cancellationPolicy";

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

import { getHotelBookingById, cancelHotelBooking, sendHotelBookingReminder, refundHotelBooking } from "@/services/admin/adminBookingsService";
import useSWR from "swr";
import { formatDateDDMMYYYY } from "@/utils/dateFormat";


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
  const displayId = payload?.booking_code || `BK-${String(bookingId).padStart(6, "0")}`;

  const refundSummary = React.useMemo(() => {
    if (!payload) return undefined;
    
    let total = Number(payload.payment_overview?.total || 0);
    if (total === 0) {
      const pTotal = payload.total_price || payload.total_amount;
      if (pTotal !== undefined) {
        total = Number(pTotal);
      } else if (payload.price_details?.items?.length) {
        total = payload.price_details.items.reduce((acc: number, item: any) => acc + Number(item.price || item.amount || item.line_total || 0), 0);
      }
    }
    
    let totalPaid = Number(payload.payment_overview?.total_paid || 0);
    if (totalPaid === 0) {
      let paid = Number(payload.amount_paid || payload.paid_amount || payload.total_paid || 0);
      if (paid === 0 && payload.payments?.length) {
        paid = payload.payments.reduce((acc: number, p: any) => acc + Number(p.amount || 0), 0);
      }
      if (paid === 0 && payload.payment_summary?.paid_amount) {
        paid = Number(payload.payment_summary.paid_amount);
      }
      if (paid === 0) {
        const rem = payload.remaining_payment_status?.toLowerCase();
        const payStatus = payload.payment_status?.toLowerCase();
        if (rem === "paid" || payStatus === "paid" || rem === "completed") {
          paid = total;
        } else if (rem === "partially_paid" || payStatus === "partially_paid" || rem === "pending") {
          paid = total * 0.3;
        } else {
          paid = total;
        }
      }
      totalPaid = paid;
    }
    
    const travelDate = payload.stay?.check_in_date || payload.stay?.start_date || new Date().toISOString();
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

  const createdAtDate = payload?.created_at || payload?.booking?.created_at || payload?.stay?.created_at;
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

  const mergedBooking = React.useMemo(() => {
    if (!payload) return {};
    return { ...payload, ...(payload.stay || {}), ...(payload.booking || {}) };
  }, [payload]);

  const roomSelections = React.useMemo(() => {
    const rawList =
      (Array.isArray(payload?.room_selections) && payload.room_selections.length > 0 ? payload.room_selections : null) ||
      (Array.isArray(payload?.stay?.room_selections) && payload.stay.room_selections.length > 0 ? payload.stay.room_selections : null) ||
      (Array.isArray(payload?.details?.room_overview) && payload.details.room_overview.length > 0 ? payload.details.room_overview : null) ||
      (Array.isArray(payload?.rooms?.overview) && payload.rooms.overview.length > 0 ? payload.rooms.overview : null) ||
      (Array.isArray(payload?.price_details?.room_overview) && payload.price_details.room_overview.length > 0 ? payload.price_details.room_overview : null) ||
      (Array.isArray(payload?.price_details?.line_items) && payload.price_details.line_items.length > 0 ? payload.price_details.line_items : null) ||
      null;

    if (rawList && rawList.length > 0) return rawList;

    // Synthesize fallback from rooms count / breakdown
    const rooms = payload?.rooms || payload?.stay?.rooms || {};
    const single = Number(payload?.rooms_single ?? payload?.stay?.rooms_single ?? rooms.single ?? 0);
    const double = Number(payload?.rooms_double ?? payload?.stay?.rooms_double ?? rooms.double ?? 0);
    const triple = Number(payload?.rooms_triple ?? payload?.stay?.rooms_triple ?? rooms.triple ?? 0);

    const synthesized: any[] = [];
    if (single > 0) synthesized.push({ room_type: "single", quantity: single, view_label: "Standard View" });
    if (double > 0) synthesized.push({ room_type: "double", quantity: double, view_label: "Standard View" });
    if (triple > 0) synthesized.push({ room_type: "triple", quantity: triple, view_label: "Standard View" });

    if (synthesized.length === 0) {
      const totalRooms = Number(payload?.rooms_count || payload?.stay?.rooms_count || 0);
      if (totalRooms > 0) {
        synthesized.push({ room_type: "double", quantity: totalRooms, view_label: "Standard View" });
      }
    }

    return synthesized;
  }, [payload]);

  const customerName =
    payload?.guest?.full_name ||
    payload?.customer_name ||
    payload?.stay?.customer_name ||
    payload?.booking?.full_name ||
    payload?.full_name ||
    (payload?.guest?.first_name ? `${payload.guest.first_name} ${payload.guest.last_name || ""}`.trim() : null) ||
    "Hotel Booking";

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
              <GuestDetails guest={payload?.guest} booking={mergedBooking} />
              <BookingInformation booking={mergedBooking} />
              <RoomSelection selections={roomSelections} booking={mergedBooking} />
              <PaymentOverview overview={payload?.payment_overview} payload={payload} />
            </div>
            
            <div className={styles.rightColumn}>
              <PriceDetails details={payload?.price_details} overview={payload?.payment_overview} booking={mergedBooking} />
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
        refundSummary={refundSummary}
        currency={payload?.currency || "$"}
        onSubmit={async (data) => {
          try {
            const formData = new FormData();
            formData.append("transaction_reference", data.reference);
            if (data.notes) formData.append("notes", data.notes);
            if (data.file) formData.append("receipt_file", data.file);

            await refundHotelBooking(bookingId, formData);
            setIsRefundModalOpen(false);
            setBannerVariant("success");
            setBannerMessage("The Refunded Payment has been Successfully Done");
            mutate();
          } catch (err: any) {
            console.error("Failed to refund hotel booking:", err);
            setBannerVariant("error");
            setBannerMessage(err?.response?.data?.message || err?.response?.data?.detail || "Failed to process refund.");
            setIsRefundModalOpen(false);
          }
        }}
      />
    </>
  );
}

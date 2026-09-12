"use client";

import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import {
  BookingDetailsSections,
  BookingSidebar,
  CancelBookingModal,
  PageHeader,
  PaymentForm,
  RefundBankDetailsCard,
  RefundSummaryCard,
  StatusPill,
  SuccessModal,
  type BookingDetailsSection,
} from "@/components/shared";
import TransportBookingSummary from "@/components/website/BookTransportationPage/BookingSummary/BookingSummary";
import { getProfileBookingDetail, payRemainingBookingBalance, cancelProfileBooking, getFullImageUrl } from "@/lib/api";
import { getAllTrips } from "@/services/tripsService";
import { COUNTRIES } from "@/data/countries";
import { MultiCurrencyPrice } from "@/constants/currency";
import { calculateRefundSummary } from "@/utils/cancellationPolicy";
import { getStatusConfig } from "@/utils/statusUtils";
import { useCurrency } from "@/contexts/CurrencyContext";
import { useTranslation } from "@/hooks/useTranslation";
import { formatDateDDMMYYYY } from "@/utils/dateFormat";
import styles from "./ProfileBookingDetailsPage.module.scss";



export default function ProfileBookingDetailsPage() {
  const { t, language } = useTranslation("common");
  const localeCode = language === "it" ? "it-IT" : language === "es" ? "es-ES" : "en-US";
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryType = searchParams.get("type");
  const detailsType = queryType === "transport" || queryType === "hotel" ? queryType : "trip";
  const id = searchParams.get("id");
  const isTransport = detailsType === "transport";
  const isHotel = detailsType === "hotel";
  const isPaymentView = searchParams.get("view") === "payment";

  const [bookingDetail, setBookingDetail] = useState<any>(null);
  const [fallbackTripSlug, setFallbackTripSlug] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const { formatCurrency } = useCurrency();

  useEffect(() => {
    if (detailsType === "trip" && bookingDetail) {
      const directSlug =
        bookingDetail.price_details?.trip_slug ||
        bookingDetail.trip?.slug ||
        bookingDetail.trip_slug ||
        bookingDetail.details?.trip_slug;
      if (directSlug) {
        setFallbackTripSlug(directSlug);
        return;
      }
      const tripTitle = (bookingDetail.details?.trip_name || bookingDetail.title || bookingDetail.trip?.title || "").trim();
      if (tripTitle) {
        getAllTrips()
          .then((trips) => {
            const match = trips.find(
              (t) =>
                t.title?.toLowerCase() === tripTitle.toLowerCase() ||
                t.slug?.toLowerCase() === tripTitle.toLowerCase()
            );
            if (match?.slug) {
              setFallbackTripSlug(match.slug);
            }
          })
          .catch(() => {});
      }
    }
  }, [detailsType, bookingDetail]);

  useEffect(() => {
    if (id) {
      setLoading(true);
      getProfileBookingDetail(detailsType, id)
        .then(setBookingDetail)
        .catch((err) => console.error("Failed to fetch booking:", err))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [id, detailsType]);

  const bData = bookingDetail || {};
  const contact = bData.contact || {};
  const payment = bData.payment_summary || {};
  const roomsObj = bData.rooms || { single: 0, double: 0, triple: 0 };
  const specialRequests = [
    bData.special_requests && bData.special_requests.toLowerCase() !== "none"
      ? bData.special_requests
      : t("profile.details.none", "None")
  ];

  // Comprehensive amount resolution from all backend structures
  const rawTotal =
    bData.total_amount ??
    bData.total_price ??
    payment.total_amount ??
    payment.total_price ??
    bData.price ??
    bData.payment_overview?.total_price ??
    bData.payment_overview?.total_amount ??
    bData.price_details?.total_amount ??
    bData.trip?.base_price ??
    bData.trip?.price ??
    bData.hotel?.price_per_night ??
    bData.details?.total_price ??
    bData.details?.total_amount;
  const parsedTotal = rawTotal != null ? parseFloat(String(rawTotal)) : NaN;
  const totalAmount = !isNaN(parsedTotal) && parsedTotal >= 0 ? parsedTotal : 0;

  const rawStatus = (bData.request_status || bData.status || searchParams.get("status") || "confirmed").toLowerCase();
  const opStatus = bData.operational_status?.toLowerCase();
  const remStatus = bData.remaining_payment_status?.toLowerCase();

  const isCancelled = rawStatus === "cancelled" || rawStatus === "canceled" || opStatus === "cancelled" || opStatus === "canceled";
  const isRejected = rawStatus === "rejected";

  const rawPaid =
    payment.paid_amount ??
    bData.paid_amount ??
    bData.payment_overview?.paid_amount;
  const parsedPaid = rawPaid != null ? parseFloat(String(rawPaid)) : NaN;

  const rawRemaining =
    payment.remaining_amount ??
    bData.remaining_amount ??
    bData.payment_overview?.remaining_amount;
  const parsedRemaining = rawRemaining != null ? parseFloat(String(rawRemaining)) : NaN;

  const isFullyPaid =
    remStatus === "paid" ||
    bData.payment_status === "paid" ||
    payment.payment_status === "paid" ||
    (!isNaN(parsedPaid) && totalAmount > 0 && parsedPaid >= totalAmount) ||
    parsedRemaining === 0 ||
    payment.remaining_amount === "0.00" ||
    bData.remaining_amount === "0.00";

  const depositAmount =
    payment.deposit_amount != null
      ? parseFloat(String(payment.deposit_amount))
      : bData.deposit_amount != null
        ? parseFloat(String(bData.deposit_amount))
        : totalAmount * 0.3;

  const paidAmount = isFullyPaid
    ? totalAmount
    : !isNaN(parsedPaid) && parsedPaid > 0
      ? parsedPaid
      : depositAmount;

  const remainingAmount = isFullyPaid
    ? 0
    : Math.max(0, totalAmount - paidAmount);

  const isPartiallyPaid = !isFullyPaid;

  // Hide the payment-due banner if the trip/check-in date has already passed
  const startDateStr = bData.check_in_date || bData.start_date || bData.pickup_date || "";
  const isStartDatePast = startDateStr ? new Date(startDateStr) < new Date() : false;

  // Refund status flags
  const isRefundInProgress = opStatus === "refund_in_progress" || rawStatus === "refund_in_progress";
  const isRefunded = opStatus === "refunded" || rawStatus === "refunded";

  let primaryStatus = rawStatus;
  if (isRefunded) {
    primaryStatus = "refunded";
  } else if (isRefundInProgress) {
    primaryStatus = "refund_in_progress";
  } else if (isCancelled) {
    primaryStatus = "cancelled";
  } else if (isRejected) {
    primaryStatus = "rejected";
  } else if (opStatus) {
    primaryStatus = opStatus;
  }

  const primaryConfig = getStatusConfig(primaryStatus);
  const secondaryConfig = !isCancelled && !isRejected && !isRefundInProgress && !isRefunded && remStatus && remStatus !== primaryStatus && !(remStatus === "paid" && (primaryStatus === "confirmed" || primaryStatus === "paid"))
    ? getStatusConfig(remStatus)
    : null;

  const [showSuccess, setShowSuccess] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [isPaying, setIsPaying] = useState(false);
  const [payError, setPayError] = useState<string | null>(null);
  const [isCancelling, setIsCancelling] = useState(false);
  const [cancelError, setCancelError] = useState<string | null>(null);
  const isCancelledOrRefunded = isCancelled || isRejected || isRefundInProgress || isRefunded;
  const showCancelAction = !isCancelledOrRefunded;
  const showPayAction = !isFullyPaid && !isCancelledOrRefunded && !isStartDatePast;
  const showFooter = showCancelAction || showPayAction;

  const getLocalizedNationality = (codeOrName: string) => {
    if (!codeOrName) return "";
    const country = COUNTRIES.find(
      (c) =>
        c.code.toLowerCase() === codeOrName.trim().toLowerCase() ||
        c.nationality.toLowerCase() === codeOrName.trim().toLowerCase() ||
        c.name.toLowerCase() === codeOrName.trim().toLowerCase()
    );
    if (!country) return codeOrName;
    try {
      const regionName = new Intl.DisplayNames([localeCode], { type: "region" }).of(country.code.toUpperCase());
      return regionName || country.nationality;
    } catch {
      return country.nationality;
    }
  };

  const formatLocalizedDuration = (raw: string | undefined | null) => {
    if (!raw) return "";
    const match = raw.match(/(\d+)\s*Nights?\s*\/\s*(\d+)\s*Days?/i);
    if (match) {
      const n = parseInt(match[1], 10);
      const d = parseInt(match[2], 10);
      const nLabel = n === 1 ? t("units.night", "Night") : t("units.nights", "Nights");
      const dLabel = d === 1 ? t("units.day", "Day") : t("units.days", "Days");
      return `${n} ${nLabel} / ${d} ${dLabel}`;
    }
    return raw;
  };

  const formatDate = (dateStr: string) =>
    formatDateDDMMYYYY(dateStr, "");


  const formatPhone = (phone: string) => {
    if (!phone) return "";
    return phone;
  };

  const rawOverviews: any[] =
    (Array.isArray(bData.details?.room_overview) && bData.details.room_overview.length > 0 ? bData.details.room_overview : null) ||
    (Array.isArray(bData.rooms?.overview) && bData.rooms.overview.length > 0 ? bData.rooms.overview : null) ||
    (Array.isArray(bData.price_details?.line_items) && bData.price_details.line_items.length > 0 ? bData.price_details.line_items : null) ||
    (Array.isArray(bData.price_details?.room_overview) && bData.price_details.room_overview.length > 0 ? bData.price_details.room_overview : null) ||
    (Array.isArray(bData.room_selections) && bData.room_selections.length > 0 ? bData.room_selections : null) ||
    [];

  const overviewsChildCount = rawOverviews.reduce((acc: number, ov: any) => {
    const cCount = ov.children_count ?? (Array.isArray(ov.children) ? ov.children.length : 0);
    return acc + cCount;
  }, 0);

  const totalChildrenCount = bData.children || bData.details?.children || bData.details?.children_count || overviewsChildCount || 0;
  const totalInfantsCount = bData.infants || bData.details?.infants || bData.details?.infants_count || 0;

  const safeFormData = {
    ...bData,
    name: contact.full_name || "",
    email: contact.email || "",
    phone: formatPhone(contact.phone),
    nationality: contact.nationality || "",
    adults: bData.adults || 0,
    children: totalChildrenCount,
    infants: totalInfantsCount,
    startDate: formatDate(bData.check_in_date || bData.start_date || ""),
    endDate: formatDate(bData.check_out_date || bData.end_date || ""),
    rooms: {
      single: roomsObj.single || 0,
      double: roomsObj.double || 0,
      triple: roomsObj.triple || 0,
    },
  };

  const rawDiscount =
    bData.price_details?.discount != null
      ? parseFloat(String(bData.price_details.discount))
      : bData.discount_amount != null
        ? parseFloat(String(bData.discount_amount))
        : bData.discount != null
          ? parseFloat(String(bData.discount))
          : 0;
  const discountAmount = !isNaN(rawDiscount) && rawDiscount > 0 ? rawDiscount : 0;

  const hotelTotalRooms =
    (safeFormData.rooms.single + safeFormData.rooms.double + safeFormData.rooms.triple) ||
    (rawOverviews.length > 0
      ? rawOverviews.reduce((acc: number, it: any) => acc + (parseInt(String(it.quantity || it.count || 1), 10) || 1), 0)
      : 1);
  const hotelTotalGuests = safeFormData.adults + safeFormData.children + safeFormData.infants;

  const hotelTotalAmount = totalAmount;
  const hotelDepositAmount = depositAmount;

  // Calculate final payment due date (30 days before start date, or fallback to backend provided date)
  let paymentDueDate = "—";
  if (payment.due_date) {
    const dueDateObj = new Date(payment.due_date);
    if (!isNaN(dueDateObj.getTime())) {
      paymentDueDate = new Intl.DateTimeFormat("en-US", { month: "long", day: "numeric", year: "numeric" }).format(dueDateObj);
    } else {
      paymentDueDate = payment.due_date;
    }
  } else if (bData.check_in_date || bData.start_date) {
    const startD = new Date(bData.check_in_date || bData.start_date);
    if (!isNaN(startD.getTime())) {
      startD.setDate(startD.getDate() - 30);
      paymentDueDate = new Intl.DateTimeFormat("en-US", { month: "long", day: "numeric", year: "numeric" }).format(startD);
    }
  }

  const refundSummary = calculateRefundSummary(
    totalAmount,
    paidAmount,
    bData.check_in_date || bData.start_date || bData.pickup_date || new Date().toISOString()
  );

  const currencyCode = (
    payment.currency_code ||
    payment.currency ||
    bData.currency_code ||
    bData.currency ||
    bData.payment_overview?.currency ||
    bData.trip?.currency_code ||
    bData.hotel?.currency_code ||
    "USD"
  ).toUpperCase();

  const isEgp = currencyCode === "EGP";
  const isEur = currencyCode === "EUR";

  const totalPrices: MultiCurrencyPrice = isEgp
    ? { egp: totalAmount }
    : isEur
      ? { eur: totalAmount }
      : { usd: totalAmount, egp: bData.paymob_total_egp ? Number(bData.paymob_total_egp) : undefined };

  const discountPrices: MultiCurrencyPrice = isEgp
    ? { egp: discountAmount }
    : isEur
      ? { eur: discountAmount }
      : {
          usd: discountAmount,
          egp: bData.paymob_total_egp && totalAmount > 0
            ? Math.round(Number(bData.paymob_total_egp) * (discountAmount / totalAmount) * 100) / 100
            : undefined,
        };

  const depositPrices: MultiCurrencyPrice = isEgp
    ? { egp: depositAmount }
    : isEur
      ? { eur: depositAmount }
      : {
          usd: depositAmount,
          egp: bData.paymob_total_egp && totalAmount > 0
            ? Math.round(Number(bData.paymob_total_egp) * (depositAmount / totalAmount) * 100) / 100
            : undefined,
        };

  const remainingPrices: MultiCurrencyPrice = isEgp
    ? { egp: remainingAmount }
    : isEur
      ? { eur: remainingAmount }
      : {
          usd: remainingAmount,
          egp: bData.paymob_total_egp && totalAmount > 0
            ? Math.round(Number(bData.paymob_total_egp) * (remainingAmount / totalAmount) * 100) / 100
            : undefined,
        };

  const paidPrices: MultiCurrencyPrice = isEgp
    ? { egp: paidAmount }
    : isEur
      ? { eur: paidAmount }
      : {
          usd: paidAmount,
          egp: bData.paymob_total_egp && totalAmount > 0
            ? Math.round(Number(bData.paymob_total_egp) * (paidAmount / totalAmount) * 100) / 100
            : undefined,
        };

  const isDepositDue = (payment.payment_due_type === "deposit" || paidAmount <= 0) && depositAmount > 0 && depositAmount < totalAmount;

  const isFullPlan = (
    payment.payment_plan ||
    bData.payment_plan ||
    bData.details?.payment_plan ||
    ""
  ).toLowerCase() === "full";

  const payButtonLabel = (() => {
    if (isPaying) return t("auth.pleaseWait", "Please wait...");
    if (paidAmount > 0 && paidAmount < totalAmount) {
      return `${t("profile.details.payRemaining", "Pay Remaining Balance")} ${formatCurrency(remainingPrices)}`;
    }
    if (isFullPlan) {
      return `${t("profile.details.payFull", "Pay Full Amount")} ${formatCurrency(totalPrices)}`;
    }
    return `${t("profile.details.payDeposit", "Pay Deposit")} ${formatCurrency(depositPrices)}`;
  })();

  const handlePayRemaining = async () => {
    if (!id || isPaying) return;
    setPayError(null);
    setIsPaying(true);
    try {
      const result = await payRemainingBookingBalance(detailsType, id);
      if (result.payment_url) {
        window.location.href = result.payment_url;
      } else {
        setPayError("Could not generate payment link. Please try again.");
      }
    } catch {
      setPayError("Payment failed. Please try again or contact support.");
    } finally {
      setIsPaying(false);
    }
  };

  const handleCancelBooking = async (cancelData: any) => {
    if (!id || isCancelling) return;
    setCancelError(null);
    setIsCancelling(true);
    try {
      const updated = await cancelProfileBooking(detailsType, id, cancelData);
      if (typeof window !== "undefined") {
        try {
          localStorage.setItem(`cancelled_by_user_${detailsType}_${id}`, "true");
        } catch {}
      }
      if (updated) {
        setBookingDetail({
          ...updated,
          operational_status: updated.operational_status || "refund_in_progress",
          cancelled_by: "user",
        });
      } else {
        setBookingDetail((prev: any) => ({
          ...prev,
          status: "cancelled",
          request_status: "cancelled",
          operational_status: "refund_in_progress",
          cancelled_by: "user",
        }));
      }
      setShowCancelModal(false);
      setShowSuccess(true);
    } catch (err: any) {
      const msg = err?.response?.data?.detail || "Failed to cancel booking. Please try again or contact support.";
      setCancelError(msg);
    } finally {
      setIsCancelling(false);
    }
  };

  const getLocalizedRoomTitle = (tName: string) => {
    const raw = (tName || "").toLowerCase().trim();
    if (raw === "any" || raw === "none" || !raw) return t("rooms.standardRoom", "Standard Room");
    if (raw.includes("single") || raw.includes("individual")) return t("rooms.singleRoom", "Single Room");
    if (raw.includes("double") || raw.includes("twin") || raw.includes("doble") || raw.includes("doppia")) return t("rooms.doubleRoom", "Double Room");
    if (raw.includes("triple") || raw.includes("tripla")) return t("rooms.tripleRoom", "Triple Room");
    if (raw.includes("standard") || raw.includes("estándar") || raw.includes("estandar")) return t("rooms.standardRoom", "Standard Room");
    if (raw.includes("deluxe")) return t("rooms.deluxeRoom", "Deluxe Room");
    if (raw.includes("suite")) return t("rooms.suite", "Suite");
    const cap = tName.charAt(0).toUpperCase() + tName.slice(1);
    return cap.toLowerCase().endsWith("room") ? cap : `${cap} Room`;
  };

  const getLocalizedViewLabel = (opt: string) => {
    const v = (opt || "").toLowerCase();
    if (v.includes("sea") || v.includes("mar")) return t("rooms.seaView", "Sea View");
    if (v.includes("pool") || v.includes("piscina")) return t("rooms.poolView", "Pool View");
    if (v.includes("garden") || v.includes("jard") || v.includes("giard")) return t("rooms.gardenView", "Garden View");
    return opt;
  };

  const hotelRoomsList = (() => {
    if (rawOverviews.length > 0) {
      return rawOverviews.map((ov: any, idx: number) => {
        const typeName = ov.room_type || ov.type || ov.roomName || ov.name || "Room";
        const roomTitle = getLocalizedRoomTitle(typeName);
        const rawView = ov.view_label || ov.view || ov.room_view || bData.rooms?.view || "Garden View";
        const view = getLocalizedViewLabel(rawView);
        const qty = ov.quantity || ov.count || 1;

        const adultNum = ov.adult_count ?? ov.adultCount ?? (rawOverviews.length === 1 ? safeFormData.adults : undefined);
        const adultText = adultNum != null && adultNum > 0
          ? `${adultNum} ${adultNum === 1 ? t("sidebar.adult", "Adult") : t("sidebar.adults", "Adults")}`
          : "";

        const childAges: number[] = (
          Array.isArray(ov.children)
            ? ov.children.map((c: any) => (typeof c === "object" && c != null ? c.age : c))
            : (rawOverviews.length === 1 ? bData.children_ages : [])
        )?.filter((a: any) => a != null) || [];

        const childCount = ov.children_count ?? (Array.isArray(ov.children) ? ov.children.length : (rawOverviews.length === 1 ? safeFormData.children : childAges.length));
        const agesText = childAges.length > 0 ? ` (${childAges.map((a: number) => `${a} ${t("units.years", "years")}`).join(", ")})` : "";
        const childText = childCount > 0
          ? `${childCount} ${childCount === 1 ? t("sidebar.child", "Child") : t("sidebar.children", "Children")}${agesText}`
          : "";

        const occupantText = [adultText, childText].filter(Boolean).join(" · ");

        return (
          <span key={`room-ov-${idx}`}>
            <strong>{qty} × {roomTitle} - {view}</strong>{" "}
            {occupantText && <span className={styles.occupantBreakdown}>{occupantText}</span>}
          </span>
        );
      });
    }

    const roomEntries = Object.entries(safeFormData.rooms || {}).filter(([, count]) => (count as number) > 0);
    if (roomEntries.length > 0) {
      return roomEntries.map(([type, count], idx) => {
        const roomTitle = getLocalizedRoomTitle(type);
        const view = getLocalizedViewLabel(bData.rooms?.view || "garden");
        const qty = count as number;

        const adultNum = roomEntries.length === 1 ? safeFormData.adults : undefined;
        const adultText = adultNum != null && adultNum > 0
          ? `${adultNum} ${adultNum === 1 ? t("sidebar.adult", "Adult") : t("sidebar.adults", "Adults")}`
          : "";

        const childAges: number[] = (bData.children_ages || []).filter((a: any) => a != null);
        const childCount = roomEntries.length === 1 ? safeFormData.children : 0;
        const agesText = childAges.length > 0 ? ` (${childAges.map((a: number) => `${a} ${t("units.years", "years")}`).join(", ")})` : "";
        const childText = childCount > 0
          ? `${childCount} ${childCount === 1 ? t("sidebar.child", "Child") : t("sidebar.children", "Children")}${agesText}`
          : "";

        const occupantText = [adultText, childText].filter(Boolean).join(" · ");

        return (
          <span key={`room-fallback-${idx}`}>
            <strong>{qty} × {roomTitle} - {view}</strong>{" "}
            {occupantText && <span className={styles.occupantBreakdown}>{occupantText}</span>}
          </span>
        );
      });
    }

    return [
      <span key="room-default">
        <strong>Standard Room</strong>
      </span>
    ];
  })();

  const bookingLineItems = (() => {
    if (rawOverviews.length > 0) {
      return rawOverviews.map((it: any) => {
        const typeName = it.room_type || it.type || it.roomName || it.name || "Room";
        const roomTitle = getLocalizedRoomTitle(typeName);
        const rawView = it.view_label || it.view || it.room_view || bData.rooms?.view || "Garden View";
        const view = getLocalizedViewLabel(rawView);
        const qty = it.quantity || it.count || 1;

        const adultNum = it.adult_count ?? it.adultCount ?? (rawOverviews.length === 1 ? safeFormData.adults : undefined);
        const adultText = adultNum != null && adultNum > 0
          ? `${adultNum} ${adultNum === 1 ? t("sidebar.adult", "Adult") : t("sidebar.adults", "Adults")}`
          : "";

        const childAges: number[] = (
          Array.isArray(it.children)
            ? it.children.map((c: any) => (typeof c === "object" && c != null ? c.age : c))
            : (rawOverviews.length === 1 ? bData.children_ages : [])
        )?.filter((a: any) => a != null) || [];

        const childCount = it.children_count ?? (Array.isArray(it.children) ? it.children.length : (rawOverviews.length === 1 ? safeFormData.children : childAges.length));
        const agesText = childAges.length > 0 ? ` (${childAges.map((a: number) => `${a} ${t("units.years", "years")}`).join(", ")})` : "";
        const childText = childCount > 0
          ? `${childCount} ${childCount === 1 ? t("sidebar.child", "Child") : t("sidebar.children", "Children")}${agesText}`
          : "";

        const occupantText = [adultText, childText].filter(Boolean).join(" · ");

        const rawPrice = parseFloat(String(it.line_total || it.price || it.amount || it.total_price || "0"));
        const price = rawPrice > 0 ? rawPrice : totalAmount / rawOverviews.length;

        return {
          label: `${qty} × ${roomTitle} - ${view}`,
          subtext: occupantText || undefined,
          price: isEgp ? { egp: price } : isEur ? { eur: price } : { usd: price },
        };
      });
    }

    const roomEntries = Object.entries(safeFormData.rooms || {}).filter(([, count]) => (count as number) > 0);
    if (roomEntries.length > 0) {
      const totalRoomsCount = roomEntries.reduce((acc, [, count]) => acc + (count as number), 0);
      return roomEntries.map(([type, count]) => {
        const roomTitle = getLocalizedRoomTitle(type);
        const view = getLocalizedViewLabel(bData.rooms?.view || "garden");
        const qty = count as number;
        const price = (totalAmount / (totalRoomsCount || 1)) * qty;

        const adultNum = roomEntries.length === 1 ? safeFormData.adults : undefined;
        const adultText = adultNum != null && adultNum > 0
          ? `${adultNum} ${adultNum === 1 ? t("sidebar.adult", "Adult") : t("sidebar.adults", "Adults")}`
          : "";

        const childAges: number[] = (bData.children_ages || []).filter((a: any) => a != null);
        const childCount = roomEntries.length === 1 ? safeFormData.children : 0;
        const agesText = childAges.length > 0 ? ` (${childAges.map((a: number) => `${a} ${t("units.years", "years")}`).join(", ")})` : "";
        const childText = childCount > 0
          ? `${childCount} ${childCount === 1 ? t("sidebar.child", "Child") : t("sidebar.children", "Children")}${agesText}`
          : "";

        const occupantText = [adultText, childText].filter(Boolean).join(" · ");

        return {
          label: `${qty} × ${roomTitle} - ${view}`,
          subtext: occupantText || undefined,
          price: isEgp ? { egp: price } : isEur ? { eur: price } : { usd: price },
        };
      });
    }

    return [
      {
        label: isHotel ? t("sidebar.hotelStay", "Hotel Stay") : t("sidebar.tripPackage", "Trip Package"),
        price: totalPrices,
      },
    ];
  })();

  const rawTourType = (
    bData.details?.travel_type ||
    bData.details?.tour_type ||
    bData.tour_type ||
    bData.travel_type ||
    bData.trip?.tour_type ||
    ""
  ).toLowerCase().trim();

  let travelType = bData.details?.travel_type || bData.travel_type || "";
  if (rawTourType.includes("group")) {
    travelType = t("profile.card.group", "Group");
  } else if (rawTourType.includes("private") || travelType.toLowerCase() === "tour") {
    travelType = t("profile.card.private", "Private");
  } else if (!travelType && rawTourType) {
    travelType = rawTourType.charAt(0).toUpperCase() + rawTourType.slice(1);
  }

  const sections: BookingDetailsSection[] = isTransport
    ? [
      {
        title: t("profile.details.contactInfo", "Contact Info"),
        icon: "/images/summary/contact.svg",
        fields: [
          { label: t("profile.details.name", "Name"), value: contact.full_name || "" },
          { label: t("profile.details.email", "Email"), value: contact.email || "" },
          { label: t("profile.details.phone", "Phone Number"), value: safeFormData.phone || "" },
          { label: t("profile.details.nationality", "Nationality"), value: contact.nationality || "" },
        ],
      },
      {
        title: t("profile.details.tripInfo", "Trip Info"),
        icon: "/images/summary/trip.svg",
        fields: [
          { label: t("profile.details.pickupLocation", "Pickup Location"), value: bData.pickup_location || bData.details?.pickup_location || "" },
          { label: t("profile.details.dropoffLocation", "Drop-off Location"), value: bData.dropoff_location || bData.details?.dropoff_location || "" },
          { label: t("profile.details.tripType", "Trip Type"), value: bData.trip_type || bData.details?.trip_type || "" },
          { label: t("profile.details.pickupTime", "Pickup Time"), value: bData.pickup_time || bData.details?.pickup_time || "" },
          { label: t("profile.details.pickupDate", "Pickup Date"), value: formatDateDDMMYYYY(bData.pickup_date || bData.details?.pickup_date || "") || "" },
          { label: t("profile.details.passengers", "Passengers"), value: bData.details?.passengers_label || `${bData.passengers || 0} Passengers` },
          { label: t("profile.details.luggage", "Luggage"), value: bData.details?.luggage_label || `${bData.luggage || 0} Bags` },
        ],
      },
      {
        title: t("profile.details.specialRequests", "Special Requests"),
        icon: "/images/summary/special.svg",
        listItems: specialRequests,
      },
    ]
    : isHotel
      ? [
        {
          title: t("profile.details.contactInfo", "Contact Info"),
          icon: "/images/summary/contact.svg",
          fields: [
            { label: t("profile.details.name", "Name"), value: contact.full_name || "" },
            { label: t("profile.details.email", "Email"), value: contact.email || "" },
            { label: t("profile.details.phone", "Phone Number"), value: safeFormData.phone || "" },
            { label: t("profile.details.nationality", "Nationality"), value: getLocalizedNationality(contact.nationality || "") },
          ],
        },
        {
          title: t("profile.details.rooms", "Rooms"),
          icon: "/images/summary/rooms.svg",
          listItems: hotelRoomsList.length ? hotelRoomsList : ["Standard Room"],
        },
        {
          title: t("profile.details.specialRequests", "Special Requests"),
          icon: "/images/summary/special.svg",
          listItems: specialRequests,
        },
      ]
      : [
        {
          title: t("profile.details.contactInfo", "Contact Info"),
          icon: "/images/summary/contact.svg",
          fields: [
            { label: t("profile.details.name", "Name"), value: contact.full_name || "" },
            { label: t("profile.details.email", "Email"), value: contact.email || "" },
            { label: t("profile.details.phone", "Phone Number"), value: safeFormData.phone || "" },
            { label: t("profile.details.nationality", "Nationality"), value: getLocalizedNationality(contact.nationality || "") },
          ],
        },
        {
          title: t("profile.details.tripInfo", "Trip Info"),
          icon: "/images/summary/trip.svg",
          fields: [
            { label: t("profile.details.tripName", "Trip Name"), value: bData.details?.trip_name || bData.title || bData.trip?.title || "" },
            { label: t("profile.details.destination", "Destination"), value: bData.details?.destination || bData.trip?.location_text || "" },
            { label: t("profile.details.travelType", "Travel Type"), value: travelType || "-" },
            { label: t("profile.details.duration", "Duration"), value: formatLocalizedDuration(bData.details?.duration_label || `${bData.trip?.duration?.nights || 0} Nights / ${bData.trip?.duration?.days || 0} Days`) },
          ],
        },
        {
          title: t("profile.details.rooms", "Rooms"),
          icon: "/images/summary/rooms.svg",
          listItems: hotelRoomsList.length ? hotelRoomsList : ["Standard Room"],
        },
        {
          title: t("profile.details.specialRequests", "Special Requests"),
          icon: "/images/summary/special.svg",
          listItems: specialRequests,
        },
      ];

  // Full-width refund data (rendered below two-column content)
  const refundBankData = bData.refund_bank_details || bData.bank_details || {};
  const refundSummaryData = bData.refund_summary || {};
  const hasBankData = Boolean(
    refundBankData.account_holder_name ||
    refundBankData.bank_name ||
    refundBankData.account_number ||
    refundBankData.iban
  );
  const hasSummaryData = Boolean(
    refundSummaryData.refund_amount ||
    refundSummaryData.package_total ||
    refundSummaryData.deduction_amount ||
    bData.reason ||
    bData.refund_receipt
  );
  const hasRefundDetails = (isRefundInProgress || isRefunded) && (hasBankData || hasSummaryData);

  const bookingCurrency = (
    bData.currency ||
    bData.currency_code ||
    payment.currency_code ||
    payment.currency ||
    "USD"
  ).toUpperCase();

  const buildDetailsHref = (view?: "payment") => {
    const params = new URLSearchParams(searchParams.toString());
    if (view) {
      params.set("view", view);
    } else {
      params.delete("view");
    }
    return `/profile/bookings-details?${params.toString()}`;
  };

  const normalizedTotal = totalAmount;
  const normalizedDeposit = depositAmount;
  const normalizedHotelTotal = hotelTotalAmount;
  const normalizedHotelDeposit = hotelDepositAmount;

  const discountTitle =
    bData.price_details?.promotion?.title ||
    bData.price_details?.promotion_title ||
    bData.price_details?.discount_title ||
    bData.price_breakdown?.promotion?.title ||
    bData.price_breakdown?.promotion_title ||
    bData.promotion?.title ||
    bData.promotion_title ||
    bData.discount_title;

  const resolvedVehicleSlug =
    bData.vehicle_slug ||
    bData.vehicle?.slug ||
    bData.details?.vehicle_slug ||
    bData.details?.slug ||
    (typeof bData.vehicle === "string" ? bData.vehicle : undefined);

  const resolvedVehicleId =
    bData.vehicle?.id ||
    bData.vehicle_id ||
    bData.details?.vehicle_id ||
    bData.details?.id;

  const vehicleIdentifier = resolvedVehicleSlug || (resolvedVehicleId ? String(resolvedVehicleId) : "");
  const vehicleHref = vehicleIdentifier ? `/transportation/${vehicleIdentifier}` : undefined;

  const resolvedHotelSlug =
    bData.hotel_slug ||
    bData.hotel?.slug ||
    bData.details?.hotel_slug ||
    bData.details?.slug ||
    (typeof bData.hotel === "string" ? bData.hotel : undefined);

  const resolvedHotelId =
    bData.hotel?.id ||
    bData.hotel_id ||
    bData.details?.hotel_id ||
    bData.details?.id;

  const hotelIdentifier = resolvedHotelSlug || (resolvedHotelId ? String(resolvedHotelId) : "");
  const hotelHref = hotelIdentifier ? `/hotels/${hotelIdentifier}` : undefined;

  const resolvedTripSlug =
    bData.price_details?.trip_slug ||
    fallbackTripSlug ||
    bData.trip?.slug ||
    bData.trip_slug ||
    bData.details?.trip_slug ||
    bData.details?.slug ||
    (typeof bData.trip === "string" ? bData.trip : undefined);

  const resolvedTripId =
    bData.price_details?.trip_id ||
    bData.trip?.id ||
    bData.trip_id ||
    bData.details?.trip_id ||
    bData.details?.id;

  const tripIdentifier = resolvedTripSlug || (resolvedTripId ? String(resolvedTripId) : "");
  const tripHref = tripIdentifier ? `/egypttours/${tripIdentifier}` : undefined;

  const paymentSidebar = isTransport ? (
    <TransportBookingSummary
      vehicle={{
        id: vehicleIdentifier || "vehicle",
        name: bData.details?.vehicle_name || bData.title || bData.vehicle?.name || "Vehicle",
        type: bData.details?.trip_type || bData.vehicle?.type || "",
        image: bData.image || bData.vehicle?.image || "/images/sedan.png",
        price: bData.total_amount || bData.total_price || "0",
        passengers: bData.vehicle?.passengers || 4,
        luggage: bData.vehicle?.luggage || 2,
        description: bData.vehicle?.description || "",
        rating: Number(bData.vehicle?.rating_avg ?? bData.vehicle?.rating ?? 5.0),
        reviews: 0
      }}
      itemHref={vehicleHref}
      formData={safeFormData as any}
      isRemainingView
    />
  ) : isHotel ? (
    <BookingSidebar
      hotel={{
        id: hotelIdentifier || "hotel",
        name: bData.details?.hotel_name || bData.title || bData.hotel?.name || "Hotel",
        location: bData.details?.location || bData.hotel?.location_text || "",
        image: getFullImageUrl(
          (bData.image && !bData.image.includes("legacy-hero") ? bData.image : undefined) ||
          (bData.hotel?.hero_image && !bData.hotel.hero_image.includes("legacy-hero") ? bData.hotel.hero_image : undefined) ||
          "/images/hotels/hotel6.png"
        ),
        stars: bData.hotel?.stars || 5,
        rating: Number(bData.hotel?.rating_avg ?? bData.hotel?.rating ?? 5.0),
        rooms: bData.hotel?.rooms || 0,
        pricePerNight: normalizedTotal / Math.max(1, hotelTotalRooms),
        reviews: bData.hotel?.review_count || 0
      }}
      itemHref={hotelHref}
      formData={safeFormData as any}
      totalAmount={normalizedHotelTotal}
      depositAmount={normalizedHotelDeposit}
      discountAmount={discountAmount}
      discountPrices={discountPrices}
      discountTitle={discountTitle}
      totalRooms={hotelTotalRooms}
      totalGuests={hotelTotalGuests}
      totalPrices={totalPrices}
      depositPrices={depositPrices}
      remainingPrices={remainingPrices}
      paidAmount={paidAmount}
      paidPrices={paidPrices}
      lineItems={bookingLineItems}
      isRemainingView={!isFullyPaid}
      isFullyPaid={isFullyPaid}
    />
  ) : (
    <BookingSidebar
      trip={{
        id: tripIdentifier || "trip",
        title: bData.details?.trip_name || bData.title || bData.trip?.title || "Trip",
        description: bData.details?.travel_type || bData.trip?.short_description || "",
        image: bData.image || bData.trip?.image || "/images/home/hero-bg.png",
        location: bData.details?.destination || bData.trip?.location_text || "",
        price: normalizedTotal,
        currency: currencyCode,
        rating: Number(bData.trip?.rating_avg ?? bData.trip?.rating ?? 4.9),
        duration: { days: 0, nights: 0, label: bData.details?.duration_label } as any
      }}
      itemHref={tripHref}
      formData={safeFormData as any}
      totalAmount={normalizedTotal}
      depositAmount={normalizedDeposit}
      discountAmount={discountAmount}
      discountPrices={discountPrices}
      discountTitle={discountTitle}
      totalPrices={totalPrices}
      depositPrices={depositPrices}
      remainingPrices={remainingPrices}
      paidAmount={paidAmount}
      paidPrices={paidPrices}
      lineItems={bookingLineItems}
      isRemainingView={!isFullyPaid}
      isFullyPaid={isFullyPaid}
    />
  );

  return (
    <div className={styles.page}>
      <PageHeader
        breadcrumbs={[
          { label: t("userMenu.profile", "Profile"), href: "/profile" },
          { label: t("profile.details.breadcrumbDetails", "Booking Details"), isCurrent: true },
        ]}
        title={t("profile.headerTitle", "Your Travel Space")}
        subtitle={t("profile.headerSubtitle", "Easily access all your travel bookings and submitted requests in one organized place, with clear details about your trips, hotel stays, transportation, and upcoming plans.")}
      />

      {loading ? (
        <div className={styles.container}>
          <div className={styles.loading}>Loading booking details...</div>
        </div>
      ) : !bookingDetail ? (
        <div className={styles.container}>
          <div className={styles.loading}>Booking not found.</div>
        </div>
      ) : (
        <div className={styles.container}>
          {isPaymentView ? (
            <PaymentForm
              formData={safeFormData as any}
              onChange={() => undefined}
              confirmLabel={`Confirm & Pay $${(isHotel ? hotelDepositAmount : depositAmount).toLocaleString()} ${(isHotel ? hotelDepositAmount : depositAmount) === totalAmount ? "(Full amount)" : "Deposit"}`}
              onPrevious={() => router.push(buildDetailsHref())}
              onConfirm={() => setShowSuccess(true)}
              sidebar={paymentSidebar}
            />
          ) : (
            <section className={styles.card}>
              {!isFullyPaid && !isCancelled && !isRejected && !isStartDatePast && (
                <div className={styles.warningBanner}>
                  <span className={styles.warningDot}>
                    <Image src="/images/info.svg" alt="" width={12} height={12} className={styles.warningDotIcon} />
                  </span>
                  {paidAmount > 0
                    ? t("profile.details.paymentDueWarning", "Final payment due by {date} to keep your booking").replace("{date}", paymentDueDate)
                    : (payment.payment_due_label || t("profile.details.depositDueWarning", "Deposit payment due by {date} to keep your booking").replace("{date}", paymentDueDate))}
                </div>
              )}

              <header className={styles.header}>
                <div>
                  <h2>{t("profile.details.title", "Booking Details")}</h2>
                  <p>{t("profile.details.subtitle", "View full details and manage your reservation.")}</p>
                </div>
                <div className={styles.headerBadges}>
                  <StatusPill
                    label={primaryConfig.label}
                    variant={primaryConfig.variant}
                    iconType={primaryConfig.iconType}
                    size="lg"
                  />
                  {secondaryConfig && (
                    <StatusPill
                      label={secondaryConfig.label}
                      variant={secondaryConfig.variant}
                      iconType={secondaryConfig.iconType}
                      size="lg"
                    />
                  )}
                </div>
              </header>

              <div className={styles.content}>
                <BookingDetailsSections sections={sections} className={styles.left} />

                <aside className={styles.sidebarWrap}>{paymentSidebar}</aside>
              </div>

              {hasRefundDetails && (
                <div className={styles.refundContainer}>
                  {hasBankData && (
                    <RefundBankDetailsCard data={refundBankData} />
                  )}
                  {hasSummaryData && (
                    <RefundSummaryCard
                      data={{
                        ...refundSummaryData,
                        paid_to_date: refundSummaryData.paid_to_date ?? (paidAmount > 0 ? paidAmount : undefined),
                      }}
                      receipt={bData.refund_receipt}
                      reason={bData.reason}
                      currency={bookingCurrency}
                    />
                  )}
                </div>
              )}

              {showFooter && (
                <footer className={`${styles.footer} ${showPayAction ? styles.footerSplit : ""}`}>
                  {showCancelAction && (
                    <button
                      type="button"
                      className={styles.cancelLink}
                      onClick={() => setShowCancelModal(true)}
                    >
                      {t("profile.details.cancelBooking", "Cancel booking")}
                    </button>
                  )}
                  {showPayAction && (
                    <>
                      {payError && <p className={styles.payError}>{payError}</p>}
                      <button
                        type="button"
                        className={styles.payButton}
                        onClick={handlePayRemaining}
                        disabled={isPaying}
                      >
                        <span>{payButtonLabel}</span>
                        {!isPaying && <Image src="/images/money-send.svg" alt="" width={24} height={24} aria-hidden />}
                      </button>
                    </>
                  )}
                </footer>
              )}
            </section>
          )}
        </div>
      )}

      {showSuccess && (
        <SuccessModal
          title="Booking Confirmed!"
          message={
            isTransport
              ? "Your vehicle has been successfully booked. Confirmation details have been sent to your email."
              : isHotel
                ? "Your hotel reservation has been successfully booked. Confirmation details have been sent to your email."
                : "Your trip has been successfully booked. Confirmation details have been sent to your email."
          }
          primaryButtonText="View Booking"
          buttonText="Back to Home"
          onPrimaryClick={() => {
            setShowSuccess(false);
            if (id) {
              getProfileBookingDetail(detailsType, id)
                .then(setBookingDetail)
                .catch(() => undefined);
            }
          }}
          onClose={() => router.push("/")}
          metadata={[
            { label: "Booking Reference", value: `BK-${String(bData.id || "0000").padStart(6, "0")}` },
            {
              label: isTransport ? "Vehicle" : isHotel ? "Hotel" : "Trip Name",
              value: isTransport
                ? bData.details?.vehicle_name || bData.title || bData.vehicle?.name || "Vehicle"
                : isHotel
                  ? bData.details?.hotel_name || bData.title || bData.hotel?.name || "Hotel"
                  : bData.details?.trip_name || bData.title || bData.trip?.title || "Trip",
            },
            {
              label: isTransport ? "Pickup Date" : isHotel ? "Check-in" : "Start Date",
              value: isTransport
                ? bData.pickup_date ? formatDateDDMMYYYY(bData.pickup_date) || bData.pickup_date : bData.details?.pickup_date ? formatDateDDMMYYYY(bData.details.pickup_date) || bData.details.pickup_date : "—"
                : isHotel
                  ? (bData.check_in_date || bData.start_date) ? formatDateDDMMYYYY(bData.check_in_date || bData.start_date) || "—" : "—"
                  : bData.start_date ? formatDateDDMMYYYY(bData.start_date) || "—" : "—",
            },
            {
              label: "Total Paid",
              value: isTransport
                ? `$${depositAmount.toFixed(2)}`
                : isHotel
                  ? `$${hotelDepositAmount.toFixed(2)}`
                  : `$${depositAmount.toLocaleString()}`,
              valueColor: "#FF6600",
            },
          ]}
        />
      )}

      <CancelBookingModal
        open={showCancelModal}
        onClose={() => {
          if (!isCancelling) {
            setCancelError(null);
            setShowCancelModal(false);
          }
        }}
        refundSummary={refundSummary}
        currency={currencyCode}
        loading={isCancelling}
        error={cancelError}
        onSubmit={handleCancelBooking}
      />

      {showSuccess && (
        <SuccessModal
          title={t("cancelModal.successTitle", "Cancellation Request Submitted")}
          message={t("cancelModal.successMessage", "Your cancellation request has been received successfully.")}
          buttonText={t("cancelModal.backToHome", "Back to Home")}
          onClose={() => {
            setShowSuccess(false);
            router.push("/profile?tab=bookings");
          }}
          metadata={[
            { label: t("cancelModal.bookingReference", "Booking Reference"), value: `#BK${bData.id || "53602205"}` },
            {
              label: t("cancelModal.estimatedRefund", "Refund Amount"),
              value: formatCurrency(
                isEgp
                  ? { egp: refundSummary.refund_amount }
                  : isEur
                    ? { eur: refundSummary.refund_amount }
                    : { usd: refundSummary.refund_amount }
              ),
              valueColor: "#FF6600",
            },
            { label: t("cancelModal.refundMethod", "Refund Method"), value: t("cancelModal.bankTransfer", "Bank Transfer") },
            { label: t("cancelModal.processingTime", "Estimated Processing Time"), value: t("cancelModal.businessDays", "7 - 10 Business Days") }
          ]}
        />
      )}
    </div>
  );
}

function LoadingGlyph() {
  return (
    <span className={styles.loadingGlyph} aria-hidden>
      <svg className={styles.spinnerSvg} width="14" height="14" viewBox="0 0 24 24" fill="none">
        <circle
          cx="12"
          cy="12"
          r="10"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          opacity="0.25"
        />
        <path
          fill="none"
          d="M12 2a10 10 0 0 1 10 10"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    </span>
  );
}

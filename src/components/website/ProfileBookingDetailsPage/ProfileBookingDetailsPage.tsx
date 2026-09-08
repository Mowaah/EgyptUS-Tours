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
  SuccessModal,
  type BookingDetailsSection,
  type TripBookingStatus,
} from "@/components/shared";
import TransportBookingSummary from "@/components/website/BookTransportationPage/BookingSummary/BookingSummary";
import { getProfileBookingDetail, payRemainingBookingBalance } from "@/lib/api";
import { COUNTRIES } from "@/data/countries";
import { MultiCurrencyPrice } from "@/constants/currency";
import { calculateRefundSummary } from "@/utils/cancellationPolicy";
import { useCurrency } from "@/contexts/CurrencyContext";
import { useTranslation } from "@/hooks/useTranslation";
import styles from "./ProfileBookingDetailsPage.module.scss";

const getCountryName = (code: string) => {
  if (!code) return "";
  const country = COUNTRIES.find((c) => c.code.toLowerCase() === code.trim().toLowerCase());
  return country ? country.nationality : code;
};

import { getStatusConfig } from "@/utils/statusUtils";
import { StatusPill } from "@/components/shared";


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
  const [loading, setLoading] = useState(true);
  const { formatCurrency } = useCurrency();

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
  const rawStatus = (bData.request_status || bData.status || searchParams.get("status") || "confirmed").toLowerCase();
  const opStatus = bData.operational_status?.toLowerCase();
  const remStatus = bData.remaining_payment_status?.toLowerCase();

  const isCancelled = rawStatus === "cancelled" || rawStatus === "canceled" || opStatus === "cancelled" || opStatus === "canceled";
  const isRejected = rawStatus === "rejected";
  const isPartiallyPaid = rawStatus === "partially_paid" || remStatus === "pending" || bData.status === "partially_paid";

  let primaryStatus = rawStatus;
  if (isCancelled) {
    primaryStatus = "cancelled";
  } else if (isRejected) {
    primaryStatus = "rejected";
  } else if (opStatus) {
    primaryStatus = opStatus;
  }

  const primaryConfig = getStatusConfig(primaryStatus);
  const secondaryConfig = !isCancelled && !isRejected && remStatus && remStatus !== primaryStatus
    ? getStatusConfig(remStatus)
    : null;

  const [showSuccess, setShowSuccess] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [isPaying, setIsPaying] = useState(false);
  const [payError, setPayError] = useState<string | null>(null);
  const showCancelAction = !isCancelled && !isRejected;
  const showPayAction = isPartiallyPaid && !isCancelled && !isRejected;
  const showFooter = showCancelAction || showPayAction;
  const contact = bData.contact || {};
  const payment = bData.payment_summary || {};
  const roomsObj = bData.rooms || { single: 0, double: 0, triple: 0 };
  const specialRequests = [
    bData.special_requests && bData.special_requests.toLowerCase() !== "none"
      ? bData.special_requests
      : t("profile.details.none", "None")
  ];

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

  const formatDate = (dateStr: string) => {
    if (!dateStr || dateStr === "—") return "";
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return dateStr;
      return new Intl.DateTimeFormat(localeCode, { weekday: 'short', month: 'short', day: 'numeric' }).format(d);
    } catch (e) {
      return dateStr;
    }
  };

  const formatPhone = (phone: string) => {
    if (!phone) return "";
    return phone;
  };

  const safeFormData = {
    ...bData,
    name: contact.full_name || "",
    email: contact.email || "",
    phone: formatPhone(contact.phone),
    nationality: contact.nationality || "",
    adults: bData.adults || 0,
    children: bData.children || 0,
    infants: bData.infants || 0,
    startDate: formatDate(bData.check_in_date || bData.start_date || ""),
    endDate: formatDate(bData.check_out_date || bData.end_date || ""),
    rooms: {
      single: roomsObj.single || 0,
      double: roomsObj.double || 0,
      triple: roomsObj.triple || 0,
    },
  };

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

  const rawPaid =
    payment.paid_amount ??
    bData.paid_amount ??
    payment.deposit_amount ??
    bData.deposit_amount ??
    bData.payment_overview?.paid_amount ??
    bData.payment_overview?.deposit_amount;
  const parsedPaid = rawPaid != null ? parseFloat(String(rawPaid)) : NaN;
  const paidAmount = !isNaN(parsedPaid) && parsedPaid >= 0 ? parsedPaid : 0;

  const rawRemaining =
    payment.remaining_amount ??
    bData.remaining_amount ??
    bData.payment_overview?.remaining_amount;
  const parsedRemaining = rawRemaining != null ? parseFloat(String(rawRemaining)) : NaN;
  const remainingAmount = !isNaN(parsedRemaining) && parsedRemaining >= 0
    ? parsedRemaining
    : Math.max(0, totalAmount - paidAmount);

  const paymentUrl = payment.payment_url || null;

  // Calculate final payment due date (30 days before start date, or fallback to backend provided date)
  let paymentDueDate = "—";
  if (payment.due_date) {
    paymentDueDate = formatDate(payment.due_date);
  } else if (bData.check_in_date || bData.start_date) {
    const startD = new Date(bData.check_in_date || bData.start_date);
    if (!isNaN(startD.getTime())) {
      startD.setDate(startD.getDate() - 30);
      paymentDueDate = new Intl.DateTimeFormat(localeCode, { month: "long", day: "numeric", year: "numeric" }).format(startD);
    }
  }

  const depositAmount = paidAmount > 0 ? paidAmount : totalAmount * 0.3;
  const hotelTotalRooms = safeFormData.rooms.single + safeFormData.rooms.double + safeFormData.rooms.triple;
  const hotelTotalGuests = safeFormData.adults + safeFormData.children + safeFormData.infants;

  const hotelTotalAmount = totalAmount;
  const hotelVatAmount = 0;
  const hotelDepositAmount = depositAmount;

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

  const totalPrices: MultiCurrencyPrice = {
    usd: isEgp ? totalAmount * 0.02 : isEur ? totalAmount * 1.08 : totalAmount,
    egp: isEgp ? totalAmount : totalAmount * 50,
    eur: isEur ? totalAmount : isEgp ? totalAmount * 0.019 : totalAmount * 0.92,
  };

  const depositPrices: MultiCurrencyPrice = {
    usd: isEgp ? depositAmount * 0.02 : isEur ? depositAmount * 1.08 : depositAmount,
    egp: isEgp ? depositAmount : depositAmount * 50,
    eur: isEur ? depositAmount : isEgp ? depositAmount * 0.019 : depositAmount * 0.92,
  };

  const handlePayRemaining = async () => {
    if (!id || isPaying) return;
    setPayError(null);
    // If backend already has an active payment_url, redirect to it directly
    if (paymentUrl) {
      window.location.href = paymentUrl;
      return;
    }
    // Otherwise request a new Paymob checkout link from the backend
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

  const getLocalizedRoomTitle = (tName: string) => {
    const raw = (tName || "").toLowerCase();
    if (raw.includes("single") || raw.includes("individual")) return t("rooms.singleRoom", "Single Room");
    if (raw.includes("double") || raw.includes("twin") || raw.includes("doble") || raw.includes("doppia")) return t("rooms.doubleRoom", "Double Room");
    if (raw.includes("triple") || raw.includes("tripla")) return t("rooms.tripleRoom", "Triple Room");
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
    if (bData.room_selections && Array.isArray(bData.room_selections) && bData.room_selections.length > 0) {
      return bData.room_selections.map((sel: any) => {
        const typeName = sel.room_type || sel.type || "Room";
        const roomTitle = getLocalizedRoomTitle(typeName);
        const view = getLocalizedViewLabel(sel.view_label || sel.view || "Garden View");
        const qty = sel.quantity || sel.count || 1;
        return `${qty} × ${roomTitle} - ${view}`;
      });
    }
    return [
      safeFormData.rooms.single > 0 ? `${safeFormData.rooms.single} × ${getLocalizedRoomTitle("single")} - ${getLocalizedViewLabel("garden")}` : null,
      safeFormData.rooms.double > 0 ? `${safeFormData.rooms.double} × ${getLocalizedRoomTitle("double")} - ${getLocalizedViewLabel("garden")}` : null,
      safeFormData.rooms.triple > 0 ? `${safeFormData.rooms.triple} × ${getLocalizedRoomTitle("triple")} - ${getLocalizedViewLabel("garden")}` : null,
    ].filter((room): room is string => Boolean(room));
  })();

  const bookingLineItems = (() => {
    if (bData.price_details?.items && Array.isArray(bData.price_details.items) && bData.price_details.items.length > 0) {
      return bData.price_details.items.map((it: any) => {
        const rawPrice = parseFloat(String(it.price || it.amount || it.line_total || "0"));
        const price = rawPrice > 0 ? rawPrice : totalAmount / (bData.price_details.items.length || 1);
        return {
          label: `${it.quantity ? `${it.quantity} × ` : ""}${it.name || it.room_type || "Room"}${it.view_label ? ` - ${it.view_label}` : ""}`,
          subtext: it.occupants || (safeFormData.adults ? `${safeFormData.adults} ${safeFormData.adults === 1 ? t("sidebar.adult", "Adult") : t("sidebar.adults", "Adults")}` : undefined),
          price: isEgp ? { egp: price, usd: price * 0.02 } : isEur ? { eur: price, usd: price * 1.08 } : { usd: price, egp: price * 50 },
        };
      });
    }

    if (bData.room_selections && Array.isArray(bData.room_selections) && bData.room_selections.length > 0) {
      const totalRoomsCount = bData.room_selections.reduce((acc: number, sel: any) => acc + (sel.quantity || sel.count || 1), 0);
      return bData.room_selections.map((sel: any) => {
        const typeName = sel.room_type || sel.type || "Room";
        const roomTitle = getLocalizedRoomTitle(typeName);
        const view = getLocalizedViewLabel(sel.view_label || sel.view || "Garden View");
        const qty = sel.quantity || sel.count || 1;
        const selPrice = parseFloat(String(sel.price || sel.total_price || sel.amount || sel.line_total || "0"));
        const price = selPrice > 0 ? selPrice : (totalAmount / (totalRoomsCount || 1)) * qty;
        return {
          label: `${qty} × ${roomTitle} - ${view}`,
          subtext: safeFormData.adults ? `${safeFormData.adults} ${safeFormData.adults === 1 ? t("sidebar.adult", "Adult") : t("sidebar.adults", "Adults")}` : undefined,
          price: isEgp ? { egp: price, usd: price * 0.02 } : isEur ? { eur: price, usd: price * 1.08 } : { usd: price, egp: price * 50 },
        };
      });
    }

    const roomEntries = Object.entries(safeFormData.rooms || {}).filter(([, count]) => (count as number) > 0);
    if (roomEntries.length > 0) {
      const totalRoomsCount = roomEntries.reduce((acc, [, count]) => acc + (count as number), 0);
      return roomEntries.map(([type, count]) => {
        const roomTitle = getLocalizedRoomTitle(type);
        const qty = count as number;
        const price = (totalAmount / (totalRoomsCount || 1)) * qty;
        return {
          label: `${qty} × ${roomTitle} - ${getLocalizedViewLabel("garden")}`,
          subtext: safeFormData.adults ? `${safeFormData.adults} ${safeFormData.adults === 1 ? t("sidebar.adult", "Adult") : t("sidebar.adults", "Adults")}` : undefined,
          price: isEgp ? { egp: price, usd: price * 0.02 } : isEur ? { eur: price, usd: price * 1.08 } : { usd: price, egp: price * 50 },
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
          { label: t("profile.details.pickupDate", "Pickup Date"), value: bData.pickup_date || bData.details?.pickup_date || "" },
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

  const buildDetailsHref = (view?: "payment") => {
    const params = new URLSearchParams(searchParams.toString());
    if (view) {
      params.set("view", view);
    } else {
      params.delete("view");
    }
    return `/profile/bookings-details?${params.toString()}`;
  };

  const paymentSidebar = isTransport ? (
    <TransportBookingSummary
      vehicle={{
        id: bData.id || bData.vehicle?.id || "vehicle",
        name: bData.details?.vehicle_name || bData.title || bData.vehicle?.name || "Vehicle",
        type: bData.details?.trip_type || bData.vehicle?.type || "",
        image: bData.image || bData.vehicle?.image || "/images/sedan.png",
        price: bData.total_amount || bData.total_price || "0",
        passengers: bData.vehicle?.passengers || 4,
        luggage: bData.vehicle?.luggage || 2,
        description: bData.vehicle?.description || "",
        rating: 5.0,
        reviews: 0
      }}
      formData={safeFormData as any}
    />
  ) : isHotel ? (
    <BookingSidebar
      hotel={{
        id: bData.id || bData.hotel?.id || "hotel",
        name: bData.details?.hotel_name || bData.title || bData.hotel?.name || "Hotel",
        location: bData.details?.location || bData.hotel?.location_text || "",
        image: bData.image || bData.hotel?.hero_image || "/images/hotels/hotel6.png",
        stars: bData.hotel?.stars || 5,
        rating: bData.hotel?.rating_avg || 5.0,
        rooms: bData.hotel?.rooms || 0,
        pricePerNight: totalAmount / Math.max(1, hotelTotalRooms),
        reviews: bData.hotel?.review_count || 0
      }}
      formData={safeFormData as any}
      totalAmount={hotelTotalAmount + hotelVatAmount}
      vatAmount={hotelVatAmount}
      depositAmount={hotelDepositAmount}
      totalRooms={hotelTotalRooms}
      totalGuests={hotelTotalGuests}
      totalPrices={totalPrices}
      depositPrices={depositPrices}
      lineItems={bookingLineItems}
    />
  ) : (
    <BookingSidebar
      trip={{
        id: bData.id || bData.trip?.id || "trip",
        title: bData.details?.trip_name || bData.title || bData.trip?.title || "Trip",
        description: bData.details?.travel_type || bData.trip?.short_description || "",
        image: bData.image || bData.trip?.image || "/images/home/hero-bg.png",
        location: bData.details?.destination || bData.trip?.location_text || "",
        price: totalAmount,
        currency: currencyCode,
        duration: { days: 0, nights: 0, label: bData.details?.duration_label } as any
      }}
      formData={safeFormData as any}
      totalAmount={totalAmount}
      depositAmount={depositAmount}
      totalPrices={totalPrices}
      depositPrices={depositPrices}
      lineItems={bookingLineItems}
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
              {isPartiallyPaid && (
                <div className={styles.warningBanner}>
                  <span className={styles.warningDot}>
                    <Image src="/images/info.svg" alt="" width={12} height={12} className={styles.warningDotIcon} />
                  </span>
                  {t("profile.details.paymentDueWarning", "Final payment due by {date} to keep your booking").replace("{date}", paymentDueDate)}
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
                        <span>
                          {isPaying
                            ? t("auth.pleaseWait", "Please wait...")
                            : `${t("profile.details.payRemaining", "Pay remaining")} ${formatCurrency(remainingAmount)}`}
                        </span>
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
          onPrimaryClick={() => router.push("/profile?tab=bookings")}
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
                ? bData.pickup_date || bData.details?.pickup_date || "—"
                : isHotel
                  ? bData.check_in_date || bData.start_date || "—"
                  : bData.start_date || "—",
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
        onClose={() => setShowCancelModal(false)}
        refundSummary={refundSummary}
        onSubmit={(data) => {
          console.log("Cancelling booking with data:", data);
          setShowCancelModal(false);
          setShowSuccess(true);
        }}
      />

      {showSuccess && (
        <SuccessModal
          title="Cancellation Request Submitted"
          message="Your cancellation request has been received successfully."
          buttonText="Back to Home"
          onClose={() => {
            setShowSuccess(false);
            router.push("/profile?tab=bookings");
          }}
          metadata={[
            { label: "Booking Reference", value: "#BK53602205" },
            { label: "Refund Amount", value: "£1,500", valueColor: "#FF6600" },
            { label: "Refund Method", value: "Bank Transfer" },
            { label: "Estimated Processing Time", value: "7 - 10 Business Days" }
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

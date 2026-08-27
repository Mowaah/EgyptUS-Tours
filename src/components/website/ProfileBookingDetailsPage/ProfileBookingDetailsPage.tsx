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
import styles from "./ProfileBookingDetailsPage.module.scss";

const getCountryName = (code: string) => {
  if (!code) return "";
  const country = COUNTRIES.find((c) => c.code.toLowerCase() === code.trim().toLowerCase());
  return country ? country.nationality : code;
};

type TripDetailsStatus = Extract<TripBookingStatus, "confirmed" | "partially_paid" | "cancelled">;



const FALLBACK_STATUS: TripDetailsStatus = "confirmed";

function getStatusFromParam(value: string | null): TripDetailsStatus {
  if (value === "confirmed" || value === "partially_paid" || value === "cancelled") {
    return value;
  }
  return FALLBACK_STATUS;
}

function getStatusUi(status: TripDetailsStatus) {
  if (status === "partially_paid") {
    return {
      label: "Partially Paid",
      badgeClass: styles.statusPartiallyPaid,
      icon: <LoadingGlyph />,
    };
  }

  if (status === "cancelled") {
    return {
      label: "Cancelled",
      badgeClass: styles.statusCancelled,
      icon: "✕",
    };
  }

  return {
    label: "Confirmed",
    badgeClass: styles.statusConfirmed,
    icon: "✓",
  };
}

export default function ProfileBookingDetailsPage() {
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

  const rawStatus = bookingDetail?.status || searchParams.get("status");
  const status = getStatusFromParam(rawStatus);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [isPaying, setIsPaying] = useState(false);
  const [payError, setPayError] = useState<string | null>(null);
  const statusUi = getStatusUi(status);
  const isPartiallyPaid = status === "partially_paid";
  const showCancelAction = status !== "cancelled";
  const showPayAction = isPartiallyPaid;
  const showFooter = showCancelAction || showPayAction;

  const bData = bookingDetail || {};
  const contact = bData.contact || {};
  const payment = bData.payment_summary || {};
  const roomsObj = bData.rooms || { single: 0, double: 0, triple: 0 };
  const specialRequests = [bData.special_requests || "None"];

  const formatDate = (dateStr: string) => {
    if (!dateStr || dateStr === "—") return "";
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return dateStr;
      return new Intl.DateTimeFormat('en-US', { weekday: 'short', month: 'short', day: 'numeric' }).format(d);
    } catch (e) {
      return dateStr;
    }
  };

  const formatPhone = (phone: string) => {
    if (!phone) return "";
    return phone.startsWith("+") ? phone : `+${phone}`;
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

  // Real amounts from payment_summary (backend now returns actual values)
  const totalAmount = parseFloat(payment.total_amount || bData.total_price || bData.price || "0");
  const paidAmount = parseFloat(payment.paid_amount || "0");
  const remainingAmount = parseFloat(payment.remaining_amount || "0") || (totalAmount - paidAmount);
  const paymentUrl = payment.payment_url || null;
  const currencySymbol = (payment.currency_code || bData.trip?.currency_code || "£").replace("EGP", "£");

  const depositAmount = paidAmount || totalAmount * 0.3;
  const hotelTotalRooms = safeFormData.rooms.single + safeFormData.rooms.double + safeFormData.rooms.triple;
  const hotelTotalGuests = safeFormData.adults + safeFormData.children + safeFormData.infants;

  const hotelTotalAmount = totalAmount;
  const hotelVatAmount = 0;
  const hotelDepositAmount = depositAmount;

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

  const hotelRoomsList = [
    safeFormData.rooms.single > 0 ? `${safeFormData.rooms.single} × Single Room` : null,
    safeFormData.rooms.double > 0 ? `${safeFormData.rooms.double} × Double Room` : null,
    safeFormData.rooms.triple > 0 ? `${safeFormData.rooms.triple} × Triple Room` : null,
  ].filter((room): room is string => Boolean(room));

  const sections: BookingDetailsSection[] = isTransport
    ? [
      {
        title: "Contact Info",
        icon: "/images/summary/contact.svg",
        fields: [
          { label: "Name", value: contact.full_name || "" },
          { label: "Email", value: contact.email || "" },
          { label: "Phone Number", value: safeFormData.phone || "" },
          { label: "Nationality", value: contact.nationality || "" },
        ],
      },
      {
        title: "Trip Info",
        icon: "/images/summary/trip.svg",
        fields: [
          { label: "Pickup Location", value: bData.pickup_location || bData.details?.pickup_location || "" },
          { label: "Drop-off Location", value: bData.dropoff_location || bData.details?.dropoff_location || "" },
          { label: "Trip Type", value: bData.trip_type || bData.details?.trip_type || "" },
          { label: "Pickup Time", value: bData.pickup_time || bData.details?.pickup_time || "" },
          { label: "Pickup Date", value: bData.pickup_date || bData.details?.pickup_date || "" },
          { label: "Passengers", value: bData.details?.passengers_label || `${bData.passengers || 0} Passengers` },
          { label: "Luggage", value: bData.details?.luggage_label || `${bData.luggage || 0} Bags` },
        ],
      },
      {
        title: "Special Requests",
        icon: "/images/summary/special.svg",
        listItems: specialRequests,
      },
    ]
    : isHotel
      ? [
        {
          title: "Contact Info",
          icon: "/images/summary/contact.svg",
          fields: [
            { label: "Name", value: contact.full_name || "" },
            { label: "Email", value: contact.email || "" },
            { label: "Phone Number", value: safeFormData.phone || "" },
            { label: "Nationality", value: getCountryName(contact.nationality || "") },
          ],
        },
        {
          title: "Rooms",
          icon: "/images/summary/rooms.svg",
          listItems: hotelRoomsList.length ? hotelRoomsList : ["Standard Room"],
        },
        {
          title: "Special Requests",
          icon: "/images/summary/special.svg",
          listItems: specialRequests,
        },
      ]
      : [
        {
          title: "Contact Info",
          icon: "/images/summary/contact.svg",
          fields: [
            { label: "Name", value: contact.full_name || "" },
            { label: "Email", value: contact.email || "" },
            { label: "Phone Number", value: safeFormData.phone || "" },
            { label: "Nationality", value: getCountryName(contact.nationality || "") },
          ],
        },
        {
          title: "Trip Info",
          icon: "/images/summary/trip.svg",
          fields: [
            { label: "Trip Name", value: bData.details?.trip_name || bData.title || bData.trip?.title || "" },
            { label: "Destination", value: bData.details?.destination || bData.trip?.location_text || "" },
            { label: "Duration", value: bData.details?.duration_label || `${bData.trip?.duration?.nights || 0} Nights / ${bData.trip?.duration?.days || 0} Days` },
          ],
        },
        {
          title: "Rooms",
          icon: "/images/summary/rooms.svg",
          listItems: hotelRoomsList.length ? hotelRoomsList : ["Standard Room"],
        },
        {
          title: "Special Requests",
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
        pricePerNight: parseFloat(bData.hotel?.price_per_night || "0"),
        reviews: bData.hotel?.review_count || 0
      }}
      formData={safeFormData as any}
      totalAmount={hotelTotalAmount + hotelVatAmount}
      vatAmount={hotelVatAmount}
      depositAmount={hotelDepositAmount}
      totalRooms={hotelTotalRooms}
      totalGuests={hotelTotalGuests}
    />
  ) : (
    <BookingSidebar
      trip={{
        id: bData.id || bData.trip?.id || "trip",
        title: bData.details?.trip_name || bData.title || bData.trip?.title || "Trip",
        description: bData.details?.travel_type || bData.trip?.short_description || "",
        image: bData.image || bData.trip?.image || "/images/home/hero-bg.png",
        location: bData.details?.destination || bData.trip?.location_text || "",
        price: parseFloat(bData.total_amount || bData.trip?.base_price || "0"),
        currency: bData.payment_summary?.currency_code || bData.trip?.currency_code || "£",
        duration: { days: 0, nights: 0, label: bData.details?.duration_label } as any
      }}
      formData={safeFormData as any}
      totalAmount={totalAmount}
      depositAmount={depositAmount}
    />
  );

  return (
    <div className={styles.page}>
      <PageHeader
        breadcrumbs={[
          { label: "Profile", href: "/profile" },
          { label: "Bookings Details", isCurrent: true },
        ]}
        title="Your Travel Space"
        subtitle="Easily access all your travel bookings and submitted requests in one organized place, with clear details about your trips, hotel stays, transportation, and upcoming plans."
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
                  Final payment due by March 15, 2026 to keep your booking
                </div>
              )}

              <header className={styles.header}>
                <div>
                  <h2>Booking Details</h2>
                  <p>View your trip details, payment status, and manage your booking</p>
                </div>
                <span className={`${styles.statusBadge} ${statusUi.badgeClass}`}>
                  <span className={styles.statusIcon}>{statusUi.icon}</span>
                  {statusUi.label}
                </span>
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
                      Cancel booking
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
                        <span>{isPaying ? "Generating payment link..." : `Pay remaining ${currencySymbol}${remainingAmount.toLocaleString()}`}</span>
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

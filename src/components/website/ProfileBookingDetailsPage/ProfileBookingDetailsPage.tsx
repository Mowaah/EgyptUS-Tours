"use client";

import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
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
import type { BookingData, Hotel, TransportationBookingData, Trip, Vehicle } from "@/types";
import styles from "./ProfileBookingDetailsPage.module.scss";

type TripDetailsStatus = Extract<TripBookingStatus, "confirmed" | "partially_paid" | "cancelled">;

const FALLBACK_STATUS: TripDetailsStatus = "confirmed";

const detailSections = [
  {
    title: "Contact Info",
    icon: "/images/summary/contact.svg",
    rows: [
      { label: "Name", value: "Ahmed Hassan" },
      { label: "Email", value: "ahmed.hassan@gmail.com" },
      { label: "Phone Number", value: "+20 100 123 4567" },
      { label: "Nationality", value: "Egyptian" },
    ],
  },
  {
    title: "Trip Info",
    icon: "/images/summary/trip.svg",
    rows: [
      { label: "Trip Name", value: "Mediterranean" },
      { label: "Destination", value: "Santorini, Greece" },
      { label: "Travel Type", value: "Group" },
      { label: "Duration", value: "7 Nights / 8 Days" },
    ],
  },
];

const rooms = [
  "2 x Double Room - Sea View",
  "1 x Double Room - Garden View",
  "1 x Triple Room - Garden View",
];

const specialRequests = [
  "High floor room with sea view if available , Non-smoking room , Late check-in around 10 PM.",
];

const bookingData: BookingData = {
  name: "Ahmed Hassan",
  email: "ahmed.hassan@gmail.com",
  phone: "+20 100 123 4567",
  nationality: "Egyptian",
  startDate: "Sun, Mar 15",
  endDate: "Sun, Mar 15",
  adults: 2,
  children: 2,
  infants: 2,
  rooms: {
    single: 0,
    double: 1,
    triple: 1,
  },
  specialRequests: specialRequests.join(", "),
  termsAccepted: true,
  cardNumber: "",
  cardName: "",
  expiry: "",
  cvv: "",
};

const trip: Trip = {
  id: "profile-trip-details",
  title: "Luxor & Aswan Nile Cruise Experience",
  description: "Trip details page mock data for profile booking details.",
  image: "/images/home/hero-bg.png",
  location: "Luxor & Aswan",
  price: 4900,
  currency: "$",
  duration: { days: 8, nights: 7 },
};

const hotel: Hotel = {
  id: "profile-hotel-booking",
  name: "Nile Palace Hotel",
  location: "Luxor, Egypt",
  image: "/images/hotels/hotel6.png",
  stars: 5,
  rating: 4.9,
  rooms: 120,
  pricePerNight: 85.42,
  reviews: 248,
};

const hotelBookingData: BookingData = {
  name: "Ahmed Hassan",
  email: "ahmed.hassan@gmail.com",
  phone: "+20 100 123 4567",
  nationality: "Egyptian",
  startDate: "Sun, Mar 15",
  endDate: "Sun, Mar 15",
  adults: 2,
  children: 0,
  infants: 0,
  rooms: {
    single: 0,
    double: 2,
    triple: 1,
  },
  specialRequests: "High floor room with sea view if available , Non-smoking room , Late check-in around 10 PM.",
  termsAccepted: true,
  cardNumber: "",
  cardName: "",
  expiry: "",
  cvv: "",
};

const transportBookingData: TransportationBookingData = {
  pickupLocation: "Santorini, Greece",
  dropoffLocation: "Santorini, Greece",
  tripType: "One Way",
  pickupDate: "April 22, 2026",
  pickupTime: "2:20 AM",
  passengers: 4,
  luggage: 2,
  services: {
    childSeat: false,
    extraLuggage: false,
    meetAndGreet: false,
  },
  name: "Ahmed Hassan",
  email: "ahmed.hassan@gmail.com",
  phone: "+20 100 123 4567",
  nationality: "Egyptian",
  specialRequests: "High floor room with sea view if available , Non-smoking room , Late check-in around 10 PM.",
  termsAccepted: true,
  cardNumber: "",
  cardName: "",
  expiry: "",
  cvv: "",
};

const transportVehicle: Vehicle = {
  id: "profile-transport-booking",
  name: "Mercedes S-Class",
  type: "Premium Sedan",
  image: "/images/sedan.png",
  price: "$100.42",
  passengers: 4,
  luggage: 2,
  description: "Premium sedan for private transfer",
  rating: 4.9,
  reviews: 248,
};

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
  const status = getStatusFromParam(searchParams.get("status"));
  const queryType = searchParams.get("type");
  const detailsType = queryType === "transport" || queryType === "hotel" ? queryType : "trip";
  const isTransport = detailsType === "transport";
  const isHotel = detailsType === "hotel";
  const isPaymentView = searchParams.get("view") === "payment";
  const [showSuccess, setShowSuccess] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const statusUi = getStatusUi(status);
  const isPartiallyPaid = status === "partially_paid";
  const showCancelAction = status !== "cancelled";
  const showPayAction = isPartiallyPaid;
  const showFooter = showCancelAction || showPayAction;
  const totalAmount = 4900;
  const depositAmount = 1470;
  const hotelTotalRooms =
    hotelBookingData.rooms.single + hotelBookingData.rooms.double + hotelBookingData.rooms.triple;
  const hotelTotalGuests = hotelBookingData.adults + hotelBookingData.children + hotelBookingData.infants;
  const hotelTotalAmount = hotel.pricePerNight * Math.max(hotelTotalRooms, 1);
  const hotelVatAmount = hotelTotalAmount * 0.1;
  const hotelDepositAmount = (hotelTotalAmount + hotelVatAmount) * 0.3;
  const hotelRoomsList = [
    hotelBookingData.rooms.single > 0
      ? `${hotelBookingData.rooms.single} × Single Room - Garden View`
      : null,
    hotelBookingData.rooms.double > 0
      ? `${hotelBookingData.rooms.double} × Double Room - Sea View`
      : null,
    hotelBookingData.rooms.triple > 0
      ? `${hotelBookingData.rooms.triple} × Triple Room - Garden View`
      : null,
  ].filter((room): room is string => Boolean(room));
  const sections: BookingDetailsSection[] = isTransport
    ? [
        {
          title: "Contact Info",
          icon: "/images/summary/contact.svg",
          fields: [
            { label: "Name", value: transportBookingData.name },
            { label: "Email", value: transportBookingData.email },
            { label: "Phone Number", value: transportBookingData.phone },
            { label: "Nationality", value: transportBookingData.nationality },
          ],
        },
        {
          title: "Trip Info",
          icon: "/images/summary/trip.svg",
          fields: [
            { label: "Pickup Location", value: transportBookingData.pickupLocation },
            { label: "Drop-off Location", value: transportBookingData.dropoffLocation },
            { label: "Trip Type", value: transportBookingData.tripType },
            { label: "Duration", value: "8 hours" },
            { label: "Pickup Time", value: transportBookingData.pickupTime },
            { label: "Pickup Date", value: transportBookingData.pickupDate },
            { label: "Passengers", value: `${transportBookingData.passengers} Passengers` },
            { label: "Luggage", value: `${transportBookingData.luggage} Bags` },
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
              { label: "Name", value: hotelBookingData.name },
              { label: "Email", value: hotelBookingData.email },
              { label: "Phone Number", value: hotelBookingData.phone },
              { label: "Nationality", value: hotelBookingData.nationality },
            ],
          },
          {
            title: "Rooms",
            icon: "/images/summary/rooms.svg",
            listItems: hotelRoomsList,
          },
          {
            title: "Special Requests",
            icon: "/images/summary/special.svg",
            listItems: specialRequests,
          },
        ]
    : [
        ...detailSections.map((section) => ({
          title: section.title,
          icon: section.icon,
          fields: section.rows,
        })),
        {
          title: "Rooms",
          icon: "/images/summary/rooms.svg",
          listItems: rooms,
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
    <TransportBookingSummary vehicle={transportVehicle} formData={transportBookingData} />
  ) : isHotel ? (
    <BookingSidebar
      hotel={hotel}
      formData={hotelBookingData}
      totalAmount={hotelTotalAmount + hotelVatAmount}
      vatAmount={hotelVatAmount}
      depositAmount={hotelDepositAmount}
      totalRooms={hotelTotalRooms}
      totalGuests={hotelTotalGuests}
    />
  ) : (
    <BookingSidebar
      trip={trip}
      formData={bookingData}
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

      <div className={styles.container}>
        {isPaymentView ? (
          <PaymentForm
            formData={isTransport ? transportBookingData : isHotel ? hotelBookingData : bookingData}
            onChange={() => undefined}
            confirmLabel={`Confirm & Pay $${(isHotel ? hotelDepositAmount : depositAmount).toLocaleString()} Deposit`}
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
                  <button
                    type="button"
                    className={styles.payButton}
                    onClick={() => router.push(buildDetailsHref("payment"))}
                  >
                    <span>Pay remaining $3,430</span>
                    <Image src="/images/money-send.svg" alt="" width={24} height={24} aria-hidden />
                  </button>
                )}
              </footer>
            )}
          </section>
        )}
      </div>

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
            { label: "Booking Reference", value: `#BK${Math.floor(Math.random() * 90000000 + 10000000)}` },
            {
              label: isTransport ? "Vehicle" : isHotel ? "Hotel" : "Trip Name",
              value: isTransport
                ? `${transportVehicle.type} - ${transportVehicle.name}`
                : isHotel
                  ? hotel.name
                  : trip.title,
            },
            {
              label: isTransport ? "Pickup Date" : isHotel ? "Check-in" : "Pickup Date",
              value: isTransport
                ? transportBookingData.pickupDate || "2026-01-22"
                : isHotel
                  ? hotelBookingData.startDate || "2026-03-15"
                  : bookingData.startDate || "2026-03-15",
            },
            {
              label: "Total Paid",
              value: isTransport
                ? "$110.42"
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
            { label: "Refund Amount", value: "$1,500", valueColor: "#FF6600" },
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

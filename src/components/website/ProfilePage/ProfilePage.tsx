"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import {
  PageHeader,
  ProfileSidebar,
  EmptyState,
  CategoryTabs,
  TripCard,
  HotelCard,
  TripBookingCard,
  SuccessModal,
  AuthModal,
} from "@/components/shared";
import type { TabType, TripBookingCardProps } from "@/components/shared";
import { Trip, Hotel } from "@/types";
import { useAuth } from "@/contexts/AuthContext";
import { useTranslation } from "@/hooks/useTranslation";
import { getFavoriteTrips, getFavoriteHotels, getProfileRequests, getProfileSummary, getProfileBookings, getPaymentReceipt } from "@/lib/api";
import styles from "./ProfilePage.module.scss";

function parseProfileTab(param: string | null): TabType {
  if (param === "favorites" || param === "bookings" || param === "requests") {
    return param;
  }
  return "favorites";
}

export default function ProfilePage() {
  const { t } = useTranslation("common");
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, isAuthenticated, isLoading } = useAuth();
  const activeTab = useMemo(
    () => parseProfileTab(searchParams.get("tab")),
    [searchParams]
  );

  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [authModalState, setAuthModalState] = useState<{ isOpen: boolean, mode: "login" | "signup" }>({ isOpen: false, mode: "login" });
  const [successBookingRef, setSuccessBookingRef] = useState<string | null>(null);
  const [successAmount, setSuccessAmount] = useState<string | null>(null);
  const [receiptData, setReceiptData] = useState<{
    booking_reference: string;
    trip_name: string;
    travel_type: string;
    start_date: string;
    amount: string;
    total_amount: string;
    status: string;
  } | null>(null);

  useEffect(() => {
    if (searchParams.get("booking_success") === "true") {
      setShowSuccessModal(true);
      const ref = searchParams.get("ref");
      setSuccessBookingRef(ref);

      if (ref) {
        getPaymentReceipt(ref).then(data => {
          setReceiptData(data);
        }).catch(err => {
          console.error("Failed to fetch receipt", err);
          const amountCents = searchParams.get("amount_cents");
          if (amountCents && !isNaN(Number(amountCents))) {
            setSuccessAmount((Number(amountCents) / 100).toFixed(2));
          }
        });
      } else {
        const amountCents = searchParams.get("amount_cents");
        if (amountCents && !isNaN(Number(amountCents))) {
          setSuccessAmount((Number(amountCents) / 100).toFixed(2));
        }
      }
    }
  }, [searchParams]);

  const handleTabChange = useCallback(
    (tab: TabType) => {
      router.replace(`/profile?tab=${tab}`, { scroll: false });
    },
    [router]
  );

  // Note: Guest users can still land here (e.g. from payment redirect) so we don't force redirect them away.
  useEffect(() => {
    // If we wanted to restrict certain tabs to authenticated users, we could do it here
    // But we let them stay on the page to see modals or empty states
  }, [isLoading, isAuthenticated, router]);

  const [favoriteCategoryIndex, setFavoriteCategoryIndex] = useState(0);
  const [bookingCategoryIndex, setBookingCategoryIndex] = useState(0);
  const [requestCategoryIndex, setRequestCategoryIndex] = useState(0);

  const profileFavoriteCategoryTabs = useMemo(
    () => [t("profile.categories.trips", "Trips"), t("profile.categories.hotels", "Hotels")],
    [t]
  );
  const profileBookingCategoryTabs = useMemo(
    () => [
      t("profile.categories.trips", "Trips"),
      t("profile.categories.hotels", "Hotels"),
      t("profile.categories.transportation", "Transportation"),
    ],
    [t]
  );
  const profileRequestCategoryTabs = useMemo(
    () => [
      t("profile.categories.planYourTrip", "Plan Your Trip"),
      t("profile.categories.events", "Events (MICE)"),
      t("profile.categories.b2b", "B2B"),
    ],
    [t]
  );

  const [favoriteTrips, setFavoriteTrips] = useState<Trip[]>([]);
  const [favoriteHotels, setFavoriteHotels] = useState<Hotel[]>([]);
  const [favoritesLoading, setFavoritesLoading] = useState(false);

  const [summary, setSummary] = useState<{ bookings_count: number; requests_count: number }>({
    bookings_count: 0,
    requests_count: 0,
  });

  const [planYourTripRequests, setPlanYourTripRequests] = useState<TripBookingCardProps[]>([]);
  const [eventsRequests, setEventsRequests] = useState<TripBookingCardProps[]>([]);
  const [b2bRequests, setB2bRequests] = useState<TripBookingCardProps[]>([]);
  const [requestsLoading, setRequestsLoading] = useState(false);

  const [tripBookings, setTripBookings] = useState<TripBookingCardProps[]>([]);
  const [hotelBookings, setHotelBookings] = useState<TripBookingCardProps[]>([]);
  const [transportBookings, setTransportBookings] = useState<TripBookingCardProps[]>([]);
  const [bookingsLoading, setBookingsLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      getProfileSummary()
        .then((data) => setSummary(data))
        .catch((err) => console.error("Failed to fetch profile summary:", err));
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (isAuthenticated && activeTab === "favorites") {
      const fetchFavorites = async () => {
        setFavoritesLoading(true);
        try {
          const [tripsData, hotelsData] = await Promise.all([
            getFavoriteTrips(),
            getFavoriteHotels(),
          ]);

          setFavoriteTrips(
            tripsData.map((t) => ({
              id: t.slug,
              title: t.title,
              description: t.short_description,
              location: t.location_text,
              price: parseFloat(t.base_price),
              currency: t.currency_code === "USD" ? "£" : t.currency_code,
              priceLabel: t.price_label,
              duration: t.duration,
              image: t.image || "/images/destination1.png",
              isFavorite: t.is_favorite,
            }))
          );

          setFavoriteHotels(
            hotelsData.map((h) => ({
              id: h.slug,
              name: h.name,
              location: h.location_text,
              image: h.hero_image || h.image || "/images/pyramids.jpg",
              stars: h.stars,
              rating: h.rating_avg,
              reviews: h.review_count,
              rooms: h.rooms,
              pricePerNight: parseFloat(h.price_per_night),
              currency: h.currency_code === "USD" ? "£" : h.currency_code,
              isFavorite: h.is_favorite,
            }))
          );
        } catch (error) {
          console.error("Failed to fetch favorites:", error);
        } finally {
          setFavoritesLoading(false);
        }
      };

      fetchFavorites();
    }
  }, [isAuthenticated, activeTab]);

  useEffect(() => {
    if (isAuthenticated && activeTab === "requests") {
      const fetchRequests = async () => {
        setRequestsLoading(true);
        try {
          const [planData, eventsData, b2bData] = await Promise.all([
            getProfileRequests("plan_your_trip"),
            getProfileRequests("events"),
            getProfileRequests("b2b"),
          ]);

          const mapRequest = (req: any): TripBookingCardProps => {
            let mappedDetails = {};
            if (req.type === "plan_your_trip") {
              mappedDetails = {
                destination: req.details?.destination || "",
                tripCategory: req.details?.trip_category || "",
                durationLabel: req.details?.duration_label || "",
                travelDates: req.details?.travel_dates || "",
                budget: req.details?.budget || "Not Specified",
                travelersLabel: req.details?.travelers_label || "",
              };
            } else if (req.type === "events") {
              mappedDetails = {
                organization: req.details?.organization || "",
                preferredCity: req.details?.preferred_city || "",
                eventType: req.details?.event_type || "",
                expectedAttendees: req.details?.expected_attendees || "",
                startDate: req.details?.start_date || "",
                endDate: req.details?.end_date || "",
                eventTime: req.details?.event_time || "",
                durationLabel: req.details?.duration_label || "",
              };
            } else if (req.type === "b2b") {
              mappedDetails = {
                companyName: req.details?.company_name || "",
                country: req.details?.country || "",
                contactPerson: req.details?.contact_person || "",
                emailAddress: req.details?.email_address || "",
                phoneNumber: req.details?.phone_number || "",
                website: req.details?.website || "",
              };
            }

            const reqStatus = req.status || "proposal_in_progress";
            const mappedStatus = ["closed", "converted", "fully_paid", "paid", "confirmed", "approved"].includes(reqStatus)
              ? "confirmed"
              : reqStatus === "proposal_sent"
              ? "proposal_sent"
              : "proposal_in_progress";

            return {
              variant: (req.type === "events" ? "mice" : req.type) as any,
              showImage: false,
              tripTitle: req.title || req.event_name || req.company_name || "",
              status: mappedStatus as any,
              infoMessage: req.info_message || t("profile.card.proposalExpected", "Proposal expected within 24-48 hrs"),
              details: mappedDetails as any,
              primaryLabel: t("buttons.viewDetails", "View Details"),
              primaryHref: `/profile/requests-details?type=${req.type}&id=${req.id}&status=${reqStatus}`,
            };
          };

          setPlanYourTripRequests(planData.map((req: any) => mapRequest({ ...req, type: "plan_your_trip" })));
          setEventsRequests(eventsData.map((req: any) => mapRequest({ ...req, type: "events" })));
          setB2bRequests(b2bData.map((req: any) => mapRequest({ ...req, type: "b2b" })));
        } catch (error) {
          console.error("Failed to fetch requests:", error);
        } finally {
          setRequestsLoading(false);
        }
      };
      fetchRequests();
    }
  }, [isAuthenticated, activeTab, t]);

  useEffect(() => {
    if (isAuthenticated && activeTab === "bookings") {
      const fetchBookings = async () => {
        setBookingsLoading(true);
        try {
          const [tripData, hotelData, transportData] = await Promise.all([
            getProfileBookings("trip"),
            getProfileBookings("hotel"),
            getProfileBookings("transport"),
          ]);

          const mapBooking = (bk: any, type: string, defaultImage: string): TripBookingCardProps => {
            let mappedDetails: any = {};
            const d = bk.details || {};

            if (type === "trip") {
              mappedDetails = {
                tripName: d.trip_name || bk.title || "",
                destination: d.destination || bk.destination || "",
                departureDate: d.departure_date || "",
                returnDate: d.return_date || "",
                travelType: d.travel_type || "",
                durationLabel: d.duration_label || "",
                roomType: d.room_type || "",
                roomExtraCount: d.room_extra_count,
                travelersLabel: d.travelers_label || "",
              };
            } else if (type === "hotel") {
              mappedDetails = {
                checkIn: d.check_in || "",
                checkOut: d.check_out || "",
                nights: d.nights || "",
                roomType: d.room_type || "",
                roomNumber: d.room_number || "",
                guests: d.guests || "",
              };
            } else if (type === "transport") {
              mappedDetails = {
                pickupLocation: d.pickup_location || bk.pickup_location || "",
                dropoffLocation: d.dropoff_location || bk.dropoff_location || "",
                pickupDate: d.pickup_date || bk.pickup_date || "",
                pickupTime: d.pickup_time || bk.pickup_time || "",
                durationLabel: d.duration_label || "",
                passengersLabel: d.passengers_label || (bk.passengers ? `${bk.passengers} Passengers` : ""),
                tripType: d.trip_type || bk.trip_type || "",
                luggageLabel: d.luggage_label || (bk.luggage !== undefined ? `${bk.luggage} Bags` : ""),
              };
            }
            const statusVal = bk.status || "confirmed";
            const isPartiallyPaid = statusVal === "partially_paid";
            const isCancelled = statusVal === "cancelled";

            let primaryLabel = t("buttons.viewDetails", "View Details");
            if (isPartiallyPaid) {
              primaryLabel = t("profile.card.completePayment", "Complete Payment");
            }

            const payment = bk.payment_summary || {};
            const totalVal = bk.total_amount ?? payment.total_amount ?? bk.price;
            const paidVal = bk.paid_amount ?? payment.paid_amount;
            const remainingVal = bk.remaining_amount ?? payment.remaining_amount;

            const paidNum = paidVal != null ? parseFloat(String(paidVal)) : (isPartiallyPaid ? 0 : undefined);
            const totalNum = totalVal != null ? parseFloat(String(totalVal)) : undefined;
            const remainingNum = remainingVal != null
              ? parseFloat(String(remainingVal))
              : (isPartiallyPaid ? (totalNum != null && paidNum != null ? totalNum - paidNum : totalNum) : undefined);

            return {
              variant: type as any,
              imageSrc: bk.image || defaultImage,
              tripTitle: bk.title || bk.hotel_name || bk.vehicle_name || "",
              status: statusVal,
              timerLabel: bk.timer_label || (isCancelled ? undefined : "In the past"),
              paidAmount: paidNum,
              remainingAmount: remainingNum,
              totalAmount: totalNum,
              cancelledLabel: bk.cancelled_label || (isCancelled ? "Cancelled by You — Apr 1, 2026" : undefined),
              infoMessage: "",
              details: mappedDetails,
              primaryLabel,
              primaryHref: `/profile/bookings-details?type=${type}&id=${bk.id}&status=${statusVal}`,
            };
          };

          setTripBookings(tripData.map((b: any) => mapBooking(b, "trip", "/images/pyramids.jpg")));
          setHotelBookings(hotelData.map((b: any) => mapBooking(b, "hotel", "/images/hotels/hotel6.png")));
          setTransportBookings(transportData.map((b: any) => mapBooking(b, "transport", "/images/sedan.png")));
        } catch (error) {
          console.error("Failed to fetch bookings:", error);
        } finally {
          setBookingsLoading(false);
        }
      };
      fetchBookings();
    }
  }, [isAuthenticated, activeTab]);

  const renderTabContent = () => {
    switch (activeTab) {
      case "favorites":
        if (favoritesLoading) {
          return <div className={styles.loading}>Loading favorites...</div>;
        }

        if (favoriteCategoryIndex === 0) {
          if (favoriteTrips.length === 0) {
            return (
              <EmptyState
                framedIcon
                iconSrc="/images/profile/glyphs/heart.svg"
                iconWidth={200}
                iconHeight={200}
                title={t("profile.emptyStates.noFavoriteTrips", "Your favorite trips list is empty")}
                description={t("profile.emptyStates.noFavoriteTripsDesc", "Save trips you're interested in and come back anytime to complete your booking.")}
                buttonText={t("profile.emptyStates.exploreTrips", "Explore trips")}
                buttonHref="/egypttours"
              />
            );
          }
          return (
            <div className={styles.tripsGrid}>
              {favoriteTrips.map((trip) => (
                <TripCard
                  key={trip.id}
                  trip={trip}
                  className={styles.profileTripCard}
                  onFavoriteToggle={(id) => {
                    // Optimistically remove from list when unfavorited
                    setFavoriteTrips((prev) => prev.filter((t) => t.id !== id));
                  }}
                />
              ))}
            </div>
          );
        } else {
          if (favoriteHotels.length === 0) {
            return (
              <EmptyState
                framedIcon
                iconSrc="/images/profile/glyphs/heart.svg"
                iconWidth={150}
                iconHeight={150}
                title={t("profile.emptyStates.noFavoriteHotels", "Your favorite hotels list is empty")}
                description={t("profile.emptyStates.noFavoriteHotelsDesc", "Save hotels you're interested in and come back anytime to complete your booking.")}
                buttonText={t("profile.emptyStates.exploreHotels", "Explore hotels")}
                buttonHref="/hotels"
              />
            );
          }
          return (
            <div className={styles.tripsGrid}>
              {favoriteHotels.map((hotel) => (
                <HotelCard
                  key={hotel.id}
                  hotel={hotel}
                  onFavoriteToggle={(id) => {
                    // Optimistically remove from list when unfavorited
                    setFavoriteHotels((prev) => prev.filter((h) => h.id !== id));
                  }}
                />
              ))}
            </div>
          );
        }
      case "bookings":
        if (bookingsLoading) {
          return <div className={styles.loading}>Loading bookings...</div>;
        }

        let bookingItems: TripBookingCardProps[] = [];
        let emptyBIcon = "";
        let emptyBTitle = "";
        let emptyBDesc = "";
        let emptyBBtn = "";
        let emptyBHref = "";

        if (!isAuthenticated) {
          return (
            <EmptyState
              framedIcon
              iconSrc="/images/profile-blue2.svg"
              iconWidth={90}
              iconHeight={90}
              title={t("profile.emptyStates.authBookingsTitle", "Create an Account to View Your Bookings")}
              description={t("profile.emptyStates.authBookingsDesc", "Sign up or log in to access your bookings, requests, and upcoming trips in one place.")}
              buttonText={t("profile.emptyStates.createAccount", "Create Account")}
              buttonVariant="primary"
              buttonStyle={{ width: "100%", maxWidth: "432px" }}
              onButtonClick={() => setAuthModalState({ isOpen: true, mode: "signup" })}
              footerNode={
                <p style={{ margin: 0, fontSize: "16px", color: "#9E9E9E", fontFamily: "var(--font-trip-sans)" }}>
                  {t("profile.emptyStates.alreadyHaveAccount", "Already have an Account ?")}{" "}
                  <button
                    type="button"
                    onClick={() => setAuthModalState({ isOpen: true, mode: "login" })}
                    style={{
                      color: "#2971E6",
                      fontWeight: 700,
                      background: "none",
                      border: "none",
                      padding: 0,
                      cursor: "pointer",
                      textDecoration: "underline",
                      fontFamily: "var(--font-trip-sans)",
                    }}
                  >
                    {t("profile.emptyStates.login", "Login")}
                  </button>
                </p>
              }
            />
          );
        }

        if (bookingCategoryIndex === 0) {
          bookingItems = tripBookings;
          emptyBIcon = "/images/profile/glyphs/trips.svg";
          emptyBTitle = t("profile.emptyStates.noTripBookings", "No bookings yet");
          emptyBDesc = t("profile.emptyStates.noTripBookingsDesc", "When you book a trip, your itinerary and details will appear here.");
          emptyBBtn = t("profile.emptyStates.exploreTrips", "Explore trips");
          emptyBHref = "/egypttours";
        } else if (bookingCategoryIndex === 1) {
          bookingItems = hotelBookings;
          emptyBIcon = "/images/profile/glyphs/hotels.svg";
          emptyBTitle = t("profile.emptyStates.noHotelBookings", "No hotel bookings yet");
          emptyBDesc = t("profile.emptyStates.noHotelBookingsDesc", "When you book a hotel, your stay details will appear here.");
          emptyBBtn = t("profile.emptyStates.exploreHotels", "Explore hotels");
          emptyBHref = "/hotels";
        } else {
          bookingItems = transportBookings;
          emptyBIcon = "/images/profile/glyphs/transportations.svg";
          emptyBTitle = t("profile.emptyStates.noTransportBookings", "No transportation bookings yet");
          emptyBDesc = t("profile.emptyStates.noTransportBookingsDesc", "When you add transfers or transport, your arrangements will appear here.");
          emptyBBtn = t("profile.emptyStates.bookTransport", "Book transportation");
          emptyBHref = "/transportation";
        }

        if (bookingItems.length === 0) {
          return (
            <EmptyState
              framedIcon
              iconSrc={emptyBIcon}
              iconWidth={90}
              iconHeight={90}
              title={emptyBTitle}
              description={emptyBDesc}
              buttonText={emptyBBtn}
              buttonHref={emptyBHref}
            />
          );
        }

        return (
          <div className={styles.bookingsList}>
            {bookingItems.map((item, idx) => (
              <TripBookingCard key={idx} {...item} />
            ))}
          </div>
        );
      case "requests":
        if (requestsLoading) {
          return <div className={styles.loading}>Loading requests...</div>;
        }
        let items: TripBookingCardProps[] = [];
        let emptyIcon = "";
        let emptyTitle = "";
        let emptyDesc = "";
        let emptyBtn = "";
        let emptyHref = "";

        if (!isAuthenticated) {
          return (
            <EmptyState
              framedIcon
              iconSrc="/images/profile-blue.svg"
              iconWidth={90}
              iconHeight={90}
              title={t("profile.emptyStates.authRequestsTitle", "Create an Account to View Your Requests")}
              description={t("profile.emptyStates.authRequestsDesc", "Sign up or log in to track your trip requests, view their status, and manage your travel inquiries.")}
              buttonText={t("profile.emptyStates.createAccount", "Create Account")}
              buttonVariant="primary"
              buttonStyle={{ width: "100%", maxWidth: "432px" }}
              onButtonClick={() => setAuthModalState({ isOpen: true, mode: "signup" })}
              footerNode={
                <p style={{ margin: 0, fontSize: "16px", color: "#9E9E9E", fontFamily: "var(--font-trip-sans)" }}>
                  {t("profile.emptyStates.alreadyHaveAccount", "Already have an Account ?")}{" "}
                  <button
                    type="button"
                    onClick={() => setAuthModalState({ isOpen: true, mode: "login" })}
                    style={{
                      color: "#2971E6",
                      fontWeight: 700,
                      background: "none",
                      border: "none",
                      padding: 0,
                      cursor: "pointer",
                      textDecoration: "underline",
                      fontFamily: "var(--font-trip-sans)",
                    }}
                  >
                    {t("profile.emptyStates.login", "Login")}
                  </button>
                </p>
              }
            />
          );
        }

        if (requestCategoryIndex === 0) {
          items = planYourTripRequests;
          emptyIcon = "/images/profile/glyphs/requests.svg";
          emptyTitle = t("profile.emptyStates.noCustomRequests", "No custom trip requests yet");
          emptyDesc = t("profile.emptyStates.noCustomRequestsDesc", "Use our Plan Your Trip planner to build your custom itinerary and get a proposal.");
          emptyBtn = t("profile.emptyStates.planYourTrip", "Plan your trip");
          emptyHref = "/booking";
        } else if (requestCategoryIndex === 1) {
          items = eventsRequests;
          emptyIcon = "/images/profile/glyphs/requests.svg";
          emptyTitle = t("profile.emptyStates.noMiceRequests", "No MICE requests yet");
          emptyDesc = t("profile.emptyStates.noMiceRequestsDesc", "Create your first event or corporate experience and get a tailored proposal.");
          emptyBtn = t("profile.emptyStates.requestProposal", "Request a proposal");
          emptyHref = "/events/request-proposal";
        } else {
          items = b2bRequests;
          emptyIcon = "/images/profile/glyphs/requests.svg";
          emptyTitle = t("profile.emptyStates.noB2bRequests", "No business requests yet");
          emptyDesc = t("profile.emptyStates.noB2bRequestsDesc", "Partner with us to create tailored travel experiences for your company.");
          emptyBtn = t("profile.emptyStates.requestProposal", "Request a proposal");
          emptyHref = "/b2b-programs/request-proposal";
        }

        if (items.length === 0) {
          return (
            <EmptyState
              framedIcon
              iconSrc={emptyIcon}
              iconWidth={150}
              iconHeight={150}
              title={emptyTitle}
              description={emptyDesc}
              buttonText={emptyBtn}
              buttonHref={emptyHref}
            />
          );
        }

        return (
          <div className={styles.bookingsList}>
            {items.map((item, idx) => (
              <TripBookingCard key={idx} {...item} />
            ))}
          </div>
        );
      default:
        return null;
    }
  };

  const getTabTitle = () => {
    switch (activeTab) {
      case "favorites":
        return t("profile.tabs.favorites", "My Favorites");
      case "bookings":
        return t("profile.tabs.bookings", "My Bookings");
      case "requests":
        return t("profile.tabs.requests", "My Requests");
      default:
        return "";
    }
  };

  const getTabSubtitle = () => {
    switch (activeTab) {
      case "favorites":
        return favoriteCategoryIndex === 0
          ? t("profile.subtitles.favoriteTrips", "All your favorite trips in one place")
          : t("profile.subtitles.favoriteHotels", "All your favorite hotels in one place");
      case "bookings":
        return t("profile.subtitles.bookings", "All your reservations in one place");
      case "requests":
        return t("profile.subtitles.requests", "Track your trip requests");
      default:
        return "";
    }
  };

  return (
    <div className={styles.profilePage}>
      {/* Header */}
      <PageHeader
        breadcrumbs={[
          { label: t("userMenu.profile", "Profile"), isCurrent: true },
        ]}
        title={t("profile.headerTitle", "Your Travel Space")}
        subtitle={t("profile.headerSubtitle", "Easily access all your travel bookings and submitted requests in one organized place, with clear details about your trips, hotel stays, transportation, and upcoming plans.")}
      />

      <div className={styles.container}>
        {/* Main Layout */}
        <div className={styles.mainLayout}>
          {/* Sidebar Column */}
          <div className={styles.sidebarColumn}>
            <ProfileSidebar
              user={{
                name: user?.full_name ?? "",
                email: user?.email ?? "",
                avatar: null,
                bookingsCount: summary.bookings_count,
                requestsCount: summary.requests_count,
              }}
              activeTab={activeTab}
              onTabChange={handleTabChange}
            />
            <div className={styles.decorationBottom} aria-hidden="true">
              <div className={styles.decorationLineWrap}>
                <Image
                  src="/images/profile/orange-dotted-line.svg"
                  alt=""
                  width={359}
                  height={234}
                  className={styles.decorationImage}
                />
                <Image
                  src="/images/trips2.svg"
                  alt=""
                  width={20}
                  height={19}
                  className={styles.decorationEndIcon}
                />
              </div>
            </div>
          </div>

          {/* Content Area */}
          <main className={styles.content}>
            {activeTab === "bookings" || activeTab === "requests" || activeTab === "favorites" ? (
              <div className={styles.contentHeaderBookings}>
                <div className={styles.contentHeaderText}>
                  <h2 className={styles.contentTitle}>{getTabTitle()}</h2>
                  <p className={styles.contentSubtitle}>{getTabSubtitle()}</p>
                </div>
                {activeTab === "bookings" ? (
                  <CategoryTabs
                    tabs={profileBookingCategoryTabs}
                    active={bookingCategoryIndex}
                    onTabChange={(_, index) => setBookingCategoryIndex(index)}
                    className={styles.bookingCategoryTabs}
                  />
                ) : activeTab === "requests" ? (
                  <CategoryTabs
                    tabs={profileRequestCategoryTabs}
                    active={requestCategoryIndex}
                    onTabChange={(_, index) => setRequestCategoryIndex(index)}
                    className={styles.bookingCategoryTabs}
                  />
                ) : (
                  <CategoryTabs
                    tabs={profileFavoriteCategoryTabs}
                    active={favoriteCategoryIndex}
                    onTabChange={(_, index) => setFavoriteCategoryIndex(index)}
                    className={styles.bookingCategoryTabs}
                  />
                )}
              </div>
            ) : (
              <div className={styles.contentHeader}>
                <h2 className={styles.contentTitle}>{getTabTitle()}</h2>
                <p className={styles.contentSubtitle}>{getTabSubtitle()}</p>
              </div>
            )}
            {renderTabContent()}
          </main>
        </div>
      </div>

      {showSuccessModal && (
        <SuccessModal
          title="Booking Confirmed!"
          message="Your booking has been successfully paid and confirmed. Confirmation details have been sent to your email."
          primaryButtonText="View Bookings"
          buttonText="Back to Home"
          onPrimaryClick={() => {
            setShowSuccessModal(false);
            router.replace("/profile?tab=bookings", { scroll: false });
          }}
          onClose={() => {
            setShowSuccessModal(false);
            router.replace("/", { scroll: false });
          }}
          metadata={
            receiptData
              ? [
                { label: "Booking Reference", value: receiptData.booking_reference },
                { label: "Trip Name", value: receiptData.trip_name },
                { label: "Travel Type", value: receiptData.travel_type },
                { label: "Date", value: receiptData.start_date || "—" },
                { label: "Total Price", value: `£${receiptData.total_amount}`, valueColor: "#FF6600" },
                { label: "Paid Now", value: `£${receiptData.amount}`, valueColor: "#FF6600" },
              ]
              : successBookingRef || successAmount
                ? [
                  ...(successBookingRef
                    ? [{ label: "Payment Reference", value: successBookingRef }]
                    : []),
                  ...(successAmount
                    ? [{ label: "Total Paid", value: `£${successAmount}`, valueColor: "#10B981" }]
                    : []),
                ]
                : undefined
          }
        />
      )}

      {authModalState.isOpen && (
        <AuthModal
          initialMode={authModalState.mode}
          onClose={() => setAuthModalState({ ...authModalState, isOpen: false })}
        />
      )}
    </div>
  );
}

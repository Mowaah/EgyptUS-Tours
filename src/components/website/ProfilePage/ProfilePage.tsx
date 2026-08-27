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
import { getFavoriteTrips, getFavoriteHotels, getProfileRequests, getProfileSummary, getProfileBookings, getPaymentReceipt } from "@/lib/api";
import styles from "./ProfilePage.module.scss";

const profileFavoriteCategoryTabs = ["Trips", "Hotels"];
const profileBookingCategoryTabs = ["Trips", "Hotels", "Transportation"];
const profileRequestCategoryTabs = ["Plan Your Trip", "Events (MICE)", "B2B"];

function parseProfileTab(param: string | null): TabType {
  if (param === "favorites" || param === "bookings" || param === "requests") {
    return param;
  }
  return "favorites";
}

export default function ProfilePage() {
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

          const mapRequest = (req: any, defaultImage: string): TripBookingCardProps => {
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

            return {
              variant: (req.type === "events" ? "mice" : req.type) as any,
              imageSrc: req.image || defaultImage,
              tripTitle: req.title || req.event_name || req.company_name || "",
              status: req.status || "proposal_in_progress",
              infoMessage: req.info_message || "Proposal expected within 24-48 hrs",
              details: mappedDetails as any,
              primaryLabel: "View Details",
              primaryHref: `/profile/requests-details?type=${req.type}&id=${req.id}&status=${req.status || "proposal_in_progress"}`,
            };
          };

          setPlanYourTripRequests(planData.map((req: any) => mapRequest(req, "/images/pyramids.jpg")));
          setEventsRequests(eventsData.map((req: any) => mapRequest(req, "/images/events1.png")));
          setB2bRequests(b2bData.map((req: any) => mapRequest(req, "/images/contact1.jpg")));
        } catch (error) {
          console.error("Failed to fetch requests:", error);
        } finally {
          setRequestsLoading(false);
        }
      };
      fetchRequests();
    }
  }, [isAuthenticated, activeTab]);

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

            let primaryLabel = "View Details";
            if (isPartiallyPaid) {
              primaryLabel = "Complete Payment";
            }

            return {
              variant: type as any,
              imageSrc: bk.image || defaultImage,
              tripTitle: bk.title || bk.hotel_name || bk.vehicle_name || "",
              status: statusVal,
              timerLabel: bk.timer_label || (isCancelled ? undefined : "In the past"),
              paidAmount: bk.paid_amount ?? (isPartiallyPaid ? 1470 : undefined),
              remainingAmount: bk.remaining_amount ?? (isPartiallyPaid ? 3430 : undefined),
              totalAmount: bk.total_amount ?? (!isPartiallyPaid && !isCancelled ? 4900 : undefined),
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
                title="Your favorite trips list is empty"
                description="Save trips you're interested in and come back anytime to complete your booking."
                buttonText="Explore Trips"
                buttonHref="/trips"
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
                title="Your favorite hotels list is empty"
                description="Save hotels you're interested in and come back anytime to complete your booking."
                buttonText="Explore Hotels"
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
              title="Create an Account to View Your Bookings"
              description="Sign up or log in to access your bookings, requests, and upcoming trips in one place."
              buttonText="Create Account"
              buttonVariant="primary"
              buttonStyle={{ width: "100%", maxWidth: "432px" }}
              onButtonClick={() => setAuthModalState({ isOpen: true, mode: "signup" })}
              footerNode={
                <p style={{ margin: 0, fontSize: "16px", color: "#9E9E9E", fontFamily: "var(--font-trip-sans)" }}>
                  Already have an Account ?{" "}
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
                    Login
                  </button>
                </p>
              }
            />
          );
        }

        if (bookingCategoryIndex === 0) {
          bookingItems = tripBookings;
          emptyBIcon = "/images/profile/glyphs/trips.svg";
          emptyBTitle = "No bookings yet";
          emptyBDesc = "When you book a trip, your itinerary and details will appear here.";
          emptyBBtn = "Explore Trips";
          emptyBHref = "/trips";
        } else if (bookingCategoryIndex === 1) {
          bookingItems = hotelBookings;
          emptyBIcon = "/images/profile/glyphs/hotels.svg";
          emptyBTitle = "No hotel bookings yet";
          emptyBDesc = "When you book a hotel, your stay details will appear here.";
          emptyBBtn = "Browse Hotels";
          emptyBHref = "/hotels";
        } else {
          bookingItems = transportBookings;
          emptyBIcon = "/images/profile/glyphs/transportations.svg";
          emptyBTitle = "No transportation bookings yet";
          emptyBDesc = "When you add transfers or transport, your arrangements will appear here.";
          emptyBBtn = "Browse Transportation";
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
              title="Create an Account to View Your Requests"
              description="Sign up or log in to track your trip requests, view their status, and manage your travel inquiries."
              buttonText="Create Account"
              buttonVariant="primary"
              buttonStyle={{ width: "100%", maxWidth: "432px" }}
              onButtonClick={() => setAuthModalState({ isOpen: true, mode: "signup" })}
              footerNode={
                <p style={{ margin: 0, fontSize: "16px", color: "#9E9E9E", fontFamily: "var(--font-trip-sans)" }}>
                  Already have an Account ?{" "}
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
                    Login
                  </button>
                </p>
              }
            />
          );
        }

        if (requestCategoryIndex === 0) {
          items = planYourTripRequests;
          emptyIcon = "/images/profile/glyphs/requests.svg";
          emptyTitle = "No custom trip requests yet";
          emptyDesc = "Use our Plan Your Trip planner to build your custom itinerary and get a proposal.";
          emptyBtn = "Plan your trip";
          emptyHref = "/plan-your-trip";
        } else if (requestCategoryIndex === 1) {
          items = eventsRequests;
          emptyIcon = "/images/profile/glyphs/requests.svg";
          emptyTitle = "No MICE requests yet";
          emptyDesc = "Create your first event or corporate experience and get a tailored proposal.";
          emptyBtn = "Request a proposal";
          emptyHref = "/events/request-proposal";
        } else {
          items = b2bRequests;
          emptyIcon = "/images/profile/glyphs/requests.svg";
          emptyTitle = "No business requests yet";
          emptyDesc = "Partner with us to create tailored travel experiences for your company.";
          emptyBtn = "Request a proposal";
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
        return "My Favorites";
      case "bookings":
        return "My Bookings";
      case "requests":
        return "My Requests";
      default:
        return "";
    }
  };

  const getTabSubtitle = () => {
    switch (activeTab) {
      case "favorites":
        return favoriteCategoryIndex === 0
          ? "All your favorite trips in one place"
          : "All your favorite hotels in one place";
      case "bookings":
        return "All your reservations in one place";
      case "requests":
        return "Track your trip requests";
      default:
        return "";
    }
  };

  return (
    <div className={styles.profilePage}>
      {/* Header */}
      <PageHeader
        breadcrumbs={[
          { label: "Profile", isCurrent: true },
        ]}
        title="Your Travel Space"
        subtitle="Easily access all your travel bookings and submitted requests in one organized place, with clear details about your trips, hotel stays, transportation, and upcoming plans."
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

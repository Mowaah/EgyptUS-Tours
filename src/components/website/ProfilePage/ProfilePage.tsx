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
} from "@/components/shared";
import type { TabType, TripBookingCardProps } from "@/components/shared";
import { Trip, Hotel } from "@/types";
import {
  profileFavoriteCategoryTabs,
  profileBookingCategoryTabs,
  profileRequestCategoryTabs,
} from "@/data/profilePageMocks";
import { useAuth } from "@/contexts/AuthContext";
import { getFavoriteTrips, getFavoriteHotels, getProfileRequests } from "@/lib/api";
import styles from "./ProfilePage.module.scss";

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

  const handleTabChange = useCallback(
    (tab: TabType) => {
      router.replace(`/profile?tab=${tab}`, { scroll: false });
    },
    [router]
  );

  // Redirect unauthenticated users to home
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace("/");
    }
  }, [isLoading, isAuthenticated, router]);

  const [favoriteCategoryIndex, setFavoriteCategoryIndex] = useState(0);
  const [bookingCategoryIndex, setBookingCategoryIndex] = useState(0);
  const [requestCategoryIndex, setRequestCategoryIndex] = useState(0);

  const [favoriteTrips, setFavoriteTrips] = useState<Trip[]>([]);
  const [favoriteHotels, setFavoriteHotels] = useState<Hotel[]>([]);
  const [favoritesLoading, setFavoritesLoading] = useState(false);

  const [planYourTripRequests, setPlanYourTripRequests] = useState<TripBookingCardProps[]>([]);
  const [eventsRequests, setEventsRequests] = useState<TripBookingCardProps[]>([]);
  const [b2bRequests, setB2bRequests] = useState<TripBookingCardProps[]>([]);
  const [requestsLoading, setRequestsLoading] = useState(false);

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
              currency: t.currency_code === "USD" ? "$" : t.currency_code,
              priceLabel: t.price_label,
              duration: t.duration,
              image: t.image || "/images/trip-placeholder.jpg",
              isFavorite: t.is_favorite,
            }))
          );

          setFavoriteHotels(
            hotelsData.map((h) => ({
              id: h.slug,
              name: h.name,
              location: h.location_text,
              image: h.hero_image || "/images/hotel-placeholder.jpg",
              stars: h.stars,
              rating: h.rating_avg,
              reviews: h.review_count,
              rooms: h.rooms,
              pricePerNight: parseFloat(h.price_per_night),
              currency: h.currency_code === "USD" ? "$" : h.currency_code,
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
              variant: req.type as any,
              imageSrc: req.image || defaultImage,
              tripTitle: req.title || req.event_name || req.company_name || "",
              status: req.status || "proposal_in_progress",
              infoMessage: req.info_message || "Proposal expected within 24-48 hrs",
              details: mappedDetails as any,
              primaryLabel: "View Details",
              primaryHref: `/profile/requests-details?type=${req.type}&id=${req.id}`,
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
                iconWidth={150}
                iconHeight={150}
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
                buttonText="Browse Hotels"
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
        return (
          <EmptyState
            framedIcon
            iconSrc={bookingCategoryIndex === 0 ? "/images/profile/glyphs/trips.svg" : bookingCategoryIndex === 1 ? "/images/profile/glyphs/hotels.svg" : "/images/profile/glyphs/transportations.svg"}
            iconWidth={90}
            iconHeight={90}
            title={bookingCategoryIndex === 0 ? "No bookings yet" : bookingCategoryIndex === 1 ? "No hotel bookings yet" : "No transportation bookings yet"}
            description={bookingCategoryIndex === 0 ? "When you book a trip, your itinerary and details will appear here." : bookingCategoryIndex === 1 ? "When you book a hotel, your stay details will appear here." : "When you add transfers or transport, your arrangements will appear here."}
            buttonText={bookingCategoryIndex === 0 ? "Explore Trips" : bookingCategoryIndex === 1 ? "Browse Hotels" : "Book Transportation"}
            buttonHref={bookingCategoryIndex === 0 ? "/trips" : bookingCategoryIndex === 1 ? "/hotels" : "/transportation"}
          />
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
                bookingsCount: 0,
                requestsCount: 0,
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
    </div>
  );
}

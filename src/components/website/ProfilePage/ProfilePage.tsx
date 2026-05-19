"use client";

import { useCallback, useMemo, useState } from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import {
  PageHeader,
  TripCard,
  HotelCard,
  TripBookingCard,
  UpcomingTripBanner,
  ProfileSidebar,
  EmptyState,
  CategoryTabs,
} from "@/components/shared";
import type { TabType } from "@/components/shared";
import { Trip, Hotel } from "@/types";
import {
  mockProfileUser,
  mockUpcomingTrip,
  mockFavoriteTrips,
  mockFavoriteHotels,
  profileFavoriteCategoryTabs,
  profileBookingCategoryTabs,
  profileRequestCategoryTabs,
  mockTripBookings,
  mockHotelBookings,
  mockTransportBookings,
  mockMiceRequests,
  mockB2BRequests,
  mockPlanYourTripRequests,
} from "@/data/profilePageMocks";
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

  const [favoriteTrips, setFavoriteTrips] = useState<Trip[]>(mockFavoriteTrips);
  const [favoriteHotels, setFavoriteHotels] = useState<Hotel[]>(mockFavoriteHotels);
  const [favoriteCategoryIndex, setFavoriteCategoryIndex] = useState(0);
  const [bookingCategoryIndex, setBookingCategoryIndex] = useState(0);
  const [requestCategoryIndex, setRequestCategoryIndex] = useState(0);

  const handleTripFavoriteToggle = (id: string) => {
    setFavoriteTrips((prev) =>
      prev.map((trip) =>
        trip.id === id ? { ...trip, isFavorite: !trip.isFavorite } : trip
      )
    );
  };

  const handleHotelFavoriteToggle = (id: string) => {
    setFavoriteHotels((prev) =>
      prev.map((hotel) =>
        hotel.id === id ? { ...hotel, isFavorite: !hotel.isFavorite } : hotel
      )
    );
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "favorites":
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
                  onFavoriteToggle={handleTripFavoriteToggle}
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
                  onFavoriteToggle={handleHotelFavoriteToggle}
                />
              ))}
            </div>
          );
        }
      case "bookings":
        if (bookingCategoryIndex === 0) {
          if (mockTripBookings.length === 0) {
            return (
              <EmptyState
                framedIcon
                iconSrc="/images/profile/glyphs/trips.svg"
                iconWidth={90}
                iconHeight={90}
                title="No bookings yet"
                description="When you book a trip, your itinerary and details will appear here."
                buttonText="Explore Trips"
                buttonHref="/trips"
              />
            );
          }
          return (
            <div className={styles.bookingsList}>
              {mockTripBookings.map((booking, index) => (
                <TripBookingCard key={`trip-booking-${index}`} {...booking} />
              ))}
            </div>
          );
        }
        if (bookingCategoryIndex === 1) {
          if (mockHotelBookings.length === 0) {
            return (
              <EmptyState
                framedIcon
                iconSrc="/images/profile/glyphs/hotels.svg"
                iconWidth={90}
                iconHeight={90}
                title="No hotel bookings yet"
                description="When you book a hotel, your stay details will appear here."
                buttonText="Browse Hotels"
                buttonHref="/hotels"
              />
            );
          }
          return (
            <div className={styles.bookingsList}>
              {mockHotelBookings.map((booking, index) => (
                <TripBookingCard key={`hotel-booking-${index}`} {...booking} />
              ))}
            </div>
          );
        }
        if (mockTransportBookings.length === 0) {
          return (
            <EmptyState
              framedIcon
              iconSrc="/images/profile/glyphs/transportations.svg"
              iconWidth={90}
              iconHeight={90}
              title="No transportation bookings yet"
              description="When you add transfers or transport, your arrangements will appear here."
              buttonText="Book Transportation"
              buttonHref="/transportation"
            />
          );
        }
        return (
          <div className={styles.bookingsList}>
            {mockTransportBookings.map((booking, index) => (
              <TripBookingCard key={`transport-booking-${index}`} {...booking} />
            ))}
          </div>
        );
      case "requests":
        if (requestCategoryIndex === 0) {
          if (mockPlanYourTripRequests.length === 0) {
            return (
              <EmptyState
                framedIcon
                iconSrc="/images/profile/glyphs/requests.svg"
                iconWidth={150}
                iconHeight={150}
                title="No custom trip requests yet"
                description="Use our Plan Your Trip planner to build your custom itinerary and get a proposal."
                buttonText="Plan your trip"
                buttonHref="/plan-your-trip"
              />
            );
          }
          return (
            <div className={styles.bookingsList}>
              {mockPlanYourTripRequests.map((request, index) => (
                <TripBookingCard key={`plan-your-trip-request-${index}`} {...request} />
              ))}
            </div>
          );
        }
        if (requestCategoryIndex === 1) {
          if (mockMiceRequests.length === 0) {
            return (
              <EmptyState
                framedIcon
                iconSrc="/images/profile/glyphs/requests.svg"
                iconWidth={150}
                iconHeight={150}
                title="No MICE requests yet"
                description="Create your first event or corporate experience and get a tailored proposal."
                buttonText="Request a proposal"
                buttonHref="/events/request-proposal"
              />
            );
          }
          return (
            <div className={styles.bookingsList}>
              {mockMiceRequests.map((request, index) => (
                <TripBookingCard key={`mice-request-${index}`} {...request} />
              ))}
            </div>
          );
        }
        if (mockB2BRequests.length === 0) {
          return (
            <EmptyState
              framedIcon
              iconSrc="/images/profile/glyphs/requests.svg"
              iconWidth={150}
              iconHeight={150}
              title="No business requests yet"
              description="Partner with us to create tailored travel experiences for your company."
              buttonText="Request a proposal"
              buttonHref="/b2b-programs/request-proposal"
            />
          );
        }
        return (
          <div className={styles.bookingsList}>
            {mockB2BRequests.map((request, index) => (
              <TripBookingCard key={`b2b-request-${index}`} {...request} />
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
        {/* Premium Banner - Upcoming Trip */}
        <UpcomingTripBanner trip={mockUpcomingTrip} />

        {/* Main Layout */}
        <div className={styles.mainLayout}>
          {/* Sidebar Column */}
          <div className={styles.sidebarColumn}>
            <ProfileSidebar
              user={mockProfileUser}
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

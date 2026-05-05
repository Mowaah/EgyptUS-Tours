"use client";

import { useCallback, useMemo, useState } from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import {
  PageHeader,
  TripCard,
  TripBookingCard,
  UpcomingTripBanner,
  ProfileSidebar,
  EmptyState,
  CategoryTabs,
} from "@/components/shared";
import type { TabType } from "@/components/shared";
import { Trip } from "@/types";
import {
  mockProfileUser,
  mockUpcomingTrip,
  mockFavoriteTrips,
  profileBookingCategoryTabs,
  mockTripBookings,
  mockHotelBookings,
  mockTransportBookings,
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
  const [requests] = useState<Trip[]>([]);
  const [bookingCategoryIndex, setBookingCategoryIndex] = useState(0);

  const handleFavoriteToggle = (id: string) => {
    setFavoriteTrips((prev) =>
      prev.map((trip) =>
        trip.id === id ? { ...trip, isFavorite: !trip.isFavorite } : trip
      )
    );
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "favorites":
        if (favoriteTrips.length === 0) {
          return (
            <EmptyState
              framedIcon
              iconSrc="/images/profile/glyphs/heart.svg"
              iconWidth={150}
              iconHeight={150}
              title="Your favorites list is empty"
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
                onFavoriteToggle={handleFavoriteToggle}
              />
            ))}
          </div>
        );
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
        if (requests.length === 0) {
          return (
            <EmptyState
              framedIcon
              iconSrc="/images/profile/glyphs/requests.svg"
              iconWidth={150}
              iconHeight={150}
              title="No trip requests yet"
              description="Tell us what you're looking for and we'll follow up with a tailored proposal."
              buttonText="Explore Trips"
              buttonHref="/trips"
            />
          );
        }
        return null;
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
        return "All your favorite trips in one place";
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
          { label: "Home", href: "/" },
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
            {activeTab === "bookings" ? (
              <div className={styles.contentHeaderBookings}>
                <div className={styles.contentHeaderText}>
                  <h2 className={styles.contentTitle}>{getTabTitle()}</h2>
                  <p className={styles.contentSubtitle}>{getTabSubtitle()}</p>
                </div>
                <CategoryTabs
                  tabs={profileBookingCategoryTabs}
                  active={bookingCategoryIndex}
                  onTabChange={(_, index) => setBookingCategoryIndex(index)}
                  className={styles.bookingCategoryTabs}
                />
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

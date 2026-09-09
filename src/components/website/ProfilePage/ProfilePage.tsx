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
import { getFavoriteTrips, getFavoriteHotels, getProfileRequests, getProfileSummary, getProfileBookings, getPaymentReceipt, getFullImageUrl } from "@/lib/api";
import { getAllHotels } from "@/services/hotelsService";
import { getStatusConfig } from "@/utils/statusUtils";
import type { MultiCurrencyPrice } from "@/constants/currency";
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
              currency: t.currency_code,
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
              currency: h.currency_code,
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
                website: req.details?.website?.trim() ? req.details.website : "-",
              };
            }

            const rawStatus = req.display_status || req.request_status || req.status || "new";
            const statusConfig = getStatusConfig(rawStatus);
            const normStatus = (rawStatus || "").toLowerCase().replace(/[-_]/g, " ").trim();

            let defaultInfoMessage = t("profile.card.proposalExpected", "Proposal expected within 24-48 hrs");
            if (normStatus === "in trip" || normStatus === "on trip") {
              defaultInfoMessage = t("profile.card.tripInProgress", "Your trip is in progress");
            } else if (normStatus === "in stay") {
              defaultInfoMessage = t("profile.card.stayInProgress", "Your stay is in progress");
            } else if (normStatus === "in transit") {
              defaultInfoMessage = t("profile.card.transitInProgress", "Your transit is in progress");
            } else if (normStatus === "completed") {
              defaultInfoMessage = t("profile.card.tripCompleted", "Trip Completed");
            } else if (normStatus === "rejected") {
              defaultInfoMessage = t("profile.card.rejectedByAdmin", "Request Rejected");
            } else if (normStatus === "proposal ready") {
              defaultInfoMessage = t("profile.card.proposalReady", "Proposal Ready");
            } else if (normStatus === "proposal sent") {
              defaultInfoMessage = t("profile.card.proposalSent", "Proposal Sent");
            } else if (normStatus === "proposal in progress") {
              defaultInfoMessage = t("profile.card.proposalInProgress", "Proposal In progress");
            } else if (normStatus === "refund in progress" || normStatus === "refund_in_progress") {
              defaultInfoMessage = t("profile.card.refundInProgress", "Refund in Progress");
            } else if (normStatus === "refunded" || normStatus === "refund completed" || normStatus === "refund_completed") {
              defaultInfoMessage = t("profile.card.refundCompleted", "Refund Completed");
            }

            let cardTitle = req.title || "";
            if (req.type === "events") {
              cardTitle =
                req.request_code ||
                (req.title && req.title.startsWith("MICE-") ? req.title : "") ||
                (req.id ? `MICE-${String(req.id).padStart(6, "0")}` : req.title || "");
            } else if (req.type === "b2b") {
              cardTitle =
                req.request_code ||
                (req.title && req.title.startsWith("B2B-") ? req.title : "") ||
                (req.id ? `B2B-${String(req.id).padStart(6, "0")}` : req.title || "");
            } else if (req.type === "plan_your_trip") {
              cardTitle =
                req.request_code ||
                (req.title && req.title.startsWith("CTP-") ? req.title : "") ||
                (req.id ? `CTP-${String(req.id).padStart(6, "0")}` : req.title || "");
            }

            return {
              variant: (req.type === "events" ? "mice" : req.type) as any,
              showImage: false,
              tripTitle: cardTitle,
              status: rawStatus as any,
              statusLabel: statusConfig.label,
              statusVariant: statusConfig.variant,
              infoMessage: req.info_message || defaultInfoMessage,
              details: mappedDetails as any,
              primaryLabel: t("buttons.viewDetails", "View Details"),
              primaryHref: `/profile/requests-details?type=${req.type}&id=${req.id}&status=${rawStatus}`,
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
          const [tripData, hotelData, transportData, allHotels] = await Promise.all([
            getProfileBookings("trip"),
            getProfileBookings("hotel"),
            getProfileBookings("transport"),
            getAllHotels().catch(() => []),
          ]);

          const mapBooking = (bk: any, type: string, defaultImage: string): TripBookingCardProps => {
            let mappedDetails: any = {};
            const d = bk.details || {};

            const computeRoomExtraCount = (): number | undefined => {
              if (typeof d.room_extra_count === "number" && d.room_extra_count > 0) {
                return d.room_extra_count;
              }
              const roomOverview = d.room_overview || bk.room_overview || bk.price_breakdown?.room_overview;
              if (Array.isArray(roomOverview) && roomOverview.length > 0) {
                const totalRooms = roomOverview.reduce(
                  (acc: number, it: any) => acc + (parseInt(String(it.quantity || it.count || 1), 10) || 1),
                  0
                );
                return totalRooms > 1 ? totalRooms - 1 : undefined;
              }
              if (bk.rooms && typeof bk.rooms === "object") {
                const totalRooms = (bk.rooms.single || 0) + (bk.rooms.double || 0) + (bk.rooms.triple || 0);
                if (totalRooms > 1) return totalRooms - 1;
              }
              if (d.room_number) {
                const match = String(d.room_number).match(/(\d+)/);
                if (match) {
                  const count = parseInt(match[1], 10);
                  if (count > 1) return count - 1;
                }
              }
              return undefined;
            };

            const roomExtraCount = computeRoomExtraCount();

            if (type === "trip") {
              const rawTourType = (
                d.tour_type ||
                bk.tour_type ||
                d.travel_type ||
                ""
              ).toLowerCase().trim();

              let travelType = d.travel_type || "";
              if (rawTourType.includes("group")) {
                travelType = t("profile.card.group", "Group");
              } else if (rawTourType.includes("private") || travelType.toLowerCase() === "tour") {
                travelType = t("profile.card.private", "Private");
              }

              mappedDetails = {
                tripName: d.trip_name || bk.title || "",
                destination: d.destination || bk.destination || "",
                departureDate: d.departure_date || "",
                returnDate: d.return_date || "",
                travelType,
                durationLabel: d.duration_label || "",
                roomType: d.room_type || "",
                roomExtraCount,
                travelersLabel: d.travelers_label || "",
              };
            } else if (type === "hotel") {
              const rawRoomType = (d.room_type || bk.room_type || "").trim();
              let resolvedRoomType = rawRoomType;

              const isInvalidRoomType =
                !resolvedRoomType ||
                resolvedRoomType.toLowerCase() === "any" ||
                resolvedRoomType.toLowerCase() === "none";

              if (isInvalidRoomType) {
                const roomOverview = d.room_overview || bk.room_overview || bk.price_breakdown?.room_overview;
                if (Array.isArray(roomOverview) && roomOverview.length > 0) {
                  const first = roomOverview[0];
                  resolvedRoomType =
                    first.type_label ||
                    first.room_name ||
                    first.room_type ||
                    first.name ||
                    first.category_label ||
                    "";
                }
                if (!resolvedRoomType && bk.rooms && typeof bk.rooms === "object") {
                  if (bk.rooms.double > 0) resolvedRoomType = "Double Room";
                  else if (bk.rooms.single > 0) resolvedRoomType = "Single Room";
                  else if (bk.rooms.triple > 0) resolvedRoomType = "Triple Room";
                }
                if (!resolvedRoomType && d.room_category) {
                  resolvedRoomType = `${d.room_category} Room`;
                }
                if (!resolvedRoomType) {
                  resolvedRoomType = "Standard Room";
                }
              }

              const lower = resolvedRoomType.toLowerCase();
              if (lower === "double" || lower === "single" || lower === "triple") {
                resolvedRoomType = `${resolvedRoomType.charAt(0).toUpperCase() + resolvedRoomType.slice(1)} Room`;
              }

              let resolvedRoomNumber = d.room_number || bk.room_number || "";
              if (!resolvedRoomNumber || resolvedRoomNumber === "0 Rooms" || resolvedRoomNumber.startsWith("0 ")) {
                const totalRooms =
                  (typeof d.room_extra_count === "number" && d.room_extra_count >= 0 ? d.room_extra_count + 1 : undefined) ||
                  (roomExtraCount != null ? roomExtraCount + 1 : undefined) ||
                  1;
                resolvedRoomNumber = totalRooms === 1 ? `1 ${t("units.room", "Room")}` : `${totalRooms} ${t("units.rooms", "Rooms")}`;
              }

              mappedDetails = {
                checkIn: d.check_in || "",
                checkOut: d.check_out || "",
                nights: d.nights || "",
                roomType: resolvedRoomType,
                roomExtraCount,
                roomNumber: resolvedRoomNumber,
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
            const reqStatus = (bk.request_status || bk.status || "confirmed").toLowerCase();
            const opStatus = bk.operational_status?.toLowerCase();
            const remStatus = bk.remaining_payment_status?.toLowerCase();

            const isCancelled = reqStatus === "cancelled" || reqStatus === "canceled" || opStatus === "cancelled" || opStatus === "canceled";
            const isRejected = reqStatus === "rejected";
            const isFullyPaid =
              remStatus === "paid" ||
              bk.payment_status === "paid" ||
              bk.payment_summary?.payment_status === "paid" ||
              bk.payment_summary?.remaining_amount === "0.00" ||
              bk.remaining_amount === "0.00";
            const isPartiallyPaid = !isFullyPaid && (reqStatus === "partially_paid" || remStatus === "pending" || bk.status === "partially_paid");

            const isRefundInProgress = opStatus === "refund_in_progress" || reqStatus === "refund_in_progress" || bk.status === "refund_in_progress";
            const isRefunded = opStatus === "refunded" || reqStatus === "refunded" || bk.status === "refunded";

            let cardStatus = "confirmed";
            let cardStatusLabel = t("profile.status.confirmed", "Confirmed");
            let cardStatusVariant: any = "green";

            if (isRefunded) {
              cardStatus = "refunded";
              cardStatusLabel = t("profile.card.refundCompleted", "Refund Completed");
              cardStatusVariant = "darkBlue";
            } else if (isRefundInProgress) {
              cardStatus = "refund_in_progress";
              cardStatusLabel = t("profile.card.refundInProgress", "Refund in Progress");
              cardStatusVariant = "darkBlue";
            } else if (isCancelled) {
              cardStatus = "cancelled";
              cardStatusLabel = t("profile.status.cancelled", "Cancelled");
              cardStatusVariant = "redSoft";
            } else if (isRejected) {
              cardStatus = "rejected";
              cardStatusLabel = t("profile.status.rejected", "Rejected");
              cardStatusVariant = "redSoft";
            } else if (isPartiallyPaid) {
              cardStatus = "partially_paid";
              cardStatusLabel = t("profile.status.partiallyPaid", "Partially Paid");
              cardStatusVariant = "orange";
            } else {
              cardStatus = "confirmed";
              cardStatusLabel = t("profile.status.confirmed", "Confirmed");
              cardStatusVariant = "green";
            }

            let primaryLabel = t("buttons.viewDetails", "View Details");
            if (isPartiallyPaid && !isCancelled && !isRejected && !isRefundInProgress && !isRefunded) {
              primaryLabel = t("profile.card.completePayment", "Complete Payment");
            }

            const payment = bk.payment_summary || {};
            const totalVal = bk.total_amount ?? payment.total_amount ?? bk.price;
            const paidVal = bk.paid_amount ?? payment.paid_amount;
            const remainingVal = bk.remaining_amount ?? payment.remaining_amount;

            const totalNum = totalVal != null ? parseFloat(String(totalVal)) : undefined;
            const rawPaidNum = paidVal != null ? parseFloat(String(paidVal)) : undefined;
            const rawRemainingNum = remainingVal != null ? parseFloat(String(remainingVal)) : undefined;

            let paidNum = rawPaidNum;
            let remainingNum = rawRemainingNum;

            if (isPartiallyPaid) {
              if (paidNum == null || paidNum <= 0) {
                paidNum = totalNum ? Math.round(totalNum * 0.3 * 100) / 100 : 0;
              }
              if (remainingNum == null || remainingNum <= 0) {
                remainingNum = totalNum && paidNum != null ? Math.max(0, Math.round((totalNum - paidNum) * 100) / 100) : 0;
              }
            } else if (isFullyPaid) {
              paidNum = totalNum;
              remainingNum = 0;
            }

            const activeTimer =
              !isCancelled && !isRejected && !isRefundInProgress && !isRefunded && bk.timer_label
                ? bk.timer_label
                : undefined;

            // Drive the pill from operational status when available,
            // but keep `status` = cardStatus so footer logic ("Fully Paid" vs "Paid • Remaining") works correctly.
            let pillLabel = cardStatusLabel;
            let pillVariant = cardStatusVariant;

            if (isRefunded) {
              const opConfig = getStatusConfig("refunded");
              pillLabel = opConfig.label;
              pillVariant = opConfig.variant;
            } else if (isRefundInProgress) {
              const opConfig = getStatusConfig("refund_in_progress");
              pillLabel = opConfig.label;
              pillVariant = opConfig.variant;
            } else if (!isCancelled && !isRejected && opStatus && opStatus !== reqStatus) {
              const opConfig = getStatusConfig(opStatus);
              pillLabel = opConfig.label;
              pillVariant = opConfig.variant;
            }

            let secondaryLabel: string | undefined;
            let secondaryVariant: any = undefined;
            let secondaryIconType: any = undefined;

            if (!isCancelled && !isRejected && remStatus && remStatus !== "paid") {
              const remConfig = getStatusConfig(remStatus);
              secondaryLabel = remConfig.label;
              secondaryVariant = remConfig.variant;
              secondaryIconType = remConfig.iconType;
            }

            const bookingCurrency = (
              bk.currency ||
              bk.currency_code ||
              payment.currency_code ||
              payment.currency ||
              "USD"
            ).toUpperCase();

            const isEgp = bookingCurrency === "EGP" || bookingCurrency === "£";
            const isEur = bookingCurrency === "EUR" || bookingCurrency === "€";

            const toMultiPrice = (amt?: number): MultiCurrencyPrice | undefined => {
              if (amt == null || isNaN(amt)) return undefined;
              if (isEgp) return { egp: amt };
              if (isEur) return { eur: amt };
              return { usd: amt };
            };

            const actorLower = (bk.cancelled_by || "").toLowerCase();
            const reasonLower = (bk.cancellation_reason || bk.details?.cancellation_reason || "").toLowerCase();
            const rawCancelledLabel = (bk.cancelled_label || "").toLowerCase();
            const isUserCancelledStored =
              typeof window !== "undefined" &&
              (localStorage.getItem(`cancelled_by_user_${type}_${bk.id}`) === "true" ||
                localStorage.getItem(`cancelled_by_user_trip_${bk.id}`) === "true" ||
                localStorage.getItem(`cancelled_by_user_hotel_${bk.id}`) === "true" ||
                localStorage.getItem(`cancelled_by_user_transport_${bk.id}`) === "true");

            let cancelledBy: "user" | "admin" = "user";
            if (
              actorLower.includes("admin") ||
              actorLower.includes("egypt us") ||
              actorLower.includes("egyptus") ||
              rawCancelledLabel.includes("egypt us") ||
              rawCancelledLabel.includes("admin") ||
              reasonLower.includes("[admin]") ||
              reasonLower.includes("by admin") ||
              reqStatus === "rejected" ||
              opStatus === "rejected"
            ) {
              cancelledBy = "admin";
            } else if (
              isUserCancelledStored ||
              actorLower.includes("user") ||
              actorLower.includes("customer") ||
              actorLower.includes("you") ||
              rawCancelledLabel.includes("you") ||
              reasonLower.includes("by customer")
            ) {
              cancelledBy = "user";
            }

            let resolvedImage = bk.image;
            if (type === "hotel") {
              const hotelName = (bk.title || bk.hotel_name || "").toLowerCase().trim();
              const matchedHotel = (allHotels || []).find(
                (h: any) =>
                  h.name?.toLowerCase().trim() === hotelName ||
                  (bk.details?.hotel_slug && h.slug === bk.details.hotel_slug) ||
                  (bk.details?.hotel_id && String(h.id) === String(bk.details.hotel_id))
              );
              if (matchedHotel?.hero_image && !matchedHotel.hero_image.includes("legacy-hero")) {
                resolvedImage = matchedHotel.hero_image;
              } else if (!resolvedImage || resolvedImage.includes("legacy-hero")) {
                resolvedImage = defaultImage;
              }
            } else if (!resolvedImage || resolvedImage.includes("legacy-hero")) {
              resolvedImage = defaultImage;
            }

            resolvedImage = getFullImageUrl(resolvedImage) || defaultImage;

            return {
              variant: type as any,
              imageSrc: resolvedImage,
              tripTitle: bk.title || bk.hotel_name || bk.vehicle_name || "",
              status: cardStatus,
              statusLabel: pillLabel,
              statusVariant: pillVariant,
              secondaryStatusLabel: secondaryLabel,
              secondaryStatusVariant: secondaryVariant,
              secondaryStatusIconType: secondaryIconType,
              timerLabel: activeTimer,
              paidAmount: toMultiPrice(paidNum),
              remainingAmount: toMultiPrice(remainingNum),
              totalAmount: toMultiPrice(totalNum),
              currency: bookingCurrency,
              cancelledLabel: bk.cancelled_label,
              cancelledBy,
              infoMessage: "",
              details: mappedDetails,
              primaryLabel,
              primaryHref: `/profile/bookings-details?type=${type}&id=${bk.id}&status=${cardStatus}`,
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
          primaryButtonText="View Booking"
          buttonText="Back to Home"
          onPrimaryClick={() => {
            setShowSuccessModal(false);
            const targetId = (receiptData as any)?.booking_id || searchParams.get("booking_id");
            if (targetId) {
              router.replace(`/profile/bookings-details?id=${targetId}&type=${(receiptData as any)?.booking_type || "trip"}`);
            } else {
              router.replace("/profile?tab=bookings", { scroll: false });
            }
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

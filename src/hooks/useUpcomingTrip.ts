"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { getProfileBookings } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import { parseDate, formatDateRange } from "@/utils/dateFormat";
import type { UpcomingTrip } from "@/components/shared";

interface BookingCandidate {
  raw: Record<string, any>;
  targetDate: Date;
  endDate: Date | null;
}

const INACTIVE_STATUSES = new Set([
  "cancelled",
  "canceled",
  "rejected",
  "refunded",
  "refund_in_progress",
  "completed",
  "expired",
]);

export interface UseUpcomingTripOptions {
  existingBookings?: Record<string, any>[];
}

export interface UseUpcomingTripReturn {
  upcomingTrip: UpcomingTrip | null;
  isLoading: boolean;
  refresh: () => Promise<void>;
}

export function useUpcomingTrip(options?: UseUpcomingTripOptions): UseUpcomingTripReturn {
  const { isAuthenticated } = useAuth();
  const [bookings, setBookings] = useState<Record<string, any>[]>(options?.existingBookings || []);
  const [isLoading, setIsLoading] = useState(false);

  // Sync if external bookings are provided
  useEffect(() => {
    if (options?.existingBookings && options.existingBookings.length > 0) {
      setBookings(options.existingBookings);
    }
  }, [options?.existingBookings]);

  const fetchTripBookings = useCallback(async () => {
    if (!isAuthenticated) {
      setBookings([]);
      return;
    }

    setIsLoading(true);
    try {
      const data = await getProfileBookings("trip");
      setBookings(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to fetch upcoming trip bookings:", error);
      setBookings([]);
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  // Fetch only if external bookings were not supplied
  useEffect(() => {
    if (isAuthenticated && (!options?.existingBookings || options.existingBookings.length === 0)) {
      fetchTripBookings();
    }
  }, [isAuthenticated, fetchTripBookings, options?.existingBookings]);

  const upcomingTrip = useMemo<UpcomingTrip | null>(() => {
    if (!bookings || bookings.length === 0) return null;

    const now = new Date().getTime();
    const candidates: BookingCandidate[] = [];

    for (const bk of bookings) {
      const rawStatus = (
        bk.operational_status ||
        bk.display_status ||
        bk.status ||
        ""
      ).toLowerCase().trim();

      if (INACTIVE_STATUSES.has(rawStatus)) {
        continue;
      }

      const startStr =
        bk.start_date ||
        bk.departure_date ||
        bk.details?.departure_date ||
        bk.check_in_date;

      if (!startStr) continue;

      const targetDate = parseDate(startStr);
      if (!targetDate || isNaN(targetDate.getTime())) continue;

      // Only consider trips starting in the future
      if (targetDate.getTime() <= now) continue;

      const endStr =
        bk.end_date ||
        bk.return_date ||
        bk.details?.return_date ||
        bk.check_out_date;
      const endDate = endStr ? parseDate(endStr) : null;

      candidates.push({
        raw: bk,
        targetDate,
        endDate,
      });
    }

    if (candidates.length === 0) return null;

    // Sort ascending by departure date to get the nearest upcoming trip
    candidates.sort((a, b) => a.targetDate.getTime() - b.targetDate.getTime());
    const nearest = candidates[0];
    const bk = nearest.raw;

    const title =
      bk.trip_title ||
      bk.title ||
      bk.details?.trip_name ||
      bk.trip?.title ||
      "Upcoming Trip";

    const startStr =
      bk.start_date ||
      bk.departure_date ||
      bk.details?.departure_date ||
      bk.check_in_date;

    const endStr =
      bk.end_date ||
      bk.return_date ||
      bk.details?.return_date ||
      bk.check_out_date;

    const dates = formatDateRange(startStr, endStr, "");

    let duration = bk.duration_label || bk.details?.duration_label || "";
    if (!duration && bk.duration_days) {
      duration = bk.duration_days === 1 ? "1 Day" : `${bk.duration_days} Days`;
    } else if (!duration && nearest.endDate) {
      const diffDays = Math.max(
        1,
        Math.round((nearest.endDate.getTime() - nearest.targetDate.getTime()) / (1000 * 60 * 60 * 24))
      );
      duration = diffDays === 1 ? "1 Day" : `${diffDays} Days`;
    }

    const rawTourType = (
      bk.details?.tour_type ||
      bk.tour_type ||
      bk.details?.travel_type ||
      bk.travel_type ||
      ""
    ).toLowerCase().trim();

    let type = "Private Tour";
    if (rawTourType.includes("group")) {
      type = "Group Tour";
    } else if (rawTourType.includes("private")) {
      type = "Private Tour";
    } else if (rawTourType) {
      type = rawTourType.charAt(0).toUpperCase() + rawTourType.slice(1);
      if (!type.toLowerCase().includes("tour")) {
        type = `${type} Tour`;
      }
    }

    const bookingId = bk.id || bk.booking_id;
    const href = bookingId ? `/profile/bookings-details?id=${bookingId}&type=trip` : undefined;

    return {
      title,
      dates,
      duration,
      type,
      targetDate: nearest.targetDate,
      href,
    };
  }, [bookings]);

  return {
    upcomingTrip,
    isLoading,
    refresh: fetchTripBookings,
  };
}

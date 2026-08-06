import { useState, useCallback, useMemo } from "react";
import useSWR from "swr";
import { getAdminUserReviews, getAdminTestimonials } from "@/services/admin/adminReviewsService";
import type { ReviewRow, AdminTestimonialRow, ReviewCategory, ReviewStatus } from "@/components/dashboard/Reviews/types";

export interface UseReviewsPanelParams {
  type: "user" | "admin";
  searchQuery: string;
  appliedFilters: {
    category: string;
    rating: string;
    state: string;
    date: string;
  };
  refreshTrigger?: number;
}

function formatDate(dateString: string) {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function mapCategory(backendCategory: string): ReviewCategory | "B2B" | "Mice" {
  switch (backendCategory?.toLowerCase()) {
    case "trip": return "Trips";
    case "hotel": return "Hotels";
    case "vehicle":
    case "transport": return "Transportation";
    case "b2b": return "B2B";
    case "mice": return "Mice";
    default: return "Trips";
  }
}

function isDateMatching(dateStr: string, filterValue: string): boolean {
  if (!filterValue || filterValue === "All") return true;
  if (!dateStr) return false;

  const itemDate = new Date(dateStr);
  if (isNaN(itemDate.getTime())) return dateStr === filterValue;

  const now = new Date();
  const itemDateOnly = new Date(itemDate.getFullYear(), itemDate.getMonth(), itemDate.getDate());
  const todayOnly = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  if (filterValue === "Today") {
    return itemDateOnly.getTime() === todayOnly.getTime();
  }

  if (filterValue === "Last 7 Days") {
    const sevenDaysAgo = new Date(todayOnly);
    sevenDaysAgo.setDate(todayOnly.getDate() - 7);
    return itemDateOnly >= sevenDaysAgo && itemDateOnly <= todayOnly;
  }

  if (filterValue === "Last 30 Days") {
    const thirtyDaysAgo = new Date(todayOnly);
    thirtyDaysAgo.setDate(todayOnly.getDate() - 30);
    return itemDateOnly >= thirtyDaysAgo && itemDateOnly <= todayOnly;
  }

  if (filterValue === "This Month") {
    return itemDateOnly.getMonth() === now.getMonth() && itemDateOnly.getFullYear() === now.getFullYear();
  }

  return dateStr === filterValue;
}

export function useReviewsPanel({ type, searchQuery, appliedFilters, refreshTrigger }: UseReviewsPanelParams) {
  const apiParams = useMemo(() => {
    const params: any = { limit: 1000, page_size: 1000 };
    
    if (searchQuery) params.search = searchQuery;
    
    if (appliedFilters.category && appliedFilters.category !== "All") {
      let cat = appliedFilters.category.toLowerCase();
      if (cat === "trips") cat = "trip";
      if (cat === "hotels") cat = "hotel";
      if (cat === "transportation") cat = type === "admin" ? "transport" : "vehicle";
      params.category = cat;
    }
    
    if (appliedFilters.rating && appliedFilters.rating !== "All") {
      params.rating = parseInt(appliedFilters.rating);
    }
    
    if (appliedFilters.state && appliedFilters.state !== "All") {
      if (type === "user") {
         params.moderation_status = appliedFilters.state === "Replied" ? "approved" : "pending";
      } else {
         params.status = appliedFilters.state === "Replied" ? "published" : "draft";
      }
    }
    return params;
  }, [type, searchQuery, appliedFilters]);

  const { data: res, isLoading: loading, mutate: refetch } = useSWR(
    [`adminReviews_${type}`, apiParams, refreshTrigger],
    async () => {
      if (type === "user") {
        return getAdminUserReviews(apiParams);
      } else {
        return getAdminTestimonials(apiParams);
      }
    },
    { keepPreviousData: true }
  );

  const data = useMemo(() => {
    if (!res?.results) return [];
    
    if (type === "user") {
      let mapped: ReviewRow[] = res.results.map((rev: any) => ({
        id: rev.review_number || `REV-${rev.id}`,
        originalId: rev.id,
        customer: rev.author_name,
        email: rev.author_email,
        category: mapCategory(rev.target_type) as ReviewCategory,
        title: rev.title || "No Title",
        body: rev.body,
        rating: Number(rev.rating) as any,
        date: formatDate(rev.review_date || rev.created_at),
        published: rev.is_featured,
        moderation_status: rev.moderation_status,
        status: (rev.moderation_status === "approved" ? "Replied" : "Pending") as ReviewStatus,
      }));

      if (appliedFilters.date && appliedFilters.date !== "All") {
        mapped = mapped.filter((item) => isDateMatching(item.date, appliedFilters.date));
      }
      return mapped;
    } else {
      let mapped: AdminTestimonialRow[] = res.results.map((rev: any) => ({
        id: rev.testimonial_number || `TST-${rev.id}`,
        originalId: rev.id,
        addedBy: rev.added_by?.user?.name || "Admin",
        customer: rev.customer_name,
        email: rev.added_by_email || "",
        country: rev.country || "EG",
        countryCode: (rev.country || "eg").toLowerCase(),
        video: !!rev.video_url,
        videoUrl: rev.video_url,
        category: mapCategory(rev.category),
        title: rev.title,
        body: rev.description,
        rating: Number(rev.rating) as any,
        date: formatDate(rev.created_at),
        published: rev.status === "published",
        status: (rev.status === "published" ? "Replied" : "Pending") as ReviewStatus,
      }));

      if (appliedFilters.date && appliedFilters.date !== "All") {
        mapped = mapped.filter((item) => isDateMatching(item.date, appliedFilters.date));
      }
      return mapped;
    }
  }, [res, type, appliedFilters.date]);

  return {
    data,
    loading,
    refresh: () => refetch()
  };
}

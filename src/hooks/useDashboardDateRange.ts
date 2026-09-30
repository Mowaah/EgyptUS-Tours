"use client";

import { useCallback, useMemo } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export interface DashboardDateRange {
  date_from?: string;
  date_to?: string;
  range?: string;
  hasActiveFilter: boolean;
  clearDateFilter: () => void;
}

function toIsoDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function useDashboardDateRange(): DashboardDateRange {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const range = searchParams.get("range") || "";
  const dateFrom = searchParams.get("date_from") || "";
  const dateTo = searchParams.get("date_to") || "";

  const clearDateFilter = useCallback(() => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("range");
    params.delete("date_from");
    params.delete("date_to");
    const query = params.toString();
    router.replace(query ? `${pathname}?${query}` : pathname);
  }, [pathname, router, searchParams]);

  return useMemo(() => {
    if (dateFrom || dateTo) {
      return {
        date_from: dateFrom || undefined,
        date_to: dateTo || undefined,
        range: range || undefined,
        hasActiveFilter: true,
        clearDateFilter,
      };
    }

    const today = new Date();
    const todayIso = toIsoDate(today);
    if (range === "today") {
      return { date_from: todayIso, date_to: todayIso, range, hasActiveFilter: true, clearDateFilter };
    }
    if (range === "this_week") {
      const start = new Date(today);
      start.setDate(today.getDate() - ((today.getDay() + 6) % 7));
      return { date_from: toIsoDate(start), date_to: todayIso, range, hasActiveFilter: true, clearDateFilter };
    }
    if (range === "this_month") {
      return {
        date_from: toIsoDate(new Date(today.getFullYear(), today.getMonth(), 1)),
        date_to: todayIso,
        range,
        hasActiveFilter: true,
        clearDateFilter,
      };
    }
    return { hasActiveFilter: false, clearDateFilter };
  }, [range, dateFrom, dateTo, clearDateFilter]);
}

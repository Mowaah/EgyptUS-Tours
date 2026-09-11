"use client";

import { useSearchParams } from "next/navigation";
import { useMemo } from "react";

export type FinanceDateRangeType = "today" | "this_week" | "this_month" | "custom";

export interface FinanceFilterParams {
  range?: FinanceDateRangeType;
  date_from?: string;
  date_to?: string;
}

function formatLocalDate(d: Date): string {
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

export function useFinanceFilter(): FinanceFilterParams {
  const searchParams = useSearchParams();

  return useMemo(() => {
    const range = searchParams.get("range") as FinanceDateRangeType | null;
    const date_from = searchParams.get("date_from") || undefined;
    const date_to = searchParams.get("date_to") || undefined;

    if (range === "today") {
      const today = formatLocalDate(new Date());
      return { range: "today", date_from: today, date_to: today };
    }

    if (range === "this_week") {
      const now = new Date();
      const day = now.getDay();
      const diffToMonday = day === 0 ? -6 : 1 - day;
      const monday = new Date(now.getFullYear(), now.getMonth(), now.getDate() + diffToMonday);
      return {
        range: "this_week",
        date_from: formatLocalDate(monday),
        date_to: formatLocalDate(now),
      };
    }

    if (range === "this_month") {
      const now = new Date();
      const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
      const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);
      return {
        range: "this_month",
        date_from: formatLocalDate(firstDay),
        date_to: formatLocalDate(lastDay),
      };
    }

    if (range === "custom" || date_from || date_to) {
      return {
        range: "custom",
        date_from,
        date_to,
      };
    }

    return {};
  }, [searchParams]);
}

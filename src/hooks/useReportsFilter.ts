import { useSearchParams } from "next/navigation";
import { useMemo } from "react";

export interface ReportsFilterParams {
  range?: string;
  date_from?: string;
  date_to?: string;
}

export function useReportsFilter(): ReportsFilterParams {
  const searchParams = useSearchParams();

  return useMemo(() => {
    const range = searchParams.get("range");
    const date_from = searchParams.get("date_from") || undefined;
    const date_to = searchParams.get("date_to") || undefined;

    if (range === "this_month") {
      return { range: "this_month" };
    }

    if (date_from && date_to) {
      return { range: "custom", date_from, date_to };
    }

    if (range === "custom" && (date_from || date_to)) {
      return {
        range: "custom",
        date_from: date_from || "2000-01-01",
        date_to: date_to || "2099-12-31",
      };
    }

    // Default: all-time
    return {
      range: "custom",
      date_from: "2000-01-01",
      date_to: "2099-12-31",
    };
  }, [searchParams]);
}

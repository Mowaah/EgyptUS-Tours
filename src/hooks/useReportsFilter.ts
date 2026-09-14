import { useSearchParams } from "next/navigation";
import { useMemo } from "react";

export interface ReportsFilterParams {
  range?: string;
  date_from?: string;
  date_to?: string;
}

function formatLocalDate(d: Date): string {
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

export function useReportsFilter(): ReportsFilterParams {
  const searchParams = useSearchParams();

  return useMemo(() => {
    const range = searchParams.get("range");
    const date_from = searchParams.get("date_from") || undefined;
    const date_to = searchParams.get("date_to") || undefined;
    const today = formatLocalDate(new Date());

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
        date_to: date_to || today,
      };
    }

    // Default: all-time through today (avoid sentinel years like 2099)
    return {
      range: "custom",
      date_from: "2000-01-01",
      date_to: today,
    };
  }, [searchParams]);
}

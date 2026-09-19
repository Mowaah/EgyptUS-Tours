import Image from "next/image";
import { SummaryCard } from "@/components/dashboard/SummaryCard";
import styles from "./CustomerOverview.module.scss";
import ServiceBreakdown from "../ServiceBreakdown/ServiceBreakdown";
import FavoriteDestinations from "../FavoriteDestinations/FavoriteDestinations";
import { useAdminCustomerOverview } from "@/hooks/useCustomers";

export default function CustomerOverview({ customerId }: { customerId: string }) {
  const { overview, isLoading } = useAdminCustomerOverview(customerId);

  if (isLoading) {
    return <div style={{ padding: 40, textAlign: "center" }}>Loading overview...</div>;
  }

  if (!overview) return null;

  // Service label mapping
  const serviceLabelMap: Record<string, string> = {
    trip: "Trips",
    hotel: "Hotels",
    transport: "Transportation",
    transportation: "Transportation",
    custom_trip: "Plan Your Trip",
    b2b: "B2B",
    b2b_proposal: "B2B",
    events: "MICE",
    event_proposal: "MICE",
  };

  // Most booked service logic
  let mostBookedService = "None";
  if (Array.isArray(overview.service_breakdown)) {
    const sorted = [...overview.service_breakdown]
      .filter((item: any) => Number(item.bookings_count || item.count || 0) > 0)
      .sort((a: any, b: any) => Number(b.bookings_count || b.count || 0) - Number(a.bookings_count || a.count || 0));
    if (sorted.length > 0) {
      const firstItem = sorted[0] as any;
      const key = (firstItem.service || firstItem.name || "").toLowerCase();
      mostBookedService = serviceLabelMap[key] || firstItem.service || "None";
    }
  } else if (overview.service_breakdown && typeof overview.service_breakdown === "object") {
    const sorted = Object.entries(overview.service_breakdown)
      .filter(([_, val]) => Number(val || 0) > 0)
      .sort((a, b) => Number(b[1]) - Number(a[1]));
    if (sorted.length > 0) {
      const key = sorted[0][0].toLowerCase();
      mostBookedService = serviceLabelMap[key] || sorted[0][0];
    }
  }

  // Total spent logic
  let totalSpentUsd = 0;
  if (overview.total_spent !== undefined && overview.total_spent !== null) {
    totalSpentUsd = typeof overview.total_spent === "number"
      ? overview.total_spent
      : parseFloat(String(overview.total_spent)) || 0;
  } else if (Array.isArray(overview.total_spent_by_currency)) {
    const usdItem = overview.total_spent_by_currency.find(
      (c: any) => c.currency?.toUpperCase() === "USD"
    );
    if (usdItem) {
      totalSpentUsd = parseFloat(String(usdItem.amount_usd || usdItem.amount || "0")) || 0;
    } else if (overview.total_spent_by_currency.length > 0) {
      const first = overview.total_spent_by_currency[0] as any;
      totalSpentUsd = parseFloat(String(first.amount_usd || first.amount || "0")) || 0;
    }
  } else if (overview.total_spent_by_currency && typeof overview.total_spent_by_currency === "object") {
    totalSpentUsd = parseFloat(String((overview.total_spent_by_currency as any).USD || "0")) || 0;
  }

  const formattedTotalSpent = Math.round(totalSpentUsd).toLocaleString("en-US", {
    maximumFractionDigits: 0,
  });

  return (
    <div className={styles.overviewContainer}>
      <div className={styles.metricsGrid}>

        <SummaryCard
          label="Total Bookings"
          value={overview.bookings_count.toString()}
          change=""
          trend="up"
          tone="blue"
          iconSrc="/images/dashboard/customers/overview/total.svg"
        />

        <SummaryCard
          label="Total Spent (USD)"
          value={`$${formattedTotalSpent}`}
          change=""
          trend="up"
          tone="pink"
          iconSrc="/images/dashboard/customers/overview/total-spent.svg"
        />

        <SummaryCard
          label="Most Booked Service"
          value={mostBookedService}
          change=""
          tone="gray"
          iconSrc="/images/dashboard/customers/overview/most.svg"
          customBadgeIcon={<Image src="/images/calendar.svg" alt="" width={12} height={12} aria-hidden />}
        />

        <SummaryCard
          label="Last Activity"
          value={overview.last_activity_at ? new Date(overview.last_activity_at).getFullYear().toString() : "Never"}
          change=""
          tone="green"
          iconSrc="/images/dashboard/customers/overview/customer.svg"
        />
      </div>

      <div className={styles.chartsGrid}>
        <ServiceBreakdown data={overview.service_breakdown || {}} />
        <FavoriteDestinations data={overview.destinations_breakdown || {}} />
      </div>
    </div>
  );
}

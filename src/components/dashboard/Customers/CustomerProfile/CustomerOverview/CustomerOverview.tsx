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

  // Most booked service logic
  const mostBooked = Object.entries(overview.service_breakdown || {}).sort((a, b) => b[1] - a[1])[0];
  const mostBookedService = mostBooked ? mostBooked[0] : "None";

  // Total spent logic
  const totalSpentUsd = overview.total_spent_by_currency?.USD || 0;

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
          value={`$${Number(totalSpentUsd).toFixed(2)}`}
          change=""
          trend="up"
          tone="pink"
          iconSrc="/images/dashboard/customers/overview/total-spent.svg"
        />

        <SummaryCard
          label="Most Booked Service"
          value={mostBookedService.charAt(0).toUpperCase() + mostBookedService.slice(1).toLowerCase()}
          change=""
          tone="gray"
          iconSrc="/images/dashboard/customers/overview/most.svg"
          customBadgeIcon={<Image src="/images/calendar.svg" alt="" width={12} height={12} aria-hidden />}
        />

        <SummaryCard
          label="Last Activity"
          value={overview.last_activity_at ? new Date(overview.last_activity_at).toLocaleDateString() : "Never"}
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

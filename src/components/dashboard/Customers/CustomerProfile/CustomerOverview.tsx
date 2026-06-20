import Image from "next/image";
import { SummaryCard } from "@/components/dashboard/SummaryCard";
import styles from "./CustomerOverview.module.scss";
import ServiceBreakdown from "./ServiceBreakdown";
import FavoriteDestinations from "./FavoriteDestinations";

export default function CustomerOverview() {
  return (
    <div className={styles.overviewContainer}>
      <div className={styles.metricsGrid}>

        <SummaryCard
          label="Total Bookings"
          value="1,284"
          change="+8.2%"
          trend="up"
          tone="blue"
          iconSrc="/images/dashboard/customers/overview/total.svg"
        />

        <SummaryCard
          label="Total Spent"
          value="$5,600"
          change="-5.1%"
          trend="down"
          tone="pink"
          iconSrc="/images/dashboard/customers/overview/total-spent.svg"
        />

        <SummaryCard
          label="Most Booked Service"
          value="Hotel"
          change="Since Mar 15, 2024"
          tone="gray"
          iconSrc="/images/dashboard/customers/overview/most.svg"
          customBadgeIcon={<Image src="/images/calendar.svg" alt="" width={12} height={12} aria-hidden />}
        />

        <SummaryCard
          label="Customer Since"
          value="2025"
          tone="green"
          iconSrc="/images/dashboard/customers/overview/customer.svg"
        />
      </div>

      <div className={styles.chartsGrid}>
        <ServiceBreakdown />
        <FavoriteDestinations />
      </div>
    </div>
  );
}

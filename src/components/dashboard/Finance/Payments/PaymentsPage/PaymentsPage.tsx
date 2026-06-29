"use client";

import Image from "next/image";
import DashboardNavbar from "@/components/dashboard/Navbar/DashboardNavbar";
import { SummaryCard } from "@/components/dashboard/SummaryCard";
import PaymentsTable from "../PaymentsTable/PaymentsTable";
import RevenueByCategory from "../RevenueByCategory/RevenueByCategory";
import RevenueByDestination from "../RevenueByDestination/RevenueByDestination";
import { mockPayments } from "../mockPayments";
import pageStyles from "@/app/(dashboard)/dashboard/page.module.scss";
import styles from "./PaymentsPage.module.scss";

export default function PaymentsPage() {
  return (
    <>
      
      
        <DashboardNavbar
          breadcrumbTrail={[
            { label: "Finance", href: "/dashboard/finance/payments" },
            { label: "Payments" },
          ]}
          title="Payments"
          subtitle="Track and manage all payment transactions."
          searchPlaceholder="Search Customer, Booking ID, Payment ID"
          primaryAction={{
            label: "Export Report",
            iconSrc: "/images/dashboard/export2.svg"
          }}
        />

        <div className={styles.metricsGrid}>
          <SummaryCard
            label="Total Revenue (MTD)"
            value="$ 284,50"
            change="+8.2%"
            trend="up"
            tone="green"
            iconSrc="/images/dashboard/finance/payment/total.svg"
          />
          <SummaryCard
            label="Total Transactions"
            value="$38,200"
            change="+8.2%"
            trend="up"
            tone="orange"
            iconSrc="/images/dashboard/finance/payment/total_transaction.svg"
          />
          <SummaryCard
            label="Refunded Amount"
            value="$4,200"
            change="-5.1%"
            trend="down"
            tone="gray"
            iconSrc="/images/dashboard/finance/payment/refunded.svg"
          />
          <SummaryCard
            label="Revenue Growth %"
            value="70%"
            change="+8.2%"
            trend="up"
            tone="pink"
            iconSrc="/images/dashboard/finance/payment/chart.svg"
          />
        </div>

        <div className={styles.chartsGrid}>
          <RevenueByDestination />
          <RevenueByCategory />
        </div>

        <PaymentsTable />
      
    </>
  );
}

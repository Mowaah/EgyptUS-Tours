"use client";

import DashboardNavbar from "@/components/dashboard/Navbar/DashboardNavbar";
import { SummaryCard } from "@/components/dashboard/SummaryCard";
import DepositsTable from "../DepositsTable/DepositsTable";
import DepositStatusDonut from "../DepositStatusDonut/DepositStatusDonut";
import OverdueDepositsChart from "../OverdueDepositsChart/OverdueDepositsChart";
import { mockDeposits } from "../mockDeposits";
import pageStyles from "@/app/(dashboard)/dashboard/page.module.scss";
import styles from "./DepositsPage.module.scss";

export default function DepositsPage() {
  return (
    <>
      
      
        <DashboardNavbar
          breadcrumbTrail={[
            { label: "Finance", href: "/dashboard/finance/deposits" },
            { label: "Deposits" },
          ]}
          title="Deposits"
          subtitle="Track deposit status for all bookings (30% policy)."
          searchPlaceholder="Search Customer, Booking ID, Payment ID"
          primaryAction={{
            label: "Export Report",
            iconSrc: "/images/dashboard/export2.svg"
          }}
        />

        <div className={styles.metricsGrid}>
          <SummaryCard
            label="Total Deposits Expected"
            value="$ 284,50"
            change="+8.2%"
            trend="up"
            tone="green"
            iconSrc="/images/dashboard/finance/payment/total.svg"
          />
          <SummaryCard
            label="Collected Deposits"
            value="$38,200"
            change="+8.2%"
            trend="up"
            tone="orange"
            iconSrc="/images/dashboard/finance/payment/total_transaction.svg"
          />
          <SummaryCard
            label="Pending"
            value="$38,200"
            change="-5.1%"
            trend="down"
            tone="pink"
            iconSrc="/images/dashboard/finance/payment/money.svg"
          />
          <SummaryCard
            label="Overdue"
            value="$4,200"
            change="-5.1%"
            trend="down"
            tone="gray"
            iconSrc="/images/dashboard/finance/payment/refunded.svg"
          />
        </div>

        <div className={styles.chartsGrid}>
          <OverdueDepositsChart />
          <DepositStatusDonut />
        </div>

        <DepositsTable />
      
    </>
  );
}

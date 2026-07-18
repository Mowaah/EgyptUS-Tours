"use client";

import { useState } from "react";
import DashboardNavbar from "@/components/dashboard/Navbar/DashboardNavbar";
import SummaryCard from "@/components/dashboard/SummaryCard/SummaryCard";
import MiceRequestsPanel from "./MiceRequestsPanel";
import styles from "./MICE.module.scss";

export default function MICE() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className={styles.page}>
      <DashboardNavbar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />
      
      <div className={styles.summaryGrid}>
        <SummaryCard
          label="Total Requests"
          value="1,284"
          change="-5.1%"
          trend="down"
          tone="green"
          iconSrc="/images/dashboard/requests/plan-your-trip/total.svg"
        />
        <SummaryCard
          label="Completed Requests"
          value="1,284"
          change="+8.2%"
          trend="up"
          tone="blue"
          iconSrc="/images/dashboard/requests/plan-your-trip/completed.svg"
        />
        <SummaryCard
          label="In Progress Requests"
          value="1,284"
          change="+8.2%"
          trend="up"
          tone="orange"
          iconSrc="/images/dashboard/requests/plan-your-trip/in-progress.svg"
        />
        <SummaryCard
          label="Rejected Requests"
          value="152,284"
          change="-5.1%"
          trend="down"
          tone="red"
          iconSrc="/images/dashboard/requests/plan-your-trip/rejected.svg"
        />
      </div>

      <MiceRequestsPanel />
    </div>
  );
}

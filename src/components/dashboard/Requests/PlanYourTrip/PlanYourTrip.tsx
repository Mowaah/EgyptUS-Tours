"use client";

import { useState } from "react";
import DashboardNavbar from "@/components/dashboard/Navbar/DashboardNavbar";
import RequestsSummaryGrid from "../shared/Layouts/RequestsSummaryGrid";
import CustomTripRequestsPanel from "./CustomTripRequestsPanel";
import { getPlanYourTripStats } from "@/lib/adminApi";
import { useRequestStats } from "@/hooks/useRequestStats";
import styles from "./PlanYourTrip.module.scss";

export default function PlanYourTrip() {
  const [searchQuery, setSearchQuery] = useState("");
  const stats = useRequestStats(getPlanYourTripStats);

  return (
    <div className={styles.page}>
      <DashboardNavbar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />
      <RequestsSummaryGrid stats={stats} />
      <CustomTripRequestsPanel searchQuery={searchQuery} />
    </div>
  );
}

"use client";

import { useState } from "react";
import DashboardNavbar from "@/components/dashboard/Navbar/DashboardNavbar";
import RequestsSummaryGrid from "../shared/Layouts/RequestsSummaryGrid";
import CustomTripRequestsPanel from "./CustomTripRequestsPanel";
import { getPlanYourTripStats } from "@/services/admin/adminRequestsService";
import { useRequestStats } from "@/hooks/useRequestStats";
import styles from "./PlanYourTrip.module.scss";

export default function PlanYourTrip() {
  const [searchQuery, setSearchQuery] = useState("");
  const { stats } = useRequestStats(getPlanYourTripStats, "adminPlanYourTripStats");

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

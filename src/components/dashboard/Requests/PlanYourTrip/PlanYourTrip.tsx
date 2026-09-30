"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import DashboardNavbar from "@/components/dashboard/Navbar/DashboardNavbar";
import DashboardDateFilter from "@/components/dashboard/Navbar/DashboardDateFilter/DashboardDateFilter";
import RequestsSummaryGrid from "../shared/Layouts/RequestsSummaryGrid";
import CustomTripRequestsPanel from "./CustomTripRequestsPanel";
import { getPlanYourTripStats } from "@/services/admin/adminRequestsService";
import { useRequestStats } from "@/hooks/useRequestStats";
import styles from "./PlanYourTrip.module.scss";

export default function PlanYourTrip() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const { stats } = useRequestStats(getPlanYourTripStats, "adminPlanYourTripStats");

  return (
    <div className={styles.page}>
      <DashboardNavbar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        customFilterDropdown={<DashboardDateFilter />}
        onPrimaryAction={() => router.push("/booking?mode=agent")}
      />
      <RequestsSummaryGrid stats={stats} />
      <CustomTripRequestsPanel searchQuery={searchQuery} onClearSearch={() => setSearchQuery("")} />
    </div>
  );
}

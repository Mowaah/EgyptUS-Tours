"use client";

import { useState } from "react";
import DashboardNavbar from "@/components/dashboard/Navbar/DashboardNavbar";
import RequestsSummaryGrid from "../shared/Layouts/RequestsSummaryGrid";
import MiceRequestsPanel from "./MiceRequestsPanel";
import { getMiceStats } from "@/services/admin/adminRequestsService";
import { useRequestStats } from "@/hooks/useRequestStats";
import styles from "./MICE.module.scss";

export default function MICE() {
  const [searchQuery, setSearchQuery] = useState("");
  const stats = useRequestStats(getMiceStats);

  return (
    <div className={styles.page}>
      <DashboardNavbar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />
      <RequestsSummaryGrid stats={stats} />
      <MiceRequestsPanel searchQuery={searchQuery} />
    </div>
  );
}

"use client";

import { useState } from "react";
import DashboardNavbar from "@/components/dashboard/Navbar/DashboardNavbar";
import RequestsSummaryGrid from "../shared/Layouts/RequestsSummaryGrid";
import B2BRequestsPanel from "./B2BRequestsPanel";
import styles from "./B2B.module.scss";
import { getB2BStats } from "@/lib/adminApi";
import { useRequestStats } from "@/hooks/useRequestStats";

export default function B2B() {
  const [searchQuery, setSearchQuery] = useState("");
  const stats = useRequestStats(getB2BStats);

  return (
    <div className={styles.page}>
      <DashboardNavbar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />
      <RequestsSummaryGrid stats={stats} />
      <B2BRequestsPanel searchQuery={searchQuery} />
    </div>
  );
}

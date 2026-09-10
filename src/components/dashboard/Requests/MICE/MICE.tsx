"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import DashboardNavbar from "@/components/dashboard/Navbar/DashboardNavbar";
import RequestsSummaryGrid from "../shared/Layouts/RequestsSummaryGrid";
import MiceRequestsPanel from "./MiceRequestsPanel";
import { getMiceStats } from "@/services/admin/adminRequestsService";
import { useRequestStats } from "@/hooks/useRequestStats";
import styles from "./MICE.module.scss";

export default function MICE() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const { stats } = useRequestStats(getMiceStats, "adminMiceStats");

  return (
    <div className={styles.page}>
      <DashboardNavbar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onPrimaryAction={() => router.push("/events/request-proposal?mode=agent")}
      />
      <RequestsSummaryGrid stats={stats} />
      <MiceRequestsPanel searchQuery={searchQuery} />
    </div>
  );
}

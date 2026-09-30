"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import DashboardNavbar from "@/components/dashboard/Navbar/DashboardNavbar";
import DashboardDateFilter from "@/components/dashboard/Navbar/DashboardDateFilter/DashboardDateFilter";
import RequestsSummaryGrid from "../shared/Layouts/RequestsSummaryGrid";
import B2BRequestsPanel from "./B2BRequestsPanel";
import styles from "./B2B.module.scss";
import { getB2BStats } from "@/services/admin/adminRequestsService";
import { useRequestStats } from "@/hooks/useRequestStats";

export default function B2B() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const { stats } = useRequestStats(getB2BStats, "adminB2BStats");

  return (
    <div className={styles.page}>
      <DashboardNavbar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        customFilterDropdown={<DashboardDateFilter />}
        onPrimaryAction={() => router.push("/b2b-programs/request-proposal?mode=agent")}
      />
      <RequestsSummaryGrid stats={stats} />
      <B2BRequestsPanel searchQuery={searchQuery} onClearSearch={() => setSearchQuery("")} />
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import DashboardNavbar from "@/components/dashboard/Navbar/DashboardNavbar";
import SummaryCard from "@/components/dashboard/SummaryCard/SummaryCard";
import B2BRequestsPanel from "./B2BRequestsPanel";
import styles from "./B2B.module.scss";
import { getB2BStats } from "@/lib/adminApi";

export default function B2B() {
  const [searchQuery, setSearchQuery] = useState("");
  const [stats, setStats] = useState({
    total: 0,
    completed: 0,
    in_progress: 0,
    rejected: 0,
  });

  useEffect(() => {
    async function fetchStats() {
      try {
        const data = await getB2BStats({ range: "30d" });
        setStats({
          total: data.total || 0,
          completed: data.completed || 0,
          in_progress: data.in_progress || 0,
          rejected: data.rejected || 0,
        });
      } catch (err) {
        console.error("Failed to fetch B2B stats:", err);
      }
    }
    fetchStats();
  }, []);

  return (
    <div className={styles.page}>
      <DashboardNavbar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />
      
      <div className={styles.summaryGrid}>
        <SummaryCard
          label="Total Requests"
          value={stats.total.toLocaleString()}
          change="+0.0%"
          trend="up"
          tone="green"
          iconSrc="/images/dashboard/requests/plan-your-trip/total.svg"
        />
        <SummaryCard
          label="Completed Requests"
          value={stats.completed.toLocaleString()}
          change="+0.0%"
          trend="up"
          tone="blue"
          iconSrc="/images/dashboard/requests/plan-your-trip/completed.svg"
        />
        <SummaryCard
          label="In Progress Requests"
          value={stats.in_progress.toLocaleString()}
          change="+0.0%"
          trend="up"
          tone="orange"
          iconSrc="/images/dashboard/requests/plan-your-trip/in-progress.svg"
        />
        <SummaryCard
          label="Rejected Requests"
          value={stats.rejected.toLocaleString()}
          change="+0.0%"
          trend="down"
          tone="red"
          iconSrc="/images/dashboard/requests/plan-your-trip/rejected.svg"
        />
      </div>

      <B2BRequestsPanel searchQuery={searchQuery} />
    </div>
  );
}

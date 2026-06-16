"use client";

import React, { useState } from "react";
import DashboardNavbar from "@/components/dashboard/Navbar/DashboardNavbar";
import DashboardSidebar from "@/components/dashboard/Sidebar/DashboardSidebar";
import { PromotionsPanel } from "@/components/dashboard/Promotions/PromotionsPanel/PromotionsPanel";
import styles from "../../page.module.scss";

export default function PromotionsPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleAction = () => {
    // This action could navigate to create offer page
    console.log("Create Offer clicked");
  };

  return (
    <main className={styles.page}>
      <DashboardSidebar />

      <section className={styles.content} aria-label="Promotions content">
        <DashboardNavbar
          onSearchChange={handleSearch}
          onPrimaryAction={handleAction}
        />
        <PromotionsPanel
          searchQuery={searchQuery}
          onClearSearch={() => setSearchQuery("")}
        />
      </section>
    </main>
  );
}

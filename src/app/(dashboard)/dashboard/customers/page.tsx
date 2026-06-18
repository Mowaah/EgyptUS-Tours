"use client";

import { useState } from "react";
import { Customers } from "@/components/dashboard/Customers";
import DashboardNavbar from "@/components/dashboard/Navbar/DashboardNavbar";
import DashboardSidebar from "@/components/dashboard/Sidebar/DashboardSidebar";
import styles from "../page.module.scss";

export default function CustomersPage() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <main className={styles.page}>
      <DashboardSidebar />

      <section className={styles.content} aria-label="Customers content">
        <DashboardNavbar 
          onSearchChange={setSearchQuery} 
          hidePrimaryAction
        />
        <Customers 
          searchQuery={searchQuery} 
          onClearSearch={() => setSearchQuery("")}
        />
      </section>
    </main>
  );
}

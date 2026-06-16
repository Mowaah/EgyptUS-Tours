"use client";

import { useState } from "react";
import { Reviews } from "@/components/dashboard/Reviews";
import DashboardNavbar from "@/components/dashboard/Navbar/DashboardNavbar";
import DashboardSidebar from "@/components/dashboard/Sidebar/DashboardSidebar";
import styles from "../page.module.scss";

export default function ReviewsPage() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <main className={styles.page}>
      <DashboardSidebar />

      <section className={styles.content} aria-label="Reviews and testimonials content">
        <DashboardNavbar onSearchChange={setSearchQuery} />
        <Reviews searchQuery={searchQuery} />
      </section>
    </main>
  );
}

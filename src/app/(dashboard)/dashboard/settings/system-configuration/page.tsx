"use client";

import DashboardNavbar from "@/components/dashboard/Navbar/DashboardNavbar";
import DashboardSidebar from "@/components/dashboard/Sidebar/DashboardSidebar";
import { SystemConfiguration } from "@/components/dashboard/SystemConfiguration";
import styles from "../../page.module.scss";

export default function SystemConfigurationPage() {
  return (
    <main className={styles.page}>
      <DashboardSidebar />

      <section className={styles.content} aria-label="System configuration content">
        <DashboardNavbar />
        <SystemConfiguration />
      </section>
    </main>
  );
}

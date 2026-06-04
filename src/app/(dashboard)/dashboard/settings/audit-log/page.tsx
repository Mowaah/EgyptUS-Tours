"use client";

import DashboardNavbar from "@/components/dashboard/Navbar/DashboardNavbar";
import DashboardSidebar from "@/components/dashboard/Sidebar/DashboardSidebar";
import { AuditLog } from "@/components/dashboard/AuditLog";
import styles from "../../page.module.scss";

export default function AuditLogPage() {
  return (
    <main className={styles.page}>
      <DashboardSidebar />

      <section className={styles.content} aria-label="Audit log content">
        <DashboardNavbar />
        <AuditLog />
      </section>
    </main>
  );
}

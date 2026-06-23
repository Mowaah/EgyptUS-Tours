"use client";

import DashboardNavbar from "@/components/dashboard/Navbar/DashboardNavbar";
import DashboardSidebar from "@/components/dashboard/Sidebar/DashboardSidebar";
import SEOConfiguration from "@/components/dashboard/SEOConfiguration/SEOConfiguration";
import styles from "../page.module.scss";

export default function SEOConfigurationPage() {
  return (
    <main className={styles.page}>
      <DashboardSidebar />

      <section className={styles.content} aria-label="SEO Configuration content">
        <DashboardNavbar />
        <SEOConfiguration />
      </section>
    </main>
  );
}

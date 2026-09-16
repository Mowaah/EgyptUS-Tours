import DashboardSidebar from "@/components/dashboard/Sidebar/DashboardSidebar";
import DashboardRouteGuard from "@/components/dashboard/DashboardRouteGuard";

import styles from "./page.module.scss";

export default function DashboardInternalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className={styles.page}>
      <DashboardSidebar />
      <section className={styles.content} aria-label="Dashboard content">
        <DashboardRouteGuard>{children}</DashboardRouteGuard>
      </section>
    </main>
  );
}

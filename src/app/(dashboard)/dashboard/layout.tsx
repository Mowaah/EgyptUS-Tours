import DashboardSidebar from "@/components/dashboard/Sidebar/DashboardSidebar";

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
        {children}
      </section>
    </main>
  );
}

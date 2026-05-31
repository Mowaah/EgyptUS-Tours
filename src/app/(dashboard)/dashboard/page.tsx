import DashboardSidebar from "@/components/dashboard/Sidebar/DashboardSidebar";
import DashboardNavbar from "@/components/dashboard/Navbar/DashboardNavbar";
import styles from "./page.module.scss";

export default function DashboardHomePage() {
  return (
    <main className={styles.page}>
      <DashboardSidebar />

      <section className={styles.content} aria-label="Dashboard content">
        <DashboardNavbar />

        <div className={styles.placeholder}>
          <p>Dashboard content area</p>
        </div>
      </section>
    </main>
  );
}

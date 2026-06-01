import DashboardHome from "@/components/dashboard/DashboardHome";
import DashboardNavbar from "@/components/dashboard/Navbar/DashboardNavbar";
import DashboardSidebar from "@/components/dashboard/Sidebar/DashboardSidebar";
import styles from "./page.module.scss";

export default function DashboardHomePage() {
  return (
    <main className={styles.page}>
      <DashboardSidebar />

      <section className={styles.content} aria-label="Dashboard content">
        <DashboardNavbar />
        <DashboardHome />
      </section>
    </main>
  );
}

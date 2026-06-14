import { Blogs } from "@/components/dashboard/Blogs";
import DashboardNavbar from "@/components/dashboard/Navbar/DashboardNavbar";
import DashboardSidebar from "@/components/dashboard/Sidebar/DashboardSidebar";
import styles from "../../page.module.scss";

export default function BlogsPage() {
  return (
    <main className={styles.page}>
      <DashboardSidebar />

      <section className={styles.content} aria-label="Blogs content">
        <DashboardNavbar />
        <Blogs />
      </section>
    </main>
  );
}

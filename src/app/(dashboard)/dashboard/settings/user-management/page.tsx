import { UserManagement } from "@/components/dashboard/UserManagement";
import DashboardNavbar from "@/components/dashboard/Navbar/DashboardNavbar";
import DashboardSidebar from "@/components/dashboard/Sidebar/DashboardSidebar";
import styles from "../../page.module.scss";

export default function UserManagementPage() {
  return (
    <main className={styles.page}>
      <DashboardSidebar />

      <section className={styles.content} aria-label="User management content">
        <DashboardNavbar />
        <UserManagement />
      </section>
    </main>
  );
}

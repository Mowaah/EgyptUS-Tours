import { LeadsInquiries } from "@/components/dashboard/LeadsInquiries";
import DashboardSidebar from "@/components/dashboard/Sidebar/DashboardSidebar";
import styles from "../page.module.scss";

export default function LeadsInquiriesPage() {
  return (
    <main className={styles.page}>
      <DashboardSidebar />

      <section className={styles.content} aria-label="Leads and inquiries content">
        <LeadsInquiries />
      </section>
    </main>
  );
}

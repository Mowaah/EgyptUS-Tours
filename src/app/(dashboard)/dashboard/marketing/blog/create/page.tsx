import { CreatePost } from "@/components/dashboard/Blogs/CreatePost";
import DashboardNavbar from "@/components/dashboard/Navbar/DashboardNavbar";
import DashboardSidebar from "@/components/dashboard/Sidebar/DashboardSidebar";
import styles from "../../../page.module.scss";

export default function CreatePostPage() {
  return (
    <main className={styles.page}>
      <DashboardSidebar />

      <section className={styles.content} aria-label="Create Post content">
        <DashboardNavbar />
        <CreatePost />
      </section>
    </main>
  );
}

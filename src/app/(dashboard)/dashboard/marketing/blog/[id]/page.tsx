import BlogDetails from "@/components/dashboard/Blogs/BlogDetails/BlogDetails";
import DashboardSidebar from "@/components/dashboard/Sidebar/DashboardSidebar";
import styles from "../../../page.module.scss";

export default async function BlogDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const unwrappedParams = await params;
  
  // Pass the ID or dummy data to the component
  return (
    <main className={styles.page}>
      <DashboardSidebar />

      <section className={styles.content} aria-label="Blog Details content">
        <BlogDetails postId={unwrappedParams.id} />
      </section>
    </main>
  );
}

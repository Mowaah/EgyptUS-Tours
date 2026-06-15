"use client";

import { useRouter } from "next/navigation";
import { Blogs } from "@/components/dashboard/Blogs";
import DashboardNavbar from "@/components/dashboard/Navbar/DashboardNavbar";
import DashboardSidebar from "@/components/dashboard/Sidebar/DashboardSidebar";
import styles from "../../page.module.scss";

export default function BlogsPage() {
  const router = useRouter();

  return (
    <main className={styles.page}>
      <DashboardSidebar />

      <section className={styles.content} aria-label="Blogs content">
        <DashboardNavbar onPrimaryAction={() => router.push("/dashboard/marketing/blog/create")} />
        <Blogs />
      </section>
    </main>
  );
}

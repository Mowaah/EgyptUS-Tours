"use client";

import { Suspense } from "react";
import { useRouter } from "next/navigation";
import { CreatePost } from "@/components/dashboard/Articles";
import DashboardNavbar from "@/components/dashboard/Navbar/DashboardNavbar";
import DashboardSidebar from "@/components/dashboard/Sidebar/DashboardSidebar";
import styles from "../../../page.module.scss";

export default function CreatePostPage() {
  const router = useRouter();
  
  return (
    <main className={styles.page}>
      <DashboardSidebar />

      <section className={styles.content} aria-label="Create Post content">
        <DashboardNavbar onSecondaryAction={() => router.push('/dashboard/marketing/articles?draftSaved=true')} />
        <Suspense fallback={<div>Loading...</div>}>
          <CreatePost />
        </Suspense>
      </section>
    </main>
  );
}

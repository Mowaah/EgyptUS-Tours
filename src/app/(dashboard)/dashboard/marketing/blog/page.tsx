"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Blogs } from "@/components/dashboard/Blogs";
import DashboardNavbar from "@/components/dashboard/Navbar/DashboardNavbar";
import DashboardSidebar from "@/components/dashboard/Sidebar/DashboardSidebar";
import DashboardStatusBanner from "@/components/shared/DashboardStatusBanner/DashboardStatusBanner";
import styles from "../../page.module.scss";

function DraftBanner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [show, setShow] = useState(false);
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    if (searchParams?.get("draftSaved") === "true") {
      setShow(true);
      setLeaving(false);
      router.replace('/dashboard/marketing/blog');
    }
  }, [searchParams, router]);

  useEffect(() => {
    if (show) {
      const leaveTimer = setTimeout(() => {
        setLeaving(true);
      }, 2700);
      
      const unmountTimer = setTimeout(() => {
        setShow(false);
      }, 3000);
      
      return () => {
        clearTimeout(leaveTimer);
        clearTimeout(unmountTimer);
      };
    }
  }, [show]);

  if (!show) return null;

  return (
    <DashboardStatusBanner
      message="Your post has been saved as a draft and is not visible to users yet. You can continue editing, reviewing content, and publish it whenever you're ready."
      variant="success"
      leaving={leaving}
      className={styles.draftBanner}
    />
  );
}

export default function BlogsPage() {
  const router = useRouter();

  return (
    <main className={styles.page}>
      <DashboardSidebar />

      <section className={styles.content} aria-label="Blogs content">
        <Suspense fallback={null}>
          <DraftBanner />
        </Suspense>
        <DashboardNavbar onPrimaryAction={() => router.push("/dashboard/marketing/blog/create")} />
        <Blogs />
      </section>
    </main>
  );
}

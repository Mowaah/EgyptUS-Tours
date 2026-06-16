"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Articles } from "@/components/dashboard/Articles";
import DashboardNavbar from "@/components/dashboard/Navbar/DashboardNavbar";
import DashboardSidebar from "@/components/dashboard/Sidebar/DashboardSidebar";
import DashboardStatusBanner from "@/components/shared/DashboardStatusBanner/DashboardStatusBanner";
import styles from "../../page.module.scss";

function StatusBanners() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [show, setShow] = useState<"draft" | "deleted" | "edited" | null>(null);

  useEffect(() => {
    if (searchParams?.get("draftSaved") === "true") {
      setShow("draft");
      router.replace('/dashboard/marketing/articles');
    } else if (searchParams?.get("deleted") === "true") {
      setShow("deleted");
      router.replace('/dashboard/marketing/articles');
    } else if (searchParams?.get("editSaved") === "true") {
      setShow("edited");
      router.replace('/dashboard/marketing/articles');
    }
  }, [searchParams, router]);

  if (!show) return null;

  let message = "";
  if (show === "draft") {
    message = "Your post has been saved as a draft and is not visible to users yet. You can continue editing, reviewing content, and publish it whenever you're ready.";
  } else if (show === "deleted") {
    message = "The article has been deleted successfully";
  } else if (show === "edited") {
    message = "Your edits have been saved and are now live.";
  }

  return (
    <DashboardStatusBanner
      show={!!show}
      onClose={() => setShow(null)}
      message={message}
      variant="success"
      className={styles.draftBanner}
    />
  );
}

export default function ArticlesPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <main className={styles.page}>
      <DashboardSidebar />

      <section className={styles.content} aria-label="Articles content">
        <Suspense fallback={null}>
          <StatusBanners />
        </Suspense>
        <DashboardNavbar 
          onPrimaryAction={() => router.push("/dashboard/marketing/articles/create")} 
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />
        <Articles searchQuery={searchQuery} onClearSearch={() => setSearchQuery("")} />
      </section>
    </main>
  );
}

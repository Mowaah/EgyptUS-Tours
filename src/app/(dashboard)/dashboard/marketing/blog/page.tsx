"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { MarketingContentPanel } from "@/components/dashboard/Marketing";
import { getAdminBlogs, deleteAdminBlog } from "@/services/admin/adminMarketingService";
import DashboardNavbar from "@/components/dashboard/Navbar/DashboardNavbar";
import DashboardStatusBanner from "@/components/dashboard/shared/DashboardStatusBanner/DashboardStatusBanner";
import styles from "../../page.module.scss";

function StatusBanners() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [show, setShow] = useState<"draft" | "deleted" | "edited" | null>(null);

  useEffect(() => {
    if (searchParams?.get("draftSaved") === "true") {
      setShow("draft");
      router.replace('/dashboard/marketing/blog');
    } else if (searchParams?.get("deleted") === "true") {
      setShow("deleted");
      router.replace('/dashboard/marketing/blog');
    } else if (searchParams?.get("editSaved") === "true") {
      setShow("edited");
      router.replace('/dashboard/marketing/blog');
    }
  }, [searchParams, router]);

  if (!show) return null;

  let message = "";
  if (show === "draft") {
    message = "Your post has been saved as a draft and is not visible to users yet. You can continue editing, reviewing content, and publish it whenever you're ready.";
  } else if (show === "deleted") {
    message = "The blog has been deleted successfully";
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

export default function BlogsPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <>
        <Suspense fallback={null}>
          <StatusBanners />
        </Suspense>
        <DashboardNavbar 
          onPrimaryAction={() => router.push("/dashboard/marketing/blog/create")} 
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />
        <MarketingContentPanel 
          contentType="blog" 
          searchQuery={searchQuery} 
          onClearSearch={() => setSearchQuery("")} 
          fetchApi={getAdminBlogs} 
          deleteApi={deleteAdminBlog} 
        />
      
    </>
  );
}

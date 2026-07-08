"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import DashboardNavbar from "@/components/dashboard/Navbar/DashboardNavbar";
import HotelsTabs from "@/components/dashboard/Catalog/Hotels/HotelsTabs/HotelsTabs";
import HotelsPanel from "@/components/dashboard/Catalog/Hotels/HotelsPanel/HotelsPanel";
import DashboardStatusBanner from "@/components/dashboard/shared/DashboardStatusBanner/DashboardStatusBanner";
import dashboardStyles from "../../page.module.scss";
import styles from "./page.module.scss";

function StatusBanners() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [show, setShow] = useState<"deleted" | "discarded" | "draft" | null>(null);

  useEffect(() => {
    const isDeleted = searchParams?.get("deleted") === "true";
    const isDiscarded = searchParams?.get("discarded") === "true";
    const isDraft = searchParams?.get("draft") === "true";

    if (isDeleted || isDiscarded || isDraft) {
      if (isDeleted) setShow("deleted");
      else if (isDiscarded) setShow("discarded");
      else if (isDraft) setShow("draft");
      router.replace('/dashboard/catalog/hotels');
    }
  }, [searchParams, router]);

  if (!show) return null;

  let message = "";
  if (show === "deleted") {
    message = "The hotel has been deleted successfully";
  } else if (show === "discarded") {
    message = "The hotel has been discard successfully";
  } else if (show === "draft") {
    message = "The hotel has been saved as a draft successfully";
  }

  return (
    <DashboardStatusBanner
      show={!!show}
      onClose={() => setShow(null)}
      message={message}
      variant="success"
      className={dashboardStyles.draftBanner}
    />
  );
}

export default function CatalogHotelsPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className={styles.page}>
      <Suspense fallback={null}>
        <StatusBanners />
      </Suspense>
      <DashboardNavbar 
        title="Hotels"
        subtitle="Centralize hotel management, pricing references, and accommodation details."
        primaryAction={{ label: "Add New Hotel" }}
        onPrimaryAction={() => router.push("/dashboard/catalog/hotels/new")}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />
      <div className={styles.content}>
        <HotelsTabs />
        <HotelsPanel searchQuery={searchQuery} />
      </div>
    </div>
  );
}

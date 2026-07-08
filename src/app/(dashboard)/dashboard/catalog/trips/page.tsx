"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import DashboardNavbar from "@/components/dashboard/Navbar/DashboardNavbar";
import CatalogTabs from "@/components/dashboard/Catalog/CatalogTabs/CatalogTabs";
import TripsPanel from "@/components/dashboard/Catalog/Trips/TripsPanel/TripsPanel";
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
      // Clean URL params
      router.replace('/dashboard/catalog/trips');
    }
  }, [searchParams, router]);

  if (!show) return null;

  let message = "";
  if (show === "deleted") {
    message = "The trip has been deleted successfully";
  } else if (show === "discarded") {
    message = "The trip has been discard successfully";
  } else if (show === "draft") {
    message = "The trip has been saved as a draft successfully";
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

export default function CatalogTripsPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className={styles.page}>
      <Suspense fallback={null}>
        <StatusBanners />
      </Suspense>
      <DashboardNavbar 
        title="Trips"
        subtitle="Manage all trip products visible on the website"
        primaryAction={{ label: "Add New Trip" }}
        onPrimaryAction={() => router.push("/dashboard/catalog/trips/new")}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />
      <div className={styles.content}>
        <CatalogTabs />
        <TripsPanel searchQuery={searchQuery} />
      </div>
    </div>
  );
}

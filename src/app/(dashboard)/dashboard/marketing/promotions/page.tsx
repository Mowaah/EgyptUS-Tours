"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import DashboardNavbar from "@/components/dashboard/Navbar/DashboardNavbar";
import DashboardSidebar from "@/components/dashboard/Sidebar/DashboardSidebar";
import DashboardStatusBanner from "@/components/shared/DashboardStatusBanner/DashboardStatusBanner";
import { PromotionsPanel } from "@/components/dashboard/Promotions/PromotionsPanel/PromotionsPanel";
import styles from "../../page.module.scss";

function ActionBanner() {
  const searchParams = useSearchParams();
  const [show, setShow] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (searchParams?.get("editSaved") === "true") {
      setShow(true);
      router.replace(window.location.pathname);
    }
  }, [searchParams, router]);

  if (!show) return null;

  return (
    <DashboardStatusBanner
      show={show}
      onClose={() => setShow(false)}
      message="Your edits have been saved and are now live."
      variant="success"
      className={styles.draftBanner}
    />
  );
}

export default function PromotionsPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleAction = () => {
    router.push("/dashboard/marketing/promotions/create");
  };

  return (
    <main className={styles.page}>
      <DashboardSidebar />

      <section className={styles.content} aria-label="Promotions content">
        <DashboardNavbar
          onSearchChange={handleSearch}
          onPrimaryAction={handleAction}
        />
        <Suspense fallback={null}>
          <ActionBanner />
        </Suspense>
        <PromotionsPanel
          searchQuery={searchQuery}
          onClearSearch={() => setSearchQuery("")}
        />
      </section>
    </main>
  );
}

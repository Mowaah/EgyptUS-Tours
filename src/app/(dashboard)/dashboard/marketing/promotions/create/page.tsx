"use client";

import { Suspense } from "react";

import { useRouter } from "next/navigation";
import DashboardNavbar from "@/components/dashboard/Navbar/DashboardNavbar";
import DashboardSidebar from "@/components/dashboard/Sidebar/DashboardSidebar";
import { CreatePromotion } from "@/components/dashboard/Promotions/CreatePromotion/CreatePromotion";
import styles from "../../../page.module.scss";

export default function CreatePromotionPage() {
  const router = useRouter();
  
  return (
    <main className={styles.page}>
      <DashboardSidebar />

      <section className={styles.content} aria-label="Create Promotion content">
        <DashboardNavbar onSecondaryAction={() => router.push('/dashboard/marketing/promotions?draftSaved=true')} />
        <Suspense fallback={<div>Loading...</div>}>
          <CreatePromotion />
        </Suspense>
      </section>
    </main>
  );
}

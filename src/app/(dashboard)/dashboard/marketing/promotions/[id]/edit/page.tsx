"use client";

import { use, Suspense } from "react";
import { useRouter } from "next/navigation";
import DashboardNavbar from "@/components/dashboard/Navbar/DashboardNavbar";
import DashboardSidebar from "@/components/dashboard/Sidebar/DashboardSidebar";
import { CreatePromotion } from "@/components/dashboard/Promotions/CreatePromotion/CreatePromotion";
import styles from "../../../../page.module.scss";

export default function EditPromotionPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const unwrappedParams = use(params);
  
  return (
    <main className={styles.page}>
      <DashboardSidebar />

      <section className={styles.content} aria-label="Edit Promotion content">
        <DashboardNavbar 
          title="Edit Offer"
          subtitle="Edit and publish promotional content"
          breadcrumbTrail={[
            { label: "Home" }, 
            { label: "Marketing" }, 
            { label: "Promotions", href: "/dashboard/marketing/promotions" }, 
            { label: "Edit Offer" }
          ]}
          primaryAction={{ label: "Save edits", form: "create-promotion-form", type: "submit", hideIcon: true }}
          secondaryAction={{ label: "Discard" }}
          hideSearch
          hideFilterButton
          onSecondaryAction={() => router.push(`/dashboard/marketing/promotions`)} 
        />
        <Suspense fallback={null}>
          <CreatePromotion promotionId={unwrappedParams.id} />
        </Suspense>
      </section>
    </main>
  );
}

"use client";

import { use } from "react";
import DashboardSidebar from "@/components/dashboard/Sidebar/DashboardSidebar";
import PromotionDetails from "@/components/dashboard/Promotions/PromotionDetails/PromotionDetails";
import styles from "../../../page.module.scss";

export default function PromotionDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const unwrappedParams = use(params);

  return (
    <main className={styles.page}>
      <DashboardSidebar />

      <section className={styles.content} aria-label="Promotion Details content">
        <PromotionDetails promotionId={unwrappedParams.id} />
      </section>
    </main>
  );
}

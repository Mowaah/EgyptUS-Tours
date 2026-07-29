"use client";

import { use, Suspense, useState } from "react";
import { useRouter } from "next/navigation";
import DashboardNavbar from "@/components/dashboard/Navbar/DashboardNavbar";
import { CreatePromotion } from "@/components/dashboard/Promotions/CreatePromotion/CreatePromotion";
import styles from "../../../../page.module.scss";

export default function EditPromotionPage({ params, searchParams }: { params: Promise<{ id: string }>, searchParams: Promise<{ from?: string }> }) {
  const router = useRouter();
  const unwrappedParams = use(params);
  const unwrappedSearchParams = use(searchParams);
  const [isDirty, setIsDirty] = useState(false);
  const fromList = unwrappedSearchParams.from === "list";
  
  return (
    <>
        <DashboardNavbar 
          title="Edit Offer"
          subtitle="Edit and publish promotional content"
          breadcrumbTrail={[
            { label: "Marketing" }, 
            { label: "Promotions", href: "/dashboard/marketing/promotions" }, 
            { label: "Edit Offer" }
          ]}
          primaryAction={{ label: "Save edits", form: "create-promotion-form", type: "submit", hideIcon: true, disabled: !isDirty }}
          secondaryAction={{ label: "Discard", disabled: !isDirty }}
          hideSearch
          hideFilterButton
          onSecondaryAction={() => router.push(fromList ? `/dashboard/marketing/promotions` : `/dashboard/marketing/promotions/${unwrappedParams.id}`)} 
        />
        <Suspense fallback={null}>
          <CreatePromotion promotionId={unwrappedParams.id} onDirtyChange={setIsDirty} />
        </Suspense>
    </>
  );
}

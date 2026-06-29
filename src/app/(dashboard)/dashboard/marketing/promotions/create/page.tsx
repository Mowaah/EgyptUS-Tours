"use client";

import { Suspense } from "react";

import { useRouter } from "next/navigation";
import DashboardNavbar from "@/components/dashboard/Navbar/DashboardNavbar";
import { CreatePromotion } from "@/components/dashboard/Promotions/CreatePromotion/CreatePromotion";
import styles from "../../../page.module.scss";

export default function CreatePromotionPage() {
  const router = useRouter();
  
  return (
    <>
      
      
        <DashboardNavbar onSecondaryAction={() => router.push('/dashboard/marketing/promotions?draftSaved=true')} />
        <Suspense fallback={<div>Loading...</div>}>
          <CreatePromotion />
        </Suspense>
      
    </>
  );
}

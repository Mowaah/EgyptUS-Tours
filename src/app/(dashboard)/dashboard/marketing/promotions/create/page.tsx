"use client";

import { Suspense, useState } from "react";
import DashboardNavbar from "@/components/dashboard/Navbar/DashboardNavbar";
import { CreatePromotion } from "@/components/dashboard/Promotions/CreatePromotion/CreatePromotion";
import styles from "../../../page.module.scss";

export default function CreatePromotionPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  return (
    <>
      
      
        <DashboardNavbar 
          primaryAction={{ label: "Activate Offer", type: "submit", form: "create-promotion-form", iconSrc: "/images/dashboard/activate-offer.svg", loading: isSubmitting }}
          secondaryAction={{ label: "Save draft", iconSrc: "/images/dashboard/save2.svg", form: "create-promotion-form", type: "submit" }}
        />
        <Suspense fallback={<div>Loading...</div>}>
          <CreatePromotion onSubmittingChange={setIsSubmitting} />
        </Suspense>
      
    </>
  );
}
